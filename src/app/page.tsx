"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calculator, FileText, Zap, Shield, Download,
  ChevronRight, Wrench, Leaf, Palette, Hammer,
  Star, Menu, X, Check, ArrowRight, Crown,
  Wind, Paintbrush, Layers, Flame, MoreHorizontal,
  Mail, Sparkles,
} from "lucide-react";
import ShareButton from "@/components/ShareButton";

function useCounter(end: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, start]);
  return count;
}

const TESTIMONIALS = [
  {
    name: "Marcus T.",
    trade: "Plumber",
    location: "Austin, TX",
    text: "I used to guess my material costs and always came up short. ForgeCost changed that — I quoted a bathroom remodel last week and made $400 more than I normally would.",
    stars: 5,
    initials: "MT",
  },
  {
    name: "Sandra K.",
    trade: "Electrician",
    location: "Phoenix, AZ",
    text: "The PDF looks so professional. My customers actually comment on it. Takes me 2 minutes to put together a quote that used to take 30.",
    stars: 5,
    initials: "SK",
  },
  {
    name: "Devon R.",
    trade: "Landscaper",
    location: "Portland, OR",
    text: "As a solo operator I can't afford to overbuy or underbid. This tool pays for itself on the first job. And the free plan is genuinely unlimited.",
    stars: 5,
    initials: "DR",
  },
];

const FEATURES = [
  {
    icon: <Wrench className="w-5 h-5" />,
    title: "10 trade-specific lists",
    desc: "Pre-loaded materials for plumbers, electricians, HVAC, carpenters, painters, welders and more. No setup.",
  },
  {
    icon: <Calculator className="w-5 h-5" />,
    title: "Live cost calculation",
    desc: "Subtotal, markup, and total update in real time. Set your markup % once and never think about it again.",
  },
  {
    icon: <FileText className="w-5 h-5" />,
    title: "Professional PDF quotes",
    desc: "One click. Branded PDF with your name, job details, itemised materials, and totals. Looks like you hired a designer.",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Reusable templates",
    desc: "Save your most common job setups. Load them in one click — never re-enter the same materials twice.",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Full quote history",
    desc: "Every downloaded quote is saved automatically. Look back at past jobs and track how your pricing evolves.",
  },
  {
    icon: <Download className="w-5 h-5" />,
    title: "100% browser-side",
    desc: "PDFs are generated in your browser. Your prices and job data never touch our servers — ever.",
  },
];

const TRADES = [
  { icon: <Wrench className="w-4 h-4" />, name: "Plumber" },
  { icon: <Zap className="w-4 h-4" />, name: "Electrician" },
  { icon: <Hammer className="w-4 h-4" />, name: "Handyman" },
  { icon: <Leaf className="w-4 h-4" />, name: "Landscaper" },
  { icon: <Palette className="w-4 h-4" />, name: "Tattoo Artist" },
  { icon: <Wind className="w-4 h-4" />, name: "HVAC Technician" },
  { icon: <Paintbrush className="w-4 h-4" />, name: "Painter" },
  { icon: <Layers className="w-4 h-4" />, name: "Carpenter" },
  { icon: <Flame className="w-4 h-4" />, name: "Welder" },
  { icon: <MoreHorizontal className="w-4 h-4" />, name: "Other" },
];

const FREE_FEATURES = [
  "5 PDF quotes per month",
  "All 10 trades pre-loaded",
  "Custom materials & prices",
  "3 saved templates",
  "5 quotes in history",
  "Browser-side PDF generation",
];

