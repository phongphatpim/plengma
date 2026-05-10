"use server";

import { readSubmissionByCatalogId } from "@/lib/sheets";

export type StatusCheckState =
  | { step: "idle" }
  | { step: "error"; message: string }
  | {
      step: "success";
      status: "pending" | "approved" | "rejected";
      title: string;
      artist: string;
      rejectionReason?: string;
    };

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export async function verifySubmissionStatus(
  _prev: StatusCheckState,
  formData: FormData
): Promise<StatusCheckState> {
  const catalogId = String(formData.get("catalogId") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  if (!catalogId) {
    return { step: "error", message: "ไม่พบหมายเลขคิว" };
  }
  if (!email) {
    return { step: "error", message: "กรุณากรอกอีเมลที่ใช้ส่งเพลง" };
  }

  let submission;
  try {
    submission = await readSubmissionByCatalogId(catalogId);
  } catch {
    return { step: "error", message: "ยังเช็คสถานะไม่ได้ชั่วคราว ลองใหม่ภายหลัง" };
  }

  if (!submission) {
    return { step: "error", message: "ไม่พบหมายเลขคิวนี้ในระบบ" };
  }

  if (normalizeEmail(email) !== normalizeEmail(submission.artistEmail)) {
    return { step: "error", message: "อีเมลไม่ตรงกับที่ใช้ส่งเพลงไว้" };
  }

  return {
    step: "success",
    status: submission.status,
    title: submission.title,
    artist: submission.artist,
    rejectionReason: submission.rejectionReason,
  };
}
