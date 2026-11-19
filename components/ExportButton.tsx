"use client";

import { useState } from "react";

/**
 * Downloads the CSV the server builds. The filename carries the date so a
 * second export in the same day doesn't silently overwrite the first.
 */
export function ExportButton({ count }: { count: number }) {
  const [busy, setBusy] = useState(false);

  async function onClick(): Promise<void> {
    setBusy(true);
    try {
      const res = await fetch("/invoices/export");
      if (!res.ok) throw new Error(`export failed: ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoices-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button type="button" onClick={onClick} disabled={busy || count === 0} aria-busy={busy}>
      {busy ? "Preparing…" : `Export ${count} invoice${count === 1 ? "" : "s"} as CSV`}
    </button>
  );
}
