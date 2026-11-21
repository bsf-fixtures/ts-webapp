import type { ReactElement } from "react";
import Link from "next/link";
import {
  listInvoices, exportableInvoices, formatAmount, totalCents, formatCurrency,
  parseStatus, invoicesWithStatus, INVOICE_STATUSES, type InvoiceStatus,
} from "@/lib/invoices";
import { ExportButton } from "@/components/ExportButton";

const label = (status: InvoiceStatus): string => status.charAt(0).toUpperCase() + status.slice(1);

const href = (status: InvoiceStatus | undefined): string =>
  status === undefined ? "/invoices" : `/invoices?status=${status}`;

export default function InvoicesPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}): ReactElement | Promise<ReactElement> {
  // Next hands a page its query as a promise, so one is resolved when it is
  // given. Resolving it here rather than making the whole page async keeps
  // the page renderable with no query at all, which is the All view.
  return searchParams === undefined
    ? view(undefined)
    : searchParams.then((params) => view(parseStatus(params["status"])));
}

function view(status: InvoiceStatus | undefined): ReactElement {
  const all = listInvoices();
  const invoices = invoicesWithStatus(all, status);
  // The export is deliberately not filtered, so its count and its total come
  // from the whole list rather than from whatever the table is showing.
  const exportable = exportableInvoices(all);
  const totalSentCents = totalCents(exportable);

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
      {/* One template literal, not adjacent children: React's server renderer
          would otherwise separate them with a <!-- --> marker. */}
      <p style={{ marginTop: "0.75rem" }}>{`Total sent: ${formatCurrency(totalSentCents)}`}</p>
    </main>
  );
}
