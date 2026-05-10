"use client";

import type { Tape, TapePosition, TapeSlotClick } from "@/lib/types";
import TransparencyBadge from "@/components/ui/TransparencyBadge";

export const TAPE_GRADIENTS: Record<number, string> = {
  1: "linear-gradient(135deg, #C73D6E, #6B1F38)",
  2: "linear-gradient(135deg, #E9B949, #8B5E0F)",
  3: "linear-gradient(135deg, #4B5FE8, #2A1A4E)",
  4: "linear-gradient(135deg, #6FE3C8, #4B5FE8)",
  5: "linear-gradient(135deg, #E85D8C, #7C8BFF)",
  6: "linear-gradient(180deg, #2A1A4E, #1A0E38)",
  7: "linear-gradient(135deg, #C8941F, #6B4500)",
  8: "linear-gradient(135deg, #1A3A38, #0E1F1E)",
  9: "linear-gradient(135deg, #4E2A1A, #1F0E08)",
  10: "linear-gradient(135deg, #3D1A4E, #1A0E38)",
  11: "linear-gradient(135deg, #7C8BFF, #4B5FE8)",
  12: "linear-gradient(135deg, #E85D8C, #6FE3C8)",
  13: "linear-gradient(135deg, #1A0E38, #0E0820)",
  14: "linear-gradient(135deg, #6B4500, #2A1A12)",
  15: "linear-gradient(135deg, #E9B949, #C73D6E)",
};

export const LIGHT_BG = new Set([2, 4, 15]);

interface TapeSlotProps {
  status: "tape" | "empty" | "retired";
  position: TapePosition;
  label: string;
  tape?: Tape;
  onClick: (payload: TapeSlotClick) => void;
}

export default function TapeSlot({ status, position, label, tape, onClick }: TapeSlotProps) {

  const fire = (payload: TapeSlotClick) => onClick(payload);

  if (status === "empty") {
    return (
      <button
        type="button"
        onClick={() => fire({ status: "empty", position })}
        title={`${label} — ว่าง`}
        className="slot-empty-btn"
        style={{
          position: "relative",
          cursor: "pointer",
          padding: 0,
          border: "none",
          background: "transparent",
          width: "100%",
          height: "100%",
          transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        <div
          className="slot-empty-face"
          style={{
            width: "100%",
            height: "100%",
            border: "1px dashed rgba(244,239,230,0.22)",
            borderRadius: 3,
            background: "rgba(14,8,32,0.25)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            padding: "0 0 4px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 14,
              color: "rgba(111,227,200,0.45)",
              lineHeight: 1,
            }}
          >
            +
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 6,
              letterSpacing: "0.1em",
              color: "rgba(244,239,230,0.35)",
              textTransform: "uppercase",
            }}
          >
            {label}
          </span>
        </div>
      </button>
    );
  }

  if (status === "retired") {
    return (
      <button
        type="button"
        onClick={() => fire({ status: "retired", position })}
        title={`${label} — RETIRED`}
        style={{
          position: "relative",
          cursor: "pointer",
          padding: 0,
          border: "none",
          background: "transparent",
          width: "100%",
          height: "100%",
          transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        }}
        className="slot-retired-btn"
      >
        <div
          className="slot-retired-face"
          style={{
            width: "100%",
            height: "100%",
            border: "1px solid rgba(232,93,140,0.2)",
            borderRadius: 3,
            background:
              "repeating-linear-gradient(45deg,transparent 0,transparent 4px,rgba(232,93,140,0.1) 4px,rgba(232,93,140,0.1) 5px), rgba(232,93,140,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 16,
              color: "rgba(232,93,140,0.45)",
              lineHeight: 1,
            }}
          >
            ×
          </span>
        </div>
      </button>
    );
  }

  if (!tape) return null;

  const bgKey = Math.min(15, Math.max(1, tape.coverBg));
  const bg = TAPE_GRADIENTS[bgKey];
  const isLight = LIGHT_BG.has(bgKey);
  const textColor = isLight ? "rgba(14,8,32,0.85)" : "rgba(244,239,230,0.9)";
  const mutedColor = isLight ? "rgba(14,8,32,0.55)" : "rgba(244,239,230,0.55)";

  return (
    <button
      type="button"
      onClick={() => fire({ status: "tape", position: tape.position, tape })}
      title={`${label} — ${tape.title}`}
      style={{
        position: "relative",
        cursor: "pointer",
        padding: 0,
        border: "none",
        background: "transparent",
        width: "100%",
        height: "100%",
        transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        transform: "translateZ(8px)",
      }}
      className="slot-hover-tape"
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 3,
          background: bg,
          position: "relative",
          boxShadow:
            "0 1px 0 rgba(255,255,255,0.15) inset, 0 -1px 0 rgba(0,0,0,0.3) inset, 0 2px 6px rgba(0,0,0,0.5)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
            mixBlendMode: "overlay",
            opacity: 0.6,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 2,
            left: 2,
            zIndex: 3,
            maxWidth: "calc(100% - 8px)",
            pointerEvents: "none",
          }}
        >
          <TransparencyBadge tape={tape} variant="compact" />
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 2,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: "var(--font-mono)",
            fontSize: 6,
            letterSpacing: "0.1em",
            color: mutedColor,
          }}
        >
          {label}
        </div>
        <div
          style={{
            position: "absolute",
            top: "38%",
            left: "18%",
            width: 16,
            height: 16,
            borderRadius: "50%",
            border: `1.5px solid ${isLight ? "rgba(14,8,32,0.25)" : "rgba(244,239,230,0.2)"}`,
            transform: "translateY(-50%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "38%",
            right: "18%",
            width: 16,
            height: 16,
            borderRadius: "50%",
            border: `1.5px solid ${isLight ? "rgba(14,8,32,0.25)" : "rgba(244,239,230,0.2)"}`,
            transform: "translateY(-50%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 4,
            right: 4,
            fontFamily: "var(--font-thai)",
            fontWeight: 700,
            fontSize: 7,
            lineHeight: 1.1,
            color: textColor,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {tape.title}
        </div>
      </div>
    </button>
  );
}
