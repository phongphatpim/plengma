import { ImageResponse } from "next/og";
import { getTapeByCatalogIdAsync } from "@/lib/tape-lookup";
import { formatShelfPosition } from "@/lib/types";

export const size = { width: 1200, height: 630 };

export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tape = await getTapeByCatalogIdAsync(id);
  const pos = tape ? formatShelfPosition(tape.position.row, tape.position.col) : "—";

  const title = tape?.title ?? "เพลงมา";
  const artist = tape?.artist ?? "PlengMa";
  const meta = tape ? `${tape.genre} · ${tape.duration} · ${tape.id} · ${pos}` : "แผงเทปเพลงไทยคัดสรร";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0E0820",
          padding: 56,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: 22,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#E9B949",
            }}
          >
            PlengMa · เพลงมา
          </div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: "#F4EFE6",
              lineHeight: 1.15,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: 32, color: "rgba(244,239,230,0.85)" }}>{artist}</div>
          <div style={{ fontSize: 22, color: "rgba(244,239,230,0.55)" }}>{meta}</div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 20,
            color: "#6FE3C8",
          }}
        >
          <span>plengma.com/shelf</span>
          <span style={{ color: "#E85D8C" }}>Neo-Retro Cassette</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
