"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calculator, FileText, Zap, Shield, Download,
  ChevronRight, Wrench, Leaf, Palette, Hammer,
  Star, Menu, X, Check, ArrowRight,
} from "lucide-react";

// ── Animated counter hook ────────────────────────────────────────────────────
function useCounter(end: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, start]);
  return count;
}

// ── Testimonials data ────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    name: "Marcus T.",
    trade: "Plumber",
    location: "Austin, TX",
    text: "I used to guess my material costs and always came up short. ForgeCost changed that — I quoted a bathroom remodel last week and made $400 more than I normally would.",
    stars: 5,
  },
  {
    name: "Sandra K.",
    trade: "Electrician",
    location: "Phoenix, AZ",
    text: "The PDF looks so professional. My customers actually comment on it. Takes me 2 minutes to put together a quote that used to take 30.",
    stars: 5,
  },
  {
    name: "Devon R.",
    trade: "Landscaper",
    location: "Portland, OR",
    text: "As a solo operator I can't afford to overbuy or underbid. This tool pays for itself on the first job. And it's free, so it literally always pays for itself.",
    stars: 5,
  },
];

// ── Features data ─────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: <Wrench className="w-6 h-6" />,
    title: "Trade-specific material lists",
    desc: "Pre-loaded with realistic prices for plumbers, electricians, handymen, landscapers, tattoo artists and more. No setup needed.",
  },
  {
    icon: <Calculator className="w-6 h-6" />,
    title: "Live cost calculation",
    desc: "See your subtotal, markup, and total-to-charge update in real time as you enter quantities. No formulas to maintain.",
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Professional PDF quotes",
    desc: "One click generates a branded PDF with your name, job details, itemized materials, and totals. Looks like you hired a designer.",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Reusable templates",
    desc: "Save your most common job setups as templates. Load them in one click — never re-enter the same materials twice.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Quote history",
    desc: "Every quote you download is saved automatically. Look back at past jobs, compare costs, and track how your pricing evolves.",
  },
  {
    icon: <Download className="w-6 h-6" />,
    title: "100% client-side PDF",
    desc: "Your data never touches our servers. PDFs are generated directly in your browser — fast, private, and works offline.",
  },
];

const TRADES = [
  { icon: <Wrench className="w-5 h-5" />, name: "Plumber" },
  { icon: <Zap className="w-5 h-5" />, name: "Electrician" },
  { icon: <Hammer className="w-5 h-5" />, name: "Handyman" },
  { icon: <Leaf className="w-5 h-5" />, name: "Landscaper" },
  { icon: <Palette className="w-5 h-5" />, name: "Tattoo Artist" },
];

