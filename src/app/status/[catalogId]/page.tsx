import Link from "next/link";
import { notFound } from "next/navigation";
import StatusCheckForm from "@/components/status/StatusCheckForm";

type Props = {
  params: Promise<{ catalogId: string }>;
};

const CATALOG_RE = /^PLG-\d{3}$/i;

export default async function StatusPage({ params }: Props) {
  const { catalogId: raw } = await params;
  const catalogId = raw.trim();
  if (!CATALOG_RE.test(catalogId)) {
    notFound();
  }

  const displayId = catalogId.toUpperCase();

  return (
    <main className="min-h-dvh bg-[#0E0820] px-6 py-16 text-[#F4EFE6]">
      <div className="mx-auto w-full max-w-md">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#E9B949]">เพลงมา · ตามสถานะคิว</p>
        <h1 className="mt-3 font-[var(--font-bai)] text-3xl font-bold text-[#E9B949]">
          เช็คสถานะ {displayId}
        </h1>
        <p className="mt-2 font-[var(--font-noto-thai)] text-sm text-[#F4EFE6]/80">
          กรอกอีเมลเดียวกับที่ใช้ส่งเพลง ระบบจะแสดงสถานะ pending / approved / rejected
        </p>

        <StatusCheckForm catalogId={displayId} />

        <p className="mt-8 text-center font-[var(--font-noto-thai)] text-sm text-[#F4EFE6]/55">
          <Link href="/" className="text-[#E9B949] hover:underline">
            กลับหน้าแรก
          </Link>
        </p>
      </div>
    </main>
  );
}
