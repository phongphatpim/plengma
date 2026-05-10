import Link from "next/link";
import type { AdminSubmission, AdminSubmissionStatus } from "@/lib/sheets";

export type SubmissionFilter = AdminSubmissionStatus | "all";

const FILTERS: Array<{ value: SubmissionFilter; label: string }> = [
  { value: "all", label: "ทั้งหมด" },
  { value: "pending", label: "รอตรวจ" },
  { value: "approved", label: "ผ่าน" },
  { value: "rejected", label: "ไม่ผ่าน" },
];

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function statusLabel(status: AdminSubmissionStatus): string {
  if (status === "approved") return "approved";
  if (status === "rejected") return "rejected";
  return "pending";
}

function statusClass(status: AdminSubmissionStatus): string {
  if (status === "approved") {
    return "border-[#6FE3C8]/60 bg-[#6FE3C8]/15 text-[#b7ffee]";
  }
  if (status === "rejected") {
    return "border-[#E85D8C]/60 bg-[#E85D8C]/15 text-[#ffd6e4]";
  }
  return "border-[#E9B949]/50 bg-[#E9B949]/10 text-[#fce7aa]";
}

type SubmissionTableProps = {
  submissions: AdminSubmission[];
  currentFilter: SubmissionFilter;
};

export default function SubmissionTable({ submissions, currentFilter }: SubmissionTableProps) {
  return (
    <section className="mt-8">
      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((filter) => {
          const active = currentFilter === filter.value;
          return (
            <Link
              key={filter.value}
              href={filter.value === "all" ? "/admin" : `/admin?status=${filter.value}`}
              className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] transition ${
                active
                  ? "border-[#E9B949] bg-[#E9B949] text-[#0E0820]"
                  : "border-[#E9B949]/35 bg-[#120b29] text-[#F4EFE6]/80 hover:border-[#E9B949]/70"
              }`}
            >
              {filter.label}
            </Link>
          );
        })}
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#E9B949]/30 bg-[#120b29]/80">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-[#0E0820]/80 text-xs uppercase tracking-[0.12em] text-[#E9B949]">
            <tr>
              <th className="px-4 py-3">catalogId</th>
              <th className="px-4 py-3">title</th>
              <th className="px-4 py-3">artist</th>
              <th className="px-4 py-3">genre</th>
              <th className="px-4 py-3">duration</th>
              <th className="px-4 py-3">status</th>
              <th className="px-4 py-3">submittedAt</th>
            </tr>
          </thead>
          <tbody>
            {submissions.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-[#F4EFE6]/70">
                  ยังไม่มีรายการที่ตรงกับ filter นี้
                </td>
              </tr>
            ) : (
              submissions.map((submission) => (
                <tr
                  key={submission.catalogId}
                  className="border-t border-[#E9B949]/15 transition hover:bg-[#E9B949]/6"
                >
                  <td className="px-4 py-3 font-mono text-xs text-[#E9B949]">
                    <Link href={`/admin/review/${submission.catalogId}`} className="hover:underline">
                      {submission.catalogId}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[#F4EFE6]">{submission.title}</td>
                  <td className="px-4 py-3 text-[#F4EFE6]/90">{submission.artist}</td>
                  <td className="px-4 py-3 text-[#F4EFE6]/80">{submission.genre}</td>
                  <td className="px-4 py-3 font-mono text-xs text-[#F4EFE6]/80">{submission.duration}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full border px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.1em] ${statusClass(submission.status)}`}
                    >
                      {statusLabel(submission.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#F4EFE6]/75">
                    {formatDate(submission.submittedAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
