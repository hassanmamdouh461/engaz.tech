/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Set NEXT_DIST_DIR to build into a private directory. Concurrent builds in the
  // same checkout otherwise overwrite each other's intermediate files and fail.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // A stray lockfile higher up the drive otherwise makes Turbopack guess the
  // workspace root and warn about it on every build.
  turbopack: { root: __dirname },
};

module.exports = nextConfig;
