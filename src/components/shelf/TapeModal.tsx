"use client";

import { useEffect, useCallback, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import type { Tape, TapeModalSelection } from "@/lib/types";
import { formatShelfPosition } from "@/lib/types";
import { TAPE_GRADIENTS, LIGHT_BG } from "./TapeSlot";
import Link from "next/link";
import CuratorNoteBlock from "./CuratorNoteBlock";
import TransparencyBadge from "@/components/ui/TransparencyBadge";
import { parseToolLabels } from "@/lib/parse-tools";

interface TapeModalProps {
  selection: TapeModalSelection | null;
  /** Tapes on shelf sorted row → col — used for ← → navigation */
  allTapes: Tape[];
  onClose: () => void;
  onTapeNavigate?: (tape: Tape) => void;
}

const TAG_STYLES: Record<string, { color: string; border: string; bg: string }> = {
  curated: { color: "var(--gold)", border: "var(--gold)", bg: "rgba(233,185,73,0.1)" },
  hot: { color: "var(--magenta)", border: "var(--magenta)", bg: "rgba(232,93,140,0.1)" },
  new: { color: "var(--mint)", border: "var(--mint)", bg: "rgba(111,227,200,0.08)" },
  rare: { color: "var(--periwinkle)", border: "var(--periwinkle)", bg: "rgba(124,139,255,0.1)" },
};

function hashHeights(seed: string, n: number): number[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return Array.from({ length: n }, (_, i) => {
    h = (h * 1664525 + 1013904223 + i) >>> 0;
    return 20 + (h % 80);
  });
}

export default function TapeModal({ selection, allTapes, onClose, onTapeNavigate }: TapeModalProps) {
  const isOpen = !!selection;

  const { onPrev, onNext } = useMemo(() => {
    if (!selection || selection.kind !== "tape" || !onTapeNavigate) {
      return { onPrev: undefined as (() => void) | undefined, onNext: undefined as (() => void) | undefined };
    }
    const idx = allTapes.findIndex((t) => t.id === selection.tape.id);
    return {
      onPrev: idx > 0 ? () => onTapeNavigate(allTapes[idx - 1]!) : undefined,
      onNext: idx >= 0 && idx < allTapes.length - 1 ? () => onTapeNavigate(allTapes[idx + 1]!) : undefined,
    };
  }, [selection, allTapes, onTapeNavigate]);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (selection?.kind === "tape") {
        if (e.key === "ArrowLeft") onPrev?.();
        if (e.key === "ArrowRight") onNext?.();
      }
    },
    [isOpen, onClose, onPrev, onNext, selection?.kind]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!selection) return null;

  if (selection.kind === "empty") {
    return (
      <ModalWrapper onClose={onClose} showNav={false}>
        <div
          style={{
            textAlign: "center",
            padding: "48px 32px",
            background: "rgba(36,23,66,0.9)",
            backdropFilter: "blur(24px)",
            border: "1.5px dashed rgba(111,227,200,0.4)",
            borderRadius: 16,
          }}
        >
          <div style={{ fontFamily: "var(--font-display)", fontSize: 80, color: "var(--mint)", lineHeight: 1, marginBottom: 16 }}>+</div>
          <h3 style={{ fontFamily: "var(--font-thai)", fontWeight: 700, fontSize: 28, marginBottom: 8 }}>
            ตำแหน่ง {selection.label} · พื้นที่ว่าง
          </h3>
          <p style={{ color: "rgba(244,239,230,0.65)", marginBottom: 24, fontSize: 15 }}>
            ส่งเพลงของคุณมาเลย — ช่องนี้รออยู่
          </p>
          <Link
            href="/submit"
            onClick={onClose}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "var(--gold)",
              color: "var(--ink)",
              fontFamily: "var(--font-thai)",
              fontWeight: 700,
              fontSize: 15,
              padding: "12px 28px",
              borderRadius: 100,
              textDecoration: "none",
            }}
          >
            ส่งเพลงของคุณมาเลย →
          </Link>
        </div>
      </ModalWrapper>
    );
  }

  if (selection.kind === "retired") {
    return (
      <ModalWrapper onClose={onClose} showNav={false}>
        <div
          style={{
            textAlign: "center",
            padding: "48px 32px",
            background: "rgba(36,23,66,0.9)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(232,93,140,0.3)",
            borderRadius: 16,
          }}
        >
          <div style={{ fontFamily: "var(--font-display)", fontSize: 80, color: "var(--magenta)", lineHeight: 1, marginBottom: 16 }}>×</div>
          <h3 style={{ fontFamily: "var(--font-thai)", fontWeight: 700, fontSize: 26, marginBottom: 8 }}>
            ตำแหน่ง {selection.label} · RETIRED
          </h3>
          <p style={{ color: "rgba(244,239,230,0.65)", fontSize: 14, marginBottom: 8 }}>
            ช่องนี้ถูกถอดออกจากแผงแล้ว
          </p>
          <span
            style={{
              display: "inline-block",
              background: "rgba(232,93,140,0.12)",
              border: "1px solid var(--magenta)",
              color: "var(--magenta)",
              padding: "4px 14px",
              borderRadius: 100,
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.25em",
            }}
          >
            RETIRED
          </span>
        </div>
      </ModalWrapper>
    );
  }

  const tape = selection.tape;
  return <TapeDetailModal tape={tape} onClose={onClose} onPrev={onPrev} onNext={onNext} />;
}

