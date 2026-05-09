export default function Loading() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        background: "var(--ink)",
      }}
    >
      <div
        className="plengma-loading-spinner"
        aria-hidden
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          border: "3px solid rgba(233,185,73,0.2)",
          borderTopColor: "var(--gold)",
          animation: "plengma-spin 0.85s linear infinite",
        }}
      />
      <p
        style={{
          fontFamily: "var(--font-thai)",
          fontSize: 15,
          color: "rgba(244,239,230,0.65)",
        }}
      >
        กำลังโหลดแผง...
      </p>
      <style>{`
        @keyframes plengma-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
