"use client";

import { useState, useEffect } from "react";
import { getTemplates, deleteTemplate } from "@/lib/db";
import type { SavedTemplate } from "@/lib/supabase";
import type { Material, Trade } from "@/lib/trades";
import { formatCurrency } from "@/lib/trades";
import { BookOpen, Trash2, Loader2, ChevronRight } from "lucide-react";

interface TemplatesPanelProps {
  onLoad: (template: SavedTemplate) => void;
}

export default function TemplatesPanel({ onLoad }: TemplatesPanelProps) {
  const [templates, setTemplates] = useState<SavedTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await getTemplates();
    setTemplates((data as SavedTemplate[]) ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string) {
    setDeletingId(id);
    await deleteTemplate(id);
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    setDeletingId(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-5 h-5 animate-spin text-[hsl(215,20%,55%)]" />
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-8">
        <BookOpen className="w-8 h-8 text-[hsl(215,20%,40%)] mx-auto mb-2" />
        <p className="text-sm text-[hsl(215,20%,55%)]">No saved templates yet.</p>
        <p className="text-xs text-[hsl(215,20%,40%)] mt-1">
          Save your current materials as a template to reuse it.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {templates.map((t) => {
        const mats = t.materials as Material[];
        const activeMats = mats.filter((m) => m.quantity > 0);
        const subtotal = activeMats.reduce(
          (sum, m) => sum + m.quantity * m.costPerUnit, 0
        );

        return (
          <div
            key={t.id}
            className="group flex items-center gap-3 rounded-xl border border-[hsl(222,35%,16%)] bg-[hsl(222,40%,9%)] p-4 hover:border-[#10b981]/30 transition-all"
          >
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-white truncate">{t.name}</p>
              <p className="text-xs text-[hsl(215,20%,55%)] mt-0.5">
                {t.trade} • {mats.length} materials • {formatCurrency(subtotal)} base
              </p>
              <p className="text-xs text-[hsl(215,20%,40%)] mt-0.5">
                {new Date(t.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleDelete(t.id)}
                disabled={deletingId === t.id}
                className="p-1.5 rounded-lg text-[hsl(215,20%,55%)] hover:text-red-400 hover:bg-red-400/10 transition-colors"
              >
                {deletingId === t.id ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                onClick={() => onLoad(t)}
                className="p-1.5 rounded-lg text-[hsl(215,20%,55%)] hover:text-[#10b981] hover:bg-[#10b981]/10 transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}