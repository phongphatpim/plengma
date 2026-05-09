"use client";

import { useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { TapeGenre } from "@/lib/types";

const GENRE_OPTIONS: TapeGenre[] = [
  "DREAM POP",
  "CITYPOP",
  "LOFI",
  "INDIE POP",
  "FOLK",
  "R&B",
  "ELECTRONIC",
  "AMBIENT",
  "HIP-HOP",
  "POP PUNK",
  "SYNTHWAVE",
  "JAZZ",
  "DARKWAVE",
  "POST-ROCK",
  "BEDROOM POP",
  "อื่นๆ",
];

type CoverMode = "upload" | "ai" | "team";

export interface SubmitPreviewState {
  form: {
    youtubeUrl: string;
    title: string;
    artist: string;
    genre: TapeGenre;
    duration: string;
    description: string;
    email: string;
    socialUrl: string;
    tools: string;
    coverPrompt: string;
    mood: string;
  };
  coverMode: CoverMode;
  coverPreviewUrl: string | null;
}

interface SubmitFormProps {
  onPreviewChange?: (data: SubmitPreviewState) => void;
}

interface FieldErrors {
  youtubeUrl?: string;
  title?: string;
  genre?: string;
  duration?: string;
  artist?: string;
  email?: string;
}

const YOUTUBE_REGEX = /^https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be|music\.youtube\.com)\//i;
const DURATION_REGEX = /^\d{1,2}:\d{2}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const stepLabel = ["เพลงของคุณ", "ข้อมูลผู้สร้าง", "ปกเทป", "ยืนยัน"];

function getPlatformLabel(url: string): "YouTube" | "YouTube Music" | null {
  if (!YOUTUBE_REGEX.test(url)) return null;
  return /music\.youtube\.com/i.test(url) ? "YouTube Music" : "YouTube";
}

