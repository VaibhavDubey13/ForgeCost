"use client";

// Auth modal — email/password sign up and sign in + forgot password

import { useState } from "react";
import { signIn, signUp } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { X, Mail, Lock, Loader2, CheckCircle, User, Briefcase, ArrowLeft } from "lucide-react";

interface AuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const PROFESSIONS = [
  "Plumber",
  "Electrician",
  "HVAC Technician",
  "Handyman",
  "Landscaper",
  "Carpenter",
  "Painter",
  "Welder",
  "Tattoo Artist",
  "General Contractor",
  "Other",
];

function InputField({
  icon, type = "text", value, onChange, onKeyDown, placeholder, label,
}: {
  icon: React.ReactNode; type?: string; value: string;
  onChange: (v: string) => void; onKeyDown?: (e: React.KeyboardEvent) => void;
  placeholder: string; label: string;
}) {
  return (
    <div>
      <label className="block text-xs text-[hsl(215,20%,55%)] uppercase tracking-widest mb-1.5">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(215,20%,55%)]">
          {icon}
        </span>
        <input
          type={type} value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown} placeholder={placeholder}
          className="w-full bg-[hsl(222,35%,12%)] border border-[hsl(222,35%,18%)] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-[hsl(215,20%,40%)] focus:outline-none focus:border-[#10b981] transition-all"
        />
      </div>
    </div>
  );
}

