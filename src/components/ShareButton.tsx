"use client";

import { useState } from "react";
import { Share2, Copy, Check, X, Twitter, MessageCircle } from "lucide-react";

const SHARE_URL  = "https://forge-cost.vercel.app";
const SHARE_TEXT = "I've been using ForgeCost to calculate material costs and generate PDF quotes in minutes. Free for tradespeople 👇";

interface ShareButtonProps {
  variant?: "icon" | "full"; // icon = small button, full = text + icon
}

export default function ShareButton({ variant = "icon" }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(SHARE_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleNativeShare() {
    if (navigator.share) {
      await navigator.share({ title: "ForgeCost", text: SHARE_TEXT, url: SHARE_URL });
    } else {
      setOpen(true);
    }
  }

  return (
    <>
      {variant === "full" ? (
        <button
          onClick={handleNativeShare}
          className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl transition-all"
          style={{ border: "1px solid hsl(222,35%,18%)", color: "hsl(215,20%,65%)", background: "hsl(222,40%,9%)" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.4)"; e.currentTarget.style.color = "white"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "hsl(222,35%,18%)"; e.currentTarget.style.color = "hsl(215,20%,65%)"; }}
        >
          <Share2 className="w-4 h-4" style={{ color: "#34d399" }} />
          Share ForgeCost
        </button>
      ) : (
        <button
          onClick={handleNativeShare}
          title="Share ForgeCost"
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-all"
          style={{ color: "hsl(215,20%,55%)", background: "hsl(222,40%,9%)", border: "1px solid hsl(222,35%,16%)" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#34d399"; e.currentTarget.style.borderColor = "rgba(16,185,129,0.4)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "hsl(215,20%,55%)"; e.currentTarget.style.borderColor = "hsl(222,35%,16%)"; }}
        >
          <Share2 className="w-3 h-3" />
          <span className="hidden sm:inline">Share</span>
        </button>
      )}

      {/* Fallback share modal (desktop / no native share API) */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="w-full max-w-sm rounded-2xl p-6 shadow-2xl"
            style={{ background: "hsl(222,40%,9%)", border: "1px solid hsl(222,35%,18%)" }}>

            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Share2 className="w-4 h-4" style={{ color: "#34d399" }} />
                Share ForgeCost
              </h3>
              <button onClick={() => setOpen(false)} style={{ color: "hsl(215,20%,55%)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "hsl(215,20%,55%)")}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Share options */}
            <div className="space-y-2 mb-4">
              {/* Twitter / X */}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(SHARE_URL)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all"
                style={{ background: "hsl(222,35%,12%)", border: "1px solid hsl(222,35%,18%)", color: "white" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(16,185,129,0.3)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "hsl(222,35%,18%)")}
              >
                <Twitter className="w-4 h-4" style={{ color: "#34d399" }} />
                Share on X / Twitter
              </a>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/?text=${encodeURIComponent(SHARE_TEXT + " " + SHARE_URL)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all"
                style={{ background: "hsl(222,35%,12%)", border: "1px solid hsl(222,35%,18%)", color: "white" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(16,185,129,0.3)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "hsl(222,35%,18%)")}
              >
                <MessageCircle className="w-4 h-4" style={{ color: "#34d399" }} />
                Share on WhatsApp
              </a>
            </div>

            {/* Copy link */}
            <div className="flex items-center gap-2 p-3 rounded-xl"
              style={{ background: "hsl(222,35%,12%)", border: "1px solid hsl(222,35%,18%)" }}>
              <span className="flex-1 text-sm truncate" style={{ color: "hsl(215,20%,65%)" }}>
                {SHARE_URL}
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all flex-shrink-0"
                style={{ background: copied ? "rgba(16,185,129,0.2)" : "rgba(16,185,129,0.1)", color: "#34d399", border: "1px solid rgba(16,185,129,0.3)" }}
              >
                {copied ? <><Check className="w-3 h-3" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
