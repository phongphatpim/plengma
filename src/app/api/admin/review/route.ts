import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { Resend } from "resend";
import {
  readSubmissionByCatalogId,
  updateSubmissionReviewByCatalogId,
  listPublishedShelfPositionsForMonth,
  type AdminSubmissionStatus,
} from "@/lib/sheets";
import { normalizeAIApproach } from "@/lib/ai-approach";
import { buildApprovedEmailTemplate, buildRejectedEmailTemplate } from "@/lib/email-templates";

type ReviewBody = {
  catalogId?: unknown;
  action?: unknown;
  /** notify = อนุมัติแจ้งศิลปินเท่านั้น · publish = ขึ้นแผง */
  approveKind?: unknown;
  curatorNote?: unknown;
  rejectionReason?: unknown;
  rowLetter?: unknown;
  colNum?: unknown;
  coverBg?: unknown;
  side?: unknown;
  tags?: unknown;
  listens?: unknown;
  likes?: unknown;
  aiApproach?: unknown;
  humanInput?: unknown;
};

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function shelfRowToIndex(letter: string): number | null {
  const L = letter.trim().toUpperCase();
  if (!/^[A-J]$/.test(L)) return null;
  return L.charCodeAt(0) - 65;
}

function shelfColToIndex(col: string): number | null {
  const n = parseInt(col.trim(), 10);
  if (Number.isNaN(n) || n < 1 || n > 30) return null;
  return n - 1;
}

