import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevents clickjacking — stops your site being embedded in iframes
          { key: "X-Frame-Options", value: "SAMEORIGIN" },

          // Stops browsers guessing content types (MIME sniffing attacks)
          { key: "X-Content-Type-Options", value: "nosniff" },

          // Controls how much referrer info is sent when navigating away
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },

          // Disables browser features you don't use
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },

          // Content Security Policy — prevents XSS attacks
          // Allows: self, Supabase, Dodo Payments, Vercel Analytics, Google Fonts
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Scripts: self + inline (needed for Next.js) + Vercel analytics
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://cdn.dodopayments.com",
              // Styles: self + inline (needed for Tailwind)
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Fonts
              "font-src 'self' https://fonts.gstatic.com data:",
              // Images: self + data URIs (for PDF logo previews) + Supabase storage
              "img-src 'self' data: blob: https://*.supabase.co",
              // API calls your app makes
              "connect-src 'self' https://*.supabase.co https://api.dodopayments.com https://api.resend.com https://va.vercel-scripts.com",
              // Frames: Dodo Payments checkout opens in a frame
              "frame-src 'self' https://checkout.dodopayments.com",
              // Workers: service worker
              "worker-src 'self' blob:",
              // Manifests
              "manifest-src 'self'",
            ].join("; "),
          },

          // Cross-Origin policies
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
          { key: "Cross-Origin-Resource-Policy", value: "cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;