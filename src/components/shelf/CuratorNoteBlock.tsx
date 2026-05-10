import type { CSSProperties } from "react";

const SIGNATURE = "ทีมเพลงมา · พฤษภาคม 2569";

type Props = { text: string };

const wrap: CSSProperties = {
  borderLeft: "3px solid #E9B949",
  background: "rgba(233, 185, 73, 0.06)",
  padding: 24,
  borderRadius: "0 12px 12px 0",
  marginBottom: 20,
  animation: "curatorNoteIn 0.5s ease-out both",
};

export default function CuratorNoteBlock({ text }: Props) {
  const body = text.trim();
  if (!body) return null;

  return (
    <div style={wrap}>
      <style>{`
        @keyframes curatorNoteIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.2em",
          textTransform: "uppercase" as const,
          color: "#E9B949",
          marginBottom: 12,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span aria-hidden style={{ fontSize: 12 }}>
          ✦
        </span>
        บันทึกจากทีมคัดสรร
      </div>
      <div
        style={{
          height: 1,
          background: "rgba(233,185,73,0.25)",
          marginBottom: 16,
        }}
      />
      <p
        style={{
          fontFamily: "var(--font-thai), 'Bai Jamjuree', serif",
          fontSize: 15,
          fontStyle: "italic",
          lineHeight: 1.7,
          color: "rgba(244,239,230,0.88)",
          margin: "0 0 16px",
        }}
      >
        {body}
      </p>
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.08em",
          color: "rgba(244,239,230,0.45)",
          margin: 0,
        }}
      >
        — {SIGNATURE}
      </p>
    </div>
  );
}
