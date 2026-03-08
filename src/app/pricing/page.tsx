"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calculator, Check, X, ArrowRight, Zap, Sparkles,
  FileText, Palette, Mail, Infinity, Clock, Shield, ChevronDown,
} from "lucide-react";

const MONTHLY_PRICE = 15;
const ANNUAL_PRICE  = 149.99;
const ANNUAL_MONTHLY = (ANNUAL_PRICE / 12).toFixed(2);
const ANNUAL_SAVING  = Math.round((1 - ANNUAL_PRICE / (MONTHLY_PRICE * 12)) * 100);

const FREE_FEATURES = [
  { text: "Up to 5 quotes per month",      included: true },
  { text: "3 saved templates",              included: true },
  { text: "10 trades pre-loaded",           included: true },
  { text: "Professional PDF download",      included: true },
  { text: "Quote history",                  included: true },
  { text: "Works offline (PWA)",            included: true },
  { text: "Unlimited quotes",               included: false },
  { text: "Custom logo on PDF",             included: false },
  { text: "Brand color on PDF",             included: false },
  { text: "Email quotes to clients",        included: false },
  { text: "Unlimited templates",            included: false },
  { text: "Remove ForgeCost watermark",     included: false },
];

const PRO_FEATURES = [
  { text: "Everything in Free",             included: true },
  { text: "Unlimited quotes",               included: true },
  { text: "Unlimited saved templates",      included: true },
  { text: "Custom logo on every PDF",       included: true },
  { text: "Brand color on every PDF",       included: true },
  { text: "Email quotes directly to clients", included: true },
  { text: "Remove ForgeCost watermark",     included: true },
  { text: "Priority support",               included: true },
];

