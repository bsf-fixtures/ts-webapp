import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import InvoicesPage from "./page.js";

afterEach(cleanup);

/** The row of the table whose first cell is this invoice id. */
function row(id: string): HTMLElement {
  return screen.getByText(id).closest("tr") as HTMLElement;
}

describe("InvoicesPage", () => {
  it("marks the sent invoice that has been outstanding since October as overdue", () => {
    render(<InvoicesPage />);
    expect(row("INV-1002").textContent).toContain("Overdue");
  });

  it("does not chase paid invoices, even ones issued more than 30 days ago", () => {
    render(<InvoicesPage />);
    expect(row("INV-1001").textContent).not.toContain("Overdue");
    expect(row("INV-1003").textContent).not.toContain("Overdue");
  });

  it("does not chase a draft or a void invoice, which were never sent to anyone", () => {
    render(<InvoicesPage />);
    expect(row("INV-1004").textContent).not.toContain("Overdue");
    expect(row("INV-1005").textContent).not.toContain("Overdue");
  });

  it("still offers the export of only the invoices that were sent", () => {
    render(<InvoicesPage />);
    expect(screen.getByRole("button").textContent).toBe("Export 3 invoices as CSV");
  });
});
