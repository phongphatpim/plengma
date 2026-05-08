"use client";
import { useState } from "react";
import Link from "next/link";

// ── Types ────────────────────────────────────────────────────
interface FormData {
  // Step 1
  songUrl: string;
  songTitle: string;
  genre: string;
  duration: string;
  description: string;
  // Step 2
  artistName: string;
  email: string;
  social: string;
  tools: string;
  // Step 3
  coverMode: "upload" | "ai" | "team";
  coverPrompt: string;
  teamMoodNote: string;
  // Step 4
  cb1: boolean;
  cb2: boolean;
  cb3: boolean;
}

const INITIAL: FormData = {
  songUrl: "", songTitle: "", genre: "", duration: "", description: "",
  artistName: "", email: "", social: "", tools: "",
  coverMode: "upload", coverPrompt: "", teamMoodNote: "",
  cb1: false, cb2: false, cb3: false,
};

const GENRES = [
  "DREAM POP","CITYPOP","LOFI","INDIE POP","FOLK","R&B",
  "ELECTRONIC","AMBIENT","HIP-HOP","POP PUNK","SYNTHWAVE","JAZZ","อื่นๆ",
];

const TAPE_GRADIENTS = [
  "linear-gradient(135deg, #C73D6E, #6B1F38)",
  "linear-gradient(135deg, #E9B949, #8B5E0F)",
  "linear-gradient(135deg, #4B5FE8, #2A1A4E)",
  "linear-gradient(135deg, #6FE3C8, #4B5FE8)",
  "linear-gradient(135deg, #E85D8C, #7C8BFF)",
];

// ── Styles helpers ───────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(14,8,32,0.6)",
  border: "1px solid rgba(244,239,230,0.15)",
  borderRadius: 8,
  padding: "12px 14px",
  color: "var(--paper)",
  fontFamily: "var(--font-thai)",
  fontSize: 15,
  outline: "none",
  transition: "border-color 0.2s ease",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-thai)",
  fontWeight: 600,
  fontSize: 14,
  marginBottom: 8,
  color: "var(--paper)",
};

const helpStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  color: "rgba(244,239,230,0.4)",
  marginTop: 6,
  letterSpacing: "0.05em",
};

const fieldStyle: React.CSSProperties = { marginBottom: 20 };