export default function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [fullName, setFullName]     = useState("");
  const [profession, setProfession] = useState("");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [success, setSuccess]       = useState("");

  function resetForm() { setError(""); setSuccess(""); }

  async function handleSignIn() {
    if (!email || !password) { setError("Please enter your email and password."); return; }
    setLoading(true); resetForm();
    const { error } = await signIn(email, password);
    if (error) setError(error.message);
    else { onSuccess(); onClose(); }
    setLoading(false);
  }

  async function handleSignUp() {
    if (!email || !password) { setError("Please enter your email and password."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true); resetForm();
    const { error } = await signUp(email, password, {
      full_name: fullName.trim() || undefined,
      profession: profession || undefined,
    });
    if (error) setError(error.message);
    else setSuccess("Account created! Check your email to confirm, then sign in.");
    setLoading(false);
  }

  async function handleForgotPassword() {
    if (!email) { setError("Please enter your email address."); return; }
    setLoading(true); resetForm();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) setError(error.message);
    else setSuccess("Password reset link sent! Check your inbox.");
    setLoading(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "Enter") return;
    if (mode === "signin") handleSignIn();
    else if (mode === "signup") handleSignUp();
    else handleForgotPassword();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(5px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-2xl border border-[hsl(222,35%,18%)] bg-[hsl(222,40%,9%)] p-8 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {mode === "forgot" && (
              <button onClick={() => { setMode("signin"); resetForm(); }}
                className="transition-colors" style={{ color: "hsl(215,20%,55%)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "hsl(215,20%,55%)")}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h2 className="text-xl font-bold text-white">
                {mode === "signin" ? "Welcome back" : mode === "signup" ? "Create account" : "Reset password"}
              </h2>
              <p className="text-sm mt-1" style={{ color: "hsl(215,20%,55%)" }}>
                {mode === "signin" ? "Sign in to access your saved templates"
                  : mode === "signup" ? "Free forever — no credit card needed"
                  : "We'll send you a reset link"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 transition-colors" style={{ color: "hsl(215,20%,55%)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "hsl(215,20%,55%)")}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success */}
        {success ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <CheckCircle className="w-12 h-12" style={{ color: "#34d399" }} />
            <p className="text-sm text-white">{success}</p>
            <button onClick={() => { setSuccess(""); setMode("signin"); }}
              className="text-sm font-medium transition-all" style={{ color: "#10b981" }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
            >
              {mode === "forgot" ? "Back to sign in →" : "Sign in now →"}
            </button>
          </div>

        ) : mode === "forgot" ? (
          <div className="space-y-4">
            <InputField icon={<Mail className="w-4 h-4" />} type="email" value={email}
              onChange={setEmail} onKeyDown={handleKeyDown} placeholder="you@example.com" label="Email" />
            {error && (
              <p className="text-sm px-3 py-2 rounded-lg"
                style={{ color: "#f87171", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)" }}>
                {error}
              </p>
            )}
            <button onClick={handleForgotPassword} disabled={loading}
              className="w-full flex items-center justify-center gap-2 font-bold py-3 rounded-xl transition-all disabled:opacity-50"
              style={{ background: "#10b981", color: "white" }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.background = "#059669")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#10b981")}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Reset Link"}
            </button>
          </div>

        ) : (
          <>
            <div className="space-y-4">
              {mode === "signup" && (
                <>
                  <InputField icon={<User className="w-4 h-4" />} value={fullName}
                    onChange={setFullName} onKeyDown={handleKeyDown}
                    placeholder="John Smith (optional)" label="Full Name" />
                  <div>
                    <label className="block text-xs uppercase tracking-widest mb-1.5"
                      style={{ color: "hsl(215,20%,55%)" }}>
                      Profession <span style={{ color: "hsl(215,20%,38%)" }}>(optional)</span>
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                        style={{ color: "hsl(215,20%,55%)" }} />
                      <select value={profession} onChange={(e) => setProfession(e.target.value)}
                        className="w-full rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none transition-all appearance-none cursor-pointer"
                        style={{
                          background: "hsl(222,35%,12%)", border: "1px solid hsl(222,35%,18%)",
                          color: profession ? "white" : "hsl(215,20%,40%)",
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "#10b981")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "hsl(222,35%,18%)")}
                      >
                        <option value="" disabled style={{ background: "hsl(222,40%,9%)" }}>
                          Select your trade…
                        </option>
                        {PROFESSIONS.map((p) => (
                          <option key={p} value={p} style={{ background: "hsl(222,40%,9%)", color: "white" }}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}

              <InputField icon={<Mail className="w-4 h-4" />} type="email" value={email}
                onChange={setEmail} onKeyDown={handleKeyDown} placeholder="you@example.com" label="Email" />

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs uppercase tracking-widest" style={{ color: "hsl(215,20%,55%)" }}>
                    Password
                  </label>
                  {mode === "signin" && (
                    <button onClick={() => { setMode("forgot"); resetForm(); }}
                      className="text-xs transition-colors" style={{ color: "hsl(215,20%,55%)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#10b981")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "hsl(215,20%,55%)")}
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "hsl(215,20%,55%)" }} />
                  <input type="password" value={password}
                    onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKeyDown}
                    placeholder="••••••••"
                    className="w-full rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-[hsl(215,20%,40%)] focus:outline-none transition-all"
                    style={{ background: "hsl(222,35%,12%)", border: "1px solid hsl(222,35%,18%)" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#10b981")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "hsl(222,35%,18%)")}
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm px-3 py-2 rounded-lg"
                  style={{ color: "#f87171", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)" }}>
                  {error}
                </p>
              )}

              <button onClick={mode === "signin" ? handleSignIn : handleSignUp} disabled={loading}
                className="w-full flex items-center justify-center gap-2 font-bold py-3 rounded-xl transition-all disabled:opacity-50 mt-2"
                style={{ background: "#10b981", color: "white" }}
                onMouseEnter={(e) => !loading && (e.currentTarget.style.background = "#059669")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#10b981")}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === "signin" ? "Sign In" : "Create Account"}
              </button>
            </div>

            <p className="text-center text-sm mt-6" style={{ color: "hsl(215,20%,55%)" }}>
              {mode === "signin" ? (
                <>No account?{" "}
                  <button onClick={() => { setMode("signup"); resetForm(); }}
                    className="font-medium transition-all" style={{ color: "#10b981" }}
                    onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                    onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
                  >Sign up free</button>
                </>
              ) : (
                <>Already have an account?{" "}
                  <button onClick={() => { setMode("signin"); resetForm(); }}
                    className="font-medium transition-all" style={{ color: "#10b981" }}
                    onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                    onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
                  >Sign in</button>
                </>
              )}
            </p>
          </>
        )}
      </div>
    </div>
  );
}