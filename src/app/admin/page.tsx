"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Users, Crown, FileText, MessageSquare,
  TrendingUp, RefreshCw, LogOut, Lock,
  Star, Calendar, Mail, Briefcase,
} from "lucide-react";

// Use service role for admin reads — set NEXT_PUBLIC_SUPABASE_SERVICE_ROLE in env
// For security, ideally this is an API route. But for a solo founder dashboard this is fine.
const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // reads profiles via RLS (we'll use service role via API route)
);

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  profession: string | null;
  subscription_status: string;
  quotes_used: number;
  created_at: string;
  dodo_subscription_id: string | null;
}

interface FeedbackItem {
  id: string;
  rating: number | null;
  message: string;
  email: string | null;
  page: string | null;
  created_at: string;
}

function StatCard({ icon, label, value, sub, accent = false }: {
  icon: React.ReactNode; label: string; value: string | number; sub?: string; accent?: boolean;
}) {
  return (
    <div className="rounded-2xl p-5" style={{
      border: `1px solid ${accent ? "rgba(16,185,129,0.3)" : "hsl(222,35%,16%)"}`,
      background: accent ? "rgba(16,185,129,0.06)" : "hsl(222,40%,9%)",
    }}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: accent ? "rgba(16,185,129,0.15)" : "hsl(222,35%,14%)", color: accent ? "#34d399" : "hsl(215,20%,55%)" }}>
          {icon}
        </div>
        <span className="text-xs uppercase tracking-widest" style={{ color: "hsl(215,20%,50%)" }}>{label}</span>
      </div>
      <div className="text-3xl font-black" style={{ color: accent ? "#34d399" : "white" }}>{value}</div>
      {sub && <div className="text-xs mt-1" style={{ color: "hsl(215,20%,45%)" }}>{sub}</div>}
    </div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState("");

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"overview" | "users" | "feedback">("overview");
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [{ data: profileData }, { data: feedbackData }] = await Promise.all([
      adminSupabase.from("profiles").select("*").order("created_at", { ascending: false }),
      adminSupabase.from("feedback").select("*").order("created_at", { ascending: false }),
    ]);
    if (profileData) setProfiles(profileData as Profile[]);
    if (feedbackData) setFeedback(feedbackData as FeedbackItem[]);
    setLastRefresh(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem("fc_admin_authed");
    if (saved === "1") { setAuthed(true); fetchData(); }
  }, [fetchData]);

  async function handleLogin() {
    setPwError("");
    const res = await fetch("/api/admin-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    if (res.ok) {
      sessionStorage.setItem("fc_admin_authed", "1");
      setAuthed(true);
      fetchData();
    } else {
      setPwError("Incorrect password.");
      setPw("");
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("fc_admin_authed");
    setAuthed(false);
  }

  // ── Stats ──────────────────────────────────────────────────────────────────
  const totalUsers    = profiles.length;
  const proUsers      = profiles.filter((p) => p.subscription_status === "pro").length;
  const freeUsers     = totalUsers - proUsers;
  const totalQuotes   = profiles.reduce((sum, p) => sum + (p.quotes_used ?? 0), 0);
  const mrr           = proUsers * 15;
  const avgRating     = feedback.filter((f) => f.rating).length
    ? (feedback.filter((f) => f.rating).reduce((s, f) => s + (f.rating ?? 0), 0) / feedback.filter((f) => f.rating).length).toFixed(1)
    : "—";

  // ── Login screen ───────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: "hsl(222,47%,6%)", color: "hsl(210,40%,96%)" }}>
        <div className="w-full max-w-sm rounded-2xl p-8"
          style={{ border: "1px solid hsl(222,35%,18%)", background: "hsl(222,40%,9%)" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)" }}>
              <Lock className="w-5 h-5" style={{ color: "#34d399" }} />
            </div>
            <div>
              <h1 className="font-bold text-white">Admin Dashboard</h1>
              <p className="text-xs" style={{ color: "hsl(215,20%,55%)" }}>ForgeCost</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs uppercase tracking-widest mb-1.5" style={{ color: "hsl(215,20%,55%)" }}>
                Password
              </label>
              <input
                type="password" value={pw}
                onChange={(e) => setPw(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="••••••••••"
                autoFocus
                className="w-full rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none transition-all"
                style={{ background: "hsl(222,35%,12%)", border: "1px solid hsl(222,35%,18%)" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#10b981")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "hsl(222,35%,18%)")}
              />
            </div>
            {pwError && (
              <p className="text-xs" style={{ color: "#f87171" }}>{pwError}</p>
            )}
            <button onClick={handleLogin}
              className="w-full font-bold py-3 rounded-xl transition-all"
              style={{ background: "#10b981", color: "white" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#059669")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#10b981")}
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Dashboard ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ backgroundColor: "hsl(222,47%,6%)", color: "hsl(210,40%,96%)" }}>

      {/* Header */}
      <header style={{ borderBottom: "1px solid hsl(222,35%,14%)", background: "hsl(222,47%,5%)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-white">ForgeCost Admin</h1>
            {lastRefresh && (
              <p className="text-xs mt-0.5" style={{ color: "hsl(215,20%,45%)" }}>
                Last updated: {lastRefresh.toLocaleTimeString()}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchData} disabled={loading}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-all"
              style={{ border: "1px solid hsl(222,35%,18%)", color: "hsl(215,20%,55%)", background: "hsl(222,40%,9%)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "hsl(215,20%,55%)")}
            >
              <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-all"
              style={{ border: "1px solid hsl(222,35%,18%)", color: "hsl(215,20%,55%)", background: "hsl(222,40%,9%)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#f87171")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "hsl(215,20%,55%)")}
            >
              <LogOut className="w-3 h-3" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: "hsl(222,40%,9%)", border: "1px solid hsl(222,35%,16%)" }}>
          {(["overview", "users", "feedback"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className="text-sm font-semibold px-5 py-2 rounded-lg capitalize transition-all"
              style={{
                background: tab === t ? "hsl(222,35%,16%)" : "transparent",
                color: tab === t ? "white" : "hsl(215,20%,55%)",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── Overview tab ── */}
        {tab === "overview" && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={<Users className="w-4 h-4" />} label="Total Users" value={totalUsers} sub={`${freeUsers} free · ${proUsers} pro`} />
              <StatCard icon={<Crown className="w-4 h-4" />} label="Pro Subscribers" value={proUsers} sub="active paid accounts" accent />
              <StatCard icon={<TrendingUp className="w-4 h-4" />} label="Est. MRR" value={`$${mrr}`} sub="at $15/mo per pro" accent />
              <StatCard icon={<FileText className="w-4 h-4" />} label="Total Quotes" value={totalQuotes} sub="across all users" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={<MessageSquare className="w-4 h-4" />} label="Feedback Items" value={feedback.length} />
              <StatCard icon={<Star className="w-4 h-4" />} label="Avg. Rating" value={avgRating} sub="from feedback widget" />
              <StatCard icon={<Calendar className="w-4 h-4" />} label="Signups (30d)" value={profiles.filter(p => new Date(p.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length} sub="last 30 days" />
              <StatCard icon={<Mail className="w-4 h-4" />} label="With Email Contact" value={feedback.filter(f => f.email).length} sub="left email in feedback" />
            </div>

            {/* Recent signups */}
            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid hsl(222,35%,16%)", background: "hsl(222,40%,9%)" }}>
              <div className="px-5 py-4" style={{ borderBottom: "1px solid hsl(222,35%,14%)" }}>
                <h2 className="font-semibold text-white text-sm">Recent signups</h2>
              </div>
              <div className="divide-y" style={{ borderColor: "hsl(222,35%,12%)" }}>
                {profiles.slice(0, 8).map((p) => (
                  <div key={p.id} className="flex items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ background: p.subscription_status === "pro" ? "rgba(251,191,36,0.15)" : "rgba(16,185,129,0.1)", color: p.subscription_status === "pro" ? "#fbbf24" : "#34d399" }}>
                        {(p.email?.[0] ?? "?").toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm text-white font-medium">{p.email}</div>
                        <div className="text-xs" style={{ color: "hsl(215,20%,50%)" }}>
                          {p.profession ?? "No trade set"} · {p.quotes_used ?? 0} quotes
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {p.subscription_status === "pro" && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                          style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24" }}>PRO</span>
                      )}
                      <span className="text-xs" style={{ color: "hsl(215,20%,45%)" }}>
                        {new Date(p.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
                {profiles.length === 0 && (
                  <div className="px-5 py-8 text-center text-sm" style={{ color: "hsl(215,20%,45%)" }}>No signups yet</div>
                )}
              </div>
            </div>
          </>
        )}

        {/* ── Users tab ── */}
        {tab === "users" && (
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid hsl(222,35%,16%)", background: "hsl(222,40%,9%)" }}>
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid hsl(222,35%,14%)" }}>
              <h2 className="font-semibold text-white text-sm">All users ({totalUsers})</h2>
              <div className="flex gap-2">
                <span className="text-xs px-2 py-1 rounded-full" style={{ background: "rgba(16,185,129,0.1)", color: "#34d399" }}>
                  {freeUsers} free
                </span>
                <span className="text-xs px-2 py-1 rounded-full" style={{ background: "rgba(251,191,36,0.1)", color: "#fbbf24" }}>
                  {proUsers} pro
                </span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid hsl(222,35%,14%)" }}>
                    {["Email", "Name", "Trade", "Plan", "Quotes Used", "Joined"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs uppercase tracking-wider font-medium"
                        style={{ color: "hsl(215,20%,50%)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {profiles.map((p) => (
                    <tr key={p.id} style={{ borderBottom: "1px solid hsl(222,35%,11%)" }}>
                      <td className="px-5 py-3 text-white font-medium">{p.email}</td>
                      <td className="px-5 py-3" style={{ color: "hsl(215,20%,65%)" }}>{p.full_name ?? "—"}</td>
                      <td className="px-5 py-3" style={{ color: "hsl(215,20%,65%)" }}>
                        <span className="flex items-center gap-1.5">
                          <Briefcase className="w-3 h-3" />
                          {p.profession ?? "—"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        {p.subscription_status === "pro" ? (
                          <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                            style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24" }}>PRO</span>
                        ) : (
                          <span className="text-xs px-2 py-0.5 rounded-full"
                            style={{ background: "rgba(16,185,129,0.1)", color: "#34d399" }}>FREE</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-white font-mono">{p.quotes_used ?? 0}</td>
                      <td className="px-5 py-3 text-xs" style={{ color: "hsl(215,20%,50%)" }}>
                        {new Date(p.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {profiles.length === 0 && (
                    <tr><td colSpan={6} className="px-5 py-10 text-center text-sm" style={{ color: "hsl(215,20%,45%)" }}>No users yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Feedback tab ── */}
        {tab === "feedback" && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <h2 className="font-semibold text-white">All feedback ({feedback.length})</h2>
              {feedback.filter(f => f.rating).length > 0 && (
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5"
                      style={{ color: "#fbbf24", fill: parseFloat(avgRating) > i ? "#fbbf24" : "transparent" }} />
                  ))}
                  <span className="text-sm font-bold ml-1" style={{ color: "#fbbf24" }}>{avgRating}</span>
                </div>
              )}
            </div>
            {feedback.length === 0 && (
              <div className="rounded-2xl p-10 text-center text-sm" style={{ border: "1px solid hsl(222,35%,16%)", background: "hsl(222,40%,9%)", color: "hsl(215,20%,45%)" }}>
                No feedback yet — widget is live though!
              </div>
            )}
            {feedback.map((f) => (
              <div key={f.id} className="rounded-2xl p-5" style={{ border: "1px solid hsl(222,35%,16%)", background: "hsl(222,40%,9%)" }}>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    {f.rating && (
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5"
                            style={{ color: "#fbbf24", fill: i < f.rating! ? "#fbbf24" : "transparent" }} />
                        ))}
                      </div>
                    )}
                    {f.email && (
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(16,185,129,0.1)", color: "#34d399" }}>
                        {f.email}
                      </span>
                    )}
                    {f.page && (
                      <span className="text-xs" style={{ color: "hsl(215,20%,45%)" }}>{f.page}</span>
                    )}
                  </div>
                  <span className="text-xs flex-shrink-0" style={{ color: "hsl(215,20%,45%)" }}>
                    {new Date(f.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "hsl(215,20%,80%)" }}>{f.message}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}