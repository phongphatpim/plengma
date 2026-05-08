import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "เกี่ยวกับเพลงมา — แผงเทปเพลงไทย AI",
  description: "เพลงมา คือ Hub สำหรับเพลงไทยที่สร้างด้วย AI คัดสรรโดยทีมงาน ส่งฟรีทุกเดือน",
};

const SECTIONS = [
  {
    tag: "01 · WHY",
    title: "ทำไมถึงมีเพลงมา",
    body: `เพลง AI ไทยมีอยู่เต็ม internet แต่กระจัดกระจาย ไม่มีที่รวม ไม่มีการคัดกรอง ไม่มีเครดิตให้ผู้สร้าง

เพลงมาเลยสร้างขึ้นมาเพื่อแก้ปัญหานี้ — เป็น Hub ที่รวบรวมเพลงไทย AI คุณภาพดี จัดระเบียบเป็นแผงประจำเดือน พร้อมให้เครดิตศิลปินอย่างชัดเจน`,
  },
  {
    tag: "02 · HOW",
    title: "แผงประจำเดือน ทำงานยังไง",
    body: `ทุกเดือน เราเปิด 300 ช่องในแผง — ศิลปินส่งเพลงเข้ามา ทีมงานรีวิวภายใน 2-3 วัน ถ้าผ่าน เพลงจะได้ช่องตำแหน่งถาวรในแผงเดือนนั้น

แต่ละช่องมี ID เฉพาะ เช่น A-07, B-21 — เหมือนมีที่นั่งจริงๆ ในแผงเทปจริงๆ

เมื่อสิ้นเดือน แผงจะถูกเก็บเป็น Archive ให้ดูพัฒนาการย้อนหลังได้ทุกเมื่อ`,
  },
  {
    tag: "03 · RULES",
    title: "เกณฑ์การรับเพลง",
    body: null,
    rules: [
      { ok: true,  text: "เพลงที่สร้างด้วย AI เครื่องมือใดก็ได้ (Suno, Udio, ฯลฯ)" },
      { ok: true,  text: "มีปกเทปที่สร้างด้วย AI หรืออัปโหลดเอง" },
      { ok: true,  text: "ภาษาไทย หรือมีองค์ประกอบความเป็นไทย" },
      { ok: false, text: "ใช้เสียงร้องของศิลปินจริงโดยไม่ได้รับอนุญาต" },
      { ok: false, text: "ลอกทำนองหรือเนื้อร้องจากเพลงมีลิขสิทธิ์" },
      { ok: false, text: "เนื้อหาผิดกฎหมาย หยาบคาย หรือดูหมิ่นบุคคล/สถาบัน" },
    ],
  },
  {
    tag: "04 · VISION",
    title: "ทิศทางที่เราเดินไป",
    body: `เพลงมาไม่ได้มองว่า AI จะ "ฆ่า" ดนตรี — เรามองว่ามันคือเครื่องมือใหม่ในมือนักสร้างสรรค์

เหมือนที่ GarageBand เคยเปิดโอกาสให้คนธรรมดาทำเพลงได้ ตอนนี้ AI กำลังทำสิ่งเดียวกันแต่ในระดับที่ใหญ่กว่า

เราอยากเป็นพื้นที่ที่ทดลอง สร้าง และแชร์งานได้อย่างมีเกียรติ — ไม่ใช่แค่อัปโหลดแล้วหายไปในทะเลคอนเทนต์`,
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100dvh" }}>

        {/* Hero */}
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "80px 24px 60px",
            borderBottom: "1px solid rgba(244,239,230,0.08)",
          }}
        >
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.3em", color: "var(--gold)", textTransform: "uppercase", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ display: "inline-block", width: 32, height: 1, background: "var(--gold)" }} />
            About · เกี่ยวกับเพลงมา
          </div>
          <h1
            style={{
              fontFamily: "var(--font-thai)",
              fontWeight: 800,
              fontSize: "clamp(40px,8vw,100px)",
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              marginBottom: 32,
            }}
          >
            <span style={{ background: "linear-gradient(135deg, var(--gold) 0%, var(--magenta) 50%, var(--periwinkle) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              เพลง
            </span>
            <br />
            <span style={{ color: "var(--paper)" }}>มา</span>
          </h1>
          <p
            style={{
              fontFamily: "var(--font-thai)",
              fontSize: "clamp(16px,2vw,20px)",
              color: "rgba(244,239,230,0.7)",
              maxWidth: 560,
              lineHeight: 1.8,
            }}
          >
            แผงเทปเพลงไทย AI คัดสรร — พื้นที่สำหรับนักสร้างสรรค์ที่อยากให้งานของตัวเองมีที่อยู่ที่ดีกว่าแค่ feed
          </p>

          <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
            {["ฟรีทุกเดือน", "รีวิวโดยทีมงาน", "เก็บ Archive ตลอดกาล", "เครดิตชัดเจน"].map((tag) => (
              <span
                key={tag}
                style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.15em", padding: "6px 14px", border: "1px solid rgba(244,239,230,0.2)", borderRadius: 100, color: "rgba(244,239,230,0.65)", textTransform: "uppercase" }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          {SECTIONS.map(({ tag, title, body, rules }, idx) => (
            <section
              key={tag}
              style={{
                padding: "64px 0",
                borderBottom: idx < SECTIONS.length - 1 ? "1px solid rgba(244,239,230,0.08)" : "none",
                display: "grid",
                gridTemplateColumns: "200px 1fr",
                gap: "40px 64px",
                alignItems: "start",
              }}
              className="about-section"
            >
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.25em", color: "var(--magenta)", textTransform: "uppercase", paddingTop: 6 }}>
                {tag}
              </div>
              <div>
                <h2
                  style={{
                    fontFamily: "var(--font-thai)",
                    fontWeight: 800,
                    fontSize: "clamp(24px,3vw,40px)",
                    letterSpacing: "-0.02em",
                    marginBottom: 24,
                    color: "var(--paper)",
                  }}
                >
                  {title}
                </h2>
                {body && (
                  <div
                    style={{
                      color: "rgba(244,239,230,0.7)",
                      fontSize: 16,
                      lineHeight: 2,
                      whiteSpace: "pre-line",
                      fontFamily: "var(--font-thai)",
                    }}
                  >
                    {body}
                  </div>
                )}
                {rules && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {rules.map(({ ok, text }) => (
                      <div
                        key={text}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 14,
                          padding: "12px 16px",
                          background: ok ? "rgba(111,227,200,0.05)" : "rgba(232,93,140,0.05)",
                          border: `1px solid ${ok ? "rgba(111,227,200,0.15)" : "rgba(232,93,140,0.15)"}`,
                          borderRadius: 10,
                        }}
                      >
                        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: ok ? "var(--mint)" : "var(--magenta)", lineHeight: 1.4, flexShrink: 0 }}>
                          {ok ? "✓" : "✗"}
                        </span>
                        <span style={{ fontFamily: "var(--font-thai)", fontSize: 14, color: "rgba(244,239,230,0.8)", lineHeight: 1.6 }}>
                          {text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>

        {/* Team / Tone note */}
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "60px 24px 40px",
            borderTop: "1px solid rgba(244,239,230,0.08)",
          }}
        >
          <div
            style={{
              background: "rgba(26,16,48,0.6)",
              border: "1px solid rgba(244,239,230,0.1)",
              borderRadius: 16,
              padding: "40px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 40,
            }}
            className="about-footer-grid"
          >
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.25em", color: "var(--periwinkle)", marginBottom: 12, textTransform: "uppercase" }}>ทีมงาน</div>
              <p style={{ fontFamily: "var(--font-thai)", color: "rgba(244,239,230,0.7)", lineHeight: 1.8, fontSize: 15 }}>
                เพลงมาเป็น side project ที่ทำโดยทีมเล็กๆ ที่รัก AI และดนตรีไทย — ไม่ใช่บริษัทใหญ่ ไม่มีทุนหนัง ทำเพราะอยากให้มันมีอยู่จริง
              </p>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.25em", color: "var(--gold)", marginBottom: 12, textTransform: "uppercase" }}>ติดต่อ</div>
              <p style={{ fontFamily: "var(--font-thai)", color: "rgba(244,239,230,0.7)", lineHeight: 1.8, fontSize: 15 }}>
                มีคำถาม ข้อเสนอแนะ หรืออยากร่วมงาน ส่งมาที่{" "}
                <a href="mailto:hello@plengma.com" style={{ color: "var(--gold)", textDecoration: "none" }}>
                  hello@plengma.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px 80px", textAlign: "center" }}>
          <Link
            href="/shelf"
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
              marginRight: 12,
            }}
          >
            ★ ดูแผงเดือนนี้
          </Link>
          <Link
            href="/submit"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "transparent",
              color: "var(--paper)",
              fontFamily: "var(--font-thai)",
              fontWeight: 600,
              fontSize: 16,
              padding: "14px 32px",
              borderRadius: 100,
              textDecoration: "none",
              border: "1px solid rgba(244,239,230,0.2)",
            }}
          >
            + ส่งเพลงขึ้นแผง
          </Link>
        </div>

        <footer style={{ borderTop: "1px solid rgba(244,239,230,0.08)", padding: 24, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 12, color: "rgba(244,239,230,0.3)", letterSpacing: "0.15em" }}>
          © 2026 PlengMa · Neo-Retro Cassette · www.plengma.com
        </footer>
      </main>

      <style>{`
        @media (max-width: 768px) {
          .about-section { grid-template-columns: 1fr !important; gap: 12px !important; }
          .about-footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
