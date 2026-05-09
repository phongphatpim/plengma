import { NextResponse } from "next/server";
import { Resend } from "resend";
import type { TapeGenre } from "@/lib/types";
import { appendSubmission, getNextCatalogNumberFromSheet } from "@/lib/sheets";

const TAPE_GENRES: Set<TapeGenre> = new Set([
  "DREAM POP",
  "CITYPOP",
  "LOFI",
  "INDIE POP",
  "FOLK",
  "R&B",
  "ELECTRONIC",
  "AMBIENT",
  "HIP-HOP",
  "POP PUNK",
  "SYNTHWAVE",
  "JAZZ",
  "DARKWAVE",
  "POST-ROCK",
  "BEDROOM POP",
  "อื่นๆ",
]);

const YOUTUBE_SUBSTRINGS = ["youtube.com", "youtu.be", "music.youtube.com"] as const;
const DURATION_REGEX = /^\d{1,2}:\d{2}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

/** In-memory Phase 1 — resets on server restart */
let catalogCounter = 1;
const submissionTimestampsByEmail = new Map<string, number[]>();

type SubmitBody = {
  website?: unknown;
  youtubeUrl?: unknown;
  title?: unknown;
  artist?: unknown;
  genre?: unknown;
  duration?: unknown;
  description?: unknown;
  artistEmail?: unknown;
  socialUrl?: unknown;
  tools?: unknown;
  coverMode?: unknown;
  coverPrompt?: unknown;
  mood?: unknown;
};

type ValidatedSubmitData = {
  youtubeUrl: string;
  title: string;
  artist: string;
  genre: TapeGenre;
  duration: string;
  description?: string;
  artistEmail: string;
  socialUrl?: string;
  tools?: string;
  coverMode: string;
  coverPrompt?: string;
  mood?: string;
};

function isYoutubeUrl(value: string): boolean {
  const v = value.toLowerCase();
  return YOUTUBE_SUBSTRINGS.some((s) => v.includes(s));
}

function validateBody(raw: SubmitBody): { ok: true; data: ValidatedSubmitData } | { ok: false; message: string } {
  const youtubeUrl = typeof raw.youtubeUrl === "string" ? raw.youtubeUrl.trim() : "";
  const title = typeof raw.title === "string" ? raw.title.trim() : "";
  const artist = typeof raw.artist === "string" ? raw.artist.trim() : "";
  const genre = typeof raw.genre === "string" ? raw.genre.trim() : "";
  const duration = typeof raw.duration === "string" ? raw.duration.trim() : "";
  const artistEmail = typeof raw.artistEmail === "string" ? raw.artistEmail.trim() : "";
  const description = typeof raw.description === "string" ? raw.description.trim() : undefined;
  const socialUrl = typeof raw.socialUrl === "string" ? raw.socialUrl.trim() : undefined;
  const tools = typeof raw.tools === "string" ? raw.tools.trim() : undefined;
  const coverMode = typeof raw.coverMode === "string" ? raw.coverMode.trim() : "";
  const coverPrompt = typeof raw.coverPrompt === "string" ? raw.coverPrompt.trim() : undefined;
  const mood = typeof raw.mood === "string" ? raw.mood.trim() : undefined;

  if (!isYoutubeUrl(youtubeUrl)) {
    return { ok: false, message: "ลิงก์ YouTube ไม่ถูกต้อง" };
  }
  if (!title || title.length > 40) {
    return { ok: false, message: "ชื่อเพลงไม่ถูกต้อง" };
  }
  if (!artist || artist.length > 30) {
    return { ok: false, message: "ชื่อศิลปินไม่ถูกต้อง" };
  }
  if (!TAPE_GENRES.has(genre as TapeGenre)) {
    return { ok: false, message: "แนวเพลงไม่ถูกต้อง" };
  }
  if (!DURATION_REGEX.test(duration)) {
    return { ok: false, message: "ความยาวเพลงไม่ถูกต้อง" };
  }
  if (!EMAIL_REGEX.test(artistEmail)) {
    return { ok: false, message: "อีเมลไม่ถูกต้อง" };
  }
  if (!["upload", "ai", "team"].includes(coverMode)) {
    return { ok: false, message: "โหมดปกไม่ถูกต้อง" };
  }

  return {
    ok: true,
    data: {
      youtubeUrl,
      title,
      artist,
      genre: genre as TapeGenre,
      duration,
      description: description || undefined,
      artistEmail,
      socialUrl: socialUrl || undefined,
      tools: tools || undefined,
      coverMode,
      coverPrompt: coverPrompt || undefined,
      mood: mood || undefined,
    },
  };
}

