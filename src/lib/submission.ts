export interface SubmissionPayload {
  songUrl: string;
  songTitle: string;
  genre: string;
  duration: string;
  description: string;
  artistName: string;
  email: string;
  social: string;
  tools: string;
  coverMode: "upload" | "ai" | "team";
  coverPrompt: string;
  teamMoodNote: string;
  cb1: boolean;
  cb2: boolean;
  cb3: boolean;
}

export interface ValidationResult {
  ok: boolean;
  errors: string[];
}

const titlePattern = /^[\u0E00-\u0E7Fa-zA-Z0-9\s\-._!?()'"&/]+$/;
const socialPattern = /^(https?:\/\/)?(www\.)?(instagram\.com|x\.com|twitter\.com)\/.+$/i;
const durationPattern = /^\d{2}:\d{2}$/;

export function validateSubmission(payload: SubmissionPayload): ValidationResult {
  const errors: string[] = [];

  if (!payload.songTitle.trim()) errors.push("กรุณาใส่ชื่อเพลง");
  if (!payload.genre.trim()) errors.push("กรุณาเลือกแนวเพลง");
  if (!payload.artistName.trim()) errors.push("กรุณาใส่ชื่อศิลปิน");
  if (!payload.email.trim()) errors.push("กรุณาใส่อีเมล");

  if (!payload.cb1 || !payload.cb2 || !payload.cb3) {
    errors.push("กรุณายืนยันเงื่อนไขทั้ง 3 ข้อก่อนส่ง");
  }

  if (payload.songTitle.length > 40) errors.push("ชื่อเพลงยาวเกิน 40 ตัวอักษร");
  if (payload.artistName.length > 30) errors.push("ชื่อศิลปินยาวเกิน 30 ตัวอักษร");
  if (payload.description.length > 280) errors.push("คำอธิบายเพลงยาวเกิน 280 ตัวอักษร");

  if (payload.songTitle && !titlePattern.test(payload.songTitle)) {
    errors.push("ชื่อเพลงมีอักขระที่ไม่รองรับ");
  }

  if (payload.duration && !durationPattern.test(payload.duration)) {
    errors.push("รูปแบบความยาวเพลงไม่ถูกต้อง (ตัวอย่าง: 03:42)");
  }

  if (payload.songUrl) {
    try {
      const parsed = new URL(payload.songUrl.startsWith("http") ? payload.songUrl : `https://${payload.songUrl}`);
      const allowedHosts = ["youtube.com", "www.youtube.com", "youtu.be", "suno.com", "udio.com", "soundcloud.com"];
      if (!allowedHosts.includes(parsed.hostname)) {
        errors.push("ลิงก์เพลงรองรับเฉพาะ YouTube / Suno / Udio / SoundCloud");
      }
    } catch {
      errors.push("ลิงก์เพลงไม่ถูกต้อง");
    }
  }

  if (payload.social && !socialPattern.test(payload.social)) {
    errors.push("ลิงก์โซเชียลต้องเป็น Instagram หรือ X/Twitter");
  }

  const forbiddenKeywords = ["ปฏิวัติ", "ดีที่สุด", "revolution", "voice clone", "voice cloning"];
  const checkText = `${payload.songTitle} ${payload.description}`.toLowerCase();
  if (forbiddenKeywords.some((keyword) => checkText.includes(keyword.toLowerCase()))) {
    errors.push("เนื้อหามีคำที่ขัดกับแนวทางการสื่อสารของเพลงมา");
  }

  return {
    ok: errors.length === 0,
    errors,
  };
}

export function toSubmissionRecord(payload: SubmissionPayload) {
  return {
    ...payload,
    songUrl: payload.songUrl.trim(),
    songTitle: payload.songTitle.trim(),
    genre: payload.genre.trim(),
    duration: payload.duration.trim(),
    description: payload.description.trim(),
    artistName: payload.artistName.trim(),
    email: payload.email.trim().toLowerCase(),
    social: payload.social.trim(),
    tools: payload.tools.trim(),
    coverPrompt: payload.coverPrompt.trim(),
    teamMoodNote: payload.teamMoodNote.trim(),
    submittedAt: new Date().toISOString(),
    status: "pending-review" as const,
  };
}
