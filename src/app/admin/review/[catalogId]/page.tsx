import Link from "next/link";
import { notFound } from "next/navigation";
import ReviewPanel from "@/components/admin/ReviewPanel";
import { readSubmissionByCatalogId } from "@/lib/sheets";

type Props = {
  params: Promise<{
    catalogId: string;
  }>;
};

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#E9B949]/85">{label}</p>
      <p className="mt-1 text-sm text-[#F4EFE6]">{value || "-"}</p>
    </div>
  );
}

export default async function ReviewPage({ params }: Props) {
  const { catalogId } = await params;
  const submission = await readSubmissionByCatalogId(catalogId);
  if (!submission) notFound();

  return (
    <main className="min-h-dvh bg-[#0E0820] px-6 py-10 text-[#F4EFE6]">
      <div className="mx-auto max-w-6xl rounded-2xl border border-[#E9B949]/35 bg-[#120b29]/95 p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#E9B949]">Admin Review</p>
            <h1 className="mt-2 font-[var(--font-bai)] text-3xl font-bold text-[#E9B949]">
              รีวิวเพลง {submission.catalogId}
            </h1>
          </div>
          <Link
            href="/admin"
            className="rounded-lg border border-[#E9B949]/50 px-3 py-2 text-sm text-[#F4EFE6]/90 hover:border-[#E9B949]"
          >
            ← กลับ Dashboard
          </Link>
        </div>

        <section className="mt-6 rounded-2xl border border-[#E9B949]/25 bg-[#0E0820]/50 p-5">
          <div className="grid gap-4 md:grid-cols-3">
            <DetailItem label="Title" value={submission.title} />
            <DetailItem label="Artist" value={submission.artist} />
            <DetailItem label="Genre" value={submission.genre} />
            <DetailItem label="Duration" value={submission.duration} />
            <DetailItem label="Status" value={submission.status} />
            <DetailItem label="Submitted At" value={submission.submittedAt} />
            <DetailItem label="Artist Email" value={submission.artistEmail} />
            <DetailItem label="Social URL" value={submission.socialUrl ?? "-"} />
            <DetailItem label="Tools" value={submission.tools ?? "-"} />
          </div>
          <div className="mt-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#E9B949]/85">Description</p>
            <p className="mt-1 text-sm text-[#F4EFE6]/90">{submission.description ?? "-"}</p>
          </div>
        </section>

        <ReviewPanel submission={submission} />
      </div>
    </main>
  );
}
