import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ExportButton } from "./ExportButton.js";

afterEach(cleanup);

describe("ExportButton", () => {
  it("is enabled when there is something to export", () => {
    render(<ExportButton count={2} />);
    expect((screen.getByRole("button") as HTMLButtonElement).disabled).toBe(false);
  });

  it("says how many invoices will be exported", () => {
    render(<ExportButton count={3} />);
    expect(screen.getByRole("button").textContent).toBe("Export 3 invoices as CSV");
  });

  it("uses the singular for one invoice", () => {
    render(<ExportButton count={1} />);
    expect(screen.getByRole("button").textContent).toBe("Export 1 invoice as CSV");
  });

  it("is disabled when there is nothing to export, so the user cannot download an empty file", () => {
    render(<ExportButton count={0} />);
    // Plain DOM assertion rather than jest-dom, to keep the fixture's
    // dependency list short.
    expect((screen.getByRole("button") as HTMLButtonElement).disabled).toBe(true);
  });
});
