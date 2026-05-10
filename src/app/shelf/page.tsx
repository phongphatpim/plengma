import Navbar from "@/components/layout/Navbar";
import IsoShelf from "@/components/shelf/IsoShelf";
import ShelfDaysLeft from "@/components/shelf/ShelfDaysLeft";
import { getMay2026Shelf } from "@/lib/shelf-data";
import type { ShelfMonth } from "@/lib/types";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "แผงเดือน MAY 2026 — เพลงมา",
  description: "แผงเทปเพลงไทย AI ประจำเดือนพฤษภาคม 2569",
};

const PAST_MONTH_TABS = ["JAN", "FEB", "MAR", "APR"] as const;

function shelfHeaderStats(shelf: ShelfMonth) {
  const filled = shelf.tapes.length;
  const retired = shelf.retiredPositions.length;
  return {
    capacity: shelf.capacity,
    filled,
    retired,
    empty: shelf.capacity - filled - retired,
  };
}

function shelfStatsBar(shelf: ShelfMonth) {
  const songCount = shelf.tapes.length;
  const totalListens = shelf.tapes.reduce((s, t) => s + t.listens, 0);
  const totalLikes = shelf.tapes.reduce((s, t) => s + t.likes, 0);
  return { songCount, totalListens, totalLikes };
}

export default async function ShelfPage() {
  const shelf = await getMay2026Shelf();
  const header = shelfHeaderStats(shelf);
  const bar = shelfStatsBar(shelf);

  const listensDisplay =
    bar.totalListens >= 1000 ? (bar.totalListens / 1000).toFixed(1).replace(/\.0$/, "") + "k" : String(bar.totalListens);

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100dvh", background: "#0E0820" }}>
        {/* 1. PageHeader */}
        <header
          style={{
            background: "#0E0820",
            borderBottom: "1px solid rgba(244,239,230,0.08)",
            padding: "0 24px",
          }}
        >
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                flexWrap: "wrap",
                gap: 4,
                paddingTop: 20,
                overflowX: "auto",
              }}
            >
              {PAST_MONTH_TABS.map((label) => (
                <button
                  key={label}
                  type="button"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    padding: "10px 14px",
                    borderRadius: "8px 8px 0 0",
                    border: "none",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    background: "transparent",
                    color: "rgba(244,239,230,0.5)",
                    borderBottom: "2px solid transparent",
                  }}
                >
                  {label}
                </button>
              ))}
              <span style={{ fontFamily: "var(--font-mono)", color: "rgba(244,239,230,0.25)", fontSize: 12, padding: "0 6px 10px", userSelect: "none" }}>|</span>
              <button
                type="button"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  padding: "10px 14px",
                  borderRadius: "8px 8px 0 0",
                  border: "none",
                  cursor: "default",
                  whiteSpace: "nowrap",
                  background: "rgba(233,185,73,0.12)",
                  color: "#E9B949",
                  borderBottom: "2px solid #E9B949",
                }}
              >
                MAY
              </button>
              <span style={{ fontFamily: "var(--font-mono)", color: "rgba(244,239,230,0.25)", fontSize: 12, padding: "0 6px 10px", userSelect: "none" }}>|</span>
              <button
                type="button"
                disabled
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  padding: "10px 14px",
                  borderRadius: "8px 8px 0 0",
                  border: "none",
                  cursor: "not-allowed",
                  whiteSpace: "nowrap",
                  background: "transparent",
                  color: "rgba(244,239,230,0.35)",
                  borderBottom: "2px solid transparent",
                  opacity: 0.85,
                }}
              >
                JUN
                <span style={{ display: "block", fontSize: 9, letterSpacing: "0.12em", marginTop: 4, color: "rgba(244,239,230,0.4)" }}>เร็วๆ นี้</span>
              </button>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                padding: "24px 0 20px",
                gap: 24,
                flexWrap: "wrap",
              }}
            >
              <h1
                style={{
                  fontFamily: "var(--font-thai)",
                  fontWeight: 800,
                  fontSize: "clamp(28px,5vw,48px)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  color: "var(--paper)",
                  margin: 0,
                }}
              >
                แผงเดือน <span style={{ color: "#E9B949" }}>พฤษภาคม</span>
              </h1>
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                {[
                  { label: "CAPACITY", value: `${header.capacity} ช่อง`, color: "var(--paper)" },
                  { label: "FILLED", value: `${header.filled} / ${header.capacity}`, color: "#E9B949" },
                  { label: "RETIRED", value: String(header.retired), color: "var(--magenta)" },
                  { label: "เปิดถึง", value: "31 พ.ค.", color: "var(--paper)" },
                ].map(({ label, value, color }) => (
                  <div key={label}>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        letterSpacing: "0.2em",
                        color: "rgba(244,239,230,0.45)",
                        marginBottom: 4,
                        textTransform: "uppercase",
                      }}
                    >
                      {label}
                    </div>
                    <div style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 18, color }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* 2. Legend */}
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "12px 24px",
            display: "flex",
            gap: 24,
            flexWrap: "wrap",
            alignItems: "center",
            background: "#0E0820",
          }}
        >
          {[
            { sym: "■", label: "เทป (มีเพลง) — กดเพื่อฟัง", color: "#E9B949" },
            { sym: "□", label: "ว่าง — รอเพลงใหม่", color: "rgba(111,227,200,0.85)" },
            { sym: "▣", label: "ถอดออกแล้ว — RETIRED", color: "var(--magenta)" },
          ].map(({ sym, label, color }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 14, lineHeight: 1, color, fontFamily: "var(--font-mono)" }}>{sym}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(244,239,230,0.55)", letterSpacing: "0.08em" }}>{label}</span>
            </div>
          ))}
        </div>

        {/* 3. IsoShelf — full width */}
        <div style={{ width: "100%", padding: "0 24px 40px", background: "#0E0820" }}>
          <IsoShelf shelf={shelf} label="★ MAY 2026 SHELF · ROW A–J · POSITION 01–30" />
        </div>

        {/* 4. StatsBar */}
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 24px 40px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 16,
            background: "#0E0820",
          }}
        >
          {[
            { emoji: "🎵", title: "เพลงบนแผง", value: bar.songCount, color: "#E9B949" },
            { emoji: "👂", title: "ผู้ฟังรวม", value: listensDisplay, color: "var(--periwinkle)" },
            { emoji: "❤️", title: "ไลค์รวม", value: bar.totalLikes.toLocaleString(), color: "var(--magenta)" },
            { emoji: "📅", title: "วันที่เหลือ", value: <ShelfDaysLeft />, color: "var(--mint)" },
          ].map((card) => (
            <div
              key={card.title}
              style={{
                background: "rgba(26,16,48,0.5)",
                border: "1px solid rgba(244,239,230,0.08)",
                borderRadius: 12,
                padding: "16px 20px",
              }}
            >
              <div style={{ fontSize: 20, marginBottom: 8 }}>{card.emoji}</div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(244,239,230,0.45)",
                  marginBottom: 8,
                }}
              >
                {card.title}
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 22, color: card.color }}>{card.value}</div>
            </div>
          ))}
        </div>

        {/* Submit CTA */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px 80px", textAlign: "center", background: "#0E0820" }}>
          <div
            style={{
              background: "rgba(233,185,73,0.06)",
              border: "1px solid rgba(233,185,73,0.2)",
              borderRadius: 16,
              padding: "40px 24px",
              display: "inline-block",
              maxWidth: 520,
            }}
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.25em", color: "var(--mint)", marginBottom: 12 }}>
              ● {header.empty} ช่องยังว่างอยู่
            </div>
            <h2 style={{ fontFamily: "var(--font-thai)", fontWeight: 800, fontSize: 28, marginBottom: 8 }}>เทปของคุณยังขาดอยู่ในแผงนี้</h2>
            <p style={{ color: "rgba(244,239,230,0.65)", marginBottom: 24, fontSize: 15 }}>ส่งเพลง AI ของคุณขึ้นแผง ฟรี ไม่มีค่าใช้จ่าย</p>
            <Link
              href="/submit"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "var(--gold)",
                color: "var(--ink)",
                fontFamily: "var(--font-thai)",
                fontWeight: 700,
                fontSize: 16,
                padding: "14px 32px",
                borderRadius: 100,
                textDecoration: "none",
              }}
            >
              + ส่งเพลงขึ้นแผง
            </Link>
          </div>
        </div>

        <footer
          style={{
            borderTop: "1px solid rgba(244,239,230,0.08)",
            padding: 24,
            textAlign: "center",
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            color: "rgba(244,239,230,0.35)",
            letterSpacing: "0.15em",
            background: "#0E0820",
          }}
        >
          © 2026 PlengMa · MAY 2026 SHELF · เปิดถึง 31 พ.ค.
        </footer>
      </main>
    </>
  );
}
