"use client";

import { useMemo, useState } from "react";
import type { AdminSubmissionDetail } from "@/lib/sheets";
import { normalizeAIApproach } from "@/lib/ai-approach";
import type { AIApproach } from "@/lib/types";
import { TAPE_GRADIENTS } from "@/components/shelf/TapeSlot";

type Props = {
  submission: AdminSubmissionDetail;
};

type ReviewAction = "approve_publish" | "approve_notify" | "reject";

function toEmbedUrl(youtubeUrl: string): string {
  if (youtubeUrl.includes("embed/")) return youtubeUrl;
  try {
    const url = new URL(youtubeUrl);
    if (url.hostname.includes("youtu.be")) {
      const id = url.pathname.replace("/", "");
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.searchParams.get("v")) {
      return `https://www.youtube.com/embed/${url.searchParams.get("v")}`;
    }
  } catch {
    return youtubeUrl;
  }
  return youtubeUrl;
}

const ROW_LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"] as const;
const COL_OPTIONS = Array.from({ length: 30 }, (_, i) => String(i + 1).padStart(2, "0"));

export default function ReviewPanel({ submission }: Props) {
  const [curatorNote, setCuratorNote] = useState(submission.curatorNote ?? "");
  const [rowLetter, setRowLetter] = useState(() => {
    const pr = submission.positionRow?.trim();
    if (!pr) return "";
    const n = parseInt(pr, 10);
    if (Number.isNaN(n) || n < 0 || n > 9) return "";
    return ROW_LETTERS[n] ?? "";
  });
  const [colNum, setColNum] = useState(() => {
    const pc = submission.positionCol?.trim();
    if (!pc) return "";
    const n = parseInt(pc, 10);
    if (Number.isNaN(n) || n < 0 || n > 29) return "";
    return String(n + 1).padStart(2, "0");
  });
  const [coverBg, setCoverBg] = useState(() => {
    const n = parseInt(submission.coverBg ?? "1", 10);
    return Number.isNaN(n) ? 1 : Math.min(15, Math.max(1, n));
  });
  const [side, setSide] = useState<"A" | "B">(submission.side?.toUpperCase() === "B" ? "B" : "A");
  const [tagCurated, setTagCurated] = useState(() => submission.tagsSheet?.includes("curated") ?? false);
  const [tagNew, setTagNew] = useState(() => submission.tagsSheet?.includes("new") ?? false);
  const [tagHot, setTagHot] = useState(() => submission.tagsSheet?.includes("hot") ?? false);
  const [tagRare, setTagRare] = useState(() => submission.tagsSheet?.includes("rare") ?? false);
  const [listens, setListens] = useState(submission.listens ?? "0");
  const [likes, setLikes] = useState(submission.likes ?? "0");
  const [aiApproach, setAiApproach] = useState<AIApproach | "">(
    () => normalizeAIApproach(submission.aiApproach ?? "") ?? ""
  );
  const [humanInput, setHumanInput] = useState(submission.humanInput ?? "");
  const [reason, setReason] = useState(submission.rejectionReason ?? "");
  const [busy, setBusy] = useState<ReviewAction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const embedUrl = useMemo(() => toEmbedUrl(submission.youtubeUrl), [submission.youtubeUrl]);

  const tagsCsv = [tagCurated && "curated", tagNew && "new", tagHot && "hot", tagRare && "rare"]
    .filter(Boolean)
    .join(",");

  async function submitReview(action: ReviewAction) {
    setBusy(action);
    setError(null);
    setSuccess(null);

    const payload =
      action === "reject"
        ? {
            catalogId: submission.catalogId,
            action: "reject",
            rejectionReason: reason.trim(),
          }
        : {
            catalogId: submission.catalogId,
            action: "approve",
            approveKind: action === "approve_publish" ? "publish" : "notify",
            curatorNote: curatorNote.trim(),
            rowLetter: rowLetter.trim(),
            colNum: colNum.trim(),
            coverBg: String(coverBg),
            side,
            tags: tagsCsv,
            listens: listens.trim() || "0",
            likes: likes.trim() || "0",
            aiApproach,
            humanInput: humanInput.trim().slice(0, 200),
          };

    const res = await fetch("/api/admin/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await res.json()) as { success?: boolean; error?: string };
    if (!res.ok || !data.success) {
      setError(data.error ?? "ไม่สามารถบันทึกผลรีวิวได้");
      setBusy(null);
      return;
    }

    const msg =
      action === "approve_publish"
        ? "ขึ้นแผงและส่งอีเมลแล้ว"
        : action === "approve_notify"
          ? "อนุมัติและแจ้งศิลปินแล้ว (ยังไม่ขึ้นแผง)"
          : "ปฏิเสธและส่งอีเมลแล้ว";
    setSuccess(msg);
    setBusy(null);
  }

  const publishDisabled =
    busy !== null ||
    !curatorNote.trim() ||
    !rowLetter ||
    !colNum ||
    !aiApproach;

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
      <section className="rounded-2xl border border-[#E9B949]/30 bg-[#120b29] p-5">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-[#E9B949]">Preview</p>
        <div className="mt-4 overflow-hidden rounded-xl border border-[#E9B949]/20 bg-black">
          <iframe
            title={`YouTube: ${submission.title}`}
            src={embedUrl}
            className="aspect-video w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </section>

      <section className="rounded-2xl border border-[#E9B949]/30 bg-[#120b29] p-5">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-[#E9B949]">Review Actions</p>

        <div className="mt-4 space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm text-[#F4EFE6]/85">Curator note</span>
            <textarea
              value={curatorNote}
              onChange={(e) => setCuratorNote(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-[#E9B949]/30 bg-[#0E0820] px-3 py-2 text-sm text-[#F4EFE6] outline-none focus:border-[#E9B949]"
            />
            <span className="mt-1 block text-xs text-[#F4EFE6]/45">จำเป็นสำหรับ “อนุมัติและขึ้นแผง”</span>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block text-sm text-[#F4EFE6]/85">แถว (A–J)</span>
              <select
                value={rowLetter}
                onChange={(e) => setRowLetter(e.target.value)}
                className="w-full rounded-lg border border-[#E9B949]/30 bg-[#0E0820] px-3 py-2 text-sm text-[#F4EFE6] outline-none focus:border-[#E9B949]"
              >
                <option value="">—</option>
                {ROW_LETTERS.map((L) => (
                  <option key={L} value={L}>
                    {L}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-sm text-[#F4EFE6]/85">คอลัมน์ (01–30)</span>
              <select
                value={colNum}
                onChange={(e) => setColNum(e.target.value)}
                className="w-full rounded-lg border border-[#E9B949]/30 bg-[#0E0820] px-3 py-2 text-sm text-[#F4EFE6] outline-none focus:border-[#E9B949]"
              >
                <option value="">—</option>
                {COL_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-sm text-[#F4EFE6]/85">Cover gradient (1–15)</span>
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={coverBg}
                onChange={(e) => setCoverBg(parseInt(e.target.value, 10) || 1)}
                className="min-w-[120px] rounded-lg border border-[#E9B949]/30 bg-[#0E0820] px-3 py-2 text-sm text-[#F4EFE6] outline-none focus:border-[#E9B949]"
              >
                {Array.from({ length: 15 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <div
                className="h-10 w-16 shrink-0 rounded-md border border-[#E9B949]/40"
                style={{ background: TAPE_GRADIENTS[coverBg] }}
              />
            </div>
          </label>

          <fieldset>
            <legend className="mb-2 text-sm text-[#F4EFE6]/85">Side</legend>
            <div className="flex gap-4">
              {(["A", "B"] as const).map((s) => (
                <label key={s} className="flex cursor-pointer items-center gap-2 text-sm text-[#F4EFE6]">
                  <input
                    type="radio"
                    name="side"
                    checked={side === s}
                    onChange={() => setSide(s)}
                    className="accent-[#6FE3C8]"
                  />
                  {s}-side
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 text-sm text-[#F4EFE6]/85">Tags</legend>
            <div className="flex flex-wrap gap-4">
              {[
                ["curated", tagCurated, setTagCurated],
                ["new", tagNew, setTagNew],
                ["hot", tagHot, setTagHot],
                ["rare", tagRare, setTagRare],
              ].map(([key, on, set]) => (
                <label key={key as string} className="flex cursor-pointer items-center gap-2 text-sm capitalize text-[#F4EFE6]">
                  <input
                    type="checkbox"
                    checked={on as boolean}
                    onChange={(e) => (set as (v: boolean) => void)(e.target.checked)}
                    className="accent-[#6FE3C8]"
                  />
                  {key as string}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block text-sm text-[#F4EFE6]/85">Listens</span>
              <input
                type="number"
                min={0}
                value={listens}
                onChange={(e) => setListens(e.target.value)}
                className="w-full rounded-lg border border-[#E9B949]/30 bg-[#0E0820] px-3 py-2 text-sm text-[#F4EFE6] outline-none focus:border-[#E9B949]"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm text-[#F4EFE6]/85">Likes</span>
              <input
                type="number"
                min={0}
                value={likes}
                onChange={(e) => setLikes(e.target.value)}
                className="w-full rounded-lg border border-[#E9B949]/30 bg-[#0E0820] px-3 py-2 text-sm text-[#F4EFE6] outline-none focus:border-[#E9B949]"
              />
            </label>
          </div>

          <fieldset>
            <legend className="mb-2 text-sm text-[#F4EFE6]/85">AI approach (จำเป็นตอนขึ้นแผง)</legend>
            <div className="space-y-2 text-sm text-[#F4EFE6]/9">
              {(
                [
                  ["full-ai", "ทำด้วย AI ล้วน"],
                  ["ai-vocal", "เนื้อร้องคน · vocal AI"],
                  ["ai-instrumental", "ดนตรี AI · ร้องเอง"],
                  ["hybrid", "ผสมมนุษย์และ AI"],
                ] as const
              ).map(([value, label]) => (
                <label key={value} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="aiApproach"
                    checked={aiApproach === value}
                    onChange={() => setAiApproach(value)}
                    className="accent-[#6FE3C8]"
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>

          <label className="block">
            <span className="mb-1 block text-sm text-[#F4EFE6]/85">Human input (ไม่บังคับ · สูงสุด 200 ตัวอักษร)</span>
            <textarea
              value={humanInput}
              onChange={(e) => setHumanInput(e.target.value.slice(0, 200))}
              rows={2}
              className="w-full rounded-lg border border-[#E9B949]/30 bg-[#0E0820] px-3 py-2 text-sm text-[#F4EFE6] outline-none focus:border-[#E9B949]"
            />
          </label>

          <button
            type="button"
            onClick={() => submitReview("approve_publish")}
            disabled={publishDisabled}
            className="w-full rounded-lg bg-[#6FE3C8] px-4 py-2.5 font-semibold text-[#0E0820] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {busy === "approve_publish" ? "กำลังบันทึก..." : "✅ อนุมัติและขึ้นแผง"}
          </button>

          <button
            type="button"
            onClick={() => submitReview("approve_notify")}
            disabled={busy !== null}
            className="w-full rounded-lg border border-[#6FE3C8]/50 bg-transparent px-4 py-2.5 font-semibold text-[#6FE3C8] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {busy === "approve_notify" ? "กำลังบันทึก..." : "📨 อนุมัติเท่านั้น · แจ้งศิลปิน (ยังไม่ขึ้นแผง)"}
          </button>

          <hr className="border-[#E9B949]/20" />

          <label className="block">
            <span className="mb-1 block text-sm text-[#F4EFE6]/85">เหตุผลที่ไม่ผ่าน</span>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-[#E85D8C]/40 bg-[#0E0820] px-3 py-2 text-sm text-[#F4EFE6] outline-none focus:border-[#E85D8C]"
            />
          </label>

          <button
            type="button"
            onClick={() => submitReview("reject")}
            disabled={busy !== null || !reason.trim()}
            className="w-full rounded-lg bg-[#E85D8C] px-4 py-2.5 font-semibold text-[#0E0820] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {busy === "reject" ? "กำลังบันทึก..." : "❌ Reject"}
          </button>

          {error ? (
            <p className="rounded-lg border border-[#E85D8C]/60 bg-[#E85D8C]/10 px-3 py-2 text-sm text-[#ffd6e4]">{error}</p>
          ) : null}
          {success ? (
            <p className="rounded-lg border border-[#6FE3C8]/50 bg-[#6FE3C8]/10 px-3 py-2 text-sm text-[#cffff3]">{success}</p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