// ── Main component ────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);

  const counter1 = useCounter(2400, 2000, statsVisible);
  const counter2 = useCounter(35, 1500, statsVisible);
  const counter3 = useCounter(98, 1800, statsVisible);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    const el = document.getElementById("stats-section");
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ backgroundColor: "hsl(222,47%,6%)", color: "hsl(210,40%,96%)", fontFamily: "var(--font-geist-sans, system-ui, sans-serif)" }}>

      {/* ── Nav ───────────────────────────────────────────────────────────── */}
      <nav style={{ borderBottom: "1px solid hsl(222,35%,12%)", backgroundColor: "hsl(222,47%,5%)", position: "sticky", top: 0, zIndex: 40, backdropFilter: "blur(12px)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Calculator className="w-5 h-5" style={{ color: "#34d399" }} />
            </div>
            <span className="text-lg font-bold">Mat<span style={{ color: "#34d399" }}>Cost</span></span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {["Features", "Trades", "Testimonials"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`}
                className="text-sm transition-colors"
                style={{ color: "hsl(215,20%,55%)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "hsl(215,20%,55%)")}
              >
                {item}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/app"
              className="text-sm font-semibold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2"
              style={{ background: "#10b981", color: "white", boxShadow: "0 4px 14px rgba(16,185,129,0.25)" }}
            >
              Try it free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen((p) => !p)} style={{ color: "hsl(215,20%,55%)" }}>
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pb-4 space-y-3" style={{ borderTop: "1px solid hsl(222,35%,12%)" }}>
            {["Features", "Trades", "Testimonials"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm" style={{ color: "hsl(215,20%,55%)" }}
              >{item}</a>
            ))}
            <Link href="/app" className="block text-center text-sm font-semibold px-4 py-3 rounded-xl" style={{ background: "#10b981", color: "white" }}>
              Try it free →
            </Link>
          </div>
        )}
      </nav>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background effects */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(hsl(160,84%,39%) 1px,transparent 1px),linear-gradient(90deg,hsl(160,84%,39%) 1px,transparent 1px)", backgroundSize: "48px 48px", opacity: 0.03, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: -200, left: "50%", transform: "translateX(-50%)", width: 800, height: 600, background: "radial-gradient(ellipse at center, rgba(16,185,129,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-8" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", color: "#34d399" }}>
            <Zap className="w-3.5 h-3.5" />
            Free for solo tradespeople — always
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6 leading-tight">
            Stop guessing your{" "}
            <span style={{ color: "#34d399", display: "inline-block", position: "relative" }}>
              material costs
              <span style={{ position: "absolute", bottom: -4, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #10b981, #34d399)", borderRadius: 2 }} />
            </span>
          </h1>

          <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: "hsl(215,20%,65%)" }}>
            ForgeCost helps plumbers, electricians, and other tradespeople calculate exact material costs, apply markup, and generate professional PDF quotes — in under 2 minutes.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/app"
              className="flex items-center gap-2 text-base font-bold px-8 py-4 rounded-2xl transition-all hover:scale-105"
              style={{ background: "#10b981", color: "white", boxShadow: "0 8px 30px rgba(16,185,129,0.3)" }}
            >
              <Calculator className="w-5 h-5" />
              Start calculating free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#features" className="flex items-center gap-2 text-sm font-medium px-6 py-4 rounded-2xl transition-all"
              style={{ border: "1px solid hsl(222,35%,20%)", color: "hsl(215,20%,70%)" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.4)"; e.currentTarget.style.color = "white"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "hsl(222,35%,20%)"; e.currentTarget.style.color = "hsl(215,20%,70%)"; }}
            >
              See how it works <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          {/* Hero mockup — fake PDF preview */}
          <div className="relative max-w-2xl mx-auto">
            <div style={{ borderRadius: 20, overflow: "hidden", border: "1px solid hsl(222,35%,16%)", boxShadow: "0 40px 80px rgba(0,0,0,0.5)", background: "white" }}>
              {/* PDF mockup header */}
              <div style={{ background: "#0f172a", padding: "24px 32px 20px" }}>
                <div className="flex items-end justify-between">
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "#10b981", letterSpacing: 1 }}>ForgeCost</div>
                    <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>PLUMBER MATERIAL QUOTE</div>
                  </div>
                  <div style={{ textAlign: "right", fontSize: 9, color: "#94a3b8" }}>March 8, 2026</div>
                </div>
              </div>
              {/* PDF mockup body */}
              <div style={{ padding: "20px 32px", background: "white" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 8, color: "#94a3b8", fontWeight: 700, letterSpacing: 1.5, marginBottom: 3 }}>JOB NAME</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Master Bathroom Remodel</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 8, color: "#94a3b8", fontWeight: 700, letterSpacing: 1.5, marginBottom: 3 }}>COMPANY</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Mike's Plumbing LLC</div>
                  </div>
                </div>
                <div style={{ height: 2, background: "#10b981", borderRadius: 1, marginBottom: 14 }} />
                {/* Table header */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 60px 80px 40px 80px", gap: 0, background: "#0f172a", borderRadius: 4, padding: "8px 10px", marginBottom: 4 }}>
                  {["Material", "Unit", "Unit Cost", "Qty", "Total"].map((h) => (
                    <div key={h} style={{ fontSize: 8, color: "white", fontWeight: 700 }}>{h}</div>
                  ))}
                </div>
                {/* Table rows */}
                {[
                  ["½″ Copper Pipe", "ft", "$3.50", "24", "$84.00"],
                  ["P-Trap (1½″)", "each", "$8.50", "2", "$17.00"],
                  ["Wax Ring", "each", "$6.00", "1", "$6.00"],
                  ["Supply Line", "each", "$5.50", "3", "$16.50"],
                ].map(([name, unit, cost, qty, total], i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 60px 80px 40px 80px", gap: 0, padding: "6px 10px", background: i % 2 === 0 ? "white" : "#f8fafc" }}>
                    <div style={{ fontSize: 9, color: "#334155" }}>{name}</div>
                    <div style={{ fontSize: 9, color: "#94a3b8" }}>{unit}</div>
                    <div style={{ fontSize: 9, color: "#334155" }}>{cost}</div>
                    <div style={{ fontSize: 9, color: "#334155" }}>{qty}</div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: "#0f172a" }}>{total}</div>
                  </div>
                ))}
                {/* Totals */}
                <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
                  <div style={{ width: 200 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 9, color: "#64748b" }}>Subtotal</span>
                      <span style={{ fontSize: 9, fontWeight: 600 }}>$123.50</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 9, color: "#64748b" }}>Markup (25%)</span>
                      <span style={{ fontSize: 9, fontWeight: 600, color: "#10b981" }}>+ $30.88</span>
                    </div>
                    <div style={{ background: "#0f172a", borderRadius: 6, padding: "8px 12px", display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: "white" }}>TOTAL</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#10b981" }}>$154.38</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div style={{ position: "absolute", top: -16, right: -16, background: "#10b981", borderRadius: 12, padding: "8px 16px", fontSize: 12, fontWeight: 700, color: "white", boxShadow: "0 8px 20px rgba(16,185,129,0.4)", transform: "rotate(3deg)" }}>
              Generated in 90 sec ⚡
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <section id="stats-section" style={{ borderTop: "1px solid hsl(222,35%,12%)", borderBottom: "1px solid hsl(222,35%,12%)", background: "hsl(222,40%,8%)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {[
            { value: counter1, suffix: "+", label: "Quotes generated", sublabel: "by tradespeople like you" },
            { value: counter2, suffix: "%", label: "Average markup added", sublabel: "that was previously lost" },
            { value: counter3, suffix: "%", label: "Would recommend", sublabel: "to other tradespeople" },
          ].map(({ value, suffix, label, sublabel }) => (
            <div key={label}>
              <div className="text-4xl sm:text-5xl font-bold mb-2" style={{ color: "#34d399" }}>
                {value.toLocaleString()}{suffix}
              </div>
              <div className="font-semibold text-white mb-1">{label}</div>
              <div className="text-sm" style={{ color: "hsl(215,20%,55%)" }}>{sublabel}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs mb-4" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#34d399" }}>
            FEATURES
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything you need to quote with confidence</h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "hsl(215,20%,55%)" }}>
            Built for tradespeople who work on job sites, not spreadsheet jockeys in an office.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl p-6 transition-all group"
              style={{ border: "1px solid hsl(222,35%,14%)", background: "hsl(222,40%,9%)" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.3)"; e.currentTarget.style.background = "hsl(222,40%,10%)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "hsl(222,35%,14%)"; e.currentTarget.style.background = "hsl(222,40%,9%)"; }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all" style={{ background: "rgba(16,185,129,0.1)", color: "#34d399" }}>
                {f.icon}
              </div>
              <h3 className="font-bold text-white mb-2">{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "hsl(215,20%,55%)" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Trades ────────────────────────────────────────────────────────── */}
      <section id="trades" style={{ borderTop: "1px solid hsl(222,35%,12%)", background: "hsl(222,40%,8%)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs mb-4" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#34d399" }}>
              SUPPORTED TRADES
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Built for your trade</h2>
            <p className="text-lg" style={{ color: "hsl(215,20%,55%)" }}>
              Pre-loaded with realistic material lists and prices for each trade.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {TRADES.map((t) => (
              <div key={t.name} className="flex items-center gap-3 px-6 py-4 rounded-2xl transition-all cursor-default"
                style={{ border: "1px solid hsl(222,35%,16%)", background: "hsl(222,40%,9%)" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.4)"; e.currentTarget.style.background = "rgba(16,185,129,0.05)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "hsl(222,35%,16%)"; e.currentTarget.style.background = "hsl(222,40%,9%)"; }}
              >
                <span style={{ color: "#34d399" }}>{t.icon}</span>
                <span className="font-semibold text-white">{t.name}</span>
              </div>
            ))}
            <div className="flex items-center gap-3 px-6 py-4 rounded-2xl" style={{ border: "1px dashed hsl(222,35%,20%)", color: "hsl(215,20%,45%)" }}>
              + Custom trade
            </div>
          </div>

          {/* How it works */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16">
            {[
              { step: "01", title: "Pick your trade", desc: "Select from 5 supported trades. Materials and prices are pre-loaded instantly." },
              { step: "02", title: "Enter quantities", desc: "Type in how much of each material you need. Edit unit costs if your local prices differ." },
              { step: "03", title: "Download your quote", desc: "Set your markup %, hit download, and share the PDF with your customer in seconds." },
            ].map((s) => (
              <div key={s.step} className="relative p-6 rounded-2xl" style={{ border: "1px solid hsl(222,35%,14%)", background: "hsl(222,40%,9%)" }}>
                <div className="text-5xl font-black mb-4" style={{ color: "rgba(16,185,129,0.15)", lineHeight: 1 }}>{s.step}</div>
                <h3 className="font-bold text-white mb-2">{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "hsl(215,20%,55%)" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section id="testimonials" className="max-w-6xl mx-auto px-4 sm:px-6 py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs mb-4" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#34d399" }}>
            TESTIMONIALS
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Tradespeople love ForgeCost</h2>
          <div className="flex items-center justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5" style={{ color: "#fbbf24", fill: "#fbbf24" }} />)}
            <span className="ml-2 text-sm" style={{ color: "hsl(215,20%,55%)" }}>5.0 from early users</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="rounded-2xl p-6" style={{ border: "1px solid hsl(222,35%,14%)", background: "hsl(222,40%,9%)" }}>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(t.stars)].map((_, i) => <Star key={i} className="w-4 h-4" style={{ color: "#fbbf24", fill: "#fbbf24" }} />)}
              </div>
              <p className="text-sm leading-relaxed mb-6" style={{ color: "hsl(215,20%,70%)" }}>"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: "rgba(16,185,129,0.15)", color: "#34d399" }}>
                  {t.name[0]}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{t.name}</div>
                  <div className="text-xs" style={{ color: "hsl(215,20%,55%)" }}>{t.trade} · {t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────────────── */}
      <section style={{ borderTop: "1px solid hsl(222,35%,12%)", background: "hsl(222,40%,8%)" }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs mb-6" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#34d399" }}>
            PRICING
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Free. Forever.</h2>
          <p className="text-lg mb-10" style={{ color: "hsl(215,20%,55%)" }}>
            No credit card. No trial. No catch. ForgeCost is completely free for solo tradespeople.
          </p>

          <div className="rounded-2xl p-8 text-left mb-8" style={{ border: "1px solid rgba(16,185,129,0.25)", background: "rgba(16,185,129,0.05)" }}>
            <div className="text-4xl font-black text-white mb-1">$0</div>
            <div className="text-sm mb-6" style={{ color: "hsl(215,20%,55%)" }}>forever, no limits</div>
            <div className="space-y-3">
              {[
                "Unlimited quotes & PDF downloads",
                "All 5 trades pre-loaded",
                "Custom materials & prices",
                "Save unlimited templates",
                "Full quote history",
                "No watermarks on PDFs",
              ].map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(16,185,129,0.2)" }}>
                    <Check className="w-3 h-3" style={{ color: "#34d399" }} />
                  </div>
                  <span className="text-sm text-white">{f}</span>
                </div>
              ))}
            </div>
          </div>

          <Link href="/app"
            className="inline-flex items-center gap-2 text-base font-bold px-8 py-4 rounded-2xl transition-all hover:scale-105"
            style={{ background: "#10b981", color: "white", boxShadow: "0 8px 30px rgba(16,185,129,0.3)" }}
          >
            <Calculator className="w-5 h-5" />
            Start for free — no signup needed
          </Link>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid hsl(222,35%,12%)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Calculator className="w-4 h-4" style={{ color: "#34d399" }} />
            </div>
            <span className="font-bold">Mat<span style={{ color: "#34d399" }}>Cost</span></span>
          </div>
          <p className="text-sm" style={{ color: "hsl(215,20%,45%)" }}>
            © 2026 ForgeCost · Free material cost calculator for tradespeople
          </p>
          <Link href="/app" className="text-sm font-medium" style={{ color: "#34d399" }}>
            Open Calculator →
          </Link>
        </div>
      </footer>
    </div>
  );
}