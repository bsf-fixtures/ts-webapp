import Link from "next/link";

export default function InvoiceNotFound() {
  return (
    <main>
      <h1>Invoice not found</h1>
      <p>No invoice has that id.</p>
      <Link href="/invoices">Back to invoices</Link>
    </main>
  );
}
