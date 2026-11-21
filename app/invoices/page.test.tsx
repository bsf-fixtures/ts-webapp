import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import InvoicesPage from "@/app/invoices/page";

afterEach(cleanup);

describe("InvoicesPage", () => {
  it("adds up the invoices that were actually sent, so a reader sees what the export is worth", () => {
    render(<InvoicesPage />);
    expect(document.body.textContent).toContain("Total sent: $1,497.50");
  });

  it("does not count the draft and the void, which would overstate the total to $2,878.50", () => {
    render(<InvoicesPage />);
    expect(document.body.textContent).not.toContain("$2,878.50");
  });

  it("makes every invoice id a link to its own page, so a row is a way in and not just text", () => {
    const { container } = render(<InvoicesPage />);
    const ids = [...container.querySelectorAll("tbody tr td:first-child a")];
    expect(ids.map((a) => a.textContent)).toEqual([
      "INV-1001", "INV-1002", "INV-1003", "INV-1004", "INV-1005",
    ]);
    expect(ids.map((a) => a.getAttribute("href"))).toEqual([
      "/invoices/INV-1001", "/invoices/INV-1002", "/invoices/INV-1003",
      "/invoices/INV-1004", "/invoices/INV-1005",
    ]);
  });
});
