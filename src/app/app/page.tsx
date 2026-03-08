"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Wrench, Zap, Hammer, Leaf, Palette, MoreHorizontal,
  Plus, Trash2, Download, ChevronDown, Calculator,
  FileText, Sparkles, LogIn, LogOut, BookOpen,
  History, Save, User, X, Loader2, Crown,
  Wind, Paintbrush, Layers, Flame,
  Mail, Settings2,
} from "lucide-react";

import type { User as SupabaseUser } from "@supabase/supabase-js";

import { TRADES, getDefaultMaterials, calcTotals, formatCurrency, genId, type Trade, type Material } from "@/lib/trades";
import { downloadPdfQuote } from "@/lib/generatePdf";
import { supabase } from "@/lib/supabase";
import { signOut } from "@/lib/auth";
import Link from "next/link";
import { saveTemplate, saveQuote } from "@/lib/db";
import type { SavedTemplate } from "@/lib/supabase";

import AuthModal from "@/components/AuthModal";
import TemplatesPanel from "@/components/TemplatesPanel";
import QuoteHistory from "@/components/QuoteHistory";

import EmailQuoteModal from "@/components/EmailQuoteModal";

import {
  getUserProfile,
  isPro,
  hasHitQuoteLimit,
  hasHitTemplateLimit,
  incrementQuotesUsed,
  type UserProfile,
} from "@/lib/subscription";
import UpgradeModal from "@/components/UpgradeModal";
import BrandingModal, { type BrandingSettings } from "@/components/BrandingModal";



const TRADE_ICONS: Record<Trade, React.ReactNode> = {
  Plumber: <Wrench className="w-4 h-4" />,
  Electrician: <Zap className="w-4 h-4" />,
  Handyman: <Hammer className="w-4 h-4" />,
  Landscaper: <Leaf className="w-4 h-4" />,
  "Tattoo Artist": <Palette className="w-4 h-4" />,
  "HVAC Technician": <Wind className="w-4 h-4" />,
  Painter: <Paintbrush className="w-4 h-4" />,
  Carpenter: <Layers className="w-4 h-4" />,
  Welder: <Flame className="w-4 h-4" />,
  Other: <MoreHorizontal className="w-4 h-4" />,
};

function DarkInput({ value, onChange, placeholder, type = "text", className = "", min, step }: {
  value: string | number; onChange: (v: string) => void; placeholder?: string;
  type?: string; className?: string; min?: string; step?: string;
}) {
  return (
    <input
      type={type} min={min} step={step} value={value} placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`bg-[hsl(222,35%,12%)] border border-[hsl(222,35%,18%)] rounded-lg px-3 py-2 text-sm text-white placeholder:text-[hsl(215,20%,40%)] focus:outline-none focus:border-[#10b981] transition-all ${className}`}
    />
  );
}

function StatCard({ label, value, accent = false, large = false }: {
  label: string; value: string; accent?: boolean; large?: boolean;
}) {
  return (
    <div className={`rounded-xl p-4 border transition-all ${accent ? "bg-[#10b981]/10 border-[#10b981]/30" : "bg-[hsl(222,40%,9%)] border-[hsl(222,35%,16%)]"}`}>
      <p className="text-xs text-[hsl(215,20%,55%)] uppercase tracking-widest mb-1">{label}</p>
      <p className={`font-bold tabular-nums ${large ? "text-2xl" : "text-xl"} ${accent ? "text-[#34d399]" : "text-white"}`}>{value}</p>
    </div>
  );
}

type DrawerTab = "templates" | "history" | null;

