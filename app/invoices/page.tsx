import { listInvoices, exportableInvoices, formatAmount, isOverdue } from "@/lib/invoices";
import { ExportButton } from "@/components/ExportButton";

// Reading the clock in a server component does not make a page dynamic, so
// without this the overdue markers would be frozen at whatever the date was
// when the app was built.
export const dynamic = "force-dynamic";

export default function InvoicesPage() {
  const invoices = listInvoices();
  const exportable = exportableInvoices(invoices);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <main>
      <h1>Invoices</h1>
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
              <td>
                {i.status}
                {isOverdue(i, today) && (
                  // The margin separates the two words on screen; only the
                  // leading space separates them for a screen reader.
                  <span style={{ marginLeft: "0.5rem", color: "#b00020", fontWeight: 600 }}>{" Overdue"}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
