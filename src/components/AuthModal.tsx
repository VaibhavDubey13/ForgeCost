"use client";

// Auth modal — email/password sign up and sign in

import { useState } from "react";
import { signIn, signUp } from "@/lib/auth";
import { X, Mail, Lock, Loader2, CheckCircle } from "lucide-react";

interface AuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit() {
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    if (mode === "signup") {
      const { error } = await signUp(email, password);
      if (error) {
        setError(error.message);
      } else {
        setSuccess("Account created! Check your email to confirm, or sign in now.");
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message);
      } else {
        onSuccess();
        onClose();
      }
    }

    setLoading(false);
  }

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-2xl border border-[hsl(222,35%,18%)] bg-[hsl(222,40%,9%)] p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">
              {mode === "signin" ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-sm text-[hsl(215,20%,55%)] mt-1">
              {mode === "signin"
                ? "Sign in to access your saved templates"
                : "Save templates and quote history forever"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[hsl(215,20%,55%)] hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success state */}
        {success ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <CheckCircle className="w-12 h-12 text-emerald-400" />
            <p className="text-sm text-[hsl(210,40%,96%)]">{success}</p>
            <button
              onClick={() => { setSuccess(""); setMode("signin"); }}
              className="text-emerald-400 text-sm hover:underline"
            >
              Sign in now →
            </button>
          </div>
        ) : (
          <>
            {/* Form */}
            <div className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs text-[hsl(215,20%,55%)] uppercase tracking-widest mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(215,20%,55%)]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder="you@example.com"
                    className="w-full bg-[hsl(222,35%,12%)] border border-[hsl(222,35%,18%)] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-[hsl(215,20%,40%)] focus:outline-none focus:border-[#10b981] transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs text-[hsl(215,20%,55%)] uppercase tracking-widest mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(215,20%,55%)]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder="••••••••"
                    className="w-full bg-[hsl(222,35%,12%)] border border-[hsl(222,35%,18%)] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-[hsl(215,20%,40%)] focus:outline-none focus:border-[#10b981] transition-all"
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#10b981] hover:bg-[#059669] disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors mt-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : mode === "signin" ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </button>
            </div>

            {/* Toggle mode */}
            <p className="text-center text-sm text-[hsl(215,20%,55%)] mt-6">
              {mode === "signin" ? (
                <>
                  No account?{" "}
                  <button
                    onClick={() => { setMode("signup"); setError(""); }}
                    className="text-[#10b981] hover:underline font-medium"
                  >
                    Sign up free
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => { setMode("signin"); setError(""); }}
                    className="text-[#10b981] hover:underline font-medium"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </>
        )}
      </div>
    </div>
  );
}