"use client";

import { useState, useEffect } from "react";
import { X, ArrowRight, ArrowLeft, Wrench, Plus, Download, Sparkles, CheckCircle2 } from "lucide-react";

const STORAGE_KEY = "fc_onboarding_done";

const STEPS = [
  {
    id: "trade",
    title: "Pick your trade",
    desc: "We've pre-loaded a real bathroom plumbing job for you. You can edit anything.",
    highlight: "trade-selector",
    arrow: "down",
  },
  {
    id: "materials",
    title: "Your materials are ready",
    desc: "We've added common materials for this job. Change quantities, add your own, or remove what you don't need.",
    highlight: "materials-table",
    arrow: "down",
  },
  {
    id: "markup",
    title: "Set your markup",
    desc: "This is your profit margin on top of material costs. Most tradespeople charge 20–40%. We've set 25% to start.",
    highlight: "markup-input",
    arrow: "right",
  },
  {
    id: "download",
    title: "Download your quote",
    desc: "That's it. Hit Download PDF and get a professional quote ready to hand to your customer.",
    highlight: "download-btn",
    arrow: "up",
  },
];

interface OnboardingWalkthroughProps {
  onComplete: () => void;
  onSkip: () => void;
}

export default function OnboardingWalkthrough({ onComplete, onSkip }: OnboardingWalkthroughProps) {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Small delay so the app renders first
    const t = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(t);
  }, []);

  function handleNext() {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  }

  function handleComplete() {
    localStorage.setItem(STORAGE_KEY, "1");
    onComplete();
  }

  function handleSkip() {
    localStorage.setItem(STORAGE_KEY, "1");
    onSkip();
  }

  if (!visible) return null;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(2px)" }}
      />

      {/* Welcome card — centered */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ pointerEvents: "none" }}
      >
        <div
          className="w-full max-w-md rounded-2xl p-6 shadow-2xl"
          style={{
            background: "hsl(222,40%,9%)",
            border: "1px solid rgba(16,185,129,0.3)",
            boxShadow: "0 0 60px rgba(16,185,129,0.12), 0 24px 48px rgba(0,0,0,0.6)",
            pointerEvents: "all",
            animation: "slideUp 0.35s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          {/* Progress dots */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === step ? 20 : 6,
                    height: 6,
                    background: i === step ? "#10b981" : i < step ? "rgba(16,185,129,0.4)" : "hsl(222,35%,20%)",
                  }}
                />
              ))}
            </div>
            <button
              onClick={handleSkip}
              className="text-xs transition-colors"
              style={{ color: "hsl(215,20%,40%)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "hsl(215,20%,65%)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "hsl(215,20%,40%)")}
            >
              Skip tour
            </button>
          </div>

          {/* Step icon */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }}
            >
              {step === 0 && <Wrench className="w-5 h-5" style={{ color: "#34d399" }} />}
              {step === 1 && <Plus className="w-5 h-5" style={{ color: "#34d399" }} />}
              {step === 2 && <Sparkles className="w-5 h-5" style={{ color: "#34d399" }} />}
              {step === 3 && <Download className="w-5 h-5" style={{ color: "#34d399" }} />}
            </div>
            <div>
              <p className="text-xs font-medium mb-0.5" style={{ color: "#34d399" }}>
                Step {step + 1} of {STEPS.length}
              </p>
              <h3 className="text-lg font-bold text-white">{current.title}</h3>
            </div>
          </div>

          <p className="text-sm leading-relaxed mb-6" style={{ color: "hsl(215,20%,65%)" }}>
            {current.desc}
          </p>

          {/* Demo job preview (step 0 only) */}
          {step === 0 && (
            <div
              className="rounded-xl p-4 mb-5 text-sm"
              style={{ background: "hsl(222,35%,12%)", border: "1px solid hsl(222,35%,18%)" }}
            >
              <p className="font-semibold text-white mb-2">📋 Demo job loaded:</p>
              <p style={{ color: "hsl(215,20%,65%)" }}>
                <span style={{ color: "#34d399" }}>Trade:</span> Plumber<br />
                <span style={{ color: "#34d399" }}>Job:</span> Bathroom renovation<br />
                <span style={{ color: "#34d399" }}>Materials:</span> Copper pipe, fittings, isolation valve, solder kit<br />
                <span style={{ color: "#34d399" }}>Markup:</span> 25%
              </p>
            </div>
          )}

          {/* Last step — completion */}
          {isLast && (
            <div
              className="rounded-xl p-4 mb-5 flex items-start gap-3"
              style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}
            >
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#34d399" }} />
              <div className="text-sm" style={{ color: "hsl(215,20%,75%)" }}>
                You're all set! Your quotes are saved automatically so you can come back to them anytime.
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center gap-3">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1.5 text-sm px-4 py-2.5 rounded-xl transition-all"
                style={{ color: "hsl(215,20%,55%)", border: "1px solid hsl(222,35%,18%)", background: "transparent" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "hsl(222,35%,28%)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "hsl(222,35%,18%)")}
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all"
              style={{ background: "#10b981", color: "white" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#059669")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#10b981")}
            >
              {isLast ? (
                <><CheckCircle2 className="w-4 h-4" /> Start using ForgeCost</>
              ) : (
                <>Next <ArrowRight className="w-3.5 h-3.5" /></>
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
      `}</style>
    </>
  );
}

// Hook to check if onboarding should show
export function useOnboarding() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const done = localStorage.getItem(STORAGE_KEY);
    if (!done) setShow(true);
  }, []);

  return {
    show,
    complete: () => setShow(false),
    skip: () => setShow(false),
    reset: () => { localStorage.removeItem(STORAGE_KEY); setShow(true); }, // for testing
  };
}