function coverPromptForSheet(data: { coverMode: string; coverPrompt?: string; mood?: string }): string {
  if (data.coverMode === "ai") return data.coverPrompt ?? "";
  if (data.coverMode === "team") return data.mood ?? "";
  return "";
}

function rateLimitKey(email: string): string {
  return email.trim().toLowerCase();
}

function isRateLimited(email: string): boolean {
  const key = rateLimitKey(email);
  const now = Date.now();
  const windowStart = now - THIRTY_DAYS_MS;
  const stamps = submissionTimestampsByEmail.get(key) ?? [];
  const recent = stamps.filter((t) => t > windowStart);
  submissionTimestampsByEmail.set(key, recent);
  return recent.length >= 3;
}

function recordSubmission(email: string): void {
  const key = rateLimitKey(email);
  const stamps = submissionTimestampsByEmail.get(key) ?? [];
  stamps.push(Date.now());
  submissionTimestampsByEmail.set(key, stamps);
}

async function allocateCatalogId(): Promise<string> {
  const hasSheetEnv =
    !!process.env.GOOGLE_SHEETS_ID &&
    !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    !!process.env.GOOGLE_PRIVATE_KEY;

  if (hasSheetEnv) {
    try {
      const n = await getNextCatalogNumberFromSheet();
      catalogCounter = Math.max(catalogCounter, n + 1);
      return `PLG-${String(n).padStart(3, "0")}`;
    } catch (e) {
      console.warn("[plengma][submit] could not read sheet for catalog id, using in-memory counter", e);
    }
  }

  const n = catalogCounter;
  catalogCounter += 1;
  return `PLG-${String(n).padStart(3, "0")}`;
}

async function sendConfirmationEmail(artist: string, title: string, catalogId: string, to: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[plengma][submit] RESEND_API_KEY not set — skipping confirmation email");
    return;
  }

  const from = process.env.RESEND_FROM_EMAIL ?? "เพลงมา <onboarding@resend.dev>";
  const resend = new Resend(apiKey);

  const text = `สวัสดีครับ/ค่ะ ${artist}

เราได้รับเพลง "${title}" เรียบร้อยแล้ว
หมายเลขคิว: ${catalogId}

ทีมงานจะรีวิวภายใน 2-3 วัน แล้วแจ้งผลกลับทาง email นี้

ขอบคุณที่ส่งเพลงมาให้เรา
— ทีมเพลงมา
plengma.com`;

  const { error } = await resend.emails.send({
    from,
    to,
    subject: "เพลงของคุณอยู่ในคิวแล้ว — เพลงมา ★",
    text,
  });

  if (error) {
    console.warn("[plengma][submit] Resend error", error);
  }
}

export async function POST(request: Request) {
  let body: SubmitBody;
  try {
    body = (await request.json()) as SubmitBody;
  } catch {
    return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
  }

  const website = typeof body.website === "string" ? body.website : "";
  if (website !== "") {
    return NextResponse.json({ success: true, catalogId: "PLG-000" });
  }

  const validated = validateBody(body);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.message }, { status: 400 });
  }

  const { data } = validated;

  if (isRateLimited(data.artistEmail)) {
    return NextResponse.json(
      { error: "ส่งได้สูงสุด 3 เพลงต่อเดือนนะ — รอเดือนหน้าได้เลย" },
      { status: 429 }
    );
  }

  const catalogId = await allocateCatalogId();

  const sheetPayload = {
    catalogId,
    title: data.title,
    artist: data.artist,
    genre: data.genre,
    duration: data.duration,
    youtubeUrl: data.youtubeUrl,
    description: data.description,
    artistEmail: data.artistEmail,
    socialUrl: data.socialUrl,
    tools: data.tools,
    coverMode: data.coverMode,
    coverPrompt: coverPromptForSheet(data),
  };

  const hasSheetEnv =
    !!process.env.GOOGLE_SHEETS_ID &&
    !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    !!process.env.GOOGLE_PRIVATE_KEY;

  if (hasSheetEnv) {
    try {
      await appendSubmission(sheetPayload);
    } catch (e) {
      console.warn("[plengma][submit] Google Sheets append failed — continuing", e);
    }
  } else {
    console.warn("[plengma][submit] Google Sheets env not configured — skipping append");
  }

  try {
    await sendConfirmationEmail(data.artist, data.title, catalogId, data.artistEmail);
  } catch (e) {
    console.warn("[plengma][submit] confirmation email failed — continuing", e);
  }

  recordSubmission(data.artistEmail);

  return NextResponse.json({ success: true, catalogId });
}
