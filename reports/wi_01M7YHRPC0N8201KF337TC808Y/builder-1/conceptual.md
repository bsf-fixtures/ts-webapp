# What this means, and why it is shaped this way

## The problem

The invoices table showed its rows in whatever order the underlying list
happened to be in. That order was the order the data was written down —
oldest first — which is an accident of how the list was typed out, not a
decision anyone made about what a reader needs. The practical effect: the
invoice raised this month sat at the bottom, under four older ones, and the
first thing the page told you was what happened in early October.

A list of invoices is read for recent activity. Newest first is what the
request asked for, and it is what the table now does.

## What a person sees

The same five invoices, the same four columns, the same button and the same
total. Only the row order changed: INV-1005 is now the top row and INV-1001
the last.

Nothing was added to make the new order legible. The table shows Invoice,
Customer, Amount and Status today, and the request did not ask for an
issue-date column, so none was added — the ordering shows up as the sequence
of rows, not as a new field. If the dates ought to be visible, that is a
separate, small change to ask for.

## Why the CSV did not change

The export file still lists INV-1001, INV-1002, INV-1003 in that order.

That is the decision worth knowing about. The ordering could have been pushed
down into `listInvoices()`, which would have been one fewer call at the page —
but the export route reads from the same function, so the file's rows would
have quietly flipped too. The request was about the table. A change that also
rewrites the bytes of a file people download, without anyone asking, is a
change that has to be noticed and decided on, not slipped in because it was
convenient.

So the page sorts what it is handed, and the export keeps reading the list as
it was seeded. If the owners want the file to match the table, that is a
one-line follow-up — and it should go through as its own request, because
anyone diffing two exports across the change would want to know.

The thing this app exists to promise — that only invoices actually sent to a
customer reach the export — is untouched by all of this. Reordering a list
does not change what is in it: the button still counts three, the total is
still $1,497.50, and the draft and the void are still visible in the table
and still absent from the file.

## Why the ordering is a function in `lib/`

This repo keeps its domain logic as pure functions over readonly data in one
module, and keeps its pages free of logic. `newestFirst` follows the shape
already set by `exportableInvoices` and `totalCents`: give it a readonly list
of invoices, get a derived readonly list back. It can be tested without a DOM,
and the next caller that needs the same order — a second page, a future
API — gets it from the same place rather than reimplementing a comparator.

The one subtlety it has to carry is that the seeded list is shared. Sorting an
array in JavaScript rearranges it in place, so a careless sort here would have
reached the export without anyone touching the export. The function copies
before it sorts, the copy carries a comment saying why, and a test asserts
that the list it was given comes back unchanged — three cheap guards against a
bug that would have been genuinely hard to trace.

Ties keep the order they arrived in. Two invoices issued on the same day will
not shuffle between renders, which is what the request asked for and what
keeps the table from looking unstable on a page reload.
