/** Phase 1 domain types — PM-P1 § Types */

export type SlotStatus = "tape" | "empty" | "retired";

export type TapeGenre =
  | "DREAM POP"
  | "CITYPOP"
  | "LOFI"
  | "INDIE POP"
  | "FOLK"
  | "R&B"
  | "ELECTRONIC"
  | "AMBIENT"
  | "HIP-HOP"
  | "POP PUNK"
  | "SYNTHWAVE"
  | "JAZZ"
  | "DARKWAVE"
  | "POST-ROCK"
  | "BEDROOM POP"
  | "อื่นๆ";

export type TapeTag = "new" | "hot" | "curated" | "rare";

export interface TapePosition {
  row: number;
  col: number;
}

export interface Tape {
  id: string;
  position: TapePosition;
  title: string;
  artist: string;
  genre: TapeGenre;
  duration: string;
  youtubeUrl: string;
  coverBg: number;
  side: "A" | "B";
  tags: TapeTag[];
  listens: number;
  likes: number;
  description?: string;
  tools?: string;
  socialUrl?: string;
  curatorNote?: string;
  submittedAt: string;
  publishedAt: string;
}

export interface ShelfMonth {
  month: string;
  year: number;
  capacity: number;
  tapes: Tape[];
  retiredPositions: TapePosition[];
}

export interface SubmitFormData {
  youtubeUrl: string;
  title: string;
  artist: string;
  genre: TapeGenre;
  duration: string;
  description?: string;
  artistEmail: string;
  socialUrl?: string;
  tools?: string;
  coverMode: "upload" | "ai" | "team";
  coverPrompt?: string;
}

/** Click payload from a shelf cell */
export type TapeSlotClick =
  | { status: "tape"; position: TapePosition; tape: Tape }
  | { status: "empty"; position: TapePosition }
  | { status: "retired"; position: TapePosition };

/** Modal state */
export type TapeModalSelection =
  | { kind: "tape"; tape: Tape }
  | { kind: "empty"; position: TapePosition; label: string }
  | { kind: "retired"; position: TapePosition; label: string };

export const SHELF_ROWS = 10;
export const SHELF_COLS = 30;
export const SHELF_CAPACITY = SHELF_ROWS * SHELF_COLS;

export function shelfSlotIndex(row: number, col: number): number {
  return row * SHELF_COLS + col;
}

export function formatShelfPosition(row: number, col: number): string {
  const letter = "ABCDEFGHIJ"[row] ?? "?";
  return `${letter}-${String(col + 1).padStart(2, "0")}`;
}

export function positionKey(p: TapePosition): string {
  return `${p.row},${p.col}`;
}