const PRO_FEATURES = [
  "Unlimited PDF quotes",
  "All 10 trades pre-loaded",
  "Custom materials & prices",
  "Unlimited templates",
  "Full quote history",
  "Custom logo on PDFs",
  "Brand color on PDFs",
  "Email quotes to customers",
  "No ForgeCost watermark",
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [billingAnnual, setBillingAnnual] = useState(false);

  const c1 = useCounter(2400, 2200, statsVisible);
  const c2 = useCounter(35, 1600, statsVisible);
  const c3 = useCounter(98, 1900, statsVisible);

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

      {/* ── Nav ── */}
      <nav style={{ borderBottom: "1px solid hsl(222,35%,12%)", backgroundColor: "rgba(10,13,24,0.85)", position: "sticky", top: 0, zIndex: 40, backdropFilter: "blur(16px)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Calculator className="w-5 h-5" style={{ color: "#34d399" }} />
            </div>
            <span className="text-lg font-bold">Forge<span style={{ color: "#34d399" }}>Cost</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {["Features", "Trades", "Pricing", "Testimonials"].map((item) => (
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

          <div className="hidden md:flex items-center gap-3">
            <ShareButton />
            <Link href="/app"
              className="text-sm font-semibold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2"
              style={{ background: "#10b981", color: "white", boxShadow: "0 4px 14px rgba(16,185,129,0.3)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#059669")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#10b981")}
            >
              Try it free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen((p) => !p)} style={{ color: "hsl(215,20%,55%)" }}>
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden px-4 pb-4 space-y-2" style={{ borderTop: "1px solid hsl(222,35%,12%)" }}>
            {["Features", "Trades", "Pricing", "Testimonials"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 text-sm" style={{ color: "hsl(215,20%,65%)", borderBottom: "1px solid hsl(222,35%,12%)" }}
              >{item}</a>
            ))}
            <Link href="/app" className="block text-center text-sm font-semibold px-4 py-3 rounded-xl mt-2" style={{ background: "#10b981", color: "white" }}>
              Try it free →
            </Link>
            <div className="flex justify-center pt-1">
              <ShareButton variant="full" />
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        {/* Grid bg */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(hsl(160,84%,39%) 1px,transparent 1px),linear-gradient(90deg,hsl(160,84%,39%) 1px,transparent 1px)", backgroundSize: "48px 48px", opacity: 0.025, pointerEvents: "none" }} />
        {/* Glow */}
        <div style={{ position: "absolute", top: -300, left: "50%", transform: "translateX(-50%)", width: 1000, height: 700, background: "radial-gradient(ellipse at center, rgba(16,185,129,0.1) 0%, transparent 65%)", pointerEvents: "none" }} />
        {/* Side glows */}
        <div style={{ position: "absolute", top: 100, left: -100, width: 400, height: 400, background: "radial-gradient(ellipse at center, rgba(16,185,129,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 200, right: -100, width: 400, height: 400, background: "radial-gradient(ellipse at center, rgba(52,211,153,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm mb-8"
            style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", color: "#34d399" }}>
            <Sparkles className="w-3.5 h-3.5" />
            Free for solo tradespeople — always
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-6 leading-[1.05]">
            Stop leaving{" "}
            <span style={{ color: "#34d399", position: "relative", display: "inline-block" }}>
              money
              <span style={{ position: "absolute", bottom: 2, left: 0, right: 0, height: 4, background: "linear-gradient(90deg,#10b981,#34d399,#10b981)", borderRadius: 2, opacity: 0.7 }} />
            </span>
            {" "}on the table.
          </h1>

          <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: "hsl(215,20%,65%)" }}>
            ForgeCost calculates your exact material costs, applies your markup, and generates a professional PDF quote — in under 2 minutes. Free forever.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link href="/app"
              className="flex items-center gap-2 text-base font-bold px-8 py-4 rounded-2xl transition-all"
              style={{ background: "#10b981", color: "white", boxShadow: "0 8px 30px rgba(16,185,129,0.35)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#059669"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#10b981"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <Calculator className="w-5 h-5" />
              Start calculating free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#features"
              className="flex items-center gap-2 text-sm font-medium px-6 py-4 rounded-2xl transition-all"
              style={{ border: "1px solid hsl(222,35%,20%)", color: "hsl(215,20%,65%)" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.4)"; e.currentTarget.style.color = "white"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "hsl(222,35%,20%)"; e.currentTarget.style.color = "hsl(215,20%,65%)"; }}
            >
              See how it works <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          {/* Hero PDF mockup */}
          <div className="relative max-w-2xl mx-auto">
            {/* Glow under card */}
            <div style={{ position: "absolute", bottom: -40, left: "10%", right: "10%", height: 60, background: "rgba(16,185,129,0.15)", filter: "blur(30px)", borderRadius: "50%", pointerEvents: "none" }} />

            <div style={{ borderRadius: 20, overflow: "hidden", border: "1px solid hsl(222,35%,18%)", boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(16,185,129,0.05)", background: "white", position: "relative" }}>
              {/* PDF header */}
              <div style={{ background: "#0f172a", padding: "20px 28px 16px" }}>
                <div className="flex items-end justify-between">
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#10b981", letterSpacing: 1 }}>ForgeCost</div>
                    <div style={{ fontSize: 9, color: "#94a3b8", marginTop: 2, letterSpacing: 2 }}>PLUMBER MATERIAL QUOTE</div>
                  </div>
                  <div style={{ textAlign: "right", fontSize: 9, color: "#94a3b8" }}>
                    <div style={{ fontWeight: 600, color: "white", marginBottom: 2 }}>Mike&apos;s Plumbing LLC</div>
                    March 8, 2026
                  </div>
                </div>
              </div>
              {/* PDF body */}
              <div style={{ padding: "16px 28px 20px", background: "white" }}>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 7, color: "#94a3b8", fontWeight: 700, letterSpacing: 2, marginBottom: 3 }}>JOB NAME</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>Master Bathroom Remodel</div>
                </div>
                <div style={{ height: 2, background: "#10b981", borderRadius: 1, marginBottom: 10 }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 55px 70px 35px 75px", background: "#0f172a", borderRadius: 4, padding: "7px 10px", marginBottom: 3 }}>
                  {["Material", "Unit", "Unit Cost", "Qty", "Total"].map((h) => (
                    <div key={h} style={{ fontSize: 7, color: "white", fontWeight: 700, letterSpacing: 0.5 }}>{h}</div>
                  ))}
                </div>
                {[
                  ["½″ Copper Pipe", "ft", "$3.50", "24", "$84.00"],
                  ["P-Trap (1½″)", "each", "$8.50", "2", "$17.00"],
                  ["Wax Ring", "each", "$6.00", "1", "$6.00"],
                  ["Supply Line", "each", "$5.50", "3", "$16.50"],
                ].map(([name, unit, cost, qty, total], i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 55px 70px 35px 75px", padding: "5px 10px", background: i % 2 === 0 ? "white" : "#f8fafc" }}>
                    <div style={{ fontSize: 8, color: "#334155" }}>{name}</div>
                    <div style={{ fontSize: 8, color: "#94a3b8" }}>{unit}</div>
                    <div style={{ fontSize: 8, color: "#334155" }}>{cost}</div>
                    <div style={{ fontSize: 8, color: "#334155" }}>{qty}</div>
                    <div style={{ fontSize: 8, fontWeight: 700, color: "#0f172a" }}>{total}</div>
                  </div>
                ))}
                <div style={{ marginTop: 10, display: "flex", justifyContent: "flex-end" }}>
                  <div style={{ width: 190 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3, padding: "0 2px" }}>
                      <span style={{ fontSize: 8, color: "#64748b" }}>Subtotal</span>
                      <span style={{ fontSize: 8, fontWeight: 600, color: "#0f172a" }}>$123.50</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, padding: "0 2px" }}>
                      <span style={{ fontSize: 8, color: "#64748b" }}>Markup (25%)</span>
                      <span style={{ fontSize: 8, fontWeight: 600, color: "#10b981" }}>+ $30.88</span>
                    </div>
                    <div style={{ background: "#0f172a", borderRadius: 6, padding: "8px 10px", display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 9, fontWeight: 700, color: "white" }}>TOTAL TO CHARGE</span>
                      <span style={{ fontSize: 9, fontWeight: 700, color: "#10b981" }}>$154.38</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div style={{ position: "absolute", top: -14, right: -12, background: "#10b981", borderRadius: 12, padding: "7px 14px", fontSize: 11, fontWeight: 700, color: "white", boxShadow: "0 6px 20px rgba(16,185,129,0.45)", transform: "rotate(2deg)" }}>
              Generated in 90 sec ⚡
            </div>
            <div style={{ position: "absolute", bottom: -14, left: -12, background: "hsl(222,40%,10%)", borderRadius: 12, padding: "7px 14px", fontSize: 11, fontWeight: 600, color: "#34d399", boxShadow: "0 6px 20px rgba(0,0,0,0.4)", border: "1px solid rgba(16,185,129,0.3)", transform: "rotate(-1.5deg)" }}>
              📄 PDF · No watermark
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section id="stats-section" style={{ borderTop: "1px solid hsl(222,35%,12%)", borderBottom: "1px solid hsl(222,35%,12%)", background: "hsl(222,40%,8%)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {[
            { value: c1, suffix: "+", label: "Quotes generated", sub: "by tradespeople like you" },
            { value: c2, suffix: "%", label: "Average markup added", sub: "that was previously lost" },
            { value: c3, suffix: "%", label: "Would recommend", sub: "to other tradespeople" },
          ].map(({ value, suffix, label, sub }) => (
            <div key={label}>
              <div className="text-4xl sm:text-5xl font-black mb-2" style={{ color: "#34d399" }}>
                {value.toLocaleString()}{suffix}
              </div>
              <div className="font-semibold text-white mb-1">{label}</div>
              <div className="text-sm" style={{ color: "hsl(215,20%,50%)" }}>{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 py-24">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-4"
            style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#34d399", letterSpacing: 1 }}>
            FEATURES
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything you need to quote with confidence</h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "hsl(215,20%,55%)" }}>
            Built for tradespeople who work on job sites, not spreadsheet jockeys in an office.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl p-6 transition-all cursor-default"
              style={{ border: "1px solid hsl(222,35%,14%)", background: "hsl(222,40%,9%)" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.3)"; e.currentTarget.style.background = "hsl(222,42%,10%)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "hsl(222,35%,14%)"; e.currentTarget.style.background = "hsl(222,40%,9%)"; }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: "rgba(16,185,129,0.12)", color: "#34d399" }}>
                {f.icon}
              </div>
              <h3 className="font-bold text-white mb-2">{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "hsl(215,20%,55%)" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Trades ── */}
      <section id="trades" style={{ borderTop: "1px solid hsl(222,35%,12%)", background: "hsl(222,40%,8%)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-4"
              style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#34d399", letterSpacing: 1 }}>
              SUPPORTED TRADES
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Built for your trade</h2>
            <p className="text-lg" style={{ color: "hsl(215,20%,55%)" }}>
              10 trades pre-loaded with realistic material lists and prices. More coming.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {TRADES.map((t) => (
              <div key={t.name}
                className="flex items-center gap-2.5 px-5 py-3 rounded-xl transition-all cursor-default"
                style={{ border: "1px solid hsl(222,35%,16%)", background: "hsl(222,40%,9%)" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.4)"; e.currentTarget.style.background = "rgba(16,185,129,0.06)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "hsl(222,35%,16%)"; e.currentTarget.style.background = "hsl(222,40%,9%)"; }}
              >
                <span style={{ color: "#34d399" }}>{t.icon}</span>
                <span className="text-sm font-semibold text-white">{t.name}</span>
              </div>
            ))}
          </div>

          {/* How it works */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { step: "01", title: "Pick your trade", desc: "Select from 10 supported trades. Materials and prices load instantly — no setup." },
              { step: "02", title: "Enter quantities", desc: "Type in how much of each material you need. Edit unit costs if your local prices differ." },
              { step: "03", title: "Download your quote", desc: "Set your markup %, hit download. Share the professional PDF with your customer in seconds." },
            ].map((s) => (
              <div key={s.step} className="relative p-6 rounded-2xl" style={{ border: "1px solid hsl(222,35%,14%)", background: "hsl(222,40%,9%)" }}>
                <div className="text-6xl font-black mb-4" style={{ color: "rgba(16,185,129,0.12)", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{s.step}</div>
                <h3 className="font-bold text-white mb-2">{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "hsl(215,20%,55%)" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="max-w-6xl mx-auto px-4 sm:px-6 py-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-4"
            style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#34d399", letterSpacing: 1 }}>
            PRICING
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Start free. Upgrade when you&apos;re ready.</h2>
          <p className="text-lg" style={{ color: "hsl(215,20%,55%)" }}>
            No credit card needed. No trial. The free plan is genuinely useful.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3 mt-6 p-1.5 rounded-xl" style={{ background: "hsl(222,40%,9%)", border: "1px solid hsl(222,35%,16%)" }}>
            <button
              onClick={() => setBillingAnnual(false)}
              className="text-sm font-semibold px-4 py-2 rounded-lg transition-all"
              style={{ background: !billingAnnual ? "hsl(222,35%,16%)" : "transparent", color: !billingAnnual ? "white" : "hsl(215,20%,55%)" }}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingAnnual(true)}
              className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition-all"
              style={{ background: billingAnnual ? "hsl(222,35%,16%)" : "transparent", color: billingAnnual ? "white" : "hsl(215,20%,55%)" }}
            >
              Annual
              <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: "rgba(16,185,129,0.2)", color: "#34d399" }}>-17%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {/* Free tier */}
          <div className="rounded-2xl p-7" style={{ border: "1px solid hsl(222,35%,18%)", background: "hsl(222,40%,9%)" }}>
            <div className="mb-5">
              <div className="text-sm font-semibold mb-1" style={{ color: "hsl(215,20%,55%)" }}>Free</div>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-black text-white">$0</span>
                <span className="text-sm mb-1.5" style={{ color: "hsl(215,20%,55%)" }}>/forever</span>
              </div>
              <p className="text-xs mt-2" style={{ color: "hsl(215,20%,45%)" }}>No credit card. No catch.</p>
            </div>
            <div className="space-y-2.5 mb-7">
              {FREE_FEATURES.map((f) => (
                <div key={f} className="flex items-center gap-2.5 text-sm">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(16,185,129,0.15)" }}>
                    <Check className="w-2.5 h-2.5" style={{ color: "#34d399" }} />
                  </div>
                  <span style={{ color: "hsl(215,20%,75%)" }}>{f}</span>
                </div>
              ))}
            </div>
            <Link href="/app"
              className="w-full flex items-center justify-center gap-2 text-sm font-bold py-3 rounded-xl transition-all"
              style={{ border: "1px solid hsl(222,35%,22%)", color: "white", background: "transparent" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.4)"; e.currentTarget.style.background = "rgba(16,185,129,0.05)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "hsl(222,35%,22%)"; e.currentTarget.style.background = "transparent"; }}
            >
              Start for free
            </Link>
          </div>

          {/* Pro tier */}
          <div className="rounded-2xl p-7 relative overflow-hidden"
            style={{ border: "1px solid rgba(16,185,129,0.35)", background: "linear-gradient(135deg, hsl(222,40%,10%) 0%, rgba(16,185,129,0.05) 100%)" }}>
            {/* Popular badge */}
            <div className="absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full"
              style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.3)" }}>
              <Crown className="w-3 h-3 inline mr-1" />POPULAR
            </div>
            <div className="mb-5">
              <div className="text-sm font-semibold mb-1" style={{ color: "#34d399" }}>Pro</div>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-black text-white">
                  {billingAnnual ? "$12.50" : "$15"}
                </span>
                <span className="text-sm mb-1.5" style={{ color: "hsl(215,20%,55%)" }}>/month</span>
              </div>
              {billingAnnual ? (
                <p className="text-xs mt-2" style={{ color: "#34d399" }}>$149.99/year — save $30</p>
              ) : (
                <p className="text-xs mt-2" style={{ color: "hsl(215,20%,45%)" }}>$15/month, cancel anytime</p>
              )}
            </div>
            <div className="space-y-2.5 mb-7">
              {PRO_FEATURES.map((f) => (
                <div key={f} className="flex items-center gap-2.5 text-sm">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(16,185,129,0.2)" }}>
                    <Check className="w-2.5 h-2.5" style={{ color: "#34d399" }} />
                  </div>
                  <span className="text-white">{f}</span>
                </div>
              ))}
            </div>
            <Link href="/app"
              className="w-full flex items-center justify-center gap-2 text-sm font-bold py-3 rounded-xl transition-all"
              style={{ background: "#10b981", color: "white", boxShadow: "0 4px 16px rgba(16,185,129,0.3)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#059669")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#10b981")}
            >
              <Crown className="w-4 h-4" /> Upgrade to Pro
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" style={{ borderTop: "1px solid hsl(222,35%,12%)", background: "hsl(222,40%,8%)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-24">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-4"
              style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#34d399", letterSpacing: 1 }}>
              TESTIMONIALS
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Tradespeople love ForgeCost</h2>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5" style={{ color: "#fbbf24", fill: "#fbbf24" }} />)}
              <span className="ml-2 text-sm" style={{ color: "hsl(215,20%,55%)" }}>5.0 from early users</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="rounded-2xl p-6 flex flex-col" style={{ border: "1px solid hsl(222,35%,16%)", background: "hsl(222,40%,9%)" }}>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.stars)].map((_, i) => <Star key={i} className="w-4 h-4" style={{ color: "#fbbf24", fill: "#fbbf24" }} />)}
                </div>
                <p className="text-sm leading-relaxed flex-1 mb-5" style={{ color: "hsl(215,20%,70%)" }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: "rgba(16,185,129,0.15)", color: "#34d399" }}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{t.name}</div>
                    <div className="text-xs" style={{ color: "hsl(215,20%,50%)" }}>{t.trade} · {t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative overflow-hidden max-w-6xl mx-auto px-4 sm:px-6 py-24">
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, rgba(16,185,129,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div className="relative text-center">
          <h2 className="text-3xl sm:text-5xl font-black mb-4 tracking-tight">
            Your next quote is{" "}
            <span style={{ color: "#34d399" }}>2 minutes away.</span>
          </h2>
          <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: "hsl(215,20%,60%)" }}>
            No signup required to start. No credit card. Just pick your trade and go.
          </p>
          <Link href="/app"
            className="inline-flex items-center gap-2 text-base font-bold px-10 py-4 rounded-2xl transition-all"
            style={{ background: "#10b981", color: "white", boxShadow: "0 8px 30px rgba(16,185,129,0.35)" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#059669"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#10b981"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <Calculator className="w-5 h-5" />
            Start for free — no signup needed
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: "1px solid hsl(222,35%,12%)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Calculator className="w-4 h-4" style={{ color: "#34d399" }} />
              </div>
              <span className="font-bold">Forge<span style={{ color: "#34d399" }}>Cost</span></span>
            </div>
            <p className="text-xs text-center" style={{ color: "hsl(215,20%,40%)" }}>
              © 2026 ForgeCost · Free material cost calculator for tradespeople
            </p>
            <div className="flex items-center gap-5 text-xs" style={{ color: "hsl(215,20%,45%)" }}>
              <Link href="/privacy"
                className="transition-colors"
                onMouseEnter={(e) => (e.currentTarget.style.color = "#34d399")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "hsl(215,20%,45%)")}
              >Privacy</Link>
              <Link href="/terms"
                className="transition-colors"
                onMouseEnter={(e) => (e.currentTarget.style.color = "#34d399")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "hsl(215,20%,45%)")}
              >Terms</Link>
              <Link href="/app" style={{ color: "#34d399" }}>Open App →</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}