import { listInvoices, exportableInvoices, formatAmount, totalCents, formatCurrency } from "@/lib/invoices";
import { ExportButton } from "@/components/ExportButton";

export default function InvoicesPage() {
  const invoices = listInvoices();
  const exportable = exportableInvoices(invoices);
  const totalSentCents = totalCents(exportable);

  return (
    <main>
      {/* Counted from the array the table maps over, so the heading and the
          rows cannot disagree, and the heading follows any filter added to
          that array later. One template literal, for the reason below. */}
      <h1>{`Invoices (${invoices.length})`}</h1>
      <ExportButton count={exportable.length} />
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
