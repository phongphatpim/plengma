import { unstable_cache } from "next/cache";
import {
  fetchSubmissionRowsRaw,
  parseSubmissionRow,
  publishedInMonth,
  type AdminSubmissionDetail,
} from "@/lib/sheets";
import { normalizeAIApproach } from "@/lib/ai-approach";
import type { Tape, TapeGenre, TapeTag, AIApproach } from "@/lib/types";
import { parseToolLabels } from "@/lib/parse-tools";
import { may2026 } from "@/lib/data/may2026";

const MONTH_MAP: Record<string, number> = {
  JAN: 1,
  FEB: 2,
  MAR: 3,
  APR: 4,
  MAY: 5,
  JUN: 6,
  JUL: 7,
  AUG: 8,
  SEP: 9,
  OCT: 10,
  NOV: 11,
  DEC: 12,
};

const GENRES: TapeGenre[] = [
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
];

const TAG_SET = new Set<TapeTag>(["new", "hot", "curated", "rare"]);

export function coerceGenre(raw: string): TapeGenre {
  const t = raw.trim();
  if (GENRES.includes(t as TapeGenre)) return t as TapeGenre;
  const up = t.toUpperCase();
  const hit = GENRES.find((g) => g.toUpperCase() === up);
  return hit ?? "อื่นๆ";
}

function parseTags(raw?: string): TapeTag[] {
  if (!raw?.trim()) return [];
  const out: TapeTag[] = [];
  for (const part of raw.split(",")) {
    const p = part.trim().toLowerCase();
    if (TAG_SET.has(p as TapeTag)) out.push(p as TapeTag);
  }
  return out;
}

function adminDetailToTape(d: AdminSubmissionDetail, month: number, year: number): Tape | null {
  if (d.status !== "approved") return null;
  if (!d.publishedAt || !publishedInMonth(d.publishedAt, month, year)) return null;
  const pr = d.positionRow?.trim();
  const pc = d.positionCol?.trim();
  if (pr === undefined || pr === "" || pc === undefined || pc === "") return null;
  const row = parseInt(pr, 10);
  const col = parseInt(pc, 10);
  if (Number.isNaN(row) || Number.isNaN(col)) return null;
  if (row < 0 || row > 9 || col < 0 || col > 29) return null;

  const coverBg = Math.min(15, Math.max(1, parseInt(d.coverBg ?? "1", 10) || 1));
  const side: "A" | "B" = d.side?.trim().toUpperCase() === "B" ? "B" : "A";
  const listens = Math.max(0, parseInt(d.listens ?? "0", 10) || 0);
  const likes = Math.max(0, parseInt(d.likes ?? "0", 10) || 0);
  const approach: AIApproach = normalizeAIApproach(d.aiApproach ?? "") ?? "hybrid";
  const toolsList = parseToolLabels(d.tools);

  return {
    id: d.catalogId,
    position: { row, col },
    title: d.title,
    artist: d.artist,
    genre: coerceGenre(d.genre),
    duration: d.duration,
    youtubeUrl: d.youtubeUrl,
    coverBg,
    side,
    tags: parseTags(d.tagsSheet),
    listens,
    likes,
    description: d.description,
    tools: d.tools,
    socialUrl: d.socialUrl,
    curatorNote: d.curatorNote,
    submittedAt: d.submittedAt || d.publishedAt,
    publishedAt: d.publishedAt,
    transparency: {
      tools: toolsList,
      approach,
      humanInput: d.humanInput || undefined,
    },
  };
}

export async function loadApprovedTapesUncached(month: string, year: number): Promise<Tape[]> {
  const m = MONTH_MAP[month.toUpperCase()];
  if (!m) return [];

  const rows = await fetchSubmissionRowsRaw();
  if (rows.length <= 1) return [];

  const tapes: Tape[] = [];
  for (let i = 1; i < rows.length; i++) {
    const detail = parseSubmissionRow(rows[i] as string[]);
    const tape = adminDetailToTape(detail, m, year);
    if (tape) tapes.push(tape);
  }

  const byPos = new Map<string, Tape>();
  for (const tape of tapes) {
    const k = `${tape.position.row},${tape.position.col}`;
    if (byPos.has(k)) {
      console.warn("[plengma][sheets-reader] duplicate shelf position, skipping row", k, tape.id);
      continue;
    }
    byPos.set(k, tape);
  }

  const deduped = Array.from(byPos.values());
  deduped.sort((a, b) => a.position.row - b.position.row || a.position.col - b.position.col);
  return deduped;
}

export function getApprovedTapesCached(month: string, year: number) {
  return unstable_cache(
    async () => loadApprovedTapesUncached(month, year),
    ["approved-tapes", month.toUpperCase(), String(year)],
    { revalidate: 60, tags: ["shelf-tapes"] }
  )();
}

export async function getRetiredPositions(month: string, year: number) {
  if (month.toUpperCase() === "MAY" && year === 2026) {
    return may2026.retiredPositions;
  }
  return [];
}
