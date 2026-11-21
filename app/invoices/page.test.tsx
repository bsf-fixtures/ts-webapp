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

  it("shows how many invoices are listed, so a reader does not have to count the rows", () => {
    const { container } = render(<InvoicesPage />);
    const rows = container.querySelectorAll("tbody tr");
    expect(container.querySelector("h1")?.textContent).toBe(`Invoices (${rows.length})`);
    expect(container.querySelector("h1")?.textContent).toBe("Invoices (5)");
  });

  it("counts the rows on the page, not the exportable ones, so the heading cannot read (3) while five rows are visible", () => {
    const { container } = render(<InvoicesPage />);
    expect(container.querySelector("h1")?.textContent).not.toBe("Invoices (3)");
    expect(document.body.textContent).toContain("Export 3 invoices as CSV");
  });
});
