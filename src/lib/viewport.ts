import type { Viewport } from "next";

export const pageViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#070a13",
  // Lets the fixed header sit under the notch and read env(safe-area-inset-*).
  viewportFit: "cover",
};
