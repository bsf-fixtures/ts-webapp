// @vitest-environment node
import { describe, it, expect } from "vitest";
import { ESLint } from "eslint";

const eslint = new ESLint();

async function moneyErrors(code: string, filePath: string) {
  const [result] = await eslint.lintText(code, { filePath });
  return (result?.messages ?? []).filter((m) => m.ruleId === "no-restricted-syntax");
}

describe("money formatting rule", () => {
  it("fails a page that formats cents inline, so an amount cannot round differently from the CSV", async () => {
    const code = "export const f = (amountCents: number) => (amountCents / 100).toFixed(2);\n";
    expect((await moneyErrors(code, "app/invoices/page.tsx")).length).toBeGreaterThan(0);
  });

  it("fails a component that builds its own Intl.NumberFormat", async () => {
    const code = 'export const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });\n';
    expect(await moneyErrors(code, "components/Example.tsx")).toHaveLength(1);
  });

  it("passes a page that uses formatAmount and formatCurrency", async () => {
    const code = [
      'import { formatAmount, formatCurrency } from "@/lib/invoices";',
      "export const f = (c: number) => [formatAmount(c), formatCurrency(c)];",
      "",
    ].join("\n");
    expect(await moneyErrors(code, "app/invoices/page.tsx")).toHaveLength(0);
  });

  it("allows the inline expression in lib/invoices.ts, where formatting belongs", async () => {
    const code = "export const f = (c: number) => (c / 100).toFixed(2);\n";
    expect(await moneyErrors(code, "lib/invoices.ts")).toHaveLength(0);
  });
});