export default function SubmitForm({ onPreviewChange }: SubmitFormProps) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [catalogId, setCatalogId] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [checks, setChecks] = useState([false, false, false]);
  const [website, setWebsite] = useState("");

  const [form, setForm] = useState<SubmitPreviewState["form"]>({
    youtubeUrl: "",
    title: "",
    artist: "",
    genre: "DREAM POP",
    duration: "",
    description: "",
    email: "",
    socialUrl: "",
    tools: "",
    coverPrompt: "",
    mood: "",
  });
  const [coverMode, setCoverMode] = useState<CoverMode>("upload");
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [uploadName, setUploadName] = useState("");
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const platform = useMemo(() => getPlatformLabel(form.youtubeUrl), [form.youtubeUrl]);
  const allChecks = checks.every(Boolean);

  const previewPayload: SubmitPreviewState = {
    form,
    coverMode,
    coverPreviewUrl,
  };

  const updateForm = <K extends keyof SubmitPreviewState["form"]>(key: K, value: SubmitPreviewState["form"][K]) => {
    const next = { ...form, [key]: value };
    setForm(next);
    onPreviewChange?.({ form: next, coverMode, coverPreviewUrl });
  };

  const updateMode = (mode: CoverMode) => {
    setCoverMode(mode);
    onPreviewChange?.({ form, coverMode: mode, coverPreviewUrl });
  };

  const updatePreview = (nextPreview: string | null) => {
    setCoverPreviewUrl(nextPreview);
    onPreviewChange?.({ form, coverMode, coverPreviewUrl: nextPreview });
  };

  const validateStep = (targetStep: number): boolean => {
    const nextErrors: FieldErrors = {};

    if (targetStep >= 1) {
      if (!YOUTUBE_REGEX.test(form.youtubeUrl.trim())) {
        nextErrors.youtubeUrl = "ใส่ลิงก์ YouTube ด้วยนะ — ไม่งั้นเราเอาขึ้นแผงไม่ได้";
      }
      if (!form.title.trim()) {
        nextErrors.title = "ชื่อเพลงว่างอยู่ — ใส่หน่อยนะ";
      }
      if (!form.genre) {
        nextErrors.genre = "เลือกแนวเพลงด้วย";
      }
      if (!DURATION_REGEX.test(form.duration.trim())) {
        nextErrors.duration = "ใส่ความยาวเพลงแบบ 03:45 นะ";
      }
    }

    if (targetStep >= 2) {
      if (!form.artist.trim()) {
        nextErrors.artist = "ชื่อศิลปินว่างอยู่";
      }
      if (!EMAIL_REGEX.test(form.email.trim())) {
        nextErrors.email = "อีเมลดูแปลกๆ — เช็คอีกทีนะ";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const nextStep = () => {
    if (!validateStep(step)) return;
    setStep((v) => Math.min(v + 1, 4));
  };

  const prevStep = () => setStep((v) => Math.max(v - 1, 1));

  const handleFile = (file?: File) => {
    if (!file) return;
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setUploadError("รองรับเฉพาะไฟล์ JPG/PNG เท่านั้นนะ");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("ไฟล์ใหญ่เกิน 5MB ลองย่อไฟล์แล้วอัปใหม่อีกที");
      return;
    }
    setUploadName(file.name);
    setUploadError("");
    const url = URL.createObjectURL(file);
    updatePreview(url);
  };

  const onSubmit = async () => {
    if (!validateStep(2) || !allChecks || submitting) return;
    if (website.trim()) return;

    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          youtubeUrl: form.youtubeUrl.trim(),
          title: form.title.trim(),
          artist: form.artist.trim(),
          genre: form.genre,
          duration: form.duration.trim(),
          description: form.description.trim() || undefined,
          artistEmail: form.email.trim(),
          socialUrl: form.socialUrl.trim() || undefined,
          tools: form.tools.trim() || undefined,
          coverMode,
          coverPrompt: form.coverPrompt.trim() || undefined,
          mood: form.mood.trim() || undefined,
          website,
        }),
      });

      const data = (await res.json()) as { success?: boolean; catalogId?: string; error?: string };

      if (res.ok && data.success && data.catalogId) {
        setCatalogId(data.catalogId);
        setSubmitted(true);
        return;
      }

      if (res.status === 429 && data.error) {
        setSubmitError(data.error);
        return;
      }

      setSubmitError("เกิดข้อผิดพลาด ลองใหม่อีกทีนะ");
    } catch {
      setSubmitError("เกิดข้อผิดพลาด ลองใหม่อีกทีนะ");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section
        style={{
          border: "1px solid rgba(244,239,230,0.12)",
          borderRadius: 20,
          padding: 32,
          background: "rgba(36,23,66,0.68)",
          backdropFilter: "blur(10px)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 54, color: "var(--gold)", marginBottom: 8 }}>★</div>
        <h2 style={{ fontFamily: "var(--font-thai)", fontWeight: 800, fontSize: 30, marginBottom: 8 }}>
          เพลงของคุณอยู่ในคิวแล้ว!
        </h2>
        <p style={{ color: "rgba(244,239,230,0.8)", marginBottom: 8 }}>catalog ID: {catalogId}</p>
        <p style={{ color: "rgba(244,239,230,0.8)", marginBottom: 24 }}>
          ทีมงานจะรีวิวภายใน 2-3 วัน แล้วแจ้งกลับทาง {form.email}
        </p>
        <a
          href="/shelf"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "var(--gold)",
            color: "var(--ink)",
            textDecoration: "none",
            borderRadius: 999,
            padding: "11px 22px",
            fontWeight: 700,
            fontFamily: "var(--font-thai)",
          }}
        >
          กลับสู่แผง →
        </a>
      </section>
    );
  }

  return (
    <section
      style={{
        border: "1px solid rgba(244,239,230,0.12)",
        borderRadius: 20,
        padding: 24,
        background: "rgba(36,23,66,0.68)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
        {stepLabel.map((label, idx) => {
          const n = idx + 1;
          const active = n === step;
          return (
            <div
              key={label}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                borderRadius: 999,
                border: "1px solid rgba(244,239,230,0.18)",
                background: active ? "rgba(233,185,73,0.15)" : "rgba(14,8,32,0.35)",
                color: active ? "var(--gold)" : "rgba(244,239,230,0.75)",
                fontSize: 12,
              }}
            >
              <strong>{n}</strong> {label}
            </div>
          );
        })}
      </div>

      {step === 1 && (
        <div style={{ display: "grid", gap: 14 }}>
          <Field label="ลิงก์ YouTube *" error={errors.youtubeUrl}>
            <input
              value={form.youtubeUrl}
              onChange={(e) => updateForm("youtubeUrl", e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              style={inputStyle}
            />
            {platform && <Badge text={platform} />}
          </Field>

          <Field label="ชื่อเพลง *" error={errors.title}>
            <input
              value={form.title}
              maxLength={40}
              onChange={(e) => updateForm("title", e.target.value)}
              placeholder="เช่น คืนที่ฝนตกหนัก"
              style={inputStyle}
            />
            <Counter value={form.title.length} max={40} />
          </Field>

          <Field label="แนวเพลง *" error={errors.genre}>
            <select value={form.genre} onChange={(e) => updateForm("genre", e.target.value as TapeGenre)} style={inputStyle}>
              {GENRE_OPTIONS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </Field>

          <Field label="ความยาวเพลง *" error={errors.duration}>
            <input
              value={form.duration}
              onChange={(e) => updateForm("duration", e.target.value)}
              placeholder="03:45"
              style={inputStyle}
            />
          </Field>

          <Field label="คำอธิบาย (ไม่บังคับ)">
            <textarea
              value={form.description}
              maxLength={280}
              onChange={(e) => updateForm("description", e.target.value)}
              rows={4}
              style={inputStyle}
            />
            <Counter value={form.description?.length ?? 0} max={280} />
          </Field>
        </div>
      )}

      {step === 2 && (
        <div style={{ display: "grid", gap: 14 }}>
          <Field label="ชื่อศิลปิน *" error={errors.artist}>
            <input
              value={form.artist}
              maxLength={30}
              onChange={(e) => updateForm("artist", e.target.value)}
              style={inputStyle}
            />
          </Field>
          <Field label="อีเมล *" error={errors.email}>
            <input
              value={form.email}
              onChange={(e) => updateForm("email", e.target.value)}
              style={inputStyle}
            />
          </Field>
          <Field label="Social URL (ไม่บังคับ)">
            <input
              value={form.socialUrl}
              onChange={(e) => updateForm("socialUrl", e.target.value)}
              placeholder="https://instagram.com/yourname"
              style={inputStyle}
            />
          </Field>
          <Field label="เครื่องมือ AI ที่ใช้ (ใส่ได้หลายตัว คั่นด้วย comma)">
            <input
              value={form.tools}
              onChange={(e) => updateForm("tools", e.target.value)}
              placeholder="Suno v4, ElevenLabs, Adobe Audition"
              style={inputStyle}
            />
          </Field>
        </div>
      )}

      {step === 3 && (
        <div style={{ display: "grid", gap: 14 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {(["upload", "ai", "team"] as CoverMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => updateMode(mode)}
                style={{
                  ...buttonSecondary,
                  borderColor: coverMode === mode ? "var(--gold)" : "rgba(244,239,230,0.24)",
                  color: coverMode === mode ? "var(--gold)" : "rgba(244,239,230,0.8)",
                }}
              >
                {mode === "upload" ? "อัปโหลด" : mode === "ai" ? "ให้ AI ทำ" : "ให้ทีมทำ"}
              </button>
            ))}
          </div>

          {coverMode === "upload" && (
            <div
              style={{
                border: "1px dashed rgba(244,239,230,0.35)",
                borderRadius: 14,
                padding: 18,
                textAlign: "center",
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFile(e.dataTransfer.files?.[0]);
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                onChange={(e) => handleFile(e.target.files?.[0])}
                style={{ display: "none" }}
              />
              <button type="button" onClick={() => fileInputRef.current?.click()} style={buttonSecondary}>
                ลากไฟล์มาวาง หรือกดเพื่อเลือก
              </button>
              {uploadName && <p style={{ color: "rgba(244,239,230,0.75)" }}>{uploadName}</p>}
              {uploadError && <p style={{ color: "#FF8DA1", marginTop: 10 }}>{uploadError}</p>}
              {coverPreviewUrl && (
                <img src={coverPreviewUrl} alt="cover preview" style={{ marginTop: 10, width: 150, borderRadius: 10 }} />
              )}
            </div>
          )}

          {coverMode === "ai" && (
            <Field label="Prompt ปก (ไม่บังคับ)">
              <textarea
                value={form.coverPrompt}
                onChange={(e) => updateForm("coverPrompt", e.target.value)}
                placeholder="ปกสีฟ้าเข้ม มีรูปเทปคาสเซตลอยอยู่ในอวกาศ บรรยากาศ lo-fi"
                rows={4}
                style={inputStyle}
              />
              <small style={noteStyle}>ทีมงานจะ generate ปกให้ภายใน 2-3 วัน</small>
            </Field>
          )}

          {coverMode === "team" && (
            <Field label="mood / vibe (ไม่บังคับ)">
              <textarea
                value={form.mood}
                onChange={(e) => updateForm("mood", e.target.value)}
                placeholder="เพลงฟีลดึก ๆ สีม่วงเข้ม เศร้านิดหน่อย"
                rows={4}
                style={inputStyle}
              />
              <small style={noteStyle}>ทีมงานจะออกแบบปกให้และติดต่อกลับทาง email</small>
            </Field>
          )}
        </div>
      )}

      {step === 4 && (
        <div style={{ display: "grid", gap: 14 }}>
          <div style={{ border: "1px solid rgba(244,239,230,0.14)", borderRadius: 12, padding: 14 }}>
            <SummaryRow label="ลิงก์" value={form.youtubeUrl} />
            <SummaryRow label="ชื่อเพลง" value={form.title} />
            <SummaryRow label="ศิลปิน" value={form.artist} />
            <SummaryRow label="แนวเพลง" value={form.genre} />
            <SummaryRow label="ความยาว" value={form.duration} />
            <SummaryRow label="อีเมล" value={form.email} />
            <SummaryRow label="โหมดปก" value={coverMode} />
          </div>

          {[
            "ฉันไม่ได้ลอกทำนอง/เนื้อร้องจากเพลงมีลิขสิทธิ์",
            "ฉันไม่ได้ใช้เสียงศิลปินจริงโดยไม่ได้รับอนุญาต",
            "เพลงนี้ไม่มีเนื้อหาผิดกฎหมายหรือดูหมิ่นบุคคล/สถาบัน",
          ].map((text, idx) => (
            <label key={text} style={{ display: "flex", gap: 10, alignItems: "flex-start", color: "rgba(244,239,230,0.9)" }}>
              <input
                type="checkbox"
                checked={checks[idx]}
                onChange={(e) => {
                  const next = [...checks];
                  next[idx] = e.target.checked;
                  setChecks(next as [boolean, boolean, boolean]);
                }}
                style={{ marginTop: 3 }}
              />
              <span>{text}</span>
            </label>
          ))}

          <input
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            style={{ display: "none" }}
            tabIndex={-1}
            autoComplete="off"
          />

          {submitError && <p style={{ color: "#FF8DA1", fontSize: 14 }}>{submitError}</p>}

          <button
            type="button"
            onClick={onSubmit}
            disabled={!allChecks || submitting}
            style={{
              border: "none",
              borderRadius: 999,
              padding: "12px 18px",
              fontWeight: 800,
              fontFamily: "var(--font-thai)",
              background: allChecks && !submitting ? "#E9B949" : "rgba(233,185,73,0.35)",
              color: allChecks && !submitting ? "#0E0820" : "rgba(14,8,32,0.6)",
              cursor: allChecks && !submitting ? "pointer" : "not-allowed",
            }}
          >
            {submitting ? "กำลังส่ง..." : "★ ส่งเข้าคิว"}
          </button>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 22, gap: 10 }}>
        {step > 1 ? (
          <button type="button" onClick={prevStep} style={buttonSecondary}>
            ← ย้อนกลับ
          </button>
        ) : (
          <span />
        )}

        {step < 4 && (
          <button type="button" onClick={nextStep} style={buttonPrimary}>
            ถัดไป →
          </button>
        )}
      </div>
    </section>
  );
}

function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: ReactNode;
  error?: string;
}) {
  return (
    <label style={{ display: "grid", gap: 8 }}>
      <span style={{ color: "rgba(244,239,230,0.9)", fontSize: 14 }}>{label}</span>
      {children}
      {error && <span style={{ color: "#FF8DA1", fontSize: 13 }}>{error}</span>}
    </label>
  );
}

function Counter({ value, max }: { value: number; max: number }) {
  return (
    <small style={{ color: "rgba(244,239,230,0.6)", textAlign: "right" }}>
      {value} / {max}
    </small>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        width: "fit-content",
        padding: "4px 10px",
        borderRadius: 999,
        border: "1px solid rgba(111,227,200,0.45)",
        color: "var(--mint)",
        fontSize: 12,
      }}
    >
      {text}
    </span>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: 10, marginBottom: 8 }}>
      <strong style={{ color: "rgba(244,239,230,0.7)" }}>{label}</strong>
      <span style={{ color: "rgba(244,239,230,0.95)" }}>{value || "-"}</span>
    </div>
  );
}

const inputStyle: CSSProperties = {
  border: "1px solid rgba(244,239,230,0.2)",
  background: "rgba(14,8,32,0.6)",
  color: "var(--paper)",
  borderRadius: 10,
  padding: "10px 12px",
  fontSize: 14,
  width: "100%",
};

const noteStyle: CSSProperties = {
  color: "rgba(244,239,230,0.6)",
  fontSize: 12,
};

const buttonPrimary: CSSProperties = {
  border: "none",
  background: "var(--gold)",
  color: "var(--ink)",
  borderRadius: 999,
  padding: "10px 18px",
  fontWeight: 700,
  cursor: "pointer",
};

const buttonSecondary: CSSProperties = {
  border: "1px solid rgba(244,239,230,0.25)",
  background: "transparent",
  color: "var(--paper)",
  borderRadius: 999,
  padding: "10px 16px",
  cursor: "pointer",
};
