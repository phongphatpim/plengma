// ─── Tape / Track ────────────────────────────────────────────
export type TapeStatus = "occupied" | "empty" | "retired";

export interface Tape {
  id: string;          // เช่น "A-07"
  slot: number;        // ตำแหน่งใน grid (0-based)
  status: TapeStatus;
  track?: Track;       // มีเฉพาะ status === "occupied"
}

export interface Track {
  title: string;
  artistName: string;
  coverUrl: string;
  audioUrl?: string;
  genre?: string;
  mood?: string;
  tools?: string[];    // ["Suno", "ElevenLabs", ...]
  curatorNote?: string;
  submittedAt: string; // ISO date string
  playCount?: number;
  /** แท็กสำหรับ modal / แผง (เช่น curated, hot, new) */
  tags?: string[];
  duration?: string;
  likes?: number;
  side?: string;
}

// ─── Shelf / Month ───────────────────────────────────────────
export interface MonthlyShelf {
  month: string;       // "2025-04"
  label: string;       // "เมษายน 2568"
  totalSlots: number;  // 300
  tapes: Tape[];
}

// ─── Submit Form ─────────────────────────────────────────────
export interface SubmitFormData {
  artistName: string;
  trackTitle: string;
  audioUrl: string;
  coverFile?: File;
  genre: string;
  mood: string;
  tools: string[];
  description: string;
  contactEmail: string;
  agreeToTerms: boolean;
}
