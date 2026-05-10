import type { CSSProperties } from "react";
import type { Tape, AIApproach } from "@/lib/types";
import { parseToolLabels } from "@/lib/parse-tools";

type Variant = "compact" | "full" | "inline";

const base: CSSProperties = {
  background: "rgba(111, 227, 200, 0.12)",
  border: "1px solid #6FE3C8",
  fontFamily: "var(--font-mono)",
  textTransform: "uppercase" as const,
  letterSpacing: "0.12em",
  color: "rgba(244,239,230,0.92)",
};

function resolveApproach(tape: Tape): AIApproach {
  return tape.transparency?.approach ?? "hybrid";
}

function approachShort(a: AIApproach): string {
  switch (a) {
    case "full-ai":
      return "AI";
    case "ai-vocal":
      return "VOCAL";
    case "ai-instrumental":
      return "INST";
    default:
      return "HYBRID";
  }
}

function approachLabelTh(a: AIApproach): string {
  switch (a) {
    case "full-ai":
      return "สร้างด้วย AI เป็นหลัก";
    case "ai-vocal":
      return "เนื้อร้องมนุษย์ · ร้อง/ดนตรี AI";
    case "ai-instrumental":
      return "ดนตรี AI · ร้องมนุษย์";
    default:
      return "ผสมมนุษย์และ AI";
  }
}

export default function TransparencyBadge({ tape, variant }: { tape: Tape; variant: Variant }) {
  const approach = resolveApproach(tape);
  const tools = tape.transparency?.tools?.length
    ? tape.transparency.tools
    : parseToolLabels(tape.tools);
  const count = tools.length;
  const human = tape.transparency?.humanInput?.trim();

  if (variant === "compact") {
    const short = approachShort(approach);
    const tip = [approachLabelTh(approach), count ? `${count} เครื่องมือ` : null, human || null]
      .filter(Boolean)
      .join(" · ");
    return (
      <span
        title={tip}
        style={{
          ...base,
          display: "inline-flex",
          alignItems: "center",
          gap: 3,
          padding: "2px 5px",
          borderRadius: 4,
          fontSize: 9,
          lineHeight: 1,
          pointerEvents: "auto",
        }}
      >
        <span aria-hidden>⚙</span>
        <span>{short}</span>
      </span>
    );
  }

  if (variant === "inline") {
    return (
      <span
        style={{
          ...base,
          display: "inline",
          padding: "2px 8px",
          borderRadius: 999,
          fontSize: 9,
        }}
      >
        ⚙ {approachShort(approach)}
        {count ? ` · ${count}` : ""}
      </span>
    );
  }

  return (
    <div
      style={{
        borderTop: "1px solid rgba(244,239,230,0.12)",
        paddingTop: 16,
        marginTop: 4,
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.2em",
          textTransform: "uppercase" as const,
          color: "rgba(244,239,230,0.45)",
          marginBottom: 10,
        }}
      >
        ความโปร่งใส
      </div>
      <p style={{ fontFamily: "var(--font-thai)", fontSize: 14, color: "rgba(244,239,230,0.85)", margin: "0 0 8px", lineHeight: 1.6 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(111,227,200,0.95)" }}>Approach: </span>
        {approachLabelTh(approach)}
      </p>
      {tools.length > 0 ? (
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "rgba(200,208,255,0.95)", margin: "0 0 8px", lineHeight: 1.5 }}>
          <span style={{ color: "rgba(244,239,230,0.5)" }}>Tools: </span>
          {tools.join(" · ")}
        </p>
      ) : (
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(244,239,230,0.45)", margin: "0 0 8px" }}>Tools: —</p>
      )}
      {human ? (
        <p style={{ fontFamily: "var(--font-thai)", fontSize: 13, color: "rgba(244,239,230,0.72)", margin: 0, lineHeight: 1.65 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(111,227,200,0.85)" }}>Human input: </span>“{human}”
        </p>
      ) : null}
    </div>
  );
}
