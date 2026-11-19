import { listInvoices, exportableInvoices, toCsv } from "@/lib/invoices";

/** Serves the CSV as a download. Only sent and paid invoices are included. */
export function GET(): Response {
  const csv = toCsv(exportableInvoices(listInvoices()));
  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="invoices.csv"',
      "Cache-Control": "no-store",
    },
  });
}
