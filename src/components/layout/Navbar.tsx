"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type CSSProperties } from "react";

const LINKS = [
  { href: "/shelf", label: "แผงเดือนนี้" },
  { href: "/about", label: "เกี่ยวกับ" },
] as const;

export default function Navbar() {
  const path = usePathname();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [path]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const isShelfActive = mounted && path === "/shelf";
  const isAboutActive = mounted && path === "/about";
  const isSubmitActive = mounted && path === "/submit";

  const linkStyle = (active: boolean): CSSProperties => ({
    fontFamily: "var(--font-thai)",
    fontWeight: 500,
    fontSize: 14,
    color: active ? "var(--gold)" : "rgba(244,239,230,0.7)",
    background: active ? "rgba(233,185,73,0.12)" : "transparent",
    padding: "8px 14px",
    borderRadius: 100,
    textDecoration: "none",
    transition: "all 0.2s ease",
  });

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        background: "rgba(14,8,32,0.85)",
        borderBottom: "1px solid rgba(244,239,230,0.08)",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        <Link
          href="/shelf"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontFamily: "var(--font-thai)",
            fontWeight: 800,
            fontSize: 20,
            color: "var(--paper)",
            textDecoration: "none",
          }}
        >
          <span className="plengma-logo-mark" aria-hidden />
          เพลงมา
        </Link>

        {/* Desktop nav */}
        <div className="nav-desktop" style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {LINKS.map(({ href, label }) => (
            <Link key={href} href={href} style={linkStyle(href === "/shelf" ? isShelfActive : isAboutActive)}>
              {href === "/shelf" ? `★ ${label}` : label}
            </Link>
          ))}

          <Link
            href="/submit"
            style={{
              fontFamily: "var(--font-thai)",
              fontWeight: 700,
              fontSize: 14,
              marginLeft: 6,
              background: isSubmitActive ? "rgba(233,185,73,0.2)" : "var(--gold)",
              color: isSubmitActive ? "var(--gold)" : "var(--ink)",
              border: isSubmitActive ? "1px solid var(--gold)" : "1px solid transparent",
              padding: "10px 18px",
              borderRadius: 100,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              transition: "all 0.2s ease",
            }}
          >
            + ส่งเพลง
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="nav-mobile-toggle"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "ปิดเมนู" : "เปิดเมนู"}
          onClick={() => setMenuOpen((o) => !o)}
          style={{
            display: "none",
            background: "transparent",
            border: "1px solid rgba(244,239,230,0.2)",
            color: "var(--paper)",
            fontFamily: "var(--font-mono)",
            fontSize: 18,
            width: 44,
            height: 44,
            borderRadius: 10,
            cursor: "pointer",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 1,
          }}
        >
          ☰
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="nav-mobile-drawer" style={{ position: "fixed", inset: 0, zIndex: 60 }}>
          <button
            type="button"
            aria-label="ปิดเมนู"
            onClick={() => setMenuOpen(false)}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.55)",
              border: "none",
              cursor: "pointer",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              width: "min(320px, 88vw)",
              background: "rgba(14,8,32,0.98)",
              borderLeft: "1px solid rgba(244,239,230,0.1)",
              padding: "24px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              boxShadow: "-8px 0 32px rgba(0,0,0,0.4)",
            }}
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(244,239,230,0.4)", letterSpacing: "0.2em", marginBottom: 8 }}>
              เมนู
            </div>
            {LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                style={{
                  ...linkStyle(href === "/shelf" ? isShelfActive : isAboutActive),
                  padding: "14px 16px",
                  borderRadius: 12,
                  fontSize: 16,
                }}
              >
                {href === "/shelf" ? `★ ${label}` : label}
              </Link>
            ))}
            <Link
              href="/submit"
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "var(--font-thai)",
                fontWeight: 700,
                fontSize: 16,
                marginTop: 12,
                background: isSubmitActive ? "rgba(233,185,73,0.2)" : "var(--gold)",
                color: isSubmitActive ? "var(--gold)" : "var(--ink)",
                border: isSubmitActive ? "1px solid var(--gold)" : "1px solid transparent",
                padding: "14px 18px",
                borderRadius: 12,
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              + ส่งเพลง
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-toggle { display: inline-flex !important; }
        }
      `}</style>
    </nav>
  );
}