function TapeDetailModal({
  tape,
  onClose,
  onPrev,
  onNext,
}: {
  tape: Tape;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}) {
  const posLabel = formatShelfPosition(tape.position.row, tape.position.col);
  const bgIndex = Math.min(15, Math.max(1, tape.coverBg));
  const bg = TAPE_GRADIENTS[bgIndex];
  const isLight = LIGHT_BG.has(bgIndex);
  const textColor = isLight ? "rgba(14,8,32,0.95)" : "var(--paper)";
  const mutedColor = isLight ? "rgba(14,8,32,0.65)" : "rgba(244,239,230,0.65)";
  const spoolBorder = isLight ? "rgba(14,8,32,0.25)" : "rgba(244,239,230,0.25)";

  const barHeights = useMemo(() => hashHeights(tape.id, 64), [tape.id]);
  const playedThrough = 0.35;
  const tapeWithTransparency = useMemo((): Tape => {
    if (tape.transparency) return tape;
    const tools = parseToolLabels(tape.tools);
    return {
      ...tape,
      transparency: { tools, approach: "hybrid" },
    };
  }, [tape]);
  const [shareHint, setShareHint] = useState<string | null>(null);

  useEffect(() => {
    setShareHint(null);
  }, [tape.id]);

  useEffect(() => {
    if (!shareHint) return;
    const t = window.setTimeout(() => setShareHint(null), 3500);
    return () => clearTimeout(t);
  }, [shareHint]);

  const copyShareLink = useCallback(async () => {
    const url = `${window.location.origin}/track/${encodeURIComponent(tape.id)}`;
    try {
      await navigator.clipboard.writeText(url);
      setShareHint("คัดลอกลิงก์แชร์แล้ว");
    } catch {
      setShareHint("คัดลอกไม่สำเร็จ — ลองอีกครั้งหรือคัดลอกด้วยตนเอง");
    }
  }, [tape.id]);

  return (
    <ModalWrapper onClose={onClose} onPrev={onPrev} onNext={onNext} showNav>
      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: -12,
            left: 24,
            background: "var(--gold)",
            color: "var(--ink)",
            padding: "6px 14px",
            borderRadius: 100,
            fontFamily: "var(--font-mono)",
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: "0.15em",
            boxShadow: "0 4px 12px rgba(233,185,73,0.4)",
            zIndex: 5,
            animation: "posBadgeIn 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.4s backwards",
          }}
        >
          ★ {posLabel}
        </div>

        <div
          style={{
            position: "relative",
            aspectRatio: "3/2",
            borderRadius: 8,
            background: bg,
            overflow: "hidden",
            boxShadow: "0 24px 60px rgba(0,0,0,0.6), 0 4px 12px rgba(0,0,0,0.3)",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
              backgroundSize: "120px 120px",
              mixBlendMode: "overlay",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: -20,
              background: "radial-gradient(circle, rgba(233,185,73,0.25) 0%, transparent 60%)",
              animation: "glowPulse 3s ease-in-out infinite",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 14,
              borderRadius: 6,
              border: `1.5px solid ${isLight ? "rgba(14,8,32,0.15)" : "rgba(244,239,230,0.18)"}`,
              padding: "24px 28px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: mutedColor }}>
              <span>● {tape.id} / {tape.side}-SIDE · HiFi · {tape.duration}</span>
            </div>

            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontFamily: "var(--font-thai)", fontWeight: 800, fontSize: 36, lineHeight: 1.05, color: textColor, letterSpacing: "-0.02em", marginBottom: 6 }}>
                {tape.title}
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: mutedColor, letterSpacing: "0.15em", textTransform: "uppercase" as const }}>
                {tape.artist} · {tape.genre} · {tape.duration}
              </div>
            </div>

            <div style={{ position: "absolute", bottom: 24, right: 28, fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 90, color: isLight ? "rgba(14,8,32,0.08)" : "rgba(244,239,230,0.07)", lineHeight: 0.8, letterSpacing: "-0.04em", userSelect: "none" }}>
              {tape.side}
            </div>
          </div>

          {[{ side: "left" as const }, { side: "right" as const }].map(({ side }) => (
            <div
              key={side}
              style={{
                position: "absolute",
                top: "50%",
                [side === "left" ? "left" : "right"]: "22%",
                width: 56,
                height: 56,
                borderRadius: "50%",
                border: `2px solid ${spoolBorder}`,
                background: `radial-gradient(circle, ${isLight ? "rgba(14,8,32,0.1)" : "rgba(244,239,230,0.1)"} 30%, transparent 31%)`,
                transform: "translateY(-50%)",
                animation: "spoolSpin 4s linear infinite",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 16,
                  borderRadius: "50%",
                  border: `2px dashed ${isLight ? "rgba(14,8,32,0.2)" : "rgba(244,239,230,0.2)"}`,
                }}
              />
            </div>
          ))}
        </div>

        <div
          style={{
            background: "rgba(36,23,66,0.88)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(244,239,230,0.1)",
            borderRadius: 16,
            padding: 24,
          }}
        >
          <div style={{ marginBottom: 20 }}>
            <h2
              style={{
                fontFamily: "var(--font-thai)",
                fontWeight: 800,
                fontSize: 22,
                lineHeight: 1.2,
                color: "var(--paper)",
                margin: "0 0 6px",
              }}
            >
              {tape.title}
            </h2>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                letterSpacing: "0.12em",
                textTransform: "uppercase" as const,
                color: "rgba(244,239,230,0.55)",
                margin: 0,
              }}
            >
              {tape.artist} · {tape.genre}
            </p>
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" as const }}>
            {tape.tags.map((tag) => {
              const s = TAG_STYLES[tag] ?? TAG_STYLES.new;
              return (
                <span
                  key={tag}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    padding: "5px 10px",
                    borderRadius: 100,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase" as const,
                    border: `1px solid ${s.border}`,
                    color: s.color,
                    background: s.bg,
                  }}
                >
                  {tag === "curated" ? "★ CURATED" : tag === "hot" ? "▲ HOT" : tag === "new" ? "● NEW" : tag === "rare" ? "◆ RARE" : tag}
                </span>
              );
            })}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
              padding: "16px 0",
              borderTop: "1px solid rgba(244,239,230,0.1)",
              borderBottom: "1px solid rgba(244,239,230,0.1)",
              marginBottom: 16,
            }}
          >
            {[
              { label: "ผู้ฟัง", value: tape.listens.toLocaleString() },
              { label: "ถูกใจ", value: tape.likes.toLocaleString() },
              { label: "ความยาว", value: tape.duration },
            ].map(({ label, value }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 20, color: "var(--paper)", marginBottom: 4 }}>{value}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "rgba(244,239,230,0.45)" }}>{label}</div>
              </div>
            ))}
          </div>

          {tape.curatorNote ? <CuratorNoteBlock text={tape.curatorNote} /> : null}

          {tape.description ? (
            <p
              style={{
                fontFamily: "var(--font-thai)",
                fontSize: 14,
                lineHeight: 1.75,
                color: "rgba(244,239,230,0.72)",
                margin: "0 0 20px",
              }}
            >
              {tape.description}
            </p>
          ) : null}

          <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 48, marginBottom: 8 }}>
            {barHeights.map((h, i) => {
              const played = i / barHeights.length < playedThrough;
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    minWidth: 2,
                    height: `${h}%`,
                    borderRadius: 1,
                    background: played ? "var(--gold)" : "rgba(244,239,230,0.12)",
                  }}
                />
              );
            })}
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "rgba(244,239,230,0.5)", marginBottom: 20 }}>
            {(() => {
              const [m, s] = tape.duration.split(":");
              const sec = parseInt(m ?? "0", 10) * 60 + parseInt(s ?? "0", 10);
              const cur = Math.floor(sec * playedThrough);
              const cm = Math.floor(cur / 60);
              const cs = cur % 60;
              return `${String(cm).padStart(2, "0")}:${String(cs).padStart(2, "0")} / ${tape.duration}`;
            })()}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 10 }}>
            <a
              href={tape.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: "1 1 140px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                background: "var(--gold)",
                color: "var(--ink)",
                fontFamily: "var(--font-thai)",
                fontWeight: 700,
                fontSize: 15,
                padding: "14px",
                borderRadius: 100,
                textDecoration: "none",
              }}
            >
              ▶ ฟัง
            </a>
            <button
              type="button"
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                border: "1px solid rgba(244,239,230,0.2)",
                background: "rgba(244,239,230,0.06)",
                color: "var(--magenta)",
                cursor: "pointer",
                fontSize: 18,
              }}
              aria-label="ถูกใจ"
            >
              ♡
            </button>
            <button
              type="button"
              onClick={() => void copyShareLink()}
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                border: "1px solid rgba(244,239,230,0.2)",
                background: "rgba(244,239,230,0.06)",
                color: "var(--mint)",
                cursor: "pointer",
                fontSize: 18,
              }}
              aria-label="คัดลอกลิงก์แชร์เทปนี้"
            >
              🔗
            </button>
            <a
              href={tape.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                border: "1px solid rgba(244,239,230,0.2)",
                background: "rgba(244,239,230,0.06)",
                color: "var(--paper)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                fontSize: 16,
              }}
              aria-label="เปิด YouTube"
            >
              ↗
            </a>
          </div>
          {shareHint ? (
            <p
              style={{
                margin: "12px 0 0",
                fontFamily: "var(--font-thai)",
                fontSize: 13,
                color: "rgba(111,227,200,0.95)",
                textAlign: "center",
              }}
            >
              {shareHint}
            </p>
          ) : null}

          <TransparencyBadge tape={tapeWithTransparency} variant="full" />
        </div>
      </div>

      <style>{`
        @keyframes spoolSpin { to { transform: translateY(-50%) rotate(360deg); } }
        @keyframes glowPulse { 0%,100% { opacity:0.5; transform:scale(1); } 50% { opacity:0.8; transform:scale(1.05); } }
        @keyframes posBadgeIn { from { transform:scale(0) rotate(-15deg); opacity:0; } to { transform:scale(1) rotate(0); opacity:1; } }
      `}</style>
    </ModalWrapper>
  );
}

