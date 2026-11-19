import type { ReactNode } from "react";

export const metadata = { title: "Invoices", description: "A fixture app for Build Software Factory" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0, padding: "2rem" }}>{children}</body>
    </html>
  );
}