const FAQS = [
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel from your account settings at any time. You'll keep Pro access until the end of your billing period. No questions asked.",
  },
  {
    q: "What happens to my quotes when I cancel?",
    a: "All your quotes and templates remain saved. You just lose access to Pro features (custom branding, email sending, unlimited quotes) and revert to the free plan limits.",
  },
  {
    q: "Is there a free trial?",
    a: "The free plan is your trial — it's genuinely useful with 5 quotes per month. Most tradespeople know within their first quote whether ForgeCost saves them time.",
  },
  {
    q: "Can I switch between monthly and annual?",
    a: "Yes. You can switch at any time from your account settings. If you switch to annual, we'll prorate any remaining monthly credit.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit and debit cards via Dodo Payments. Payments are processed securely and your card details are never stored on our servers.",
  },
  {
    q: "I'm a solo tradesperson — is Pro worth it?",
    a: "If you're doing more than 5 quotes a month, yes. At $15/mo that's $0.75 per professional quote that impresses clients and wins more jobs.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-xl overflow-hidden transition-all"
      style={{ border: "1px solid hsl(222,35%,16%)", background: open ? "hsl(222,40%,9%)" : "transparent" }}
    >
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left gap-4"
        onClick={() => setOpen(!open)}
      >
        <span className="text-sm font-medium text-white">{q}</span>
        <ChevronDown
          className="w-4 h-4 flex-shrink-0 transition-transform duration-200"
          style={{ color: "#34d399", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm leading-relaxed" style={{ color: "hsl(215,20%,65%)" }}>
          {a}
        </div>
      )}
    </div>
  );
}

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: "hsl(222,47%,5%)", color: "white" }}>
      {/* Nav */}
      <nav style={{ borderBottom: "1px solid hsl(222,35%,12%)", background: "rgba(10,13,24,0.9)", backdropFilter: "blur(16px)", position: "sticky", top: 0, zIndex: 40 }}>
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Calculator className="w-4 h-4" style={{ color: "#34d399" }} />
            </div>
            <span className="font-bold">Forge<span style={{ color: "#34d399" }}>Cost</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/app" className="text-sm transition-colors" style={{ color: "hsl(215,20%,55%)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "hsl(215,20%,55%)")}
            >
              Open app
            </Link>
            <Link href="/app"
              className="text-sm font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all"
              style={{ background: "#10b981", color: "white" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#059669")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#10b981")}
            >
              Try free <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-16">

        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-5"
            style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", color: "#34d399" }}>
            <Zap className="w-3 h-3" /> Simple, honest pricing
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight">
            Start free.<br />
            <span style={{ color: "#34d399" }}>Upgrade when you're ready.</span>
          </h1>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "hsl(215,20%,60%)" }}>
            No contracts. No hidden fees. Cancel anytime. Built for solo tradespeople who want professional quotes without the faff.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <span className="text-sm" style={{ color: annual ? "hsl(215,20%,45%)" : "white" }}>Monthly</span>
          <button
            onClick={() => setAnnual(!annual)}
            className="relative rounded-full transition-colors"
            style={{ width: 48, height: 26, background: annual ? "#10b981" : "hsl(222,35%,20%)" }}
          >
            <span
              className="absolute top-1 rounded-full bg-white transition-all duration-200"
              style={{ width: 18, height: 18, left: annual ? 26 : 4 }}
            />
          </button>
          <span className="text-sm flex items-center gap-2" style={{ color: annual ? "white" : "hsl(215,20%,45%)" }}>
            Annual
            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(16,185,129,0.15)", color: "#34d399" }}>
              -{ANNUAL_SAVING}%
            </span>
          </span>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">

          {/* Free */}
          <div className="rounded-2xl p-7" style={{ background: "hsl(222,40%,8%)", border: "1px solid hsl(222,35%,16%)" }}>
            <div className="mb-6">
              <p className="text-sm font-semibold mb-1" style={{ color: "hsl(215,20%,55%)" }}>Free</p>
              <div className="flex items-end gap-1 mb-2">
                <span className="text-4xl font-extrabold">$0</span>
                <span className="text-sm mb-1.5" style={{ color: "hsl(215,20%,55%)" }}>/month</span>
              </div>
              <p className="text-sm" style={{ color: "hsl(215,20%,55%)" }}>Forever free. No credit card needed.</p>
            </div>

            <Link href="/app"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold mb-6 transition-all"
              style={{ border: "1px solid hsl(222,35%,22%)", color: "white", background: "transparent" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "hsl(222,35%,32%)"; e.currentTarget.style.background = "hsl(222,35%,12%)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "hsl(222,35%,22%)"; e.currentTarget.style.background = "transparent"; }}
            >
              Get started free
            </Link>

            <ul className="space-y-3">
              {FREE_FEATURES.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  {f.included
                    ? <Check className="w-4 h-4 flex-shrink-0" style={{ color: "#34d399" }} />
                    : <X className="w-4 h-4 flex-shrink-0" style={{ color: "hsl(215,20%,30%)" }} />
                  }
                  <span style={{ color: f.included ? "hsl(215,20%,75%)" : "hsl(215,20%,35%)" }}>{f.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pro */}
          <div className="rounded-2xl p-7 relative overflow-hidden"
            style={{ background: "hsl(222,40%,9%)", border: "1px solid rgba(16,185,129,0.35)", boxShadow: "0 0 40px rgba(16,185,129,0.08)" }}>

            {/* Popular badge */}
            <div className="absolute top-5 right-5 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1"
              style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", color: "#34d399" }}>
              <Sparkles className="w-3 h-3" /> Most popular
            </div>

            <div className="mb-6">
              <p className="text-sm font-semibold mb-1" style={{ color: "#34d399" }}>Pro</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-4xl font-extrabold">
                  ${annual ? ANNUAL_MONTHLY : MONTHLY_PRICE}
                </span>
                <span className="text-sm mb-1.5" style={{ color: "hsl(215,20%,55%)" }}>/month</span>
              </div>
              {annual && (
                <p className="text-xs mb-1" style={{ color: "#34d399" }}>
                  Billed as ${ANNUAL_PRICE}/year
                </p>
              )}
              <p className="text-sm" style={{ color: "hsl(215,20%,55%)" }}>
                {annual ? `Save $${(MONTHLY_PRICE * 12 - ANNUAL_PRICE).toFixed(2)} vs monthly` : "Billed monthly, cancel anytime"}
              </p>
            </div>

            <Link href="/app"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold mb-6 transition-all"
              style={{ background: "#10b981", color: "white", boxShadow: "0 4px 14px rgba(16,185,129,0.3)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#059669")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#10b981")}
            >
              <Zap className="w-4 h-4" /> Upgrade to Pro
            </Link>

            <ul className="space-y-3">
              {PRO_FEATURES.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 flex-shrink-0" style={{ color: "#34d399" }} />
                  <span style={{ color: "hsl(215,20%,80%)" }}>{f.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">What Pro actually gives you</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <Infinity className="w-5 h-5" style={{ color: "#34d399" }} />, title: "Unlimited quotes", desc: "No monthly cap. Quote as many jobs as you want." },
              { icon: <Palette className="w-5 h-5" style={{ color: "#34d399" }} />, title: "Your brand on PDFs", desc: "Add your logo and colors. Looks like you hired a designer." },
              { icon: <Mail className="w-5 h-5" style={{ color: "#34d399" }} />, title: "Email to clients", desc: "Send the PDF quote directly from ForgeCost. No attachments." },
              { icon: <FileText className="w-5 h-5" style={{ color: "#34d399" }} />, title: "No watermark", desc: "Clean, professional PDFs with no ForgeCost branding." },
            ].map((item, i) => (
              <div key={i} className="rounded-xl p-5" style={{ background: "hsl(222,40%,8%)", border: "1px solid hsl(222,35%,15%)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
                  {item.icon}
                </div>
                <p className="font-semibold text-white text-sm mb-1">{item.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: "hsl(215,20%,55%)" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust row */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-16">
          {[
            { icon: <Shield className="w-4 h-4" />, text: "Cancel anytime" },
            { icon: <Clock className="w-4 h-4" />, text: "No long-term contracts" },
            { icon: <Check className="w-4 h-4" />, text: "Secure payments via Dodo" },
            { icon: <Zap className="w-4 h-4" />, text: "Instant access after upgrade" },
          ].map((t, i) => (
            <div key={i} className="flex items-center gap-2 text-sm" style={{ color: "hsl(215,20%,50%)" }}>
              <span style={{ color: "#34d399" }}>{t.icon}</span>
              {t.text}
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently asked questions</h2>
          <div className="space-y-3">
            {FAQS.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center rounded-2xl p-10"
          style={{ background: "hsl(222,40%,8%)", border: "1px solid hsl(222,35%,16%)" }}>
          <h2 className="text-2xl font-bold mb-2">Ready to stop undercharging?</h2>
          <p className="mb-6 text-sm" style={{ color: "hsl(215,20%,60%)" }}>
            Join tradespeople who use ForgeCost to quote faster and win more jobs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/app"
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{ background: "#10b981", color: "white", boxShadow: "0 4px 14px rgba(16,185,129,0.3)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#059669")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#10b981")}
            >
              <Zap className="w-4 h-4" /> Start free — no card needed
            </Link>
            <Link href="/app"
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{ border: "1px solid hsl(222,35%,22%)", color: "hsl(215,20%,70%)" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.3)"; e.currentTarget.style.color = "white"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "hsl(222,35%,22%)"; e.currentTarget.style.color = "hsl(215,20%,70%)"; }}
            >
              See it in action <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-xs" style={{ borderColor: "hsl(222,35%,12%)", color: "hsl(215,20%,40%)" }}>
        <div className="flex items-center justify-center gap-4">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/app" className="hover:text-white transition-colors">App</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
        </div>
        <p className="mt-3">© {new Date().getFullYear()} ForgeCost. All rights reserved.</p>
      </footer>
    </div>
  );
}
