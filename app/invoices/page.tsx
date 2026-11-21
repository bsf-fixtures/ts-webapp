import Link from "next/link";
import {
  listInvoices, exportableInvoices, formatAmount, invoicesWithStatus, parseStatus,
  INVOICE_STATUSES, type InvoiceStatus,
} from "@/lib/invoices";
import { ExportButton } from "@/components/ExportButton";

const label = (status: InvoiceStatus): string => status.charAt(0).toUpperCase() + status.slice(1);

const href = (status: InvoiceStatus | undefined): string =>
  status === undefined ? "/invoices" : `/invoices?status=${status}`;

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const status = parseStatus((await searchParams)["status"]);
  const all = listInvoices();
  const invoices = invoicesWithStatus(all, status);
  // The export is not filtered, so its count comes from the whole list.
  const exportable = exportableInvoices(all);

  return (
    <main>
      <h1>Invoices</h1>
      <ExportButton count={exportable.length} />
      <nav style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
        {[undefined, ...INVOICE_STATUSES].map((s) => (
          <Link
            key={s ?? "all"}
            href={href(s)}
            aria-current={s === status ? "page" : undefined}
            style={{ fontWeight: s === status ? 700 : 400 }}
          >
            {s === undefined ? "All" : label(s)}
          </Link>
        ))}
      </nav>
      <table style={{ marginTop: "1.5rem", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", paddingRight: "1.5rem" }}>Invoice</th>
            <th style={{ textAlign: "left", paddingRight: "1.5rem" }}>Customer</th>
            <th style={{ textAlign: "right", paddingRight: "1.5rem" }}>Amount</th>
            <th style={{ textAlign: "left" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((i) => (
            <tr key={i.id}>
              <td style={{ paddingRight: "1.5rem" }}>{i.id}</td>
              <td style={{ paddingRight: "1.5rem" }}>{i.customer}</td>
              <td style={{ textAlign: "right", paddingRight: "1.5rem" }}>{formatAmount(i.amountCents)}</td>
              <td>{i.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
