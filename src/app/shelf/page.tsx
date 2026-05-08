import Navbar from "@/components/layout/Navbar";
import IsoShelf from "@/components/tape/IsoShelf";
import { MAY_2026_SHELF, shelfStats } from "@/lib/mockData";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "แผงเดือน MAY 2026 — เพลงมา",
  description: "แผงเทปเพลงไทย AI ประจำเดือนพฤษภาคม 2569",
};

const MONTH_TABS = [
  { label: "JAN 2026", active: false, coming: false },
  { label: "FEB 2026", active: false, coming: false },
  { label: "MAR 2026", active: false, coming: false },
  { label: "APR 2026", active: false, coming: false },
  { label: "★ MAY 2026", active: true, coming: false },
  { label: "JUN 2026", active: false, coming: true },
];

export default function ShelfPage() {
  const stats = shelfStats(MAY_2026_SHELF);

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100dvh" }}>

        {/* Month tabs + header */}
        <div style={{ background: "rgba(14,8,32,0.95)", borderBottom: "1px solid rgba(244,239,230,0.08)", padding: "0 24px" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ display: "flex", gap: 4, paddingTop: 20, overflowX: "auto" }}>
              {MONTH_TABS.map(({ label, active, coming }) => (
                <button key={label} disabled={coming} style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", padding: "10px 16px", borderRadius: "8px 8px 0 0", border: "none", cursor: coming ? "not-allowed" : "pointer", whiteSpace: "nowrap", background: active ? "rgba(233,185,73,0.12)" : "transparent", color: active ? "var(--gold)" : coming ? "rgba(244,239,230,0.25)" : "rgba(244,239,230,0.5)", borderBottom: active ? "2px solid var(--gold)" : "2px solid transparent" }}>
                  {label}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "24px 0 20px", gap: 24, flexWrap: "wrap" }}>
              <h1 style={{ fontFamily: "var(--font-thai)", fontWeight: 800, fontSize: "clamp(28px,5vw,48px)", letterSpacing: "-0.02em", lineHeight: 1, color: "var(--paper)" }}>
                แผงเดือน <span style={{ color: "var(--gold)" }}>พฤษภาคม</span>
              </h1>
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                {[
                  { label: "CAPACITY", value: "300 ช่อง", color: "var(--paper)" },
                  { label: "FILLED",   value: stats.occupied + " / 300", color: "var(--gold)" },
                  { label: "RETIRED",  value: String(stats.retired), color: "var(--magenta)" },
                  { label: "เปิดถึง", value: "31 พ.ค.", color: "var(--paper)" },
                ].map(({ label, value, color }) => (
                  <div key={label}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.2em", color: "rgba(244,239,230,0.45)", marginBottom: 4, textTransform: "uppercase" }}>{label}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 18, color }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "12px 24px", display: "flex", gap: 20, flexWrap: "wrap" }}>
          {[
            { color: "var(--gold)",    label: "เทป (มีเพลง) — กดเพื่อฟัง" },
            { color: "var(--mint)",    label: "ว่าง — รอเพลงใหม่" },
            { color: "var(--magenta)", label: "ถอดออกแล้ว — RETIRED" },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: color, flexShrink: 0 }} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(244,239,230,0.55)", letterSpacing: "0.1em" }}>{label}</span>
            </div>
          ))}
        </div>

        {/* SHELF */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px 40px" }}>
          <IsoShelf tapes={MAY_2026_SHELF.tapes} label="★ MAY 2026 SHELF · ROW A–J · POSITION 01–30" />
        </div>

        {/* Stats */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px 40px", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
          {[
            { label: "เทปทั้งหมด",    value: stats.occupied,  color: "var(--gold)",    pct: (stats.occupied/300)*100 },
            { label: "ช่องว่าง",      value: stats.empty,     color: "var(--mint)",    pct: (stats.empty/300)*100 },
            { label: "ถูกถอด",        value: stats.retired,   color: "var(--magenta)", pct: (stats.retired/300)*100 },
            { label: "ผู้ฟังเดือนนี้", value: stats.totalListens > 999 ? (stats.totalListens/1000).toFixed(1)+"k" : stats.totalListens, color: "var(--paper)", pct: 60 },
          ].map(({ label, value, color, pct }) => (
            <div key={label} style={{ background: "rgba(26,16,48,0.5)", border: "1px solid rgba(244,239,230,0.08)", borderRadius: 12, padding: "16px 20px" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(244,239,230,0.45)", marginBottom: 8 }}>{label}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 24, color, marginBottom: 10 }}>{value}</div>
              <div style={{ height: 4, background: "rgba(244,239,230,0.08)", borderRadius: 100, overflow: "hidden" }}>
                <div style={{ height: "100%", width: pct+"%", background: color, borderRadius: 100 }} />
              </div>
            </div>
          ))}
        </div>

        {/* Submit CTA */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px 80px", textAlign: "center" }}>
          <div style={{ background: "rgba(233,185,73,0.06)", border: "1px solid rgba(233,185,73,0.2)", borderRadius: 16, padding: "40px 24px", display: "inline-block", maxWidth: 520 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.25em", color: "var(--mint)", marginBottom: 12 }}>● {stats.empty} ช่องยังว่างอยู่</div>
            <h2 style={{ fontFamily: "var(--font-thai)", fontWeight: 800, fontSize: 28, marginBottom: 8 }}>เทปของคุณยังขาดอยู่ในแผงนี้</h2>
            <p style={{ color: "rgba(244,239,230,0.65)", marginBottom: 24, fontSize: 15 }}>ส่งเพลง AI ของคุณขึ้นแผง ฟรี ไม่มีค่าใช้จ่าย</p>
            <Link href="/submit" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--gold)", color: "var(--ink)", fontFamily: "var(--font-thai)", fontWeight: 700, fontSize: 16, padding: "14px 32px", borderRadius: 100, textDecoration: "none" }}>
              + ส่งเพลงขึ้นแผง
            </Link>
          </div>
        </div>

        <footer style={{ borderTop: "1px solid rgba(244,239,230,0.08)", padding: 24, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 12, color: "rgba(244,239,230,0.35)", letterSpacing: "0.15em" }}>
          © 2026 PlengMa · MAY 2026 SHELF · เปิดถึง 31 พ.ค.
        </footer>
      </main>
    </>
  );
}
