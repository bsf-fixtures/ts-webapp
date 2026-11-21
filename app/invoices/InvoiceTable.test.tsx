import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { InvoiceTable } from "./InvoiceTable.js";
import { type Invoice } from "@/lib/invoices";

const invoice = (over: Partial<Invoice> = {}): Invoice => ({
  id: "INV-9000", customer: "Test Co", amountCents: 1000,
  issuedOn: "2026-01-01", status: "sent", ...over,
});

afterEach(cleanup);

describe("InvoiceTable", () => {
  it("says no invoices match rather than showing a table with nothing under its headings", () => {
    render(<InvoiceTable invoices={[]} />);
    expect(document.body.textContent).toBe("No invoices match this filter");
    expect(document.querySelector("table")).toBe(null);
  });

  it("still lists every invoice it is given, so moving the table out of the page changed nothing a user sees", () => {
    render(<InvoiceTable invoices={[invoice({ id: "INV-9001" }), invoice({ id: "INV-9002" })]} />);
    expect(document.querySelectorAll("tr")).toHaveLength(3);
    expect(document.body.textContent).toContain("INV-9001");
    expect(document.body.textContent).toContain("INV-9002");
    expect(document.body.textContent).not.toContain("No invoices match this filter");
  });
});
