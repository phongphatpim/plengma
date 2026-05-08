"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const path = usePathname();

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
        {/* Logo */}
        <Link
          href="/"
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
          <span
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, var(--gold), var(--magenta) 50%, var(--periwinkle))",
              display: "inline-block",
              position: "relative",
              flexShrink: 0,
            }}
          />
          เพลงมา
        </Link>

        {/* Nav links */}
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {[
            { href: "/shelf", label: "★ แผงเดือนนี้" },
            { href: "/about", label: "เกี่ยวกับ" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                fontFamily: "var(--font-thai)",
                fontWeight: 500,
                fontSize: 14,
                color:
                  path === href
                    ? "var(--gold)"
                    : "rgba(244,239,230,0.7)",
                background:
                  path === href
                    ? "rgba(233,185,73,0.1)"
                    : "transparent",
                padding: "8px 14px",
                borderRadius: 100,
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
            >
              {label}
            </Link>
          ))}

          <Link
            href="/submit"
            style={{
              fontFamily: "var(--font-thai)",
              fontWeight: 700,
              fontSize: 14,
              background: "var(--gold)",
              color: "var(--ink)",
              padding: "10px 20px",
              borderRadius: 100,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              transition: "all 0.2s ease",
            }}
          >
            + ส่งเพลงขึ้นแผง
          </Link>
        </div>
      </div>
    </nav>
  );
}
