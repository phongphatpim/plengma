"use client";
import { useState, useCallback } from "react";
import { Tape } from "@/types";
import TapeSlot from "./TapeSlot";
import TapeModal from "./TapeModal";

interface IsoShelfProps {
  tapes: Tape[];
  label?: string;
  rows?: number;
  cols?: number;
}

export default function IsoShelf({
  tapes,
  label = "★ MAY 2026 SHELF · ROW A–J · POSITION 01–30",
  rows = 10,
  cols = 30,
}: IsoShelfProps) {
  const [selected, setSelected] = useState<Tape | null>(null);

  // Build a lookup map: slotIndex → Tape
  const tapeMap = new Map(tapes.map((t) => [t.slot, t]));

  // Occupied tapes list (for prev/next nav in modal)
  const occupiedSlots = tapes
    .filter((t) => t.status === "occupied")
    .sort((a, b) => a.slot - b.slot);

  const handleSelect = useCallback((tape: Tape) => {
    setSelected(tape);
  }, []);

  const handlePrev = useCallback(() => {
    if (!selected || selected.status !== "occupied") return;
    const idx = occupiedSlots.findIndex((t) => t.slot === selected.slot);
    if (idx > 0) setSelected(occupiedSlots[idx - 1]);
  }, [selected, occupiedSlots]);

  const handleNext = useCallback(() => {
    if (!selected || selected.status !== "occupied") return;
    const idx = occupiedSlots.findIndex((t) => t.slot === selected.slot);
    if (idx < occupiedSlots.length - 1) setSelected(occupiedSlots[idx + 1]);
  }, [selected, occupiedSlots]);

  return (
    <>
      {/* Shelf container */}
      <div
        style={{
          background: "rgba(26,16,48,0.5)",
          border: "1px solid rgba(244,239,230,0.08)",
          borderRadius: 16,
          padding: "20px 20px 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Wood texture overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='wood'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.02 0.6' numOctaves='3'/%3E%3CfeColorMatrix values='0.4 0 0 0 0.15 0.25 0 0 0 0.08 0.15 0 0 0 0.04 0 0 0 0.5 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23wood)'/%3E%3C/svg%3E")`,
            backgroundSize: "400px 400px",
            opacity: 0.4,
            pointerEvents: "none",
            borderRadius: 12,
          }}
        />

        {/* Shelf header */}
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
            zIndex: 2,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "rgba(244,239,230,0.55)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            {label}
          </span>
          <div style={{ display: "flex", gap: 6 }}>
            {["−", "+", "⌕"].map((icon) => (
              <button
                key={icon}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  border: "1px solid rgba(244,239,230,0.15)",
                  background: "rgba(244,239,230,0.04)",
                  color: "var(--paper)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                }}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* ISO Viewport — scrollable */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            perspective: 1400,
            perspectiveOrigin: "50% 30%",
            overflowX: "auto",
            overflowY: "hidden",
            padding: "20px 0 40px",
          }}
          className="shelf-scroll"
        >
          <div
            style={{
              transform: "rotateX(48deg) rotateZ(-2deg)",
              transformStyle: "preserve-3d",
              transformOrigin: "50% 0",
              display: "grid",
              gridTemplateColumns: `repeat(${cols}, 56px)`,
              gridTemplateRows: `repeat(${rows}, 78px)`,
              gap: 6,
              margin: "80px auto 100px",
              width: "max-content",
              position: "relative",
            }}
          >
            {/* Row-divider lines (every 2 rows) */}
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                backgroundImage: `repeating-linear-gradient(
                  180deg,
                  transparent 0,
                  transparent 168px,
                  rgba(0,0,0,0.4) 168px,
                  rgba(0,0,0,0.4) 170px,
                  rgba(255,255,255,0.04) 170px,
                  rgba(255,255,255,0.04) 172px
                )`,
                pointerEvents: "none",
                transform: "translateZ(-2px)",
              }}
            />

            {/* Render all cells */}
            {Array.from({ length: rows * cols }, (_, i) => {
              const r = Math.floor(i / cols);
              const c = i % cols;
              const rowLetter = "ABCDEFGHIJ"[r];
              const id = `${rowLetter}-${String(c + 1).padStart(2, "0")}`;
              const tape: Tape = tapeMap.get(i) ?? {
                id,
                slot: i,
                status: "empty",
              };

              return (
                <TapeSlot key={i} tape={{ ...tape, id }} onClick={handleSelect} />
              );
            })}
          </div>
        </div>
      </div>

      {/* Scrollbar style */}
      <style>{`
        .shelf-scroll { -webkit-overflow-scrolling: touch; }
        .shelf-scroll::-webkit-scrollbar { height: 6px; }
        .shelf-scroll::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 3px; }
        .shelf-scroll::-webkit-scrollbar-thumb { background: rgba(233,185,73,0.4); border-radius: 3px; }
        .slot-hover-tape:hover { transform: translateZ(16px) translateY(-4px) !important; }
        .slot-hover-empty:hover { transform: translateZ(4px) !important; }
      `}</style>

      {/* Modal */}
      <TapeModal
        tape={selected}
        onClose={() => setSelected(null)}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </>
  );
}
