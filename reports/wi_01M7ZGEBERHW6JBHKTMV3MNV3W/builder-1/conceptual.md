# What this means, and why it is shaped this way

## The problem

A table with a header row and nothing under it is ambiguous. It can mean "there
is nothing here", or it can mean "something went wrong and the rows did not
load". A person cannot tell which from looking, so they do the only thing left:
reload, or ask someone. An empty state that says *why* it is empty — "No
invoices match this filter" — closes that gap with one sentence.

This change gives the invoices table that sentence.

## What it is not

It does not add a status filter. The request mentioned one as an example of
*when* the table would be empty — "for example a status filter with no
matches" — and this app has no filter: `listInvoices()` returns a hard-coded
array of five invoices and the page renders all of them. Filtering is real
work with its own decisions (where the state lives, whether it survives a
reload, what the export does with it) and is filed separately as issue #27.

So the empty state lands first, and the filter lands on top of it later rather
than having to carry it. The wording — "match this filter" — is chosen for the
world where the filter exists, which is the one case where a user will ever see
it.

## Why this is invisible today

With the repo's data, nothing on the page changes. That is the point, and it is
the main thing worth checking in review: the table markup was moved, not
rewritten, so the five invoices, the four columns, the button label and the
total are all exactly as they were. The empty state is a branch that today's
data cannot reach.

That raises a fair question — how do you know it works? Two ways, both in the
PR:

- the seed was temporarily emptied in a scratch edit, the app rebuilt and
  looked at in a browser (the first screenshot), and the edit reverted. It is
  not in the diff;
- the new unit test renders the component with an empty list and asserts the
  message appears and no `<table>` element exists.

## Why the table became its own component

The honest reason is testability, and it is worth being plain about it, because
"extract a component" is otherwise the kind of move that gets waved through
without a reason.

`page.tsx` calls `listInvoices()` itself. A `length === 0` check written
directly in the page would be a branch that *no test could ever enter*, because
the data the page fetches is a constant five-invoice array. Covering it would
mean mocking the domain module — a pattern this codebase does not use anywhere,
and one that tests the mock as much as the code.

A component that receives the list as a prop has no such problem: both branches
are one `render()` call away, using the same plain-DOM testing pattern as
`ExportButton`. The shape follows from wanting the behaviour actually checked,
not from a preference for small files.

It lives beside the page rather than in `components/` because the feature map
is explicit that `components/` is for UI a page and something else both need,
or UI that needs browser APIs. This is neither: one caller, and no browser API.
One caller is not a shared concern. If a second page ever lists invoices, that
is when it moves.

## The cost

One more file in `app/invoices/`, and one more hop to follow when reading how
the page renders. Against that: the empty state is covered by a test instead of
by hope, and `page.tsx` is shorter and now reads as a layout — heading, button,
table, total — rather than as a heading, a button, twenty lines of `<td>`, and
a total.
