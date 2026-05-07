export default function PreloaderShell() {
  return (
    <div
      id="preloader-shell"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "var(--background)",
        zIndex: 99998,
        display: "block",
        pointerEvents: "auto",
        transition: "opacity 0.6s ease, transform 0.85s cubic-bezier(0.85, 0, 0.15, 1)",
      }}
    />
  );
}
