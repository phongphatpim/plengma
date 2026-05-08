import { NextResponse } from "next/server";
import { toSubmissionRecord, validateSubmission, type SubmissionPayload } from "@/lib/submission";

export async function POST(request: Request) {
  let payload: SubmissionPayload;

  try {
    payload = (await request.json()) as SubmissionPayload;
  } catch {
    return NextResponse.json(
      { ok: false, message: "ข้อมูลที่ส่งมาไม่ถูกต้อง" },
      { status: 400 }
    );
  }

  const validation = validateSubmission(payload);
  if (!validation.ok) {
    return NextResponse.json(
      {
        ok: false,
        message: validation.errors[0],
        errors: validation.errors,
      },
      { status: 400 }
    );
  }

  const record = toSubmissionRecord(payload);

  // Phase 0: เก็บเป็น log ชั่วคราวก่อนเชื่อม DB จริงใน Phase ถัดไป
  console.log("[plengma][submission]", record);

  return NextResponse.json({
    ok: true,
    message: "รับเพลงเข้าคิวแล้ว",
    submissionId: `PM-${Date.now().toString(36).toUpperCase()}`,
  });
}
