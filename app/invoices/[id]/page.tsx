import Link from "next/link";
import { notFound } from "next/navigation";
import { findInvoice, formatCurrency } from "@/lib/invoices";

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const invoice = findInvoice(id);
  // notFound() throws, so everything below it has a real invoice.
  if (invoice === undefined) notFound();

  return (
    <main>
      <h1>{invoice.id}</h1>
      <dl>
        <dt>Customer</dt>
        <dd>{invoice.customer}</dd>
        <dt>Amount</dt>
        <dd>{formatCurrency(invoice.amountCents)}</dd>
        <dt>Issued on</dt>
        <dd>{invoice.issuedOn}</dd>
        <dt>Status</dt>
        <dd>{invoice.status}</dd>
      </dl>
      <Link href="/invoices">Back to invoices</Link>
    </main>
  );
}
