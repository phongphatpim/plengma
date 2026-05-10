import type { AdminSubmissionDetail } from "@/lib/sheets";

type StatsPanelProps = {
  submissions: AdminSubmissionDetail[];
};

function toDate(value: string): Date | null {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function percent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export default function StatsPanel({ submissions }: StatsPanelProps) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const submissionsThisMonth = submissions.filter((item) => {
    const d = toDate(item.submittedAt);
    if (!d) return false;
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).length;

  const reviewed = submissions.filter((item) => item.status !== "pending");
  const approved = reviewed.filter((item) => item.status === "approved").length;
  const approvalRate = reviewed.length === 0 ? 0 : approved / reviewed.length;

  const artistCounts = submissions.reduce<Map<string, number>>((acc, item) => {
    const key = item.artist.trim().toLowerCase();
    if (!key) return acc;
    acc.set(key, (acc.get(key) ?? 0) + 1);
    return acc;
  }, new Map());
  const repeatArtistsCount = Array.from(artistCounts.values()).filter((count) => count > 1).length;

  const pendingQueue = submissions.filter((item) => item.status === "pending").length;

  const cards = [
    { label: "submissions เดือนนี้", value: String(submissionsThisMonth), color: "text-[#E9B949]" },
    { label: "approval rate", value: percent(approvalRate), color: "text-[#6FE3C8]" },
    { label: "repeat artists", value: String(repeatArtistsCount), color: "text-[#E85D8C]" },
    { label: "pending queue", value: String(pendingQueue), color: "text-[#F4EFE6]" },
  ];

  return (
    <section className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl border border-[#E9B949]/25 bg-[#0E0820]/60 p-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#F4EFE6]/70">{card.label}</p>
          <p className={`mt-2 font-[var(--font-bai)] text-2xl font-bold ${card.color}`}>{card.value}</p>
        </div>
      ))}
    </section>
  );
}
