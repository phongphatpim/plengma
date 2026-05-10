type BaseTemplateInput = {
  artist: string;
  title: string;
  catalogId: string;
  siteUrl?: string;
};

type ApprovedTemplateInput = BaseTemplateInput & {
  curatorNote?: string;
  row?: string;
  col?: string;
};

type RejectedTemplateInput = BaseTemplateInput & {
  rejectionReason?: string;
};

type EmailTemplate = {
  subject: string;
  text: string;
  html: string;
};

function resolveSiteUrl(siteUrl?: string): string {
  return (siteUrl || process.env.NEXT_PUBLIC_SITE_URL || "https://plengma.com").replace(/\/+$/, "");
}

function baseHtmlLayout(content: string): string {
  return `<!doctype html>
<html lang="th">
  <body style="margin:0;padding:0;background:#0E0820;color:#F4EFE6;font-family:'Noto Sans Thai',Arial,sans-serif;">
    <div style="max-width:640px;margin:0 auto;padding:24px;">
      <div style="border:1px solid rgba(233,185,73,0.35);background:#120b29;border-radius:16px;padding:24px;">
        <p style="margin:0 0 8px;font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#E9B949;">
          PlengMa Admin Update
        </p>
        ${content}
      </div>
    </div>
  </body>
</html>`;
}

export function buildApprovedEmailTemplate(input: ApprovedTemplateInput): EmailTemplate {
  const shelfUrl = `${resolveSiteUrl(input.siteUrl)}/shelf`;
  const position = input.row || input.col ? `${input.row || "-"}-${input.col || "-"}` : "-";
  const noteLine = input.curatorNote ? `หมายเหตุจากทีม: ${input.curatorNote}` : "หมายเหตุจากทีม: -";

  return {
    subject: "★ ขึ้นแผงแล้ว!",
    text: `สวัสดี ${input.artist}

เพลง "${input.title}" ได้ขึ้นแผงแล้ว!
catalog #: ${input.catalogId}
ตำแหน่ง: ${position}
${noteLine}

ดูแผงได้ที่: ${shelfUrl}

ขอบคุณที่ส่งเพลงมาให้เรา
— ทีมเพลงมา`,
    html: baseHtmlLayout(`
      <h1 style="margin:0 0 12px;font-family:'Bai Jamjuree',Arial,sans-serif;font-size:30px;line-height:1.25;color:#E9B949;">★ ขึ้นแผงแล้ว!</h1>
      <p style="margin:0 0 14px;font-size:15px;line-height:1.7;">สวัสดี ${input.artist}</p>
      <p style="margin:0 0 14px;font-size:15px;line-height:1.7;">เพลง "<strong>${input.title}</strong>" ของคุณถูกคัดเลือกขึ้นแผงเรียบร้อยแล้ว</p>
      <p style="margin:0 0 4px;font-size:14px;line-height:1.6;"><strong>catalog #:</strong> ${input.catalogId}</p>
      <p style="margin:0 0 4px;font-size:14px;line-height:1.6;"><strong>ตำแหน่ง:</strong> ${position}</p>
      <p style="margin:0 0 18px;font-size:14px;line-height:1.6;"><strong>หมายเหตุจากทีม:</strong> ${input.curatorNote || "-"}</p>
      <a href="${shelfUrl}" style="display:inline-block;padding:10px 14px;border-radius:10px;background:#E9B949;color:#0E0820;text-decoration:none;font-weight:700;">ไปดูบนแผง /shelf</a>
    `),
  };
}

export function buildRejectedEmailTemplate(input: RejectedTemplateInput): EmailTemplate {
  const submitUrl = `${resolveSiteUrl(input.siteUrl)}/submit`;
  const reason = input.rejectionReason || "รอบนี้ทีมยังเห็นว่ายังไม่ตรงกับแนวคัดสรรของเดือนนี้";

  return {
    subject: "ขอบคุณที่ส่งเพลงมา",
    text: `สวัสดี ${input.artist}

ขอบคุณที่ส่งเพลง "${input.title}" (${input.catalogId}) มาที่เพลงมา
รอบนี้ทีมยังไม่ได้คัดเลือกเพลงนี้ขึ้นแผง
เหตุผล: ${reason}

อยากชวนส่งผลงานใหม่เข้ามาอีกครั้งที่ ${submitUrl}
— ทีมเพลงมา`,
    html: baseHtmlLayout(`
      <h1 style="margin:0 0 12px;font-family:'Bai Jamjuree',Arial,sans-serif;font-size:28px;line-height:1.25;color:#E9B949;">ขอบคุณที่ส่งเพลงมา</h1>
      <p style="margin:0 0 14px;font-size:15px;line-height:1.7;">สวัสดี ${input.artist}</p>
      <p style="margin:0 0 14px;font-size:15px;line-height:1.7;">ขอบคุณสำหรับเพลง "<strong>${input.title}</strong>" (${input.catalogId})</p>
      <p style="margin:0 0 6px;font-size:14px;line-height:1.6;">รอบนี้ทีมยังไม่ได้คัดเลือกเพลงนี้ขึ้นแผง</p>
      <p style="margin:0 0 18px;font-size:14px;line-height:1.6;"><strong>เหตุผล:</strong> ${reason}</p>
      <a href="${submitUrl}" style="display:inline-block;padding:10px 14px;border-radius:10px;background:#E85D8C;color:#0E0820;text-decoration:none;font-weight:700;">ส่งเพลงใหม่ที่ /submit</a>
    `),
  };
}
