import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ─── Tailwind className helper ────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Brand Constants ──────────────────────────────────────────
export const BRAND = {
  name: "เพลงมา",
  nameEn: "PlengMa",
  tagline: "แผงเทปเพลงไทย AI คัดสรร",
  url: "https://www.plengma.com",
  slots: 300, // ช่องต่อเดือน
} as const;

export const GENRES = [
  "ป็อป", "ร็อค", "อีดีเอ็ม", "ฮิปฮอป", "อาร์แอนด์บี",
  "โฟล์ค", "แจ๊ส", "ลูกทุ่ง", "ลูกกรุง", "อินดี้", "อื่นๆ",
] as const;

export const MOODS = [
  "สนุก", "เศร้า", "โรแมนติก", "ฮึกเหิม",
  "ผ่อนคลาย", "มืดหม่น", "สดใส",
] as const;

export const AI_TOOLS = [
  "Suno", "Udio", "ElevenLabs", "Stable Audio",
  "MusicGen", "Musicfy", "อื่นๆ",
] as const;
