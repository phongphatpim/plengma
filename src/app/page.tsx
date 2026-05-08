export default function HomePage() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center gap-6 p-8">
      <div className="text-center">
        <p
          className="text-xs tracking-widest uppercase mb-4"
          style={{ fontFamily: "var(--font-mono)", color: "var(--mint)" }}
        >
          ● COMING SOON
        </p>
        <h1
          className="text-7xl font-extrabold mb-3"
          style={{
            fontFamily: "var(--font-display)",
            background:
              "linear-gradient(135deg, var(--gold) 0%, var(--magenta) 50%, var(--periwinkle) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          เพลงมา
        </h1>
        <p
          className="text-lg"
          style={{ fontFamily: "var(--font-thai)", color: "rgba(244,239,230,0.7)" }}
        >
          แผงเทปเพลงไทย AI คัดสรร — เร็วๆ นี้
        </p>
      </div>
      <div
        className="text-xs tracking-widest"
        style={{ fontFamily: "var(--font-mono)", color: "var(--muted)" }}
      >
        www.plengma.com
      </div>
    </main>
  );
}
