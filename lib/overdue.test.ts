import { describe, it, expect } from "vitest";
import { isOverdue } from "./invoices";

describe("isOverdue", () => {
  it("is true for a date in the past", () => {
    expect(isOverdue("2020-01-01", new Date("2026-01-01"))).toBe(true);
  });
  it("is false for a date in the future", () => {
    expect(isOverdue("2030-01-01", new Date("2026-01-01"))).toBe(false);
  });
});
