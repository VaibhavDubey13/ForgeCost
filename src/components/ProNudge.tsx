"use client";

import { useState } from "react";
import { Sparkles, X, Zap, FileText, Palette, Mail, Infinity } from "lucide-react";

// ── Inline Pro badge for feature labels ──────────────────────────────────────
export function ProBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded-md ${className}`}
      style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.25)" }}
    >
      <Sparkles className="w-2.5 h-2.5" />
      PRO
    </span>
  );
}

// ── Lock overlay for Pro features ─────────────────────────────────────────────
export function ProLockOverlay({ onUpgrade }: { onUpgrade: () => void }) {
  return (
    <div
      className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-xl cursor-pointer"
      style={{ background: "rgba(6,13,26,0.85)", backdropFilter: "blur(4px)" }}
      onClick={onUpgrade}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.3)" }}
      >
        <Sparkles className="w-5 h-5" style={{ color: "#fbbf24" }} />
      </div>
      <p className="text-sm font-semibold text-white">Pro feature</p>
      <p className="text-xs" style={{ color: "hsl(215,20%,55%)" }}>Upgrade to unlock</p>
    </div>
  );
}

// ── Inline upgrade nudge (shows after hitting free limit) ────────────────────
interface UpgradeNudgeProps {
  reason: "quotes" | "templates" | "branding" | "email";
  onUpgrade: () => void;
  onDismiss?: () => void;
}

const NUDGE_COPY = {
  quotes: {
    icon: <FileText className="w-4 h-4" style={{ color: "#fbbf24" }} />,
    title: "You've used all 5 free quotes",
    desc: "Upgrade to Pro for unlimited quotes, custom PDF branding, and email quotes to clients.",
  },
  templates: {
    icon: <Infinity className="w-4 h-4" style={{ color: "#fbbf24" }} />,
    title: "Template limit reached",
    desc: "Free plan includes 3 saved templates. Upgrade to Pro for unlimited templates.",
  },
  branding: {
    icon: <Palette className="w-4 h-4" style={{ color: "#fbbf24" }} />,
    title: "Custom branding is a Pro feature",
    desc: "Add your logo and brand colors to every PDF quote. Clients will think you paid a designer.",
  },
  email: {
    icon: <Mail className="w-4 h-4" style={{ color: "#fbbf24" }} />,
    title: "Email quotes is a Pro feature",
    desc: "Send professional PDF quotes directly to your client's inbox without leaving ForgeCost.",
  },
};

export function UpgradeNudge({ reason, onUpgrade, onDismiss }: UpgradeNudgeProps) {
  const copy = NUDGE_COPY[reason];

  return (
    <div
      className="rounded-xl p-4 flex items-start gap-3 relative"
      style={{
        background: "rgba(251,191,36,0.06)",
        border: "1px solid rgba(251,191,36,0.2)",
        animation: "fadeIn 0.3s ease",
      }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: "rgba(251,191,36,0.12)" }}
      >
        {copy.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white mb-0.5">{copy.title}</p>
        <p className="text-xs leading-relaxed mb-3" style={{ color: "hsl(215,20%,60%)" }}>{copy.desc}</p>
        <button
          onClick={onUpgrade}
          className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
          style={{ background: "#fbbf24", color: "#111" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#f59e0b")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#fbbf24")}
        >
          <Zap className="w-3 h-3" /> Upgrade to Pro
        </button>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 transition-colors"
          style={{ color: "hsl(215,20%,35%)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "hsl(215,20%,60%)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "hsl(215,20%,35%)")}
        >
          <X className="w-4 h-4" />
        </button>
      )}
      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(-6px);} to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}

// ── Persistent Pro banner (shows after quote #3, stays subtle) ───────────────
interface ProBannerProps {
  quotesUsed: number;
  quotesLimit: number;
  onUpgrade: () => void;
}

export function ProBanner({ quotesUsed, quotesLimit, onUpgrade }: ProBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const remaining = quotesLimit - quotesUsed;

  // Only show when 2 or fewer quotes remain
  if (dismissed || remaining > 2 || quotesUsed === 0) return null;

  return (
    <div
      className="flex items-center gap-3 px-4 py-2.5 text-sm"
      style={{
        background: "rgba(251,191,36,0.07)",
        borderBottom: "1px solid rgba(251,191,36,0.15)",
        animation: "slideDown 0.3s ease",
      }}
    >
      <Sparkles className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#fbbf24" }} />
      <span style={{ color: "hsl(215,20%,70%)" }}>
        {remaining === 0
          ? "You've used all your free quotes."
          : `${remaining} free quote${remaining === 1 ? "" : "s"} remaining.`}
        {" "}
      </span>
      <button
        onClick={onUpgrade}
        className="font-semibold transition-colors whitespace-nowrap"
        style={{ color: "#fbbf24" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#f59e0b")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#fbbf24")}
      >
        Upgrade to Pro →
      </button>
      <button
        onClick={() => setDismissed(true)}
        className="ml-auto flex-shrink-0 transition-colors"
        style={{ color: "hsl(215,20%,35%)" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "hsl(215,20%,60%)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "hsl(215,20%,35%)")}
      >
        <X className="w-3.5 h-3.5" />
      </button>
      <style>{`@keyframes slideDown { from { opacity:0; transform:translateY(-8px);} to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}