export default function ForgeCostPage() {
  const [selectedTrade, setSelectedTrade] = useState<Trade>("Plumber");
  const [tradeDropdownOpen, setTradeDropdownOpen] = useState(false);
  const [jobName, setJobName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [notes, setNotes] = useState("");
  const [markupPct, setMarkupPct] = useState<number>(20);
  const [materials, setMaterials] = useState<Material[]>(() => getDefaultMaterials("Plumber"));
  const [newMatName, setNewMatName] = useState("");
  const [newMatUnit, setNewMatUnit] = useState("");
  const [newForgeCost, setNewForgeCost] = useState("");
  const [newMatQty, setNewMatQty] = useState("1");
  const [addFormOpen, setAddFormOpen] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  // Auth state
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<DrawerTab>(null);

  // Save states
  const [saveTemplateLoading, setSaveTemplateLoading] = useState(false);
  const [saveQuoteLoading, setSaveQuoteLoading] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateNamePrompt, setTemplateNamePrompt] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState("");

  //updated
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState<"quotes" | "templates" | "history" | "branding">("quotes");

  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  //email state
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  // branding state (Pro)
  const [brandingModalOpen, setBrandingModalOpen] = useState(false);
  const [brandingSettings, setBrandingSettings] = useState<BrandingSettings>({
    logoBase64: null,
    brandColor: "#10b981",
    includeLogo: false,
  });

// Listen for auth state changes
useEffect(() => {
  async function loadUser() {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      const profile = await getUserProfile();
      setUserProfile(profile);
    }
  }

  async function checkPaymentSuccess() {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") !== "success") return;

    window.history.replaceState({}, "", "/app");

    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) return;

    const res = await fetch("/api/dodo/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currentUser.id }),
    });
    const { verified } = await res.json();
    if (verified) {
      showSaveSuccess("🎉 Welcome to Pro! Your account has been upgraded.");
      const profile = await getUserProfile();
      setUserProfile(profile);
    } else {
      showSaveSuccess("Payment pending — please refresh in a moment.");
    }
  }

  loadUser();
  checkPaymentSuccess();

  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const profile = await getUserProfile();
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
    }
  );
  return () => subscription.unsubscribe();
}, []);

  useEffect(() => {
    const customMats = materials.filter((m) => m.isCustom);
    setMaterials([...getDefaultMaterials(selectedTrade), ...customMats]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTrade]);

  const { subtotal, markupAmount, grandTotal } = calcTotals(materials, markupPct);
  const activeMaterialCount = materials.filter((m) => m.quantity > 0).length;

  const updateQuantity = useCallback((id: string, qty: string) => {
    const parsed = parseFloat(qty);
    setMaterials((prev) => prev.map((m) => m.id === id ? { ...m, quantity: isNaN(parsed) ? 0 : Math.max(0, parsed) } : m));
  }, []);

  const updateCostPerUnit = useCallback((id: string, cost: string) => {
    const parsed = parseFloat(cost);
    setMaterials((prev) => prev.map((m) => m.id === id ? { ...m, costPerUnit: isNaN(parsed) ? 0 : Math.max(0, parsed) } : m));
  }, []);

  const deleteMaterial = useCallback((id: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const addCustomMaterial = useCallback(() => {
    const cost = parseFloat(newForgeCost);
    const qty = parseFloat(newMatQty);
    if (!newMatName.trim() || isNaN(cost) || cost < 0) return;
    setMaterials((prev) => [...prev, {
      id: genId("custom"), name: newMatName.trim(),
      unit: newMatUnit.trim() || "each", costPerUnit: cost,
      quantity: isNaN(qty) ? 1 : Math.max(0, qty), isCustom: true,
    }]);
    setNewMatName(""); setNewMatUnit(""); setNewForgeCost(""); setNewMatQty("1");
    setAddFormOpen(false);
  }, [newMatName, newMatUnit, newForgeCost, newMatQty]);

  const handleDownloadPdf = useCallback(async () => {
  // Check quote limit for free users
  // Anonymous users: limit to 2 downloads, then prompt sign in
if (!user) {
  const anonCount = parseInt(localStorage.getItem("ForgeCost_anon_downloads") ?? "0");
  if (anonCount >= 2) {
    setAuthModalOpen(true);
    return;
  }
  localStorage.setItem("ForgeCost_anon_downloads", String(anonCount + 1));
}

// Logged in free users: check quote limit
if (user && userProfile && !isPro(userProfile)) {
  if (hasHitQuoteLimit(userProfile)) {
    setUpgradeReason("quotes");
    setUpgradeModalOpen(true);
    return;
  }
}

  setPdfLoading(true);
  try {
    await downloadPdfQuote({
      jobName: jobName || "Untitled Job",
      trade: selectedTrade,
      date: today,
      materials,
      markupPct,
      companyName: companyName || undefined,
      notes: notes || undefined,
      isPro: isPro(userProfile),
      logoBase64: isPro(userProfile) && brandingSettings.includeLogo && brandingSettings.logoBase64
        ? brandingSettings.logoBase64
        : undefined,
      brandColor: isPro(userProfile) ? brandingSettings.brandColor : undefined,
    });

    // Save quote + increment counter if logged in
    if (user && grandTotal > 0) {
      setSaveQuoteLoading(true);
      await saveQuote({
        jobName: jobName || "Untitled Job",
        trade: selectedTrade,
        companyName,
        notes,
        materials,
        markupPct,
        subtotal,
        grandTotal,
      });

      // Increment usage counter for free users
      if (userProfile && !isPro(userProfile)) {
        await incrementQuotesUsed(user.id);
        setUserProfile((prev) =>
          prev ? { ...prev, quotes_used: prev.quotes_used + 1 } : prev
        );
      }

      setSaveQuoteLoading(false);
      showSaveSuccess("Quote saved to history!");
        }
      } catch (err) {
        console.error("PDF generation failed:", err);
        alert("PDF generation failed. Please try again.");
      } finally {
        setPdfLoading(false);
      }
    }, [jobName, selectedTrade, today, materials, markupPct, companyName, notes, user, grandTotal, subtotal, userProfile]);

  function showSaveSuccess(msg: string) {
    setSaveSuccess(msg);
    setTimeout(() => setSaveSuccess(""), 3000);
  }

  async function handleSaveTemplate() {
    if (!user) { setAuthModalOpen(true); return; }

  // Check template limit
    const { data: existingTemplates } = await supabase
      .from("templates")
      .select("id")
      .eq("user_id", user.id);
     const count = existingTemplates?.length ?? 0;
    if (userProfile && hasHitTemplateLimit(userProfile, count)) {
      setUpgradeReason("templates");
      setUpgradeModalOpen(true);
      return;
    }
    if (!templateName.trim()) return;
    setSaveTemplateLoading(true);
    const { error } = await saveTemplate({
      name: templateName,
      trade: selectedTrade,
      materials,
      markupPct,
    });
    setSaveTemplateLoading(false);
    if (!error) {
      setTemplateNamePrompt(false);
      setTemplateName("");
      showSaveSuccess("Template saved!");
    } else {
      alert("Failed to save template: " + error.message);
    }
  }

  function handleLoadTemplate(t: SavedTemplate) {
    setSelectedTrade(t.trade as Trade);
    setMaterials(t.materials as Material[]);
    setMarkupPct(t.markup_pct);
    setDrawerTab(null);
    showSaveSuccess(`Loaded template: ${t.name}`);
  }

  async function handleSignOut() {
    await signOut();
    setDrawerTab(null);
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "hsl(222,47%,6%)", color: "hsl(210,40%,96%)" }}>
      {/* Grid texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "linear-gradient(hsl(160,84%,39%) 1px,transparent 1px),linear-gradient(90deg,hsl(160,84%,39%) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />

      {/* Auth modal */}
      {authModalOpen && (
        <AuthModal onClose={() => setAuthModalOpen(false)} onSuccess={() => showSaveSuccess("Signed in!")} />
        )}
        {upgradeModalOpen && (
  user ? (
    <UpgradeModal
      onClose={() => setUpgradeModalOpen(false)}
      userId={user.id}
      userEmail={user.email ?? ""}
      userName={companyName || undefined}
      reason={upgradeReason}
    />
  ) : (
    <AuthModal
      onClose={() => setUpgradeModalOpen(false)}
      onSuccess={() => {
        setUpgradeModalOpen(false);
        showSaveSuccess("Signed in! Now you can upgrade to Pro.");
      }}
    />
  )
)}

{brandingModalOpen && (
  <BrandingModal
    onClose={() => setBrandingModalOpen(false)}
    onApply={(settings) => setBrandingSettings(settings)}
    current={brandingSettings}
  />
)}

{emailModalOpen && (
  <EmailQuoteModal
    onClose={() => setEmailModalOpen(false)}
    jobName={jobName}
    companyName={companyName}
    trade={selectedTrade}
    date={today}
    materials={materials}
    markupPct={markupPct}
    subtotal={subtotal}
    markupAmount={markupAmount}
    grandTotal={grandTotal}
    notes={notes}
    isPro={isPro(userProfile)}
    onUpgradeClick={() => {
      setEmailModalOpen(false);
      setUpgradeReason("branding");
      setUpgradeModalOpen(true);
    }}
  />
)}


      {/* Header */}
      <header style={{ borderBottom: "1px solid hsl(222,35%,14%)", backgroundColor: "hsl(222,47%,5%)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div style={{ width: 36, height: 36, borderRadius: 12, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Calculator className="w-5 h-5" style={{ color: "#34d399" }} />
            </div>
            <div>
              <span className="text-lg font-bold">Forge<span style={{ color: "#34d399" }}>Cost</span></span>
              <p className="text-xs" style={{ color: "hsl(215,20%,55%)", lineHeight: 1, marginTop: 2 }}>Material Cost Calculator</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isPro(userProfile) ? (
  <span className="hidden sm:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-semibold"
    style={{ color: "#fbbf24", background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)" }}>
    <Crown className="w-3 h-3" /> Pro Plan Active
  </span>
) : (
  <span className="hidden sm:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
    style={{ color: "hsl(215,20%,55%)", background: "hsl(222,40%,9%)", border: "1px solid hsl(222,35%,16%)" }}>
    <Sparkles className="w-3 h-3" style={{ color: "#34d399" }} /> Free Plan
  </span>
)}

            {user ? (
              <div className="flex items-center gap-2">
                {/* Templates button */}
                <button
                  onClick={() => setDrawerTab(drawerTab === "templates" ? null : "templates")}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-all"
                  style={{ color: drawerTab === "templates" ? "#10b981" : "hsl(215,20%,55%)", background: drawerTab === "templates" ? "rgba(16,185,129,0.1)" : "hsl(222,40%,9%)", border: `1px solid ${drawerTab === "templates" ? "rgba(16,185,129,0.3)" : "hsl(222,35%,16%)"}` }}
                >
                  <BookOpen className="w-3 h-3" /> Templates
                </button>
                {/* History button */}
                <button
                  onClick={() => setDrawerTab(drawerTab === "history" ? null : "history")}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-all"
                  style={{ color: drawerTab === "history" ? "#10b981" : "hsl(215,20%,55%)", background: drawerTab === "history" ? "rgba(16,185,129,0.1)" : "hsl(222,40%,9%)", border: `1px solid ${drawerTab === "history" ? "rgba(16,185,129,0.3)" : "hsl(222,35%,16%)"}` }}
                >
                  <History className="w-3 h-3" /> History
                </button>
                {/* User menu */}
                <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
                  style={{ color: "hsl(215,20%,55%)", background: "hsl(222,40%,9%)", border: "1px solid hsl(222,35%,16%)" }}
                >
                  {isPro(userProfile) ? (
                    <Crown className="w-3 h-3" style={{ color: "#34d399" }} />
                  ) : (
                    <User className="w-3 h-3" style={{ color: "#34d399" }} />
                  )}
                  <span className="hidden sm:inline max-w-[100px] truncate">{user.email}</span>
                  {isPro(userProfile) && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1"
                      style={{ background: "rgba(16,185,129,0.2)", color: "#34d399" }}
                    >PRO</span>
                  )}
                </div>                
                {isPro(userProfile) && (
                  <button
                    onClick={() => setBrandingModalOpen(true)}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-all"
                    style={{ color: "hsl(215,20%,55%)", background: "hsl(222,40%,9%)", border: "1px solid hsl(222,35%,16%)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#fbbf24"; e.currentTarget.style.borderColor = "rgba(251,191,36,0.4)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "hsl(215,20%,55%)"; e.currentTarget.style.borderColor = "hsl(222,35%,16%)"; }}
                  >
                    <Settings2 className="w-3 h-3" /> PDF Branding
                  </button>
                )}
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-all"
                  style={{ color: "hsl(215,20%,55%)", background: "hsl(222,40%,9%)", border: "1px solid hsl(222,35%,16%)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.borderColor = "rgba(248,113,113,0.4)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "hsl(215,20%,55%)"; e.currentTarget.style.borderColor = "hsl(222,35%,16%)"; }}
                >
                  <LogOut className="w-3 h-3" />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full transition-all"
                style={{ background: "#10b981", color: "white" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#059669")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#10b981")}
              >
                <LogIn className="w-4 h-4" /> Sign in
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Drawer: Templates / History */}
      {drawerTab && (
        <div style={{ background: "hsl(222,40%,8%)", borderBottom: "1px solid hsl(222,35%,14%)" }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white flex items-center gap-2">
                {drawerTab === "templates" ? <><BookOpen className="w-4 h-4" style={{ color: "#34d399" }} /> Saved Templates</> : <><History className="w-4 h-4" style={{ color: "#34d399" }} /> Quote History</>}
              </h3>
              <button onClick={() => setDrawerTab(null)} className="text-[hsl(215,20%,55%)] hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            {drawerTab === "templates" ? <TemplatesPanel onLoad={handleLoadTemplate} /> : <QuoteHistory />}
          </div>
        </div>
      )}

      {/* Success toast */}
      {saveSuccess && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium shadow-xl" style={{ background: "#10b981", color: "white" }}>
          ✓ {saveSuccess}
        </div>
      )}

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-6">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
          Stop undercharging. <span style={{ color: "#34d399" }}>Know your costs.</span>
        </h1>
        <p className="text-base sm:text-lg" style={{ color: "hsl(215,20%,55%)" }}>
          Pick your trade, enter quantities, set your markup — download a professional PDF quote in seconds.
        </p>
      </section>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          {/* Left */}
          <div className="space-y-5">
            {/* Job details */}
            <div className="rounded-2xl p-5" style={{ border: "1px solid hsl(222,35%,16%)", background: "hsl(222,40%,9%)" }}>
              <h2 className="text-sm font-semibold flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4" style={{ color: "#34d399" }} /> Job Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Trade */}
                <div className="sm:col-span-2 lg:col-span-1">
                  <label className="block text-xs uppercase tracking-widest mb-1.5" style={{ color: "hsl(215,20%,55%)" }}>Trade</label>
                  <div className="relative">
                    <button
                      onClick={() => setTradeDropdownOpen((p) => !p)}
                      className="w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-all"
                      style={{ background: "hsl(222,35%,12%)", border: "1px solid hsl(222,35%,18%)", color: "white" }}
                    >
                      <span className="flex items-center gap-2">
                        <span style={{ color: "#34d399" }}>{TRADE_ICONS[selectedTrade]}</span>
                        {selectedTrade}
                      </span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${tradeDropdownOpen ? "rotate-180" : ""}`} style={{ color: "hsl(215,20%,55%)" }} />
                    </button>
                    {tradeDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 rounded-xl shadow-2xl z-50 overflow-hidden" style={{ border: "1px solid hsl(222,35%,18%)", background: "hsl(222,40%,9%)" }}>
                        {TRADES.map((trade) => (
                          <button key={trade} onClick={() => { setSelectedTrade(trade); setTradeDropdownOpen(false); }}
                            className="w-full flex items-center gap-2.5 px-4 py-3 text-sm transition-colors hover:bg-[hsl(222,35%,14%)]"
                            style={{ color: selectedTrade === trade ? "#10b981" : "white", background: selectedTrade === trade ? "rgba(16,185,129,0.05)" : "transparent" }}
                          >
                            <span style={{ color: selectedTrade === trade ? "#10b981" : "hsl(215,20%,55%)" }}>{TRADE_ICONS[trade]}</span>
                            {trade}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-1.5" style={{ color: "hsl(215,20%,55%)" }}>Job Name</label>
                  <DarkInput value={jobName} onChange={setJobName} placeholder="e.g. Kitchen remodel" className="w-full" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-1.5" style={{ color: "hsl(215,20%,55%)" }}>Your Name / Company</label>
                  <DarkInput value={companyName} onChange={setCompanyName} placeholder="e.g. John's Plumbing LLC" className="w-full" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-1.5" style={{ color: "hsl(215,20%,55%)" }}>Markup %</label>
                  <div className="flex items-center gap-2">
                    <DarkInput type="number" min="0" step="1" value={markupPct} onChange={(v) => setMarkupPct(Math.max(0, parseFloat(v) || 0))} className="w-full" placeholder="20" />
                    <span className="text-sm font-mono" style={{ color: "hsl(215,20%,55%)" }}>%</span>
                  </div>
                  <p className="text-[11px] mt-1" style={{ color: "hsl(215,20%,40%)" }}>Typical: 15–35% for materials</p>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-1.5" style={{ color: "hsl(215,20%,55%)" }}>Date</label>
                  <div className="rounded-lg px-3 py-2.5 text-sm" style={{ background: "hsl(222,35%,12%)", border: "1px solid hsl(222,35%,18%)", color: "hsl(215,20%,55%)" }}>{today}</div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-widest mb-1.5" style={{ color: "hsl(215,20%,55%)" }}>Notes (optional)</label>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any notes for the customer or yourself…" rows={2}
                    className="w-full rounded-lg px-3 py-2 text-sm resize-none focus:outline-none transition-all"
                    style={{ background: "hsl(222,35%,12%)", border: "1px solid hsl(222,35%,18%)", color: "white" }}
                  />
                </div>
              </div>

              {/* Save as template row */}
              {user && (
                <div className="mt-4 pt-4" style={{ borderTop: "1px solid hsl(222,35%,14%)" }}>
                  {!templateNamePrompt ? (
                    <button onClick={() => setTemplateNamePrompt(true)} className="flex items-center gap-2 text-sm font-medium transition-colors" style={{ color: "#10b981" }}>
                      <Save className="w-4 h-4" /> Save current setup as template
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <DarkInput value={templateName} onChange={setTemplateName} placeholder="Template name (e.g. Standard bathroom)" className="flex-1" />
                      <button onClick={handleSaveTemplate} disabled={saveTemplateLoading || !templateName.trim()}
                        className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-40 transition-colors"
                        style={{ background: "#10b981", color: "white" }}
                      >
                        {saveTemplateLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
                      </button>
                      <button onClick={() => { setTemplateNamePrompt(false); setTemplateName(""); }} className="text-sm px-2 py-2 transition-colors" style={{ color: "hsl(215,20%,55%)" }}>
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Materials table */}
            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid hsl(222,35%,16%)", background: "hsl(222,40%,9%)" }}>
              <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid hsl(222,35%,14%)" }}>
                <h2 className="text-sm font-semibold flex items-center gap-2">
                  <Wrench className="w-4 h-4" style={{ color: "#34d399" }} />
                  Materials
                  {activeMaterialCount > 0 && (
                    <span className="ml-1 text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "rgba(16,185,129,0.15)", color: "#34d399" }}>
                      {activeMaterialCount} active
                    </span>
                  )}
                </h2>
                <p className="text-xs" style={{ color: "hsl(215,20%,55%)" }}>Set qty to 0 to exclude</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: "1px solid hsl(222,35%,14%)" }}>
                      {["Material", "Unit", "Cost/Unit", "Qty", "Subtotal", ""].map((h, i) => (
                        <th key={i} className={`text-xs uppercase tracking-wider px-${i === 0 ? "5" : "3"} py-3 font-medium ${i >= 2 && i < 5 ? "text-right" : i === 4 ? "text-right" : i === 1 ? "text-center" : "text-left"}`} style={{ color: "hsl(215,20%,55%)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {materials.length === 0 && (
                      <tr><td colSpan={6} className="text-center py-12 text-sm" style={{ color: "hsl(215,20%,55%)" }}>No materials. Select a trade or add custom materials.</td></tr>
                    )}
                    {materials.map((mat) => {
                      const lineTotal = mat.quantity * mat.costPerUnit;
                      const isActive = mat.quantity > 0;
                      return (
                        <tr key={mat.id} style={{ borderBottom: "1px solid hsl(222,35%,12%)", background: isActive ? "rgba(16,185,129,0.02)" : "transparent", opacity: isActive ? 1 : 0.5 }}>
                          <td className="px-5 py-3 font-medium text-white">
                            <span className="flex items-center gap-2">
                              {mat.isCustom && <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ background: "rgba(16,185,129,0.15)", color: "#34d399" }}>custom</span>}
                              {mat.name}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-center" style={{ color: "hsl(215,20%,55%)" }}>{mat.unit}</td>
                          <td className="px-3 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <span className="text-xs" style={{ color: "hsl(215,20%,55%)" }}>$</span>
                              <input type="number" min="0" step="0.01" value={mat.costPerUnit || ""}
                                onChange={(e) => updateCostPerUnit(mat.id, e.target.value)}
                                className="w-20 text-right bg-transparent focus:outline-none text-sm text-white tabular-nums"
                                style={{ borderBottom: "1px solid transparent" }}
                                onFocus={(e) => e.target.style.borderBottomColor = "#10b981"}
                                onBlur={(e) => e.target.style.borderBottomColor = "transparent"}
                              />
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <input type="number" min="0" step="1" value={mat.quantity || ""} onChange={(e) => updateQuantity(mat.id, e.target.value)} placeholder="0"
                              className="w-16 text-center rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none tabular-nums transition-all"
                              style={{ background: "hsl(222,35%,12%)", border: "1px solid hsl(222,35%,18%)" }}
                            />
                          </td>
                          <td className="px-3 py-3 text-right font-semibold tabular-nums" style={{ color: isActive ? "white" : "hsl(215,20%,55%)" }}>
                            {formatCurrency(lineTotal)}
                          </td>
                          <td className="px-3 py-3">
                            <button onClick={() => deleteMaterial(mat.id)} className="p-1 rounded transition-colors" style={{ color: "hsl(215,20%,55%)" }}
                              onMouseEnter={(e) => (e.currentTarget.style.color = "#f87171")}
                              onMouseLeave={(e) => (e.currentTarget.style.color = "hsl(215,20%,55%)")}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Add material */}
              <div className="px-5 py-4" style={{ borderTop: "1px solid hsl(222,35%,14%)" }}>
                {!addFormOpen ? (
                  <button onClick={() => setAddFormOpen(true)} className="flex items-center gap-2 text-sm font-medium transition-colors" style={{ color: "#10b981" }}>
                    <Plus className="w-4 h-4" /> Add custom material
                  </button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "hsl(215,20%,55%)" }}>New Material</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <DarkInput value={newMatName} onChange={setNewMatName} placeholder="Material name" className="sm:col-span-2" />
                      <DarkInput value={newMatUnit} onChange={setNewMatUnit} placeholder="Unit (e.g. ft)" />
                      <DarkInput type="number" min="0" step="0.01" value={newForgeCost} onChange={setNewForgeCost} placeholder="Cost/unit $" />
                    </div>
                    <div className="flex items-center gap-2">
                      <DarkInput type="number" min="0" step="1" value={newMatQty} onChange={setNewMatQty} placeholder="Qty" className="w-28" />
                      <button onClick={addCustomMaterial} disabled={!newMatName.trim() || !newForgeCost}
                        className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-40 transition-colors"
                        style={{ background: "#10b981", color: "white" }}
                      >
                        <Plus className="w-4 h-4" /> Add
                      </button>
                      <button onClick={() => setAddFormOpen(false)} className="text-sm px-3 py-2" style={{ color: "hsl(215,20%,55%)" }}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile totals */}
            <div className="lg:hidden space-y-3">
              <TotalsPanel
  subtotal={subtotal}
  markupPct={markupPct}
  markupAmount={markupAmount}
  grandTotal={grandTotal}
  onDownload={handleDownloadPdf}
  pdfLoading={pdfLoading}
  saveQuoteLoading={saveQuoteLoading}
  activeMaterialCount={activeMaterialCount}
  user={user}
  userProfile={userProfile}
  onAuthClick={() => setAuthModalOpen(true)}
  onUpgradeClick={(reason) => {
    setUpgradeReason(reason);
    setUpgradeModalOpen(true);
  }}
  onEmailClick={() => setEmailModalOpen(true)}
  onBrandingClick={() => setBrandingModalOpen(true)}
/>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-6 space-y-4">
              <TotalsPanel
  subtotal={subtotal}
  markupPct={markupPct}
  markupAmount={markupAmount}
  grandTotal={grandTotal}
  onDownload={handleDownloadPdf}
  pdfLoading={pdfLoading}
  saveQuoteLoading={saveQuoteLoading}
  activeMaterialCount={activeMaterialCount}
  user={user}
  userProfile={userProfile}
  onAuthClick={() => setAuthModalOpen(true)}
  onUpgradeClick={(reason) => {
    setUpgradeReason(reason);
    setUpgradeModalOpen(true);
  }}
  onEmailClick={() => setEmailModalOpen(true)}
  onBrandingClick={() => setBrandingModalOpen(true)}
/>
            </div>
          </div>
        </div>
      </main>

      <footer style={{ borderTop: "1px solid hsl(222,35%,14%)" }} className="py-8 text-center">
        <p className="text-xs mb-3" style={{ color: "hsl(215,20%,55%)" }}>
          ForgeCost — Free for solo tradespeople. <span style={{ color: "#34d399" }}>Built to help you earn more.</span>
        </p>
        <div className="flex items-center justify-center gap-5 text-xs" style={{ color: "hsl(215,20%,45%)" }}>
          <Link href="/privacy"
            className="transition-colors"
            onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = "#34d399")}
            onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = "hsl(215,20%,45%)")}>
            Privacy Policy
          </Link>
          <span style={{ color: "hsl(222,35%,22%)" }}>·</span>
          <Link href="/terms"
            className="transition-colors"
            onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = "#34d399")}
            onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = "hsl(215,20%,45%)")}>
            Terms of Service
          </Link>
        </div>
      </footer>
    </div>
  );
}

function TotalsPanel({ subtotal, markupPct, markupAmount, grandTotal, onDownload, pdfLoading, saveQuoteLoading, activeMaterialCount, user, userProfile, onAuthClick, onUpgradeClick, onEmailClick, onBrandingClick }: {
  subtotal: number; markupPct: number; markupAmount: number; grandTotal: number;
  onDownload: () => void; pdfLoading: boolean; saveQuoteLoading: boolean;
  activeMaterialCount: number; user: SupabaseUser | null;
  userProfile: UserProfile | null;
  onAuthClick: () => void; 
  onUpgradeClick: (reason: "quotes" | "templates" | "history" | "branding") => void;
  onEmailClick: () => void;
  onBrandingClick: () => void;
}): React.ReactNode {
  return (
  <>
    <div className="rounded-2xl p-5 space-y-3" style={{ border: "1px solid hsl(222,35%,16%)", background: "hsl(222,40%,9%)" }}>
      <h2 className="text-sm font-semibold flex items-center gap-2 mb-4">
        <Calculator className="w-4 h-4" style={{ color: "#34d399" }} /> Live Quote
      </h2>
      <StatCard label="Material Subtotal" value={formatCurrency(subtotal)} />
      <StatCard label={`Markup (${markupPct}%)`} value={`+ ${formatCurrency(markupAmount)}`} />
      <div style={{ borderTop: "1px solid hsl(222,35%,16%)", margin: "4px 0" }} />
      <StatCard label="Total to Charge" value={formatCurrency(grandTotal)} accent large />
      {activeMaterialCount === 0 && (
        <p className="text-xs text-center pt-1" style={{ color: "hsl(215,20%,55%)" }}>
          Add quantities to materials above
        </p>
      )}
    </div>

    {/* Download button */}
    <button
      onClick={onDownload}
      disabled={pdfLoading || grandTotal === 0}
      className="w-full flex items-center justify-center gap-2.5 font-bold text-base px-6 py-4 rounded-2xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      style={{ background: "#10b981", color: "white", boxShadow: "0 8px 24px rgba(16,185,129,0.2)" }}
    >
      {pdfLoading || saveQuoteLoading ? (
        <><Loader2 className="w-5 h-5 animate-spin" />
          {saveQuoteLoading ? "Saving…" : "Generating PDF…"}
        </>
      ) : (
        <><Download className="w-5 h-5" /> Download PDF Quote</>
      )}
    </button>
    <button
    onClick={onEmailClick}
    disabled={grandTotal === 0}
    className="w-full flex items-center justify-center gap-2.5 font-semibold text-sm px-6 py-3 rounded-2xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
    style={{ border: "1px solid rgba(16,185,129,0.3)", color: "#34d399", background: "rgba(16,185,129,0.05)" }}
  >
    <Mail className="w-4 h-4" /> Email Quote to Customer
  </button>

    {grandTotal === 0 && (
      <p className="text-xs text-center" style={{ color: "hsl(215,20%,55%)" }}>
        Enter quantities to enable download
      </p>
    )}

    {/* ── NOT logged in: show sign in + pro teaser ── */}
    {!user && (
      <>
        <button
          onClick={onAuthClick}
          className="w-full flex items-center justify-center gap-2 text-sm font-medium py-3 rounded-xl transition-all"
          style={{ border: "1px solid rgba(16,185,129,0.3)", color: "#34d399", background: "rgba(16,185,129,0.05)" }}
        >
          <LogIn className="w-4 h-4" /> Sign in to save templates & history
        </button>

        {/* Pro teaser for anonymous users */}
        <div className="rounded-xl p-4" style={{ border: "1px solid rgba(251,191,36,0.2)", background: "rgba(251,191,36,0.04)" }}>
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-4 h-4" style={{ color: "#fbbf24" }} />
            <span className="text-xs font-bold" style={{ color: "#fbbf24" }}>ForgeCost Pro — $15/mo</span>
          </div>
          <p className="text-xs mb-3" style={{ color: "hsl(215,20%,55%)" }}>
            Unlimited quotes, custom PDF branding, saved templates & full history.
          </p>
          <button
            onClick={() => onUpgradeClick("quotes")}
            className="w-full text-xs font-semibold py-2 rounded-lg transition-all"
            style={{ border: "1px solid rgba(251,191,36,0.3)", color: "#fbbf24", background: "rgba(251,191,36,0.08)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(251,191,36,0.15)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(251,191,36,0.08)")}
          >
            View Pro features →
          </button>
        </div>
      </>
    )}

    {/* ── Logged in free user: usage bar + upgrade CTA ── */}
    {user && userProfile && !isPro(userProfile) && (
      <>
        <div className="rounded-xl p-3" style={{ border: "1px solid hsl(222,35%,16%)", background: "hsl(222,40%,9%)" }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs" style={{ color: "hsl(215,20%,55%)" }}>Free quotes used</span>
            <span className="text-xs font-bold"
              style={{ color: userProfile.quotes_used >= 4 ? "#f87171" : "hsl(215,20%,55%)" }}>
              {userProfile.quotes_used} / 5
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "hsl(222,35%,16%)" }}>
            <div className="h-full rounded-full transition-all" style={{
              width: `${Math.min((userProfile.quotes_used / 5) * 100, 100)}%`,
              background: userProfile.quotes_used >= 4 ? "#f87171" : "#10b981",
            }} />
          </div>
          {userProfile.quotes_used >= 4 && (
            <p className="text-xs mt-2" style={{ color: "#f87171" }}>
              {userProfile.quotes_used >= 5 ? "Limit reached — " : "Almost at limit — "}
              <button onClick={() => onUpgradeClick("quotes")} className="underline font-medium">
                upgrade to Pro
              </button>
            </p>
          )}
        </div>

        {/* Always visible upgrade CTA for free logged-in users */}
        <button
          onClick={() => onUpgradeClick("quotes")}
          className="w-full flex items-center justify-center gap-2 text-sm font-semibold py-3 rounded-xl transition-all"
          style={{ border: "1px solid rgba(251,191,36,0.3)", color: "#fbbf24", background: "rgba(251,191,36,0.06)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(251,191,36,0.12)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(251,191,36,0.06)")}
        >
          <Crown className="w-4 h-4" /> Upgrade to Pro — $15/mo
        </button>
      </>
    )}

    {/* ── Pro user badge ── */}
    {user && userProfile && isPro(userProfile) && (
      <div className="rounded-xl p-3 flex items-center gap-3"
        style={{ border: "1px solid rgba(16,185,129,0.25)", background: "rgba(16,185,129,0.06)" }}>
        <Crown className="w-4 h-4 flex-shrink-0" style={{ color: "#34d399" }} />
        <div className="flex-1">
          <p className="text-xs font-bold" style={{ color: "#34d399" }}>Pro Plan Active</p>
          <p className="text-xs" style={{ color: "hsl(215,20%,55%)" }}>Unlimited everything ✓</p>
        </div>
        <button
          onClick={onBrandingClick}
          className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-all"
          style={{ border: "1px solid rgba(251,191,36,0.3)", color: "#fbbf24", background: "rgba(251,191,36,0.06)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(251,191,36,0.15)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(251,191,36,0.06)")}
        >
          <Settings2 className="w-3 h-3" /> Branding
        </button>
      </div>
    )}

    <div className="rounded-xl p-4 space-y-2" style={{ border: "1px solid hsl(222,35%,16%)", background: "hsl(222,40%,9%)" }}>
      {["✓  100% free plan available", "✓  PDF generated in your browser", "✓  Your data never leaves your device"].map((t) => (
        <p key={t} className="text-xs" style={{ color: "hsl(215,20%,55%)" }}>{t}</p>
      ))}
    </div>
  </>
);
}