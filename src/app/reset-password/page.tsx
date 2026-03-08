"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Lock, Loader2, CheckCircle, Calculator } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [done, setDone]         = useState(false);
  const [ready, setReady]       = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        setError("This reset link is invalid or has expired. Please request a new one.");
      }
      setReady(true);
    });
  }, []);

  async function handleReset() {
    if (!password) { setError("Please enter a new password."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setError("Passwords don't match."); return; }
    setLoading(true); setError("");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { setError(error.message); setLoading(false); return; }
    setDone(true);
    setTimeout(() => router.push("/app"), 2500);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "hsl(222,47%,6%)", color: "hsl(210,40%,96%)" }}>
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: "linear-gradient(hsl(160,84%,39%) 1px,transparent 1px),linear-gradient(90deg,hsl(160,84%,39%) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div style={{ width: 36, height: 36, borderRadius: 12, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Calculator className="w-5 h-5" style={{ color: "#34d399" }} />
          </div>
          <span className="text-xl font-bold">Forge<span style={{ color: "#34d399" }}>Cost</span></span>
        </div>

        <div className="rounded-2xl p-8 shadow-2xl"
          style={{ border: "1px solid hsl(222,35%,18%)", background: "hsl(222,40%,9%)" }}>

          {done ? (
            <div className="text-center py-4">
              <CheckCircle className="w-14 h-14 mx-auto mb-4" style={{ color: "#34d399" }} />
              <h2 className="text-xl font-bold text-white mb-2">Password updated!</h2>
              <p className="text-sm" style={{ color: "hsl(215,20%,55%)" }}>Redirecting you to the app…</p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-white mb-1">Set new password</h2>
              <p className="text-sm mb-6" style={{ color: "hsl(215,20%,55%)" }}>
                Choose a strong password for your ForgeCost account.
              </p>

              <div className="space-y-4">
                {["New Password", "Confirm Password"].map((label, i) => (
                  <div key={label}>
                    <label className="block text-xs uppercase tracking-widest mb-1.5"
                      style={{ color: "hsl(215,20%,55%)" }}>{label}</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                        style={{ color: "hsl(215,20%,55%)" }} />
                      <input
                        type="password"
                        value={i === 0 ? password : confirm}
                        onChange={(e) => i === 0 ? setPassword(e.target.value) : setConfirm(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleReset()}
                        placeholder="••••••••"
                        autoFocus={i === 0}
                        className="w-full rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-[hsl(215,20%,40%)] focus:outline-none transition-all"
                        style={{ background: "hsl(222,35%,12%)", border: "1px solid hsl(222,35%,18%)" }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "#10b981")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "hsl(222,35%,18%)")}
                      />
                    </div>
                  </div>
                ))}

                {error && (
                  <p className="text-sm px-3 py-2 rounded-lg"
                    style={{ color: "#f87171", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)" }}>
                    {error}
                  </p>
                )}

                <button onClick={handleReset} disabled={loading || !ready}
                  className="w-full flex items-center justify-center gap-2 font-bold py-3 rounded-xl transition-all disabled:opacity-50"
                  style={{ background: "#10b981", color: "white" }}
                  onMouseEnter={(e) => !loading && (e.currentTarget.style.background = "#059669")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#10b981")}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Password"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}