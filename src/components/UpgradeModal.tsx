"use client";

import { useState } from "react";
import { X, Zap, Check, Loader2, Crown } from "lucide-react";

interface UpgradeModalProps {
  onClose: () => void;
  userId: string;
  userEmail: string;
  userName?: string;
  reason?: "quotes" | "templates" | "history" | "branding";
}

const REASON_TEXT = {
  quotes: "You've used all 5 free quotes.",
  templates: "You've reached the 3 template limit.",
  history: "Upgrade to see your full quote history.",
  branding: "Custom PDF branding is a Pro feature.",
};

const PRO_FEATURES = [
  "Unlimited PDF quote downloads",
  "Unlimited saved templates",
  "Full quote history",
  "Custom branding on PDFs (logo + colors)",
  "CSV export of materials",
  "Priority support",
];

export default function UpgradeModal({
  onClose,
  userId,
  userEmail,
  userName,
  reason = "quotes",
}: UpgradeModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpgrade() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/dodo/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, userEmail, userName }),
      });

      const data = await res.json();

      if (!res.ok || !data.checkout_url) {
        throw new Error(data.error ?? "Failed to create checkout");
      }

      // Redirect to Dodo hosted checkout
      window.location.href = data.checkout_url;
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8 shadow-2xl"
        style={{ border: "1px solid rgba(16,185,129,0.25)", background: "hsl(222,40%,9%)" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(16,185,129,0.15)" }}>
              <Crown className="w-5 h-5" style={{ color: "#34d399" }} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Upgrade to Pro</h2>
              <p className="text-sm" style={{ color: "#34d399" }}>
                {REASON_TEXT[reason]}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ color: "hsl(215,20%,55%)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "hsl(215,20%,55%)")}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pricing */}
        <div className="rounded-xl p-5 mb-6"
          style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.2)" }}
        >
          <div className="flex items-end gap-2 mb-1">
            <span className="text-4xl font-black text-white">$12</span>
            <span className="text-sm mb-2" style={{ color: "hsl(215,20%,55%)" }}>/month</span>
          </div>
          <p className="text-xs" style={{ color: "hsl(215,20%,55%)" }}>
            Cancel anytime. No long-term commitment.
          </p>
        </div>

        {/* Features list */}
        <div className="space-y-3 mb-6">
          {PRO_FEATURES.map((f) => (
            <div key={f} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(16,185,129,0.2)" }}>
                <Check className="w-3 h-3" style={{ color: "#34d399" }} />
              </div>
              <span className="text-sm text-white">{f}</span>
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm px-3 py-2 rounded-lg mb-4"
            style={{ color: "#f87171", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)" }}
          >
            {error}
          </p>
        )}

        {/* CTA */}
        <button
          onClick={handleUpgrade}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 font-bold py-4 rounded-xl transition-all disabled:opacity-50"
          style={{ background: "#10b981", color: "white", boxShadow: "0 8px 24px rgba(16,185,129,0.25)" }}
          onMouseEnter={(e) => !loading && (e.currentTarget.style.background = "#059669")}
          onMouseLeave={(e) => !loading && (e.currentTarget.style.background = "#10b981")}
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Redirecting to checkout…</>
          ) : (
            <><Zap className="w-4 h-4" /> Upgrade to Pro — $12/mo</>
          )}
        </button>

        <p className="text-center text-xs mt-4" style={{ color: "hsl(215,20%,45%)" }}>
          Powered by Dodo Payments · Secure checkout
        </p>
      </div>
    </div>
  );
}