import { Resend } from "resend";

type NewSubmissionNotifyInput = {
  catalogId: string;
  title: string;
  artist: string;
};

function getBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://plengma.com").replace(/\/+$/, "");
}

export async function notifyAdminNewSubmission(input: NewSubmissionNotifyInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL?.trim();
  if (!apiKey || !adminEmail) {
    return;
  }

  const from = process.env.RESEND_FROM_EMAIL ?? "เพลงมา <onboarding@resend.dev>";
  const reviewUrl = `${getBaseUrl()}/admin/review/${encodeURIComponent(input.catalogId)}`;
  const subject = `เพลงใหม่: ${input.title} - ${input.artist}`;

  const text = `มีเพลงใหม่ส่งเข้ามา

catalogId: ${input.catalogId}
title: ${input.title}
artist: ${input.artist}

เปิดรีวิวได้ที่:
${reviewUrl}`;

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: adminEmail,
    subject,
    text,
    replyTo: adminEmail,
  });

  if (error) {
    console.warn("[plengma][notify] failed to notify admin", error);
  }
}
