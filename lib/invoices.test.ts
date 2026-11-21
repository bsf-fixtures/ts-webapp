import { describe, it, expect } from "vitest";
import {
  listInvoices, exportableInvoices, toCsv, formatAmount, isOverdue, CSV_HEADER,
  type Invoice,
} from "./invoices.js";

const invoice = (over: Partial<Invoice> = {}): Invoice => ({
  id: "INV-9000", customer: "Test Co", amountCents: 1000,
  issuedOn: "2026-01-01", status: "sent", ...over,
});

describe("exportableInvoices", () => {
  it("includes sent and paid invoices", () => {
    const out = exportableInvoices([invoice({ status: "sent" }), invoice({ status: "paid" })]);
    expect(out).toHaveLength(2);
  });

  it("leaves out drafts and voids, which were never sent to a customer", () => {
    const out = exportableInvoices([invoice({ status: "draft" }), invoice({ status: "void" })]);
    expect(out).toHaveLength(0);
  });

  it("returns an empty list for an empty input rather than throwing", () => {
    expect(exportableInvoices([])).toEqual([]);
  });
});

describe("isOverdue", () => {
  const today = "2026-11-21";

  it("flags a sent invoice the customer has held for 31 days", () => {
    expect(isOverdue(invoice({ status: "sent", issuedOn: "2026-10-21" }), today)).toBe(true);
  });

  it("gives a sent invoice its full 30 days before calling it overdue", () => {
    expect(isOverdue(invoice({ status: "sent", issuedOn: "2026-10-22" }), today)).toBe(false);
  });

  it("leaves a sent invoice issued 29 days ago alone", () => {
    expect(isOverdue(invoice({ status: "sent", issuedOn: "2026-10-23" }), today)).toBe(false);
  });

  it("never chases a paid invoice, however old, because it is settled", () => {
    expect(isOverdue(invoice({ status: "paid", issuedOn: "2026-08-13" }), today)).toBe(false);
  });

  it("never chases a draft, because it was never put in front of the customer", () => {
    expect(isOverdue(invoice({ status: "draft", issuedOn: "2026-08-13" }), today)).toBe(false);
  });

  it("never chases a void invoice, because nobody is waiting on it", () => {
    expect(isOverdue(invoice({ status: "void", issuedOn: "2026-08-13" }), today)).toBe(false);
  });
});

describe("formatAmount", () => {
  it("renders cents as a two-decimal amount", () => {
    expect(formatAmount(24500)).toBe("245.00");
    expect(formatAmount(7250)).toBe("72.50");
    expect(formatAmount(5)).toBe("0.05");
  });

  it("renders zero as 0.00", () => {
    expect(formatAmount(0)).toBe("0.00");
  });
});

describe("toCsv", () => {
  it("writes a header row even when there are no invoices", () => {
    expect(toCsv([])).toBe(`${CSV_HEADER.join(",")}\n`);
  });

  it("writes one row per invoice, in order", () => {
    const csv = toCsv([invoice({ id: "A" }), invoice({ id: "B" })]);
    const lines = csv.trimEnd().split("\n");
    expect(lines).toHaveLength(3);
    expect(lines[1]).toContain("A");
    expect(lines[2]).toContain("B");
  });

  it("quotes a customer name containing a comma, so the row keeps its columns", () => {
    const csv = toCsv([invoice({ customer: "Smith, Jones & Co" })]);
    const row = csv.trimEnd().split("\n")[1] ?? "";
    expect(row).toContain('"Smith, Jones & Co"');
    expect(row.split(",")).toHaveLength(6); // the quoted comma does not split a column
  });

  it("doubles a quote inside a customer name", () => {
    const csv = toCsv([invoice({ customer: 'The "Good" Bakery' })]);
    expect(csv).toContain('"The ""Good"" Bakery"');
  });

  it("ends with a newline, so appending does not join two rows", () => {
    expect(toCsv([invoice()]).endsWith("\n")).toBe(true);
  });
});

describe("listInvoices", () => {
  it("returns the seeded invoices", () => {
    expect(listInvoices().length).toBeGreaterThan(0);
  });

  it("gives every invoice a unique id", () => {
    const ids = listInvoices().map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
