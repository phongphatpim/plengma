import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import type { Metadata } from "next";
import type { CSSProperties } from "react";

export const metadata: Metadata = {
  title: "เกี่ยวกับเพลงมา — แผงเทปคาสเซตประจำเดือน",
  description:
    "เพลงมาคือแผงเทปเพลงไทยสร้างสรรค์จาก AI ที่คัดสรรทุกเดือน — เรียนรู้แนวคิด วิธีส่งเพลง และมาตรฐานที่เรายึดถือ",
};

const sectionWrap: CSSProperties = {
  maxWidth: 1280,
  margin: "0 auto",
  padding: "56px 24px",
  borderBottom: "1px solid rgba(244,239,230,0.08)",
};

const h2: CSSProperties = {
  fontFamily: "var(--font-thai)",
  fontWeight: 800,
  fontSize: "clamp(22px, 3.5vw, 36px)",
  letterSpacing: "-0.02em",
  color: "var(--paper)",
  marginBottom: 28,
};

const bodyMuted: CSSProperties = {
  fontFamily: "var(--font-thai)",
  color: "rgba(244,239,230,0.72)",
  fontSize: 16,
  lineHeight: 1.85,
};

const cardBase: CSSProperties = {
  background: "rgba(26,16,48,0.55)",
  border: "1px solid rgba(244,239,230,0.1)",
  borderRadius: 14,
  padding: "22px 20px",
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100dvh" }}>
        {/* Section 1 — Hero */}
        <section style={{ ...sectionWrap, paddingTop: 48 }}>
          <Link
            href="/shelf"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              color: "rgba(244,239,230,0.45)",
              textDecoration: "none",
              display: "inline-block",
              marginBottom: 28,
              letterSpacing: "0.02em",
            }}
          >
            ← กลับแผง
          </Link>
          <h1
            style={{
              fontFamily: "var(--font-thai)",
              fontWeight: 700,
              fontSize: "clamp(36px, 7vw, 64px)",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              color: "var(--paper)",
              marginBottom: 20,
            }}
          >
            เพลงมา คืออะไร?
          </h1>
          <p style={{ ...bodyMuted, maxWidth: 620, fontSize: "clamp(15px, 2vw, 18px)" }}>
            แผงเทปคาสเซตประจำเดือน — คัดสรรเพลงไทยสร้างสรรค์จาก AI
          </p>
        </section>

        {/* Section 2 — Concept */}
        <section style={sectionWrap}>
          <h2 style={h2}>แผงเทปประจำเดือน ทำงานยังไง?</h2>
          <div
            className="about-concept-cards"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 18,
            }}
          >
            {[
              {
                icon: "▦",
                text: "แต่ละเดือนมี 300 ช่องบนแผง ศิลปินส่งเพลงมา ทีมงานรีวิว แล้วคัดขึ้นแผงทีละเพลง",
              },
              {
                icon: "★",
                text: "ทุกเพลงที่ขึ้นแผงได้รับตำแหน่งถาวร เช่น A-07 หรือ D-15 พร้อมหมายเลข catalog #PLG-XXX",
              },
              {
                icon: "◫",
                text: "แผงเดือนที่ผ่านมาจะถูกเก็บไว้ ดูพัฒนาการของวงการเพลง AI ไทยได้ตลอด",
              },
            ].map(({ icon, text }) => (
              <div key={text.slice(0, 12)} style={cardBase}>
                <span
                  style={{
                    fontSize: 28,
                    lineHeight: 1,
                    color: "var(--gold)",
                    fontFamily: "var(--font-mono)",
                  }}
                  aria-hidden
                >
                  {icon}
                </span>
                <p style={{ ...bodyMuted, margin: 0, fontSize: 15 }}>{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3 — For artists */}
        <section style={sectionWrap}>
          <h2 style={h2}>ส่งเพลงของคุณขึ้นแผง</h2>
          <div
            className="about-artists-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 40,
              alignItems: "start",
            }}
          >
            <div>
              <p style={{ ...bodyMuted, fontWeight: 600, color: "var(--paper)", marginBottom: 16 }}>
                ขั้นตอน
              </p>
              <ol
                style={{
                  margin: 0,
                  paddingLeft: 22,
                  fontFamily: "var(--font-thai)",
                  color: "rgba(244,239,230,0.78)",
                  lineHeight: 1.9,
                  fontSize: 15,
                }}
              >
                <li>ส่งลิงก์ YouTube + ข้อมูลเพลง</li>
                <li>ทีมงานรีวิวภายใน 2-3 วัน</li>
                <li>ถ้าผ่าน — เพลงขึ้นแผงพร้อม catalog number</li>
                <li>ถ้าไม่ผ่าน — แจ้งเหตุผลกลับทาง email</li>
              </ol>
            </div>
            <div>
              <p style={{ ...bodyMuted, fontWeight: 600, color: "var(--paper)", marginBottom: 16 }}>
                มาตรฐานที่ยอมรับ (และไม่ยอมรับ)
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <p style={{ fontFamily: "var(--font-thai)", color: "var(--mint)", fontWeight: 700, fontSize: 14, margin: "0 0 8px" }}>
                    ✅ ยอมรับ:
                  </p>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: 20,
                      fontFamily: "var(--font-thai)",
                      color: "rgba(244,239,230,0.75)",
                      fontSize: 15,
                      lineHeight: 1.75,
                    }}
                  >
                    <li>เพลงที่สร้างหรือช่วยสร้างด้วย AI tools</li>
                    <li>ทุกแนวเพลง ทุกความยาว</li>
                    <li>ทั้งเพลงบรรเลงและมีเนื้อร้อง</li>
                  </ul>
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-thai)", color: "var(--magenta)", fontWeight: 700, fontSize: 14, margin: "0 0 8px" }}>
                    ❌ ไม่รับ:
                  </p>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: 20,
                      fontFamily: "var(--font-thai)",
                      color: "rgba(244,239,230,0.75)",
                      fontSize: 15,
                      lineHeight: 1.75,
                    }}
                  >
                    <li>เสียงคน/ศิลปินจริงโดยไม่ได้รับอนุญาต</li>
                    <li>ลอกทำนอง/เนื้อร้องจากเพลงมีลิขสิทธิ์</li>
                    <li>เนื้อหาผิดกฎหมายหรือดูหมิ่นบุคคล/สถาบัน</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4 — AI disclosure */}
        <section style={sectionWrap}>
          <h2 style={h2}>เราโปร่งใสเรื่อง AI</h2>
          <p style={{ ...bodyMuted, maxWidth: 720 }}>
            ทุกเพลงบนแผงเพลงมาสร้างขึ้นด้วยความช่วยเหลือของ AI เราไม่ปิดบังเรื่องนี้ — และมองว่า AI
            เป็นเครื่องมือสร้างสรรค์ เหมือนกับที่นักดนตรียุคก่อนใช้ synthesizer หรือ drum machine
            สิ่งที่เราวัดคือคุณภาพของเพลง ไม่ใช่เครื่องมือที่ใช้ทำ
          </p>
          <p
            style={{
              marginTop: 20,
              display: "inline-block",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(244,239,230,0.55)",
              border: "1px solid rgba(233,185,73,0.35)",
              borderRadius: 999,
              padding: "8px 14px",
            }}
          >
            ทุกเพลงมี AI Disclosure badge แสดงเครื่องมือที่ใช้
          </p>
        </section>

        {/* Section 5 — Team */}
        <section style={sectionWrap}>
          <h2 style={h2}>ทีมงาน</h2>
          <div style={{ maxWidth: 560 }}>
            <p style={bodyMuted}>เพลงมาดูแลโดยทีมเล็กๆ ที่รักเพลงและสนใจ AI</p>
            <p style={{ ...bodyMuted, marginTop: 16 }}>
              ติดต่อเรา:{" "}
              <a href="mailto:hello@plengma.com" style={{ color: "var(--gold)", textDecoration: "none" }}>
                hello@plengma.com
              </a>
            </p>
            <p style={{ ...bodyMuted, marginTop: 16, color: "rgba(244,239,230,0.55)" }}>
              ติดตามความเคลื่อนไหว: ช่องทาง social กำลังจัดเตรียม — แจ้งผ่านเว็บไซต์และอีเมลก่อน
            </p>
          </div>
        </section>

        {/* Section 6 — CTA */}
        <section
          style={{
            ...sectionWrap,
            borderBottom: "none",
            paddingBottom: 80,
            textAlign: "center",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
            <Link
              href="/submit"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                background: "var(--gold)",
                color: "var(--ink)",
                fontFamily: "var(--font-thai)",
                fontWeight: 800,
                fontSize: 15,
                padding: "14px 28px",
                borderRadius: 999,
                textDecoration: "none",
                minWidth: 200,
              }}
            >
              ★ ส่งเพลงของคุณ
            </Link>
            <Link
              href="/shelf"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                background: "transparent",
                color: "var(--paper)",
                fontFamily: "var(--font-thai)",
                fontWeight: 600,
                fontSize: 15,
                padding: "14px 28px",
                borderRadius: 999,
                textDecoration: "none",
                border: "1px solid rgba(244,239,230,0.28)",
                minWidth: 200,
              }}
            >
              ดูแผงเดือนนี้ →
            </Link>
          </div>
        </section>
      </main>

      <style>{`
        @media (max-width: 768px) {
          .about-concept-cards { grid-template-columns: 1fr !important; }
          .about-artists-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </>
  );
}
