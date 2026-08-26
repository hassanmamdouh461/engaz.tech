export function BackgroundDecor() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-base-950" />
      <div className="absolute inset-0 bg-grid-faint [background-size:64px_64px] opacity-60" />

      {/*
        Drifting auras as plain divs rather than filtered SVG ellipses. A transform
        animation inside an SVG that carries a filter cannot be handed to the
        compositor, so it ran on the main thread every frame; CSS blur on a div can.
        will-change keeps each orb on its own layer for the whole loop.
      */}
      <div
        className="animate-drift-a absolute left-[-10%] top-[-10%] h-[60vmax] w-[60vmax] rounded-full bg-[radial-gradient(circle,rgba(0,240,255,0.18),transparent_70%)] blur-[80px] will-change-transform"
      />
      <div
        className="animate-drift-b absolute right-[-15%] top-[20%] h-[65vmax] w-[65vmax] rounded-full bg-[radial-gradient(circle,rgba(2,132,199,0.20),transparent_70%)] blur-[90px] will-change-transform"
      />
      <div
        className="animate-drift-c absolute bottom-[-15%] left-[20%] h-[55vmax] w-[55vmax] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.14),transparent_70%)] blur-[85px] will-change-transform"
      />

      <div className="absolute inset-0 noise-overlay opacity-[0.035] mix-blend-soft-light" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-base-950/40 to-base-950" />
    </div>
  );
}