function ModalWrapper({
  children,
  onClose,
  onPrev,
  onNext,
  showNav,
}: {
  children: ReactNode;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  showNav: boolean;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        animation: "fadeIn 0.25s ease",
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(14,8,32,0.78)",
          backdropFilter: "blur(16px) saturate(120%)",
          WebkitBackdropFilter: "blur(16px) saturate(120%)",
          cursor: "pointer",
        }}
      />

      {showNav && onPrev && (
        <button type="button" onClick={onPrev} style={navBtnStyle("left")} aria-label="เทปก่อนหน้า">
          ←
        </button>
      )}
      {showNav && onNext && (
        <button type="button" onClick={onNext} style={navBtnStyle("right")} aria-label="เทปถัดไป">
          →
        </button>
      )}

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 520,
          width: "100%",
          maxHeight: "90dvh",
          overflowY: "auto",
          animation: "modalIn 0.6s cubic-bezier(0.34,1.56,0.64,1)",
          paddingTop: 16,
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="ปิด"
          style={{
            position: "absolute",
            top: 4,
            right: -8,
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "rgba(36,23,66,0.95)",
            color: "var(--paper)",
            border: "1px solid rgba(244,239,230,0.2)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 15,
            zIndex: 20,
            backdropFilter: "blur(8px)",
          }}
        >
          ✕
        </button>

        {children}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes modalIn { from { transform:scale(0.5) translateY(40px); opacity:0; } to { transform:scale(1) translateY(0); opacity:1; } }
      `}</style>
    </div>
  );
}

function navBtnStyle(side: "left" | "right"): CSSProperties {
  return {
    position: "absolute",
    top: "50%",
    [side]: 16,
    transform: "translateY(-50%)",
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: "50%",
    background: "rgba(36,23,66,0.7)",
    border: "1px solid rgba(244,239,230,0.2)",
    color: "var(--paper)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    backdropFilter: "blur(8px)",
  };
}
