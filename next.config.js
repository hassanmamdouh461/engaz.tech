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
};

module.exports = nextConfig;
