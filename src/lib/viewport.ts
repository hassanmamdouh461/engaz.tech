import type { Viewport } from "next";

export const pageViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Matches the void colour the page frame floats on, so mobile browser chrome
  // continues the design instead of cutting a dark band above it.
  themeColor: "#d0d0d0",
  // Lets the fixed header sit under the notch and read env(safe-area-inset-*).
  viewportFit: "cover",
};
