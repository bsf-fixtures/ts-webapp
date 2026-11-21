# What this means

## The problem

`/invoices` listed every invoice in a table under a heading that said only
"Invoices". To answer "how many are there?" a reader had to count the rows.
That is fine at five rows and useless at fifty — and the page gave no hint
which it was about to be until you had scrolled it.

The heading now answers the question: **Invoices (5)**.

## Why the count comes from the rendered rows

The request asked for "the rows currently shown (after any status filter)".
There is no status filter in this app today — filtering by status is its own
open issue (#27), and building one is not in this work item. So the phrase had
to be honoured by *where* the number is taken from rather than by adding the
thing it refers to.

The count is read off the array the table body maps over. That has two
consequences, and both are the point of the change:

- **Today**, the heading and the rows are the same array, so they cannot
  disagree. There is no second query, no second filter, nothing to fall out of
  step when the seed data changes.
- **When a filter lands**, it will narrow that array — and the heading will
  follow it, correctly, with no edit to this line. The feature that does not
  exist yet needs no follow-up here.

The alternative — calling `listInvoices()` again for the count, or counting
`exportableInvoices()` — would have produced a number that was right today and
wrong the moment anything narrowed the list. A heading that confidently says
the wrong number is worse than no heading.

## The two numbers on the page are meant to differ

Anyone looking at the page now sees "Invoices (5)" directly above a button
reading "Export 3 invoices as CSV", and the obvious reading is that something
is broken. It is not, and the difference is the entire reason this app exists.

The table shows every invoice because a person needs to see the drafts and the
voids. The export contains only the invoices that were actually **sent** to a
customer, because a CSV handed to someone else must not carry an invoice that
was never issued. Five are listed; three are exportable; both labels tell the
truth about their own thing.

This change deliberately did not reconcile them, and one of the two new tests
exists specifically to stop a future change from doing so. If the heading ever
reads "Invoices (3)" to match the button, the page has started lying about
what it is showing — and if the button ever reads "Export 5 invoices as CSV"
to match the heading, the product rule this app was written to demonstrate is
gone.

## What it costs

One line of JSX and a comment. No new dependency, no new module, no new
abstraction, no change to the domain. The count is `.length` on an array the
component was already holding, which is why there is no `countInvoices()` in
`lib/` to go and read: the clearest implementation wins over the most general
one here, and a function wrapping `.length` would be a second way of doing
something the language already does.
