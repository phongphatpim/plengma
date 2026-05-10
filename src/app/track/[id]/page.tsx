import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import { getTapeByCatalogIdAsync } from "@/lib/tape-lookup";
import { formatShelfPosition } from "@/lib/types";
import { getPublicSiteBase } from "@/lib/utils";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const tape = await getTapeByCatalogIdAsync(id);
  const base = getPublicSiteBase();

  if (!tape) {
    return {
      title: "ไม่พบเพลง — เพลงมา",
      description: "ลิงก์เพลงอาจไม่ถูกต้องหรือเพลงถูกถอดจากแผงแล้ว",
    };
  }

  const title = `${tape.title} — ${tape.artist} | เพลงมา`;
  const description = `ฟัง ${tape.title} โดย ${tape.artist} · ${tape.genre} · แผงเพลงมา`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${base}/track/${encodeURIComponent(tape.id)}`,
      siteName: "เพลงมา",
      locale: "th_TH",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function TrackPage({ params }: Props) {
  const { id } = await params;
  const tape = await getTapeByCatalogIdAsync(id);
  if (!tape) notFound();

  const pos = formatShelfPosition(tape.position.row, tape.position.col);
  const shelfUrl = `${getPublicSiteBase()}/shelf`;

  return (
    <>
      <Navbar />
      <main
        style={{
          minHeight: "100dvh",
          background: "#0E0820",
          color: "var(--paper)",
          padding: "48px 24px 80px",
        }}
      >
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#E9B949",
              marginBottom: 12,
            }}
          >
            เพลงมา · {tape.id} · {pos}
          </p>
          <h1
            style={{
              fontFamily: "var(--font-thai)",
              fontWeight: 800,
              fontSize: "clamp(28px, 5vw, 40px)",
              lineHeight: 1.15,
              margin: "0 0 8px",
            }}
          >
            {tape.title}
          </h1>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              letterSpacing: "0.08em",
              color: "rgba(244,239,230,0.65)",
              marginBottom: 28,
            }}
          >
            {tape.artist} · {tape.genre} · {tape.duration}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <a
              href={tape.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                background: "#E9B949",
                color: "#0E0820",
                fontFamily: "var(--font-thai)",
                fontWeight: 700,
                fontSize: 15,
                padding: "14px 24px",
                borderRadius: 100,
                textDecoration: "none",
              }}
            >
              ▶ ฟังบน YouTube
            </a>
            <Link
              href={shelfUrl}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                border: "1px solid rgba(233,185,73,0.45)",
                color: "#E9B949",
                fontFamily: "var(--font-thai)",
                fontWeight: 600,
                fontSize: 15,
                padding: "14px 24px",
                borderRadius: 100,
                textDecoration: "none",
              }}
            >
              ไปดูแผงทั้งหมด /shelf
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
