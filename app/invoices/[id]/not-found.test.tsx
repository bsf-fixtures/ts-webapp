import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import InvoiceNotFound from "@/app/invoices/[id]/not-found";

afterEach(cleanup);

describe("InvoiceNotFound", () => {
  it("says the invoice was not found, instead of leaving a reader on a blank framework page", () => {
    render(<InvoiceNotFound />);
    expect(document.body.textContent).toContain("Invoice not found");
  });

  it("still offers the way back to the list, which is the only thing left to do here", () => {
    const { container } = render(<InvoiceNotFound />);
    const back = container.querySelector("a");
    expect(back?.textContent).toBe("Back to invoices");
    expect(back?.getAttribute("href")).toBe("/invoices");
  });
});
