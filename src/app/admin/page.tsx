import SubmissionTable, { type SubmissionFilter } from "@/components/admin/SubmissionTable";
import StatsPanel from "@/components/admin/StatsPanel";
import { readSubmissions, type AdminSubmissionDetail } from "@/lib/sheets";

type AdminPageProps = {
  searchParams?: Promise<{
    status?: string;
  }>;
};

function parseFilter(value: string | undefined): SubmissionFilter {
  if (value === "pending" || value === "approved" || value === "rejected") {
    return value;
  }
  return "all";
}

function toEpoch(value: string): number {
  const t = new Date(value).getTime();
  return Number.isNaN(t) ? 0 : t;
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = (await searchParams) ?? {};
  const filter = parseFilter(params.status);

  let allSubmissions: AdminSubmissionDetail[] = [];
  let loadError: string | null = null;
  try {
    allSubmissions = await readSubmissions();
  } catch {
    loadError = "ยังดึงข้อมูลจาก Google Sheets ไม่ได้ กรุณาตรวจสอบ env และสิทธิ์ service account";
  }

  const filteredSubmissions =
    filter === "all" ? allSubmissions : allSubmissions.filter((item) => item.status === filter);

  const sortedSubmissions = filteredSubmissions.sort(
    (a, b) => toEpoch(b.submittedAt) - toEpoch(a.submittedAt)
  );

  return (
    <main className="min-h-dvh bg-[#0E0820] px-6 py-16 text-[#F4EFE6]">
      <div className="mx-auto max-w-6xl rounded-2xl border border-[#E9B949]/40 bg-[#120b29] p-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#E9B949]">Admin Dashboard</p>
        <h1 className="mt-3 font-[var(--font-bai)] text-3xl font-bold text-[#E9B949]">รายการเพลงที่ส่งเข้ามา</h1>
        <p className="mt-3 font-[var(--font-noto-thai)] text-base text-[#F4EFE6]/85">
          ดูคิวเพลงทั้งหมดและกดเข้าไปรีวิวรายเพลงได้ทันที
        </p>

        {loadError ? (
          <p className="mt-6 rounded-lg border border-[#E85D8C]/60 bg-[#E85D8C]/10 px-4 py-3 text-sm text-[#ffd6e4]">
            {loadError}
          </p>
        ) : null}

        <StatsPanel submissions={allSubmissions} />
        <SubmissionTable submissions={sortedSubmissions} currentFilter={filter} />
      </div>
    </main>
  );
}
