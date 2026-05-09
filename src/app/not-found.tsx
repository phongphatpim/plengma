import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main
        style={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 24px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            letterSpacing: "0.2em",
            color: "rgba(244,239,230,0.4)",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          404
        </p>
        <h1
          style={{
            fontFamily: "var(--font-thai)",
            fontWeight: 800,
            fontSize: "clamp(22px, 4vw, 32px)",
            color: "var(--paper)",
            maxWidth: 420,
            lineHeight: 1.35,
            marginBottom: 32,
          }}
        >
          หาไม่เจอ — เทปหลุดออกจากแผงไปแล้ว
        </h1>
        <Link
          href="/shelf"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "var(--gold)",
            color: "var(--ink)",
            fontFamily: "var(--font-thai)",
            fontWeight: 700,
            fontSize: 15,
            padding: "12px 26px",
            borderRadius: 999,
            textDecoration: "none",
          }}
        >
          กลับแผง
        </Link>
      </main>
    </>
  );
}
