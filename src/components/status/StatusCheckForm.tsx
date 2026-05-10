"use client";

import { useActionState } from "react";
import Link from "next/link";
import { verifySubmissionStatus } from "@/app/status/[catalogId]/actions";
import type { StatusCheckState } from "@/app/status/[catalogId]/actions";
import { getPublicSiteBase } from "@/lib/utils";

const initialState: StatusCheckState = { step: "idle" };

type Props = {
  catalogId: string;
};

export default function StatusCheckForm({ catalogId }: Props) {
  const [state, formAction, isPending] = useActionState(verifySubmissionStatus, initialState);

  const base = getPublicSiteBase();
  const shelfUrl = `${base}/shelf`;
  const submitUrl = `${base}/submit`;

  return (
    <div className="mt-8 space-y-6">
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="catalogId" value={catalogId} />
        <label className="block">
          <span className="mb-2 block font-mono text-xs uppercase tracking-[0.18em] text-[#F4EFE6]/70">
            อีเมลที่ใช้ส่งเพลง
          </span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            disabled={isPending}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-[#E9B949]/50 bg-[#120b29] px-3 py-2.5 font-[var(--font-noto-thai)] text-sm text-[#F4EFE6] outline-none transition focus:border-[#E9B949] focus:ring-2 focus:ring-[#E9B949]/40 disabled:opacity-60"
          />
        </label>
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-[#E9B949] px-4 py-2.5 font-[var(--font-bai)] text-base font-semibold text-[#0E0820] transition hover:bg-[#f0c861] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? "กำลังเช็ค..." : "เช็คสถานะ"}
        </button>
      </form>

      {state.step === "error" ? (
        <p className="rounded-lg border border-[#E85D8C]/60 bg-[#E85D8C]/10 px-3 py-2 text-sm text-[#ffd6e4]">
          {state.message}
        </p>
      ) : null}

      {state.step === "success" ? (
        <div className="rounded-xl border border-[#E9B949]/35 bg-[#120b29]/90 p-5">
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-[#E9B949]">ผลการเช็ค</p>
          <p className="mt-2 font-[var(--font-noto-thai)] text-[#F4EFE6]">
            <span className="text-[#F4EFE6]/80">เพลง: </span>
            <strong>{state.title}</strong>
            <span className="text-[#F4EFE6]/80"> — </span>
            {state.artist}
          </p>

          {state.status === "pending" ? (
            <div className="mt-4">
              <p className="rounded-lg border border-[#E9B949]/40 bg-[#E9B949]/10 px-3 py-2 text-sm text-[#fce7aa]">
                สถานะ: <strong>รอตรวจ (pending)</strong>
                <br />
                ทีมกำลังรีวิวอยู่ จะแจ้งผลทางอีเมลเมื่อมีอัปเดต
              </p>
            </div>
          ) : null}

          {state.status === "approved" ? (
            <div className="mt-4 space-y-3">
              <p className="rounded-lg border border-[#6FE3C8]/50 bg-[#6FE3C8]/10 px-3 py-2 text-sm text-[#cffff3]">
                สถานะ: <strong>ผ่านการคัดเลือก (approved)</strong>
              </p>
              <Link
                href={shelfUrl}
                className="inline-flex w-full items-center justify-center rounded-lg bg-[#6FE3C8] px-4 py-2.5 font-semibold text-[#0E0820] transition hover:brightness-110"
              >
                ไปดูบนแผง /shelf
              </Link>
            </div>
          ) : null}

          {state.status === "rejected" ? (
            <div className="mt-4 space-y-3">
              <p className="rounded-lg border border-[#E85D8C]/50 bg-[#E85D8C]/10 px-3 py-2 text-sm text-[#ffd6e4]">
                สถานะ: <strong>ไม่ผ่านรอบนี้ (rejected)</strong>
              </p>
              {state.rejectionReason ? (
                <p className="text-sm leading-relaxed text-[#F4EFE6]/90">
                  <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#E9B949]/90">
                    เหตุผลจากทีม
                  </span>
                  <br />
                  {state.rejectionReason}
                </p>
              ) : null}
              <Link
                href={submitUrl}
                className="inline-flex w-full items-center justify-center rounded-lg border border-[#E9B949] bg-transparent px-4 py-2.5 font-[var(--font-bai)] font-semibold text-[#E9B949] transition hover:bg-[#E9B949]/15"
              >
                ส่งเพลงใหม่ที่ /submit
              </Link>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
