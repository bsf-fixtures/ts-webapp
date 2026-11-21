import { listInvoices, exportableInvoices, totalCents, formatCurrency } from "@/lib/invoices";
import { ExportButton } from "@/components/ExportButton";
import { InvoiceTable } from "./InvoiceTable";

export default function InvoicesPage() {
  const invoices = listInvoices();
  const exportable = exportableInvoices(invoices);
  const totalSentCents = totalCents(exportable);

  return (
    <main>
      <h1>Invoices</h1>
      <ExportButton count={exportable.length} />
      <InvoiceTable invoices={invoices} />
      {/* One template literal, not adjacent children: React's server renderer
          would otherwise separate them with a <!-- --> marker. */}
      <p style={{ marginTop: "0.75rem" }}>{`Total sent: ${formatCurrency(totalSentCents)}`}</p>
    </main>
  );
}
