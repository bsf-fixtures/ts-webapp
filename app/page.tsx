import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Invoices fixture</h1>
      <p>A small app the factory can be installed on.</p>
      <Link href="/invoices">Go to invoices</Link>
    </main>
  );
}
