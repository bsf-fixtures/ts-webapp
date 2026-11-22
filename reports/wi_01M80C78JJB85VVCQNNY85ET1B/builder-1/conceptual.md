# Conceptual
Amounts are integer cents and must be formatted only by `formatAmount`/`formatCurrency`, so pages round like the CSV export. This was a convention; it is now a failing lint check. No app behaviour changes, and there are 0 existing violations.
