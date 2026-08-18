import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    // Vercel Blob serves each store from a store-specific subdomain
    // (e.g. ca9gympxcgdcqwjd.public.blob.vercel-storage.com) — wildcarded
    // so re-creating the store (as happened once already) doesn't break this.
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  async headers() {
    return [
      {
        // Firebase's signInWithPopup needs to check the popup window's
        // closed state from the opener — the strict default COOP policy
        // blocks that check (console warning, and can break the flow in
        // some browsers).
        source: "/:path*",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
        ],
      },
    ];
  },
};

export default nextConfig;
