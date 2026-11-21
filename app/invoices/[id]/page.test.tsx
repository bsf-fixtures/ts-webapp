import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import InvoicePage from "@/app/invoices/[id]/page";

afterEach(cleanup);

describe("InvoicePage", () => {
  it("shows the whole invoice, so a reader does not have to go back to the table for a figure", async () => {
    render(await InvoicePage({ params: Promise.resolve({ id: "INV-1001" }) }));
    const page = document.body.textContent ?? "";
    expect(page).toContain("INV-1001");
    expect(page).toContain("Acme Bakery");
    expect(page).toContain("$245.00");
    expect(page).toContain("2026-10-02");
    expect(page).toContain("paid");
  });

  it("opens a draft too, because a draft is listed in the table and its row must lead somewhere", async () => {
    render(await InvoicePage({ params: Promise.resolve({ id: "INV-1004" }) }));
    const page = document.body.textContent ?? "";
    expect(page).toContain("Initech Hardware");
    expect(page).toContain("$931.00");
    expect(page).toContain("draft");
  });

  it("offers a way back to the list, so the page is not a dead end", async () => {
    const { container } = render(await InvoicePage({ params: Promise.resolve({ id: "INV-1002" }) }));
    const back = container.querySelector("a");
    expect(back?.textContent).toBe("Back to invoices");
    expect(back?.getAttribute("href")).toBe("/invoices");
  });

  it("refuses an id no invoice has, rather than rendering a page of blanks", async () => {
    // notFound() throws so Next can answer 404; it never returns an element.
    await expect(InvoicePage({ params: Promise.resolve({ id: "INV-9999" }) })).rejects.toThrow();
  });
});
