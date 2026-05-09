"use client";

import { useState, useCallback, useMemo } from "react";
import type { ShelfMonth, TapeModalSelection, TapeSlotClick, Tape } from "@/lib/types";
import { formatShelfPosition, positionKey, shelfSlotIndex, SHELF_COLS, SHELF_ROWS } from "@/lib/types";
import TapeSlot from "./TapeSlot";
import TapeModal from "./TapeModal";

interface IsoShelfProps {
  shelf: ShelfMonth;
  label?: string;
}

export default function IsoShelf({
  shelf,
  label = "★ MAY 2026 SHELF · ROW A–J · POSITION 01–30",
}: IsoShelfProps) {
  const [selectedSlot, setSelectedSlot] = useState<TapeModalSelection | null>(null);

  const slotMap = useMemo(() => {
    const m = new Map<string, Tape>();
    for (const t of shelf.tapes) {
      m.set(positionKey(t.position), t);
    }
    return m;
  }, [shelf.tapes]);

  const retiredSet = useMemo(
    () => new Set(shelf.retiredPositions.map(positionKey)),
    [shelf.retiredPositions]
  );

  const allTapes = useMemo(
    () =>
      [...shelf.tapes].sort(
        (a, b) => shelfSlotIndex(a.position.row, a.position.col) - shelfSlotIndex(b.position.row, b.position.col)
      ),
    [shelf.tapes]
  );

  const handleSlotClick = useCallback((click: TapeSlotClick) => {
    if (click.status === "tape") {
      setSelectedSlot({ kind: "tape", tape: click.tape });
      return;
    }
    const lbl = formatShelfPosition(click.position.row, click.position.col);
    if (click.status === "empty") {
      setSelectedSlot({ kind: "empty", position: click.position, label: lbl });
      return;
    }
    setSelectedSlot({ kind: "retired", position: click.position, label: lbl });
  }, []);

  const rows = SHELF_ROWS;
  const cols = SHELF_COLS;

  return (
    <>
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
                type="button"
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

            {Array.from({ length: rows * cols }, (_, i) => {
              const r = Math.floor(i / cols);
              const c = i % cols;
              const pos = { row: r, col: c };
              const id = formatShelfPosition(r, c);
              const key = positionKey(pos);

              if (retiredSet.has(key)) {
                return <TapeSlot key={i} status="retired" position={pos} label={id} onClick={handleSlotClick} />;
              }

              const tape = slotMap.get(key);
              if (tape) {
                return <TapeSlot key={i} status="tape" position={pos} label={id} tape={tape} onClick={handleSlotClick} />;
              }

              return <TapeSlot key={i} status="empty" position={pos} label={id} onClick={handleSlotClick} />;
            })}
          </div>
        </div>
      </div>

      <style>{`
        .shelf-scroll { -webkit-overflow-scrolling: touch; }
        .shelf-scroll::-webkit-scrollbar { height: 6px; }
        .shelf-scroll::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 3px; }
        .shelf-scroll::-webkit-scrollbar-thumb { background: rgba(233,185,73,0.4); border-radius: 3px; }
        .slot-hover-tape:hover {
          transform: translateZ(20px) translateY(-4px) !important;
          filter: drop-shadow(0 12px 20px rgba(0,0,0,0.55));
        }
        .slot-empty-btn:hover .slot-empty-face {
          border-color: #6FE3C8 !important;
          box-shadow: 0 0 0 1px rgba(111,227,200,0.35);
        }
        .slot-empty-btn:hover {
          transform: translateZ(20px) translateY(-2px) !important;
        }
        .slot-retired-btn:hover .slot-retired-face {
          background: repeating-linear-gradient(45deg,transparent 0,transparent 4px,rgba(232,93,140,0.16) 4px,rgba(232,93,140,0.16) 5px), rgba(232,93,140,0.12) !important;
        }
        .slot-retired-btn:hover {
          transform: translateZ(12px) !important;
        }
      `}</style>

      <TapeModal
        selection={selectedSlot}
        allTapes={allTapes}
        onClose={() => setSelectedSlot(null)}
        onTapeNavigate={(tape) => setSelectedSlot({ kind: "tape", tape })}
      />
    </>
  );
}
