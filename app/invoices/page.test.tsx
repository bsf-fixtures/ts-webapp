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

  it("lists the invoices newest first, so INV-1005 is the top row and INV-1001 the last", () => {
    render(<InvoicesPage />);
    const rows = [...document.querySelectorAll("tbody tr")];
    const ids = rows.map((row) => row.querySelector("td")?.textContent);
    expect(ids).toEqual(["INV-1005", "INV-1004", "INV-1003", "INV-1002", "INV-1001"]);
  });
});
