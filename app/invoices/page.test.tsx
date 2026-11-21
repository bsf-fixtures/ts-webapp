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
});
