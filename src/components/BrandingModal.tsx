"use client";

import { useState, useRef } from "react";
import { X, Crown, Upload, Trash2, Check, Palette } from "lucide-react";

interface BrandingModalProps {
  onClose: () => void;
  onApply: (settings: BrandingSettings) => void;
  current: BrandingSettings;
}

export interface BrandingSettings {
  logoBase64: string | null;
  brandColor: string;
  includeLogo: boolean;
}

const PRESET_COLORS = [
  { label: "Emerald",  value: "#10b981" },
  { label: "Blue",     value: "#3b82f6" },
  { label: "Violet",   value: "#8b5cf6" },
  { label: "Rose",     value: "#f43f5e" },
  { label: "Amber",    value: "#f59e0b" },
  { label: "Cyan",     value: "#06b6d4" },
  { label: "Slate",    value: "#475569" },
  { label: "Black",    value: "#0f172a" },
];

export default function BrandingModal({ onClose, onApply, current }: BrandingModalProps) {
  const [logoBase64, setLogoBase64] = useState<string | null>(current.logoBase64);
  const [brandColor, setBrandColor] = useState(current.brandColor);
  const [includeLogo, setIncludeLogo] = useState(current.includeLogo);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Logo must be under 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setLogoBase64(e.target?.result as string);
      setIncludeLogo(true);
    };
    reader.readAsDataURL(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleApply() {
    onApply({ logoBase64, brandColor, includeLogo });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8 shadow-2xl"
        style={{ border: "1px solid rgba(16,185,129,0.25)", background: "hsl(222,40%,9%)" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(251,191,36,0.15)" }}>
              <Crown className="w-5 h-5" style={{ color: "#fbbf24" }} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">PDF Branding</h2>
              <p className="text-sm" style={{ color: "hsl(215,20%,55%)" }}>
                Customise your quote appearance
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ color: "hsl(215,20%,55%)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "hsl(215,20%,55%)")}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Logo upload */}
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider mb-3"
            style={{ color: "hsl(215,20%,55%)" }}>Company Logo</p>

          {logoBase64 ? (
            <div className="rounded-xl p-4 flex items-center gap-4"
              style={{ border: "1px solid hsl(222,35%,18%)", background: "hsl(222,35%,12%)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoBase64} alt="Logo preview" className="h-12 object-contain rounded" />
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Logo uploaded</p>
                <p className="text-xs mt-0.5" style={{ color: "hsl(215,20%,55%)" }}>
                  Appears in PDF header
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {/* Toggle include */}
                <button
                  onClick={() => setIncludeLogo(!includeLogo)}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all"
                  style={{
                    border: `1px solid ${includeLogo ? "rgba(16,185,129,0.4)" : "hsl(222,35%,22%)"}`,
                    background: includeLogo ? "rgba(16,185,129,0.1)" : "transparent",
                    color: includeLogo ? "#34d399" : "hsl(215,20%,55%)",
                  }}
                >
                  {includeLogo ? <><Check className="w-3 h-3" /> On</> : "Off"}
                </button>
                {/* Remove */}
                <button
                  onClick={() => { setLogoBase64(null); setIncludeLogo(false); }}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all"
                  style={{ border: "1px solid rgba(248,113,113,0.3)", color: "#f87171", background: "rgba(248,113,113,0.05)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(248,113,113,0.12)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(248,113,113,0.05)")}
                >
                  <Trash2 className="w-3 h-3" /> Remove
                </button>
              </div>
            </div>
          ) : (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => fileRef.current?.click()}
              className="rounded-xl p-6 text-center cursor-pointer transition-all"
              style={{
                border: `2px dashed ${dragOver ? "#10b981" : "hsl(222,35%,22%)"}`,
                background: dragOver ? "rgba(16,185,129,0.05)" : "hsl(222,35%,12%)",
              }}
            >
              <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: "hsl(215,20%,45%)" }} />
              <p className="text-sm font-medium text-white">Drop your logo here</p>
              <p className="text-xs mt-1" style={{ color: "hsl(215,20%,45%)" }}>
                PNG, JPG, SVG — max 2MB
              </p>
              <button
                className="mt-3 text-xs font-semibold px-4 py-2 rounded-lg transition-all"
                style={{ background: "rgba(16,185,129,0.15)", color: "#34d399", border: "1px solid rgba(16,185,129,0.3)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(16,185,129,0.25)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(16,185,129,0.15)")}
              >
                Browse files
              </button>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </div>

        {/* Brand color */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Palette className="w-3.5 h-3.5" style={{ color: "hsl(215,20%,55%)" }} />
            <p className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "hsl(215,20%,55%)" }}>Accent Color</p>
          </div>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {PRESET_COLORS.map((c) => (
              <button
                key={c.value}
                onClick={() => setBrandColor(c.value)}
                className="relative h-10 rounded-lg transition-all"
                style={{
                  background: c.value,
                  border: brandColor === c.value ? "3px solid white" : "3px solid transparent",
                  boxShadow: brandColor === c.value ? `0 0 0 2px ${c.value}` : "none",
                }}
                title={c.label}
              >
                {brandColor === c.value && (
                  <Check className="w-4 h-4 absolute inset-0 m-auto text-white drop-shadow" />
                )}
              </button>
            ))}
          </div>
          {/* Custom color picker */}
          <div className="flex items-center gap-3">
            <label className="text-xs" style={{ color: "hsl(215,20%,55%)" }}>Custom:</label>
            <input
              type="color"
              value={brandColor}
              onChange={(e) => setBrandColor(e.target.value)}
              className="w-10 h-8 rounded cursor-pointer border-0 bg-transparent"
            />
            <span className="text-xs font-mono" style={{ color: "hsl(215,20%,55%)" }}>
              {brandColor}
            </span>
          </div>
        </div>

        {/* Preview strip */}
        <div className="rounded-xl p-4 mb-6 flex items-center gap-3"
          style={{ background: "hsl(222,35%,12%)", border: "1px solid hsl(222,35%,18%)" }}>
          <div className="w-1 h-12 rounded-full flex-shrink-0" style={{ background: brandColor }} />
          <div className="flex-1">
            <p className="text-sm font-bold text-white">PDF Preview</p>
            <p className="text-xs mt-0.5" style={{ color: "hsl(215,20%,55%)" }}>
              {logoBase64 && includeLogo ? "Logo + custom color" : `Custom color · No logo`}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-black text-white"
            style={{ background: brandColor }}>
            FC
          </div>
        </div>

        {/* Apply button */}
        <button
          onClick={handleApply}
          className="w-full flex items-center justify-center gap-2 font-bold py-4 rounded-xl transition-all"
          style={{ background: brandColor, color: "white", boxShadow: `0 8px 24px ${brandColor}40` }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          <Check className="w-4 h-4" /> Apply Branding
        </button>

        <p className="text-center text-xs mt-3" style={{ color: "hsl(215,20%,45%)" }}>
          Settings saved for this session · Applies to all PDF downloads
        </p>
      </div>
    </div>
  );
}