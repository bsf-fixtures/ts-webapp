import { describe, it, expect } from "vitest";
import {
  listInvoices, findInvoice, exportableInvoices, toCsv, formatAmount, totalCents, formatCurrency,
  CSV_HEADER, type Invoice,
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

describe("totalCents", () => {
  it("adds up the amounts of the invoices it is given", () => {
    const out = totalCents([
      invoice({ amountCents: 24500 }),
      invoice({ amountCents: 118000 }),
      invoice({ amountCents: 7250 }),
    ]);
    expect(out).toBe(149750);
  });

  it("totals an empty list as zero rather than NaN, so the page still shows a figure", () => {
    expect(totalCents([])).toBe(0);
  });

  it("leaves drafts and voids out of the total, because they are not in the exportable list", () => {
    expect(totalCents(exportableInvoices(listInvoices()))).toBe(149750);
  });
});

describe("formatCurrency", () => {
  it("writes a four-figure total the way a customer reads it, with symbol and thousands separator", () => {
    expect(formatCurrency(149750)).toBe("$1,497.50");
  });

  it("renders zero as $0.00", () => {
    expect(formatCurrency(0)).toBe("$0.00");
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

describe("findInvoice", () => {
  it("returns the invoice whose id was asked for, so its page can show the right figures", () => {
    expect(findInvoice("INV-1002")).toEqual({
      id: "INV-1002", customer: "Northwind Books", amountCents: 118000,
      issuedOn: "2026-10-11", status: "sent",
    });
  });

  it("finds a draft and a void as well, because every row in the table has to open", () => {
    expect(findInvoice("INV-1004")?.status).toBe("draft");
    expect(findInvoice("INV-1005")?.status).toBe("void");
  });

  it("returns undefined for an id nobody has, so the caller can answer 404 rather than guess", () => {
    expect(findInvoice("INV-9999")).toBeUndefined();
  });
});
