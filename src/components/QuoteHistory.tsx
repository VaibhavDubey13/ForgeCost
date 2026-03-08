"use client";

import { useState, useEffect } from "react";
import { getQuotes, deleteQuote } from "@/lib/db";
import type { SavedQuote } from "@/lib/supabase";
import { formatCurrency } from "@/lib/trades";
import { History, Trash2, Loader2 } from "lucide-react";

export default function QuoteHistory() {
  const [quotes, setQuotes] = useState<SavedQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await getQuotes();
    setQuotes((data as SavedQuote[]) ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string) {
    setDeletingId(id);
    await deleteQuote(id);
    setQuotes((prev) => prev.filter((q) => q.id !== id));
    setDeletingId(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-5 h-5 animate-spin text-[hsl(215,20%,55%)]" />
      </div>
    );
  }

  if (quotes.length === 0) {
    return (
      <div className="text-center py-8">
        <History className="w-8 h-8 text-[hsl(215,20%,40%)] mx-auto mb-2" />
        <p className="text-sm text-[hsl(215,20%,55%)]">No quotes saved yet.</p>
        <p className="text-xs text-[hsl(215,20%,40%)] mt-1">
          After downloading a PDF, save it to your history.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {quotes.map((q) => (
        <div
          key={q.id}
          className="group flex items-center gap-3 rounded-xl border border-[hsl(222,35%,16%)] bg-[hsl(222,40%,9%)] p-4 hover:border-[#10b981]/30 transition-all"
        >
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-white truncate">{q.job_name}</p>
            <p className="text-xs text-[hsl(215,20%,55%)] mt-0.5">
              {q.trade} • {formatCurrency(q.grand_total)}
            </p>
            <p className="text-xs text-[hsl(215,20%,40%)] mt-0.5">
              {new Date(q.created_at).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={() => handleDelete(q.id)}
            disabled={deletingId === q.id}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-[hsl(215,20%,55%)] hover:text-red-400 hover:bg-red-400/10 transition-all"
          >
            {deletingId === q.id ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      ))}
    </div>
  );
}