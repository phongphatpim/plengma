"use client";
import { useEffect, useCallback } from "react";
import { Tape } from "@/types";
import { TAPE_GRADIENTS, LIGHT_BG } from "./TapeSlot";
import Link from "next/link";

interface TapeModalProps {
  tape: Tape | null;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

const TAG_STYLES: Record<string, { color: string; border: string; bg: string }> = {
  curated: { color: "var(--gold)", border: "var(--gold)", bg: "rgba(233,185,73,0.1)" },
  hot:     { color: "var(--magenta)", border: "var(--magenta)", bg: "rgba(232,93,140,0.1)" },
  new:     { color: "var(--mint)", border: "var(--mint)", bg: "rgba(111,227,200,0.08)" },
  rare:    { color: "var(--periwinkle)", border: "var(--periwinkle)", bg: "rgba(124,139,255,0.1)" },
  gold:    { color: "var(--gold)", border: "var(--gold)", bg: "rgba(233,185,73,0.1)" },
};

export default function TapeModal({ tape, onClose, onPrev, onNext }: TapeModalProps) {
  const isOpen = !!tape;

  // Keyboard nav
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev?.();
      if (e.key === "ArrowRight") onNext?.();
    },
    [isOpen, onClose, onPrev, onNext]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!tape) return null;

  const bgIndex = (tape.slot % 15) + 1;
  const bg = TAPE_GRADIENTS[bgIndex];
  const isLight = LIGHT_BG.has(bgIndex);
  const textColor = isLight ? "rgba(14,8,32,0.95)" : "var(--paper)";
  const mutedColor = isLight ? "rgba(14,8,32,0.65)" : "rgba(244,239,230,0.65)";
  const spoolBorder = isLight ? "rgba(14,8,32,0.25)" : "rgba(244,239,230,0.25)";

  // Empty slot modal
  if (tape.status === "empty") {
    return (
      <ModalWrapper onClose={onClose}>
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
            ช่อง {tape.id} ยังว่างอยู่
          </h3>
          <p style={{ color: "rgba(244,239,230,0.65)", marginBottom: 24, fontSize: 15 }}>
            ส่งเพลงของคุณขึ้นแผงเดือนนี้ได้เลย
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
            + ส่งเพลงขึ้นแผง
          </Link>
        </div>
      </ModalWrapper>
    );
  }

  // Retired slot modal
  if (tape.status === "retired") {
    return (
      <ModalWrapper onClose={onClose}>
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
            ช่อง {tape.id} — RETIRED
          </h3>
          <p style={{ color: "rgba(244,239,230,0.65)", fontSize: 14, marginBottom: 8 }}>
            เทปนี้เคยมีเพลง แต่ถูกถอดออกจากแผงแล้ว
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

  // Occupied tape modal
  const track = tape.track!;
  const tags: string[] = (track as any).tags ?? [];

  return (
    <ModalWrapper onClose={onClose} onPrev={onPrev} onNext={onNext}>
      <div style={{ position: "relative" }}>
        {/* Position badge */}
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
            letterSpacing: "0.2em",
            boxShadow: "0 4px 12px rgba(233,185,73,0.4)",
            zIndex: 5,
            animation: "posBadgeIn 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.4s backwards",
          }}
        >
          POS {tape.id}
        </div>

        {/* Big tape visual */}
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
          {/* Grain */}
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
          {/* Glow */}
          <div
            style={{
              position: "absolute",
              inset: -20,
              background: "radial-gradient(circle, rgba(233,185,73,0.25) 0%, transparent 60%)",
              animation: "glowPulse 3s ease-in-out infinite",
              pointerEvents: "none",
            }}
          />
          {/* Inner border */}
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
            {/* Header row */}
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: mutedColor }}>
              <span>PLENGMA</span>
              <span>{(track as any).side ?? "A"} SIDE</span>
            </div>

            {/* Content */}
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontFamily: "var(--font-thai)", fontWeight: 800, fontSize: 36, lineHeight: 1.05, color: textColor, letterSpacing: "-0.02em", marginBottom: 6 }}>
                {track.title}
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: mutedColor, letterSpacing: "0.15em", textTransform: "uppercase" as const }}>
                {track.artistName}
              </div>
            </div>

            {/* Side watermark */}
            <div style={{ position: "absolute", bottom: 24, right: 28, fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 90, color: isLight ? "rgba(14,8,32,0.08)" : "rgba(244,239,230,0.07)", lineHeight: 0.8, letterSpacing: "-0.04em", userSelect: "none" }}>
              {(track as any).side ?? "A"}
            </div>
          </div>

          {/* Spools */}
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

        {/* Info section */}
        <div
          style={{
            background: "rgba(36,23,66,0.88)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(244,239,230,0.1)",
            borderRadius: 16,
            padding: 24,
          }}
        >
          {/* Tags */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" as const }}>
            {tags.map((tag) => {
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
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, padding: "5px 10px", borderRadius: 100, letterSpacing: "0.2em", textTransform: "uppercase" as const, border: "1px solid rgba(124,139,255,0.5)", color: "var(--periwinkle)", background: "rgba(124,139,255,0.08)" }}>
              {(track as any).genre ?? "—"}
            </span>
          </div>

          {/* Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
              padding: "16px 0",
              borderTop: "1px solid rgba(244,239,230,0.1)",
              borderBottom: "1px solid rgba(244,239,230,0.1)",
              marginBottom: 20,
            }}
          >
            {[
              { label: "ผู้ฟัง", value: ((track.playCount ?? (track as any).listens ?? 0) as number).toLocaleString() },
              { label: "ถูกใจ", value: ((track as any).likes ?? "—").toLocaleString() },
              { label: "ความยาว", value: (track as any).duration ?? "—" },
            ].map(({ label, value }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 20, color: "var(--paper)", marginBottom: 4 }}>{value}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "rgba(244,239,230,0.45)" }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Curator note */}
          {track.curatorNote && (
            <blockquote
              style={{
                borderLeft: "3px solid var(--gold)",
                paddingLeft: 16,
                margin: "0 0 20px",
                color: "rgba(244,239,230,0.7)",
                fontSize: 14,
                fontStyle: "italic",
                lineHeight: 1.6,
              }}
            >
              {track.curatorNote}
            </blockquote>
          )}

          {/* CTA */}
          {track.audioUrl && (
            <a
              href={track.audioUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
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
                width: "100%",
                transition: "all 0.2s ease",
              }}
            >
              ▶ ฟังเพลงนี้
            </a>
          )}
        </div>
      </div>

      {/* Keyframe styles */}
      <style>{`
        @keyframes spoolSpin { to { transform: translateY(-50%) rotate(360deg); } }
        @keyframes glowPulse { 0%,100% { opacity:0.5; transform:scale(1); } 50% { opacity:0.8; transform:scale(1.05); } }
        @keyframes posBadgeIn { from { transform:scale(0) rotate(-15deg); opacity:0; } to { transform:scale(1) rotate(0); opacity:1; } }
      `}</style>
    </ModalWrapper>
  );
}

// ── Shared wrapper with backdrop & nav arrows ─────────────────
function ModalWrapper({
  children,
  onClose,
  onPrev,
  onNext,
}: {
  children: React.ReactNode;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
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
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(14,8,32,0.80)",
          backdropFilter: "blur(16px) saturate(120%)",
          WebkitBackdropFilter: "blur(16px) saturate(120%)",
          cursor: "pointer",
        }}
      />

      {/* Prev / Next nav */}
      {onPrev && (
        <button
          onClick={onPrev}
          style={navBtnStyle("left")}
          aria-label="เทปก่อนหน้า"
        >←</button>
      )}
      {onNext && (
        <button
          onClick={onNext}
          style={navBtnStyle("right")}
          aria-label="เทปถัดไป"
        >→</button>
      )}

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 520,
          width: "100%",
          maxHeight: "90dvh",
          overflowY: "auto",
          animation: "modalIn 0.5s cubic-bezier(0.34,1.56,0.64,1)",
          paddingTop: 16,
        }}
      >
        {/* Close button */}
        <button
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
            transition: "all 0.2s ease",
          }}
        >
          ✕
        </button>

        {children}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes modalIn { from { transform:scale(0.6) translateY(30px); opacity:0; } to { transform:scale(1) translateY(0); opacity:1; } }
      `}</style>
    </div>
  );
}

function navBtnStyle(side: "left" | "right"): React.CSSProperties {
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
    transition: "all 0.2s ease",
  };
}