// ── Main Component ────────────────────────────────────────────
export default function SubmitForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [tapeBg] = useState(() => TAPE_GRADIENTS[Math.floor(Math.random() * TAPE_GRADIENTS.length)]);

  const set = (key: keyof FormData, val: string | boolean) =>
    setForm((f) => ({ ...f, [key]: val }));

  const progressPct = ((step - 1) / 3) * 100;

  const canSubmit = form.cb1 && form.cb2 && form.cb3;

  // ── Render ─────────────────────────────────────────────────
  return (
    <>
      {/* Page header */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px 0" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.3em", color: "var(--magenta)", textTransform: "uppercase", marginBottom: 12 }}>
          SUBMIT YOUR TAPE · ส่งฟรี
        </div>
        <h1 style={{ fontFamily: "var(--font-thai)", fontWeight: 800, fontSize: "clamp(28px,5vw,48px)", letterSpacing: "-0.02em", marginBottom: 10 }}>
          ส่งเทปขึ้นแผง{" "}
          <span style={{ color: "var(--gold)" }}>MAY 2026</span>
        </h1>
        <p style={{ color: "rgba(244,239,230,0.65)", maxWidth: 580, fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
          กรอกข้อมูลแค่ 4 ขั้นตอน — ทีมงานจะรีวิวภายใน 2-3 วัน ถ้าผ่าน เพลงคุณจะอยู่บนแผงตลอดเดือน
        </p>
      </div>

      {/* Progress bar */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px 32px" }}>
        <div style={{ height: 6, background: "rgba(244,239,230,0.08)", borderRadius: 100, overflow: "hidden", marginBottom: 12, position: "relative" }}>
          <div
            style={{
              height: "100%",
              width: `${progressPct}%`,
              background: "linear-gradient(90deg, var(--gold), var(--magenta))",
              borderRadius: 100,
              transition: "width 0.5s cubic-bezier(0.34,1.56,0.64,1)",
              position: "relative",
            }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {["01 · เพลง", "02 · ผู้สร้าง", "03 · ปกเทป", "04 · ยืนยัน"].map((label, i) => (
            <span
              key={label}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: i + 1 === step ? "var(--gold)" : i + 1 < step ? "var(--mint)" : "rgba(244,239,230,0.35)",
                fontWeight: i + 1 === step ? 700 : 400,
              }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Layout: form + preview */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px 80px",
          display: "grid",
          gridTemplateColumns: "1fr 360px",
          gap: 32,
          alignItems: "flex-start",
        }}
        className="submit-layout"
      >
        {/* ─── Form card ─── */}
        <div
          style={{
            background: "rgba(36,23,66,0.5)",
            border: "1px solid rgba(244,239,230,0.08)",
            borderRadius: 16,
            padding: 32,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Top accent line */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, var(--gold), var(--magenta), var(--periwinkle))" }} />

          {step === 1 && <Step1 form={form} set={set} onNext={() => setStep(2)} />}
          {step === 2 && <Step2 form={form} set={set} onNext={() => setStep(3)} onPrev={() => setStep(1)} />}
          {step === 3 && <Step3 form={form} set={set} onNext={() => setStep(4)} onPrev={() => setStep(2)} />}
          {step === 4 && <Step4 form={form} set={set} onPrev={() => setStep(3)} canSubmit={canSubmit} onSubmit={() => setSubmitted(true)} />}
        </div>

        {/* ─── Live Preview ─── */}
        <div
          style={{
            position: "sticky",
            top: 80,
            background: "rgba(26,16,48,0.6)",
            border: "1px solid rgba(244,239,230,0.1)",
            borderRadius: 16,
            padding: 24,
          }}
        >
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.25em", color: "var(--gold)", marginBottom: 6, textTransform: "uppercase" }}>
            ★ LIVE PREVIEW
          </div>
          <div style={{ fontFamily: "var(--font-thai)", fontWeight: 700, fontSize: 16, marginBottom: 20, color: "var(--paper)" }}>
            เทปของคุณ
          </div>

          {/* Mini tape preview */}
          <div
            style={{
              aspectRatio: "3/2",
              borderRadius: 6,
              background: tapeBg,
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
              marginBottom: 12,
            }}
          >
            {/* Grain */}
            <div style={{ position: "absolute", inset: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`, backgroundSize: "80px 80px", mixBlendMode: "overlay", pointerEvents: "none" }} />
            {/* Inner */}
            <div style={{ position: "absolute", inset: 12, borderRadius: 4, border: "1px solid rgba(244,239,230,0.18)", padding: "14px 16px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              {/* Label row */}
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(244,239,230,0.65)" }}>
                <span>PLENGMA</span><span>A SIDE</span>
              </div>
              {/* Content */}
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ fontFamily: "var(--font-thai)", fontWeight: 800, fontSize: form.songTitle ? 18 : 16, color: form.songTitle ? "var(--paper)" : "rgba(244,239,230,0.25)", wordBreak: "break-word", lineHeight: 1.1, marginBottom: 4 }}>
                  {form.songTitle || "ชื่อเพลงของคุณ"}
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "rgba(244,239,230,0.55)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  {form.artistName || "ARTIST NAME"}
                </div>
              </div>
              {/* Side watermark */}
              <div style={{ position: "absolute", bottom: 14, right: 16, fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 52, color: "rgba(244,239,230,0.07)", lineHeight: 0.8, userSelect: "none" }}>A</div>
            </div>
            {/* Spools */}
            {["22%", "auto"].map((left, i) => (
              <div key={i} style={{ position: "absolute", top: "50%", ...(i === 0 ? { left: "22%" } : { right: "22%" }), width: 28, height: 28, borderRadius: "50%", border: "1.5px solid rgba(244,239,230,0.2)", transform: "translateY(-50%)", animation: "spoolSpin 6s linear infinite" }} />
            ))}
          </div>

          {/* Info rows */}
          <div style={{ background: "rgba(14,8,32,0.5)", borderRadius: 10, padding: "10px 14px" }}>
            {[
              { label: "ชื่อเพลง",  val: form.songTitle  || "—" },
              { label: "ศิลปิน",    val: form.artistName || "—" },
              { label: "แนวเพลง",  val: form.genre      || "—" },
              { label: "เครื่องมือ", val: form.tools     || "—" },
            ].map(({ label, val }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid rgba(244,239,230,0.06)" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(244,239,230,0.45)" }}>{label}</span>
                <span style={{ fontFamily: "var(--font-thai)", fontSize: 13, color: "var(--paper)", fontWeight: 500, textAlign: "right", maxWidth: "60%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{val}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16, padding: "12px 14px", background: "rgba(14,8,32,0.4)", borderRadius: 8, border: "1px solid rgba(233,185,73,0.15)" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.2em", color: "rgba(244,239,230,0.45)", marginBottom: 6, textTransform: "uppercase" }}>ตำแหน่งในแผง</div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 28, color: "var(--gold)", letterSpacing: "-0.02em", lineHeight: 1 }}>กำหนดหลังรีวิว</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(244,239,230,0.4)", marginTop: 4 }}>ทีมงานจะกำหนดตำแหน่งให้หลังผ่านการรีวิว</div>
          </div>
        </div>
      </div>

      {/* Success overlay */}
      {submitted && <SuccessModal artistName={form.artistName} songTitle={form.songTitle} onClose={() => { setSubmitted(false); setStep(1); setForm(INITIAL); }} />}

      <style>{`
        @keyframes spoolSpin { to { transform: translateY(-50%) rotate(360deg); } }
        @media (max-width: 900px) {
          .submit-layout { grid-template-columns: 1fr !important; }
          .submit-layout > div:last-child { position: static !important; order: -1; }
        }
        input, select, textarea { color-scheme: dark; }
        input:focus, select:focus, textarea:focus { border-color: rgba(233,185,73,0.5) !important; }
      `}</style>
    </>
  );
}

// ── Step 1: เพลง ─────────────────────────────────────────────
function Step1({ form, set, onNext }: { form: FormData; set: (k: keyof FormData, v: string | boolean) => void; onNext: () => void }) {
  const canProceed = form.songTitle && form.genre;
  return (
    <>
      <StepHeader step={1} title="เพลงของคุณ" desc="เริ่มจากชื่อเพลงและลิงก์ที่คุณอัปไว้ เราจะเอาไว้ส่งให้ทีมรีวิว" />

      <div style={fieldStyle}>
        <label style={labelStyle}>ลิงก์เพลง <Hint>OPTIONAL</Hint></label>
        <input style={inputStyle} type="url" value={form.songUrl} onChange={e => set("songUrl", e.target.value)} placeholder="https://youtube.com/watch?v=... หรือ Suno / Udio" />
        <div style={helpStyle}>รองรับ YouTube · Suno · Udio · SoundCloud</div>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>ชื่อเพลง <Required /></label>
        <input style={inputStyle} type="text" value={form.songTitle} onChange={e => set("songTitle", e.target.value)} placeholder="เช่น คืนที่ฝนตกหนัก" maxLength={40} />
        <div style={helpStyle}>ไม่เกิน 40 ตัวอักษร · ภาษาไทยได้ ({form.songTitle.length}/40)</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div>
          <label style={labelStyle}>แนวเพลง <Required /></label>
          <select style={{ ...inputStyle, cursor: "pointer" }} value={form.genre} onChange={e => set("genre", e.target.value)}>
            <option value="">เลือกแนวเพลง</option>
            {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>ความยาว <Hint>OPTIONAL</Hint></label>
          <input style={inputStyle} type="text" value={form.duration} onChange={e => set("duration", e.target.value)} placeholder="03:42" maxLength={5} />
        </div>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>เล่าเกี่ยวกับเพลงนี้สั้นๆ <Hint>OPTIONAL</Hint></label>
        <textarea
          style={{ ...inputStyle, resize: "vertical", minHeight: 100, lineHeight: 1.6 }}
          value={form.description}
          onChange={e => set("description", e.target.value)}
          placeholder="แรงบันดาลใจ · เรื่องราว · feel ของเพลง — เขียนได้เต็มที่ ทีมงานจะเอาไปลงในหน้าเพลง"
          maxLength={280}
        />
        <div style={helpStyle}>{form.description.length}/280 ตัวอักษร</div>
      </div>

      <StepActions onNext={onNext} nextDisabled={!canProceed} />
    </>
  );
}

// ── Step 2: ข้อมูลผู้สร้าง ───────────────────────────────────
function Step2({ form, set, onNext, onPrev }: { form: FormData; set: (k: keyof FormData, v: string | boolean) => void; onNext: () => void; onPrev: () => void }) {
  const canProceed = form.artistName && form.email;
  return (
    <>
      <StepHeader step={2} title="ข้อมูลผู้สร้าง" desc="เราต้องรู้ว่าคุณเป็นใคร เพื่อติดต่อกลับและให้เครดิตอย่างถูกต้อง" />

      <div style={fieldStyle}>
        <label style={labelStyle}>ชื่อศิลปิน / นามแฝง <Required /></label>
        <input style={inputStyle} type="text" value={form.artistName} onChange={e => set("artistName", e.target.value)} placeholder="เช่น NIRA · จอมขมังเวทย์ · SYNTHKID" maxLength={30} />
        <div style={helpStyle}>ชื่อนี้จะแสดงบนเทปและบนแผง ({form.artistName.length}/30)</div>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>อีเมล <Required /></label>
        <input style={inputStyle} type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@example.com" />
        <div style={helpStyle}>ใช้แจ้งผลรีวิวและส่งลิงก์หลังเพลงขึ้นแผง</div>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>โซเชียล <Hint>OPTIONAL</Hint></label>
        <input style={inputStyle} type="url" value={form.social} onChange={e => set("social", e.target.value)} placeholder="instagram.com/yourname หรือ x.com/yourname" />
        <div style={helpStyle}>ลิงก์ที่ผู้ฟังติดตามคุณได้ — แสดงในหน้าเพลง</div>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>เครื่องมือ AI ที่ใช้ <Hint>OPTIONAL</Hint></label>
        <input style={inputStyle} type="text" value={form.tools} onChange={e => set("tools", e.target.value)} placeholder="เช่น Suno v4 · Udio · ElevenLabs" />
        <div style={helpStyle}>PlengMa สนับสนุนความโปร่งใส — ไม่บังคับ</div>
      </div>

      <StepActions onNext={onNext} onPrev={onPrev} nextDisabled={!canProceed} />
    </>
  );
}

// ── Step 3: ปกเทป ────────────────────────────────────────────
function Step3({ form, set, onNext, onPrev }: { form: FormData; set: (k: keyof FormData, v: string | boolean) => void; onNext: () => void; onPrev: () => void }) {
  return (
    <>
      <StepHeader step={3} title="ปกเทป" desc="ทุกเทปบนแผงต้องมีปก — เลือกวิธีที่สะดวกที่สุด" />

      {/* Cover mode selector */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 24 }}>
        {([
          { mode: "upload", icon: "📁", label: "อัปโหลดเอง", sub: "JPG · PNG" },
          { mode: "ai",     icon: "✨", label: "AI สร้างให้", sub: "FREE · 4 OPTIONS" },
          { mode: "team",   icon: "🎨", label: "ทีมงานทำให้", sub: "2–3 DAYS" },
        ] as const).map(({ mode, icon, label, sub }) => (
          <button
            key={mode}
            onClick={() => set("coverMode", mode)}
            style={{
              background: form.coverMode === mode ? "rgba(233,185,73,0.12)" : "rgba(244,239,230,0.03)",
              border: `1px solid ${form.coverMode === mode ? "var(--gold)" : "rgba(244,239,230,0.12)"}`,
              borderRadius: 12,
              padding: "16px 12px",
              cursor: "pointer",
              textAlign: "center",
              transition: "all 0.2s ease",
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
            <div style={{ fontFamily: "var(--font-thai)", fontWeight: 600, fontSize: 13, color: form.coverMode === mode ? "var(--gold)" : "var(--paper)", marginBottom: 4 }}>{label}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.15em", color: "rgba(244,239,230,0.4)", textTransform: "uppercase" }}>{sub}</div>
          </button>
        ))}
      </div>

      {/* Upload mode */}
      {form.coverMode === "upload" && (
        <div style={{ border: "2px dashed rgba(244,239,230,0.15)", borderRadius: 12, padding: "40px 24px", textAlign: "center", cursor: "pointer", marginBottom: 20 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 40, color: "rgba(244,239,230,0.3)", marginBottom: 12 }}>+</div>
          <div style={{ fontFamily: "var(--font-thai)", fontWeight: 600, marginBottom: 6 }}>ลากไฟล์มาวาง หรือกดเพื่อเลือก</div>
          <div style={helpStyle}>JPG/PNG · ขนาดอย่างน้อย 1200×800 · สูงสุด 5MB</div>
        </div>
      )}

      {/* AI mode */}
      {form.coverMode === "ai" && (
        <div style={{ marginBottom: 20 }}>
          <div style={fieldStyle}>
            <label style={labelStyle}>บอก mood ของเพลงให้ AI</label>
            <input style={inputStyle} type="text" value={form.coverPrompt} onChange={e => set("coverPrompt", e.target.value)} placeholder="เช่น เปลี่ยวเหงา · กลางคืน · ชายทะเล · ฟ้าหลังฝน" />
          </div>
          <button
            style={{ width: "100%", background: "var(--periwinkle)", color: "var(--ink)", fontFamily: "var(--font-thai)", fontWeight: 700, fontSize: 14, padding: "12px", borderRadius: 100, border: "none", cursor: "pointer" }}
          >
            ✨ ให้ AI สร้าง 4 แบบ (เร็วๆ นี้)
          </button>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8, marginTop: 12 }}>
            {TAPE_GRADIENTS.slice(0, 4).map((bg, i) => (
              <div key={i} style={{ aspectRatio: "3/2", borderRadius: 6, background: bg, opacity: 0.6, cursor: "not-allowed" }} />
            ))}
          </div>
          <div style={{ ...helpStyle, textAlign: "center", marginTop: 8 }}>ฟีเจอร์นี้จะเปิดใช้งานหลัง launch</div>
        </div>
      )}

      {/* Team mode */}
      {form.coverMode === "team" && (
        <div style={{ marginBottom: 20 }}>
          <div style={fieldStyle}>
            <label style={labelStyle}>บอก mood ที่อยากได้</label>
            <textarea
              style={{ ...inputStyle, resize: "vertical", minHeight: 100, lineHeight: 1.6 }}
              value={form.teamMoodNote}
              onChange={e => set("teamMoodNote", e.target.value)}
              placeholder="เช่น ปกเทปแนวสีเทอร์ควอยซ์ มีบรรยากาศกลางคืน เน้นความเหงา..."
            />
            <div style={helpStyle}>ทีมงานจะส่ง 2-3 แบบให้เลือกภายใน 2-3 วัน — ฟรีไม่มีค่าใช้จ่าย</div>
          </div>
        </div>
      )}

      <StepActions onNext={onNext} onPrev={onPrev} />
    </>
  );
}

// ── Step 4: ยืนยัน ───────────────────────────────────────────
function Step4({ form, set, onPrev, canSubmit, onSubmit }: {
  form: FormData;
  set: (k: keyof FormData, v: string | boolean) => void;
  onPrev: () => void;
  canSubmit: boolean;
  onSubmit: () => void;
}) {
  return (
    <>
      <StepHeader step={4} title="ยืนยันและส่งเข้าคิว" desc="เกือบเสร็จแล้ว! ก่อนส่ง อ่านและยืนยันข้อตกลง 3 ข้อ — สำคัญมาก ห้ามข้าม" />

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
        {([
          { key: "cb1", text: <>ฉันยืนยันว่าเพลงนี้ <strong>ไม่ลอกทำนอง เนื้อร้อง หรือ sample จากเพลงที่มีลิขสิทธิ์</strong> โดยไม่ได้รับอนุญาต</> },
          { key: "cb2", text: <>ฉันยืนยันว่า <strong>ไม่ใช้เสียงร้องของคนหรือศิลปินจริง</strong> โดยไม่ได้รับอนุญาต (voice cloning ผิดกฎหมาย)</> },
          { key: "cb3", text: <>เพลงและปกเทปไม่มีเนื้อหา <strong>ผิดกฎหมาย หยาบคายเกินสมควร หรือดูหมิ่น</strong>บุคคล/สถาบัน</> },
        ] as const).map(({ key, text }) => (
          <label
            key={key}
            style={{ display: "flex", alignItems: "flex-start", gap: 14, cursor: "pointer", padding: "14px 16px", background: form[key] ? "rgba(111,227,200,0.06)" : "rgba(244,239,230,0.03)", border: `1px solid ${form[key] ? "rgba(111,227,200,0.25)" : "rgba(244,239,230,0.1)"}`, borderRadius: 10, transition: "all 0.2s ease" }}
          >
            <input
              type="checkbox"
              checked={form[key]}
              onChange={e => set(key, e.target.checked)}
              style={{ display: "none" }}
            />
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                border: `2px solid ${form[key] ? "var(--mint)" : "rgba(244,239,230,0.25)"}`,
                background: form[key] ? "var(--mint)" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                marginTop: 1,
                transition: "all 0.2s ease",
              }}
            >
              {form[key] && <span style={{ color: "var(--ink)", fontSize: 12, fontWeight: 700 }}>✓</span>}
            </div>
            <span style={{ fontFamily: "var(--font-thai)", fontSize: 14, color: "rgba(244,239,230,0.85)", lineHeight: 1.6 }}>{text}</span>
          </label>
        ))}
      </div>

      {/* Process note */}
      <div style={{ marginBottom: 24, padding: "16px 18px", background: "rgba(111,227,200,0.06)", border: "1px solid rgba(111,227,200,0.18)", borderRadius: 10, fontSize: 13, color: "rgba(244,239,230,0.85)", lineHeight: 1.7 }}>
        <strong style={{ color: "var(--mint)" }}>★ หลังจากส่ง</strong><br />
        ทีมงานจะรีวิวภายใน 2-3 วัน หากผ่าน เพลงคุณจะถูกเพิ่มเข้าแผงประจำเดือน MAY 2026 เราจะส่งอีเมลแจ้งผลและลิงก์เพลงของคุณ
      </div>

      <StepActions
        onPrev={onPrev}
        onSubmit={canSubmit ? onSubmit : undefined}
        nextLabel="★ ส่งเข้าคิว"
        nextDisabled={!canSubmit}
        isLast
      />
    </>
  );
}

// ── Success overlay ──────────────────────────────────────────
function SuccessModal({ artistName, songTitle, onClose }: { artistName: string; songTitle: string; onClose: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(14,8,32,0.92)", backdropFilter: "blur(20px)", cursor: "pointer" }} />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          background: "rgba(36,23,66,0.98)",
          border: "1px solid rgba(244,239,230,0.15)",
          borderRadius: 16,
          padding: "40px 32px",
          maxWidth: 480,
          width: "100%",
          textAlign: "center",
          animation: "successIn 0.5s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--mint)", color: "var(--ink)", margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, fontWeight: 700, boxShadow: "0 0 40px rgba(111,227,200,0.4)" }}>
          ✓
        </div>
        <h2 style={{ fontFamily: "var(--font-thai)", fontWeight: 800, fontSize: 28, marginBottom: 8 }}>เทปเข้าคิวแล้ว!</h2>
        <p style={{ color: "rgba(244,239,230,0.65)", marginBottom: 20, lineHeight: 1.6 }}>
          {artistName || "คุณ"} ส่ง <strong style={{ color: "var(--paper)" }}>{songTitle || "เพลง"}</strong> เข้าคิวเรียบร้อย<br />
          ทีมงานจะรีวิวภายใน 2-3 วัน แจ้งผลทางอีเมล
        </p>
        <div style={{ display: "inline-block", background: "var(--gold)", color: "var(--ink)", padding: "6px 16px", borderRadius: 100, fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 12, letterSpacing: "0.25em", marginBottom: 24 }}>
          MAY 2026 · PENDING REVIEW
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <Link href="/shelf" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "transparent", color: "var(--paper)", fontFamily: "var(--font-thai)", fontWeight: 600, fontSize: 14, padding: "10px 20px", borderRadius: 100, border: "1px solid rgba(244,239,230,0.2)", textDecoration: "none" }}>
            ← กลับแผง
          </Link>
          <button onClick={onClose} style={{ background: "var(--gold)", color: "var(--ink)", fontFamily: "var(--font-thai)", fontWeight: 700, fontSize: 14, padding: "10px 20px", borderRadius: 100, border: "none", cursor: "pointer" }}>
            ส่งอีกเพลง
          </button>
        </div>
      </div>
      <style>{`@keyframes successIn { from { transform:scale(0.7); opacity:0; } to { transform:scale(1); opacity:1; } }`}</style>
    </div>
  );
}

// ── Shared sub-components ────────────────────────────────────
function StepHeader({ step, title, desc }: { step: number; title: string; desc: string }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.3em", color: "var(--magenta)", textTransform: "uppercase", marginBottom: 6 }}>
        STEP 0{step} / 04
      </div>
      <h2 style={{ fontFamily: "var(--font-thai)", fontWeight: 800, fontSize: 28, letterSpacing: "-0.01em", marginBottom: 6 }}>{title}</h2>
      <p style={{ color: "rgba(244,239,230,0.6)", fontSize: 14, lineHeight: 1.7 }}>{desc}</p>
    </div>
  );
}

function StepActions({ onPrev, onNext, onSubmit, nextLabel = "ถัดไป →", nextDisabled = false, isLast = false }: {
  onPrev?: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  isLast?: boolean;
}) {
  const btn = isLast ? onSubmit : onNext;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, paddingTop: 24, borderTop: "1px solid rgba(244,239,230,0.08)" }}>
      {onPrev
        ? <button onClick={onPrev} style={{ background: "transparent", border: "1px solid rgba(244,239,230,0.2)", color: "var(--paper)", fontFamily: "var(--font-thai)", fontWeight: 600, fontSize: 14, padding: "10px 20px", borderRadius: 100, cursor: "pointer" }}>← ก่อนหน้า</button>
        : <span />
      }
      <button
        onClick={btn}
        disabled={nextDisabled}
        style={{ background: nextDisabled ? "rgba(244,239,230,0.08)" : "var(--gold)", color: nextDisabled ? "rgba(244,239,230,0.3)" : "var(--ink)", fontFamily: "var(--font-thai)", fontWeight: 700, fontSize: 15, padding: "12px 28px", borderRadius: 100, border: "none", cursor: nextDisabled ? "not-allowed" : "pointer", transition: "all 0.2s ease" }}
      >
        {nextLabel}
      </button>
    </div>
  );
}

function Required() {
  return <span style={{ color: "var(--magenta)", marginLeft: 3 }}>*</span>;
}

function Hint({ children }: { children: React.ReactNode }) {
  return <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.15em", color: "rgba(244,239,230,0.4)", fontWeight: 400, marginLeft: 6 }}>{children}</span>;
}
