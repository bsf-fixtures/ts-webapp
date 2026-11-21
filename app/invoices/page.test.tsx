import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import InvoicesPage from "./page.js";

afterEach(cleanup);

// The page is an async server component, so it is awaited and the element it
// returns is rendered. Assertions use plain DOM properties rather than
// jest-dom, to keep the fixture's dependency list short.
const renderPage = async (status?: string) =>
  render(await InvoicesPage({ searchParams: Promise.resolve(status === undefined ? {} : { status }) }));

const rows = (): HTMLTableRowElement[] => Array.from(document.querySelectorAll("tr"));

const links = (): HTMLAnchorElement[] => Array.from(document.querySelectorAll("nav a"));

describe("InvoicesPage", () => {
  it("lists every invoice when no filter is chosen, so All is what you land on", async () => {
    await renderPage();
    expect(rows()).toHaveLength(6); // the header row plus the five seeded invoices
    expect(links().map((a) => a.textContent)).toEqual(["All", "Draft", "Sent", "Paid", "Void"]);
  });

  it("shows only the draft when the table is filtered to drafts, so the other four are out of the way", async () => {
    await renderPage("draft");
    expect(rows()).toHaveLength(2);
    expect(screen.queryByText("INV-1004")).not.toBeNull();
    for (const id of ["INV-1001", "INV-1002", "INV-1003", "INV-1005"]) {
      expect(screen.queryByText(id)).toBeNull();
    }
  });

  it("shows both paid invoices when the table is filtered to paid", async () => {
    await renderPage("paid");
    expect(rows()).toHaveLength(3);
    expect(screen.queryByText("INV-1001")).not.toBeNull();
    expect(screen.queryByText("INV-1003")).not.toBeNull();
  });

  it("falls back to every invoice for a status nobody has, rather than showing an empty table", async () => {
    await renderPage("bogus");
    expect(rows()).toHaveLength(6);
    const current = links().filter((a) => a.getAttribute("aria-current") === "page");
    expect(current.map((a) => a.textContent)).toEqual(["All"]);
  });

  it("marks the chosen filter, and only it, as the current one so you can see what you are looking at", async () => {
    await renderPage("void");
    const current = links().filter((a) => a.getAttribute("aria-current") === "page");
    expect(current.map((a) => a.textContent)).toEqual(["Void"]);
    expect(current[0]?.style.fontWeight).toBe("700");
    const others = links().filter((a) => a.getAttribute("aria-current") === null);
    expect(others).toHaveLength(4);
    for (const a of others) expect(a.style.fontWeight).toBe("400");
  });

  it("links each filter to its own URL, so a filtered table can be shared or bookmarked", async () => {
    await renderPage();
    const hrefs = links().map((a) => a.getAttribute("href"));
    expect(hrefs).toEqual([
      "/invoices",
      "/invoices?status=draft",
      "/invoices?status=sent",
      "/invoices?status=paid",
      "/invoices?status=void",
    ]);
  });

  it("keeps the export button's count on every sent and paid invoice, whatever the table is filtered to", async () => {
    await renderPage("draft");
    expect(screen.getByRole("button").textContent).toBe("Export 3 invoices as CSV");
  });
});
