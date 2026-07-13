"use client";

import { useState } from "react";

type ClassificationResult = {
  category: string;
  urgency: "low" | "medium" | "high";
  summary: string;
  suggested_action: string;
};

const urgencyStyles: Record<string, { color: string; label: string }> = {
  high: { color: "var(--color-urgency-high)", label: "HIGH" },
  medium: { color: "var(--color-urgency-medium)", label: "MEDIUM" },
  low: { color: "var(--color-urgency-low)", label: "LOW" },
};

export default function Home() {
  const [ticketText, setTicketText] = useState("");
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!ticketText.trim()) {
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticket_text: ticketText }),
      });

      if (!res.ok) throw new Error(`Server responded ${res.status}`);

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(
        "Couldn't reach the classifier. Confirm the FastAPI server is running on port 8000."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-16">
      <div className="w-full max-w-2xl">
        <div className="mb-10">
          <p className="text-xs tracking-widest text-[var(--color-text-muted)] mb-2">
            SUPPORT OPS
          </p>
          <h1 className="font-display text-3xl font-bold">Ticket Triage</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-2">
            Paste a raw ticket. Get category, urgency, and next action.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={ticketText}
            onChange={(e) => setTicketText(e.target.value)}
            placeholder="e.g. My package shows delivered but I never received it..."
            rows={5}
            className="w-full p-4 rounded-md border resize-none text-sm focus:outline-none focus:ring-2"
            style={{
              background: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          />
          <button
            type="submit"
            disabled={loading || !ticketText.trim()}
            className="mt-4 px-5 py-2.5 rounded-md font-display font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            style={{ background: "var(--color-text)", color: "var(--color-bg)" }}
          >
            {loading ? "Classifying..." : "Classify ticket"}
          </button>
        </form>

        {error && (
          <div
            className="p-4 rounded-md text-sm border"
            style={{ borderColor: "var(--color-urgency-high)", color: "var(--color-urgency-high)" }}
          >
            {error}
          </div>
        )}

        {result && (
          <div
            className="rounded-md border overflow-hidden flex"
            style={{ borderColor: "var(--color-border)" }}
          >
            <div
              className="w-1.5 shrink-0"
              style={{ background: urgencyStyles[result.urgency]?.color }}
            />
            <div className="p-5 flex-1" style={{ background: "var(--color-surface)" }}>
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="text-xs font-bold tracking-widest px-2 py-1 rounded"
                  style={{
                    color: urgencyStyles[result.urgency]?.color,
                    border: `1px solid ${urgencyStyles[result.urgency]?.color}`,
                  }}
                >
                  {urgencyStyles[result.urgency]?.label ?? result.urgency.toUpperCase()}
                </span>
                <span className="text-xs uppercase tracking-widest text-[var(--color-text-muted)]">
                  {result.category}
                </span>
              </div>

              <p className="text-sm mb-4">{result.summary}</p>

              <div
                className="pt-4 border-t text-sm"
                style={{ borderColor: "var(--color-border)" }}
              >
                <p className="text-xs uppercase tracking-widest text-[var(--color-text-muted)] mb-1">
                  Suggested action
                </p>
                <p>{result.suggested_action}</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
