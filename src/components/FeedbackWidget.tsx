"use client";

import { useState } from "react";
import { MessageSquare, X, Send, Loader2, CheckCircle, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!message.trim()) { setError("Please write a message."); return; }
    setLoading(true); setError("");

    const { error } = await supabase.from("feedback").insert({
      rating: rating || null,
      message: message.trim(),
      email: email.trim() || null,
      page: typeof window !== "undefined" ? window.location.pathname : null,
      created_at: new Date().toISOString(),
    });

    if (error) {
      setError("Failed to send. Please try again.");
    } else {
      setDone(true);
      setTimeout(() => {
        setOpen(false);
        setDone(false);
        setRating(0);
        setMessage("");
        setEmail("");
      }, 2500);
    }
    setLoading(false);
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 text-sm font-semibold px-4 py-3 rounded-2xl shadow-2xl transition-all"
        style={{ background: "hsl(222,40%,12%)", color: "white", border: "1px solid hsl(222,35%,20%)", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.4)"; e.currentTarget.style.background = "hsl(222,40%,14%)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "hsl(222,35%,20%)"; e.currentTarget.style.background = "hsl(222,40%,12%)"; }}
      >
        <MessageSquare className="w-4 h-4" style={{ color: "#34d399" }} />
        Feedback
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end p-4 sm:p-6"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div
            className="w-full sm:w-[360px] rounded-2xl shadow-2xl"
            style={{ background: "hsl(222,40%,9%)", border: "1px solid hsl(222,35%,18%)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4" style={{ borderBottom: "1px solid hsl(222,35%,14%)" }}>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" style={{ color: "#34d399" }} />
                <span className="font-semibold text-white text-sm">Share your feedback</span>
              </div>
              <button onClick={() => setOpen(false)}
                style={{ color: "hsl(215,20%,55%)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "hsl(215,20%,55%)")}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {done ? (
              <div className="flex flex-col items-center gap-3 py-10 px-5 text-center">
                <CheckCircle className="w-10 h-10" style={{ color: "#34d399" }} />
                <p className="font-semibold text-white">Thank you!</p>
                <p className="text-sm" style={{ color: "hsl(215,20%,55%)" }}>Your feedback helps us improve ForgeCost.</p>
              </div>
            ) : (
              <div className="p-5 space-y-4">
                {/* Star rating */}
                <div>
                  <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "hsl(215,20%,55%)" }}>
                    How&apos;s your experience?
                  </p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                      >
                        <Star
                          className="w-7 h-7 transition-all"
                          style={{
                            color: star <= (hoveredRating || rating) ? "#fbbf24" : "hsl(222,35%,22%)",
                            fill: star <= (hoveredRating || rating) ? "#fbbf24" : "transparent",
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-1.5" style={{ color: "hsl(215,20%,55%)" }}>
                    Your message <span style={{ color: "#34d399" }}>*</span>
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="What's working well? What could be better?"
                    rows={3}
                    className="w-full rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none transition-all"
                    style={{ background: "hsl(222,35%,12%)", border: "1px solid hsl(222,35%,18%)", color: "white" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#10b981")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "hsl(222,35%,18%)")}
                  />
                </div>

                {/* Email (optional) */}
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-1.5" style={{ color: "hsl(215,20%,55%)" }}>
                    Email <span style={{ color: "hsl(215,20%,40%)" }}>(optional — for follow-up)</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none transition-all"
                    style={{ background: "hsl(222,35%,12%)", border: "1px solid hsl(222,35%,18%)", color: "white" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#10b981")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "hsl(222,35%,18%)")}
                  />
                </div>

                {error && (
                  <p className="text-xs px-3 py-2 rounded-lg"
                    style={{ color: "#f87171", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)" }}>
                    {error}
                  </p>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={loading || !message.trim()}
                  className="w-full flex items-center justify-center gap-2 text-sm font-bold py-3 rounded-xl transition-all disabled:opacity-40"
                  style={{ background: "#10b981", color: "white" }}
                  onMouseEnter={(e) => !loading && (e.currentTarget.style.background = "#059669")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#10b981")}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> Send feedback</>}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}