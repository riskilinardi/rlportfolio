// The glow behind the page. Static on purpose: animating large blurred layers repaints every frame.
export function AuroraBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden pointer-events-none -z-10"
    >
      <div
        className="absolute w-[800px] h-[800px] rounded-full blur-[120px] opacity-30 -top-48 -left-48"
        style={{ background: "radial-gradient(circle, #1f6feb 0%, transparent 70%)" }}
      />

      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-[100px] opacity-20 -bottom-24 -right-24"
        style={{ background: "radial-gradient(circle, #58a6ff 0%, transparent 70%)" }}
      />

      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-[90px] opacity-15 top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ background: "radial-gradient(circle, #79c0ff 0%, transparent 70%)" }}
      />

      <div className="grain-overlay" />
      <div className="absolute inset-0 grid-overlay" />
    </div>
  );
}
