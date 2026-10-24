"use client";

import { useState } from "react";

export default function UnsubscribeForm() {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const email = String(new FormData(e.currentTarget).get("email") ?? "");
    try {
      const res = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        let msg = "";
        try {
          msg = (await res.json())?.error ?? "";
        } catch {}
        throw new Error(msg || "Request failed");
      }
      setDone(true);
    } catch (err) {
      setError(
        err instanceof Error && err.message !== "Request failed"
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <p className="rounded-md bg-mist px-4 py-3 text-sm font-medium text-brand">
        Done — if that address was subscribed, it won&apos;t receive newsletters
        anymore.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <label className="field-label">
        Email
        <input name="email" type="email" required placeholder="you@example.com" className="field-input" />
      </label>
      <button type="submit" disabled={busy} className="btn-primary disabled:opacity-60">
        {busy ? "Working…" : "Unsubscribe"}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </form>
  );
}
