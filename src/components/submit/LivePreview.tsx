"use client";

import { TAPE_GRADIENTS } from "@/components/shelf/TapeSlot";
import type { TapeGenre } from "@/lib/types";
import type { SubmitPreviewState } from "./SubmitForm";
import type { CSSProperties } from "react";

interface LivePreviewProps {
  data: SubmitPreviewState;
}

const genreBgMap: Record<TapeGenre, number> = {
  "DREAM POP": 5,
  CITYPOP: 2,
  LOFI: 6,
  "INDIE POP": 12,
  FOLK: 9,
  "R&B": 15,
  ELECTRONIC: 4,
  AMBIENT: 8,
  "HIP-HOP": 10,
  "POP PUNK": 1,
  SYNTHWAVE: 11,
  JAZZ: 7,
  DARKWAVE: 13,
  "POST-ROCK": 14,
  "BEDROOM POP": 3,
  อื่นๆ: 6,
};

export default function LivePreview({ data }: LivePreviewProps) {
  const coverBg = genreBgMap[data.form.genre] ?? 6;
  const coverStyle: CSSProperties = data.coverMode === "upload" && data.coverPreviewUrl
    ? {
        backgroundImage: `url("${data.coverPreviewUrl}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {
        background: TAPE_GRADIENTS[coverBg],
      };

  return (
    <aside
      style={{
        position: "sticky",
        top: 24,
        border: "1px solid rgba(244,239,230,0.12)",
        borderRadius: 20,
        padding: 18,
        background: "rgba(26,16,48,0.7)",
        backdropFilter: "blur(10px)",
      }}
    >
      <h3 style={{ fontFamily: "var(--font-thai)", marginBottom: 12 }}>Live Preview</h3>

      <div
        style={{
          borderRadius: 14,
          overflow: "hidden",
          border: "1px solid rgba(244,239,230,0.15)",
          marginBottom: 14,
        }}
      >
        <div style={{ ...coverStyle, minHeight: 180, padding: 14, color: "#fff", position: "relative" }}>
          <div style={{ fontSize: 11, opacity: 0.9 }}>★ ตำแหน่งโดยประมาณ G-14</div>
          <div style={{ position: "absolute", left: 14, bottom: 14, right: 14 }}>
            <div style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.1 }}>{data.form.title || "ชื่อเพลงของคุณ"}</div>
            <div style={{ fontSize: 12, opacity: 0.92 }}>
              {data.form.artist || "ชื่อศิลปิน"} · {data.form.genre || "-"} · {data.form.duration || "--:--"}
            </div>
          </div>
        </div>
      </div>

      <div style={{ border: "1px solid rgba(244,239,230,0.14)", borderRadius: 12, padding: 12, fontSize: 14 }}>
        <InfoRow label="ชื่อ" value={data.form.title || "-"} />
        <InfoRow label="ศิลปิน" value={data.form.artist || "-"} />
        <InfoRow label="แนวเพลง" value={data.form.genre || "-"} />
        <InfoRow label="ความยาว" value={data.form.duration || "-"} />
      </div>
    </aside>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "70px 1fr", marginBottom: 8 }}>
      <span style={{ color: "rgba(244,239,230,0.65)" }}>{label}</span>
      <strong style={{ color: "rgba(244,239,230,0.95)" }}>{value}</strong>
    </div>
  );
}