async function sendReviewResultEmail(input: {
  to: string;
  artist: string;
  title: string;
  catalogId: string;
  status: AdminSubmissionStatus;
  curatorNote?: string;
  rejectionReason?: string;
  row?: string;
  col?: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const from = process.env.RESEND_FROM_EMAIL ?? "เพลงมา <onboarding@resend.dev>";
  const replyTo = process.env.ADMIN_EMAIL || undefined;
  const resend = new Resend(apiKey);

  const isApproved = input.status === "approved";
  const template = isApproved
    ? buildApprovedEmailTemplate({
        artist: input.artist,
        title: input.title,
        catalogId: input.catalogId,
        curatorNote: input.curatorNote,
        row: input.row,
        col: input.col,
      })
    : buildRejectedEmailTemplate({
        artist: input.artist,
        title: input.title,
        catalogId: input.catalogId,
        rejectionReason: input.rejectionReason,
      });

  const { error } = await resend.emails.send({
    from,
    to: input.to,
    subject: template.subject,
    text: template.text,
    html: template.html,
    replyTo,
  });

  if (error) {
    console.warn("[plengma][admin-review] failed to send email", error);
  }
}

export async function POST(request: Request) {
  let body: ReviewBody;
  try {
    body = (await request.json()) as ReviewBody;
  } catch {
    return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
  }

  const catalogId = asString(body.catalogId);
  const action = asString(body.action);
  const approveKind = asString(body.approveKind) || "notify";
  const curatorNote = asString(body.curatorNote);
  const rejectionReason = asString(body.rejectionReason);
  const rowLetter = asString(body.rowLetter);
  const colNum = asString(body.colNum);
  const coverBgRaw = asString(body.coverBg);
  const sideRaw = asString(body.side).toUpperCase();
  const tags = asString(body.tags);
  const listensRaw = asString(body.listens);
  const likesRaw = asString(body.likes);
  const aiApproachRaw = asString(body.aiApproach);
  const humanInput = asString(body.humanInput).slice(0, 200);

  if (!catalogId) {
    return NextResponse.json({ error: "ไม่พบ catalogId" }, { status: 400 });
  }
  if (action !== "approve" && action !== "reject") {
    return NextResponse.json({ error: "action ไม่ถูกต้อง" }, { status: 400 });
  }
  if (action === "reject" && !rejectionReason) {
    return NextResponse.json({ error: "กรุณาใส่เหตุผลที่ไม่ผ่าน" }, { status: 400 });
  }

  const existing = await readSubmissionByCatalogId(catalogId);
  if (!existing) {
    return NextResponse.json({ error: "ไม่พบรายการเพลงนี้" }, { status: 404 });
  }

  if (action === "approve" && approveKind === "publish") {
    if (!curatorNote) {
      return NextResponse.json(
        { error: "กรุณาใส่ curator note ก่อนขึ้นแผง" },
        { status: 400 }
      );
    }
    const rowIdx = shelfRowToIndex(rowLetter);
    const colIdx = shelfColToIndex(colNum);
    if (rowIdx === null || colIdx === null) {
      return NextResponse.json(
        { error: "ตำแหน่งแถว (A–J) และคอลัมน์ (01–30) ไม่ถูกต้อง" },
        { status: 400 }
      );
    }
    const approach = normalizeAIApproach(aiApproachRaw);
    if (!approach) {
      return NextResponse.json({ error: "กรุณาเลือก AI approach" }, { status: 400 });
    }
    const coverBg = Math.min(15, Math.max(1, parseInt(coverBgRaw || "1", 10) || 1));
    const side = sideRaw === "B" ? "B" : "A";
    const listens = Math.max(0, parseInt(listensRaw || "0", 10) || 0);
    const likes = Math.max(0, parseInt(likesRaw || "0", 10) || 0);

    const occupied = await listPublishedShelfPositionsForMonth({
      month: 5,
      year: 2026,
      excludeCatalogId: catalogId,
    });
    if (occupied.some((o) => o.row === rowIdx && o.col === colIdx)) {
      return NextResponse.json({ error: "ตำแหน่งนี้มีเพลงอื่นอยู่แล้ว" }, { status: 400 });
    }

    let updated;
    try {
      updated = await updateSubmissionReviewByCatalogId({
        catalogId,
        status: "approved",
        curatorNote,
        rejectionReason: "",
        publish: {
          positionRow: rowIdx,
          positionCol: colIdx,
          coverBg,
          side,
          tags,
          listens,
          likes,
          aiApproach: approach,
          humanInput: humanInput || undefined,
        },
      });
    } catch (error) {
      if (error instanceof Error && error.message === "CATALOG_NOT_FOUND") {
        return NextResponse.json({ error: "ไม่พบ catalogId ใน Google Sheets" }, { status: 404 });
      }
      console.error("[plengma][admin-review] update error", error);
      return NextResponse.json({ error: "บันทึกผลรีวิวไม่สำเร็จ" }, { status: 500 });
    }

    try {
      await sendReviewResultEmail({
        to: existing.artistEmail,
        artist: existing.artist,
        title: existing.title,
        catalogId: existing.catalogId,
        status: "approved",
        curatorNote: updated.curatorNote,
        row: rowLetter.toUpperCase(),
        col: colNum,
      });
    } catch (error) {
      console.warn("[plengma][admin-review] email failed", error);
    }

    revalidateTag("shelf-tapes", "default");
    revalidatePath("/shelf");
    revalidatePath(`/track/${encodeURIComponent(catalogId)}`);

    return NextResponse.json({
      success: true,
      submission: updated,
    });
  }

  if (action === "approve" && approveKind === "notify") {
    let updated;
    try {
      updated = await updateSubmissionReviewByCatalogId({
        catalogId,
        status: "approved",
        curatorNote,
        rejectionReason: "",
        publish: null,
      });
    } catch (error) {
      if (error instanceof Error && error.message === "CATALOG_NOT_FOUND") {
        return NextResponse.json({ error: "ไม่พบ catalogId ใน Google Sheets" }, { status: 404 });
      }
      console.error("[plengma][admin-review] update error", error);
      return NextResponse.json({ error: "บันทึกผลรีวิวไม่สำเร็จ" }, { status: 500 });
    }

    try {
      await sendReviewResultEmail({
        to: existing.artistEmail,
        artist: existing.artist,
        title: existing.title,
        catalogId: existing.catalogId,
        status: "approved",
        curatorNote: updated.curatorNote,
        row: "",
        col: "",
      });
    } catch (error) {
      console.warn("[plengma][admin-review] email failed", error);
    }

    return NextResponse.json({
      success: true,
      submission: updated,
    });
  }

  let updated;
  try {
    updated = await updateSubmissionReviewByCatalogId({
      catalogId,
      status: "rejected",
      curatorNote: "",
      rejectionReason,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "CATALOG_NOT_FOUND") {
      return NextResponse.json({ error: "ไม่พบ catalogId ใน Google Sheets" }, { status: 404 });
    }
    console.error("[plengma][admin-review] update error", error);
    return NextResponse.json({ error: "บันทึกผลรีวิวไม่สำเร็จ" }, { status: 500 });
  }

  try {
    await sendReviewResultEmail({
      to: existing.artistEmail,
      artist: existing.artist,
      title: existing.title,
      catalogId: existing.catalogId,
      status: "rejected",
      rejectionReason: updated.rejectionReason,
    });
  } catch (error) {
    console.warn("[plengma][admin-review] email failed", error);
  }

  return NextResponse.json({
    success: true,
    submission: updated,
  });
}
