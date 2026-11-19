import { describe, it, expect } from "vitest";
import { GET } from "./route.js";
import { CSV_HEADER } from "@/lib/invoices";

describe("GET /invoices/export", () => {
  it("serves a CSV with the right content type", async () => {
    const res = GET();
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toContain("text/csv");
  });

  it("serves it as a download with a filename", () => {
    expect(GET().headers.get("Content-Disposition")).toContain("filename=");
  });

  it("is never an empty file: it always has a header and at least one row", async () => {
    const body = await GET().text();
    const lines = body.trimEnd().split("\n");
    expect(lines[0]).toBe(CSV_HEADER.join(","));
    expect(lines.length).toBeGreaterThan(1);
  });

  it("leaves out invoices that were never sent", async () => {
    const body = await GET().text();
    expect(body).not.toContain("INV-1004"); // draft
    expect(body).not.toContain("INV-1005"); // void
  });

  it("is not cached, so a fresh export reflects current data", () => {
    expect(GET().headers.get("Cache-Control")).toBe("no-store");
  });
});
