/** The fixture's one domain concept: invoices, and a CSV export of them. */

export interface Invoice {
  readonly id: string;
  readonly customer: string;
  readonly amountCents: number;
  readonly issuedOn: string; // YYYY-MM-DD
  readonly status: "draft" | "sent" | "paid" | "void";
}

const INVOICES: readonly Invoice[] = [
  { id: "INV-1001", customer: "Acme Bakery", amountCents: 24500, issuedOn: "2026-10-02", status: "paid" },
  { id: "INV-1002", customer: "Northwind Books", amountCents: 118000, issuedOn: "2026-10-11", status: "sent" },
  { id: "INV-1003", customer: "Globex Coffee", amountCents: 7250, issuedOn: "2026-10-19", status: "paid" },
  { id: "INV-1004", customer: "Initech Hardware", amountCents: 93100, issuedOn: "2026-11-01", status: "draft" },
  { id: "INV-1005", customer: "Hooli Cleaning", amountCents: 45000, issuedOn: "2026-11-08", status: "void" },
];

export function listInvoices(): readonly Invoice[] {
  return INVOICES;
}

/** Only invoices that were actually sent to a customer belong in an export. */
export function exportableInvoices(invoices: readonly Invoice[]): readonly Invoice[] {
  return invoices.filter((i) => i.status === "sent" || i.status === "paid");
}

export function formatAmount(amountCents: number): string {
  return (amountCents / 100).toFixed(2);
}

/** A CSV cell is quoted when it holds a comma, a quote or a newline. */
function csvCell(value: string): string {
  if (/[",\n\r]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export const CSV_HEADER = ["id", "customer", "amount", "issued_on", "status"] as const;

export function toCsv(invoices: readonly Invoice[]): string {
  const rows = [
    CSV_HEADER.join(","),
    ...invoices.map((i) =>
      [i.id, csvCell(i.customer), formatAmount(i.amountCents), i.issuedOn, i.status].join(","),
    ),
  ];
  // A trailing newline, so appending to the file doesn't join two rows.
  return `${rows.join("\n")}\n`;
}
