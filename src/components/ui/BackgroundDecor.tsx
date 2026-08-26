export function BackgroundDecor() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-base-950" />
      <div className="absolute inset-0 bg-grid-faint [background-size:64px_64px] opacity-60" />

      {/*
        One static pre-blurred gradient layer instead of three animated blur-filtered
        orbs. A large CSS blur radius forces the compositor to re-rasterize the layer on
        every frame of the drift loop; that per-frame raster dominated Style & Layout in
        the trace. Painting the same look once costs nothing after first paint.
      */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            "radial-gradient(60% 50% at 10% 6%, rgba(0,240,255,0.16), transparent 70%)",
            "radial-gradient(65% 55% at 90% 28%, rgba(2,132,199,0.18), transparent 70%)",
            "radial-gradient(55% 45% at 30% 94%, rgba(56,189,248,0.12), transparent 70%)",
          ].join(","),
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-base-950/40 to-base-950" />
    </div>
  );
}
