"use client";

import { useState } from "react";
import { X, Mail, Loader2, Check } from "lucide-react";
import type { Material } from "@/lib/trades";

interface EmailQuoteModalProps {
  onClose: () => void;
  jobName: string;
  companyName: string;
  trade: string;
  date: string;
  materials: Material[];
  markupPct: number;
  subtotal: number;
  markupAmount: number;
  grandTotal: number;
  notes: string;
  isPro: boolean;
  onUpgradeClick: () => void;
}

export default function EmailQuoteModal({
  onClose, jobName, companyName, trade, date,
  materials, markupPct, subtotal, markupAmount,
  grandTotal, notes, isPro, onUpgradeClick,
}: EmailQuoteModalProps) {
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSend() {
    if (!customerEmail.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/email/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerEmail, customerName, jobName,
          companyName, trade, date, subtotal,
          markupPct, markupAmount, grandTotal,
          materials, notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to send");
      setSent(true);
    } catch (err) {
      console.error(err);
      setError("Failed to send email. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-2xl p-8 shadow-2xl"
        style={{ border: "1px solid rgba(16,185,129,0.25)", background: "hsl(222,40%,9%)" }}>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(16,185,129,0.15)" }}>
              <Mail className="w-5 h-5" style={{ color: "#34d399" }} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Email Quote</h2>
              <p className="text-sm" style={{ color: "hsl(215,20%,55%)" }}>
                Send this quote to your customer
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

        {/* Pro gate */}
        {!isPro ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)" }}>
              <Mail className="w-7 h-7" style={{ color: "#fbbf24" }} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Pro Feature</h3>
            <p className="text-sm mb-6" style={{ color: "hsl(215,20%,55%)" }}>
              Email quotes directly to customers is a ForgeCost Pro feature.
            </p>
            <button onClick={onUpgradeClick}
              className="w-full font-bold py-3 rounded-xl transition-all"
              style={{ background: "#10b981", color: "white" }}>
              Upgrade to Pro — $15/mo
            </button>
          </div>
        ) : sent ? (
          /* Success state */
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(16,185,129,0.15)" }}>
              <Check className="w-7 h-7" style={{ color: "#34d399" }} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Quote Sent!</h3>
            <p className="text-sm mb-6" style={{ color: "hsl(215,20%,55%)" }}>
              Your quote has been emailed to <strong className="text-white">{customerEmail}</strong>
            </p>
            <button onClick={onClose}
              className="w-full font-bold py-3 rounded-xl"
              style={{ background: "#10b981", color: "white" }}>
              Done
            </button>
          </div>
        ) : (
          /* Form */
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: "hsl(215,20%,55%)" }}>
                Customer Email *
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="customer@email.com"
                className="w-full rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-[hsl(215,20%,40%)] focus:outline-none transition-all"
                style={{ background: "hsl(222,35%,12%)", border: "1px solid hsl(222,35%,18%)" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#10b981")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "hsl(222,35%,18%)")}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: "hsl(215,20%,55%)" }}>
                Customer Name (optional)
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="John Smith"
                className="w-full rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-[hsl(215,20%,40%)] focus:outline-none transition-all"
                style={{ background: "hsl(222,35%,12%)", border: "1px solid hsl(222,35%,18%)" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#10b981")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "hsl(222,35%,18%)")}
              />
            </div>

            {/* Quote summary */}
            <div className="rounded-xl p-4" style={{ background: "hsl(222,35%,12%)", border: "1px solid hsl(222,35%,18%)" }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "hsl(215,20%,55%)" }}>
                Quote Summary
              </p>
              <p className="text-sm font-bold text-white">{jobName || "Untitled Job"}</p>
              <p className="text-xs mt-1" style={{ color: "hsl(215,20%,55%)" }}>{trade} · {date}</p>
              <p className="text-lg font-black mt-2" style={{ color: "#34d399" }}>
                ${grandTotal.toFixed(2)}
              </p>
            </div>

            {error && (
              <p className="text-sm px-3 py-2 rounded-lg"
                style={{ color: "#f87171", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)" }}>
                {error}
              </p>
            )}

            <button
              onClick={handleSend}
              disabled={loading || !customerEmail.trim() || grandTotal === 0}
              className="w-full flex items-center justify-center gap-2 font-bold py-4 rounded-xl transition-all disabled:opacity-40"
              style={{ background: "#10b981", color: "white" }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.background = "#059669")}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.background = "#10b981")}
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                : <><Mail className="w-4 h-4" /> Send Quote</>
              }
            </button>
            {grandTotal === 0 && (
              <p className="text-xs text-center" style={{ color: "hsl(215,20%,55%)" }}>
                Add quantities to materials before sending
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}