// Google Sheets helper — submissions tab columns A–Z

import { google } from "googleapis";
import type { AIApproach } from "@/lib/types";
import { normalizeAIApproach } from "@/lib/ai-approach";

export { normalizeAIApproach };

export type SheetSubmissionPayload = {
  catalogId: string;
  title: string;
  artist: string;
  genre: string;
  duration: string;
  youtubeUrl: string;
  description?: string;
  artistEmail: string;
  socialUrl?: string;
  tools?: string;
  coverMode: string;
  coverPrompt?: string;
};

export type AdminSubmissionStatus = "pending" | "approved" | "rejected";

export type AdminSubmission = {
  submittedAt: string;
  catalogId: string;
  title: string;
  artist: string;
  genre: string;
  duration: string;
  youtubeUrl: string;
  status: AdminSubmissionStatus;
  curatorNote?: string;
  rejectionReason?: string;
};

export type AdminSubmissionDetail = AdminSubmission & {
  artistEmail: string;
  socialUrl?: string;
  tools?: string;
  description?: string;
  coverMode?: string;
  coverPrompt?: string;
  /** Sheet Q–Z (publish / transparency) */
  positionRow?: string;
  positionCol?: string;
  coverBg?: string;
  side?: string;
  tagsSheet?: string;
  listens?: string;
  likes?: string;
  publishedAt?: string;
  aiApproach?: string;
  humanInput?: string;
};

export const SUBMISSIONS_TAB = "Submissions";

export function getSubmissionsFullRange(): string {
  return process.env.GOOGLE_SHEETS_FULL_RANGE ?? `${SUBMISSIONS_TAB}!A:Z`;
}

export function getSubmissionsAppendRange(): string {
  return process.env.GOOGLE_SHEETS_APPEND_RANGE ?? `${SUBMISSIONS_TAB}!A:Z`;
}

function getPrivateKey(): string {
  const raw = process.env.GOOGLE_PRIVATE_KEY;
  if (!raw) return "";
  return raw.replace(/\\n/g, "\n");
}

function getAuth() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = getPrivateKey();
  if (!clientEmail || !privateKey) {
    throw new Error("Google service account env vars are incomplete");
  }
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

/** Next catalog sequence from row count (column A). Assumes row 1 is header; first data row = PLG-001. */
export async function getNextCatalogNumberFromSheet(): Promise<number> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
  if (!spreadsheetId) {
    throw new Error("GOOGLE_SHEETS_ID is not set");
  }

  const range = process.env.GOOGLE_SHEETS_RANGE ?? `${SUBMISSIONS_TAB}!A:A`;
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const rows = res.data.values ?? [];
  return Math.max(1, rows.length);
}

const EMPTY_QZ = ["", "", "", "", "", "", "", "", "", ""] as const;

export async function appendSubmission(data: SheetSubmissionPayload): Promise<void> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
  if (!spreadsheetId) {
    throw new Error("GOOGLE_SHEETS_ID is not set");
  }

  const range = getSubmissionsAppendRange();
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });

  const timestamp = new Date().toISOString();
  const row: string[] = [
    timestamp,
    data.catalogId,
    data.title,
    data.artist,
    data.genre,
    data.duration,
    data.youtubeUrl,
    data.description ?? "",
    data.artistEmail,
    data.socialUrl ?? "",
    data.tools ?? "",
    data.coverMode,
    data.coverPrompt ?? "",
    "pending",
    "",
    "",
    ...EMPTY_QZ,
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [row],
    },
  });
}

function normalizeStatus(value: string): AdminSubmissionStatus {
  const status = value.trim().toLowerCase();
  if (status === "approved" || status === "rejected") return status;
  return "pending";
}

export function parseSubmissionRow(row: string[]): AdminSubmissionDetail {
  const submittedAt = row[0] ?? "";
  const catalogId = row[1] ?? "";
  const title = row[2] ?? "";
  const artist = row[3] ?? "";
  const genre = row[4] ?? "";
  const duration = row[5] ?? "";
  const youtubeUrl = row[6] ?? "";
  const description = row[7] ?? "";
  const artistEmail = row[8] ?? "";
  const socialUrl = row[9] ?? "";
  const tools = row[10] ?? "";
  const coverMode = row[11] ?? "";
  const coverPrompt = row[12] ?? "";
  const status = normalizeStatus(row[13] ?? "");
  const curatorNote = row[14] ?? "";
  const rejectionReason = row[15] ?? "";
  const positionRow = row[16]?.trim() ?? "";
  const positionCol = row[17]?.trim() ?? "";
  const coverBg = row[18]?.trim() ?? "";
  const side = row[19]?.trim() ?? "";
  const tagsSheet = row[20]?.trim() ?? "";
  const listens = row[21]?.trim() ?? "";
  const likes = row[22]?.trim() ?? "";
  const publishedAt = row[23]?.trim() ?? "";
  const aiApproach = row[24]?.trim() ?? "";
  const humanInput = row[25]?.trim() ?? "";

  return {
    submittedAt,
    catalogId,
    title,
    artist,
    genre,
    duration,
    youtubeUrl,
    artistEmail,
    socialUrl: socialUrl || undefined,
    tools: tools || undefined,
    description: description || undefined,
    coverMode: coverMode || undefined,
    coverPrompt: coverPrompt || undefined,
    status,
    curatorNote: curatorNote || undefined,
    rejectionReason: rejectionReason || undefined,
    positionRow: positionRow || undefined,
    positionCol: positionCol || undefined,
    coverBg: coverBg || undefined,
    side: side || undefined,
    tagsSheet: tagsSheet || undefined,
    listens: listens || undefined,
    likes: likes || undefined,
    publishedAt: publishedAt || undefined,
    aiApproach: aiApproach || undefined,
    humanInput: humanInput || undefined,
  };
}

export async function fetchSubmissionRowsRaw(): Promise<string[][]> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
  if (!spreadsheetId) {
    throw new Error("GOOGLE_SHEETS_ID is not set");
  }

  const range = getSubmissionsFullRange();
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  return res.data.values ?? [];
}

export async function readSubmissions(): Promise<AdminSubmissionDetail[]> {
  const rows = await fetchSubmissionRowsRaw();
  if (rows.length <= 1) return [];

  return rows
    .slice(1)
    .map((row) => parseSubmissionRow(row as string[]))
    .filter((item) => item.catalogId && item.title && item.artist);
}

export async function readSubmissionByCatalogId(
  catalogId: string
): Promise<AdminSubmissionDetail | null> {
  const items = await readSubmissions();
  const target = items.find((item) => item.catalogId === catalogId.trim());
  return target ?? null;
}

/** Published date is in calendar month (1–12) and year */
export function publishedInMonth(iso: string, month: number, year: number): boolean {
  if (!iso.trim()) return false;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return false;
  return d.getMonth() + 1 === month && d.getFullYear() === year;
}

export type ShelfOccupant = { catalogId: string; row: number; col: number };

export async function listPublishedShelfPositionsForMonth(input: {
  month: number;
  year: number;
  excludeCatalogId?: string;
}): Promise<ShelfOccupant[]> {
  const rows = await fetchSubmissionRowsRaw();
  if (rows.length <= 1) return [];

  const out: ShelfOccupant[] = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i] as string[];
    const detail = parseSubmissionRow(row);
    if (detail.status !== "approved") continue;
    if (!detail.publishedAt || !publishedInMonth(detail.publishedAt, input.month, input.year)) continue;
    if (input.excludeCatalogId && detail.catalogId === input.excludeCatalogId.trim()) continue;
    const pr = detail.positionRow?.trim();
    const pc = detail.positionCol?.trim();
    if (pr === undefined || pr === "" || pc === undefined || pc === "") continue;
    const rowIdx = parseInt(pr, 10);
    const colIdx = parseInt(pc, 10);
    if (Number.isNaN(rowIdx) || Number.isNaN(colIdx)) continue;
    out.push({ catalogId: detail.catalogId, row: rowIdx, col: colIdx });
  }
  return out;
}

export type ApprovePublishPayload = {
  positionRow: number;
  positionCol: number;
  coverBg: number;
  side: "A" | "B";
  tags: string;
  listens: number;
  likes: number;
  aiApproach: AIApproach;
  humanInput?: string;
};

export async function updateSubmissionReviewByCatalogId(input: {
  catalogId: string;
  status: AdminSubmissionStatus;
  curatorNote?: string;
  rejectionReason?: string;
  /** null = อนุมัติแต่ยังไม่ขึ้นแผง · object = publish · omit/undefined ใช้กับ reject */
  publish?: ApprovePublishPayload | null;
}): Promise<AdminSubmissionDetail> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
  if (!spreadsheetId) {
    throw new Error("GOOGLE_SHEETS_ID is not set");
  }

  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const range = getSubmissionsFullRange();

  const getRes = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const rows = getRes.data.values ?? [];
  const dataRows = rows.slice(1);
  const rowIndex = dataRows.findIndex((row) => (row[1] ?? "").trim() === input.catalogId.trim());
  if (rowIndex === -1) {
    throw new Error("CATALOG_NOT_FOUND");
  }

  const sheetRowNumber = rowIndex + 2;
  const reviewRange = `${SUBMISSIONS_TAB}!N${sheetRowNumber}:Z${sheetRowNumber}`;

  let tail: string[];
  if (input.status === "rejected") {
    tail = [
      input.status,
      "",
      input.rejectionReason?.trim() ?? "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ];
  } else if (input.publish) {
    const p = input.publish;
    const publishedAt = new Date().toISOString();
    tail = [
      input.status,
      input.curatorNote?.trim() ?? "",
      "",
      String(p.positionRow),
      String(p.positionCol),
      String(p.coverBg),
      p.side,
      p.tags,
      String(p.listens),
      String(p.likes),
      publishedAt,
      p.aiApproach,
      p.humanInput?.trim() ?? "",
    ];
  } else {
    tail = [
      input.status,
      input.curatorNote?.trim() ?? "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ];
  }

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: reviewRange,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [tail],
    },
  });

  const updatedRow = [...(dataRows[rowIndex] ?? [])];
  while (updatedRow.length < 26) {
    updatedRow.push("");
  }
  updatedRow[13] = tail[0] ?? "";
  updatedRow[14] = tail[1] ?? "";
  updatedRow[15] = tail[2] ?? "";
  for (let i = 0; i < 10; i++) {
    updatedRow[16 + i] = tail[3 + i] ?? "";
  }

  return parseSubmissionRow(updatedRow as string[]);
}
