import { formatAmount, type Invoice } from "@/lib/invoices";

export function InvoiceTable({ invoices }: { invoices: readonly Invoice[] }) {
  // The same top margin the table carries, so emptying the list does not
  // close the gap under the export button.
  if (invoices.length === 0) {
    return <p style={{ marginTop: "1.5rem" }}>No invoices match this filter</p>;
  }

  return (
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
  );
}
