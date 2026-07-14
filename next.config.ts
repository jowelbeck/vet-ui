import type { NextConfig } from "next";

// Security headers applied to every route. NOTE: a strict Content-Security-Policy
// is intentionally omitted for now — the app relies heavily on inline styles and
// Next's inline bootstrap scripts, so a CSP needs nonce wiring + testing before
// it can be enabled without breaking the UI. Tracked as a follow-up.
const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self)",
  },
];

const nextConfig: NextConfig = {
  // The AI backend is now reached through the authenticated server route at
  // app/api/ai/[action], which injects the backend key. The old public
  // /backend/* rewrite was removed because it exposed the backend,
  // unauthenticated, through the app's own origin.
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
