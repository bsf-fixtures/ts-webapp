# What this means, and why it is shaped this way

## The table was a dead end

The invoices table showed five rows and four columns, and that was all there
was. An id was a string in a cell — nothing to click, nothing underneath it. If
you wanted to know anything about INV-1002 that the table did not already show,
there was nowhere to go and no URL to go to.

This change makes a row a way in. Each id is a link, and behind it is a page
for that one invoice: who it is for, what it is worth, when it was issued and
where it stands. That page has its own address, so it can be linked to, sent to
someone, or kept in a tab.

## Every row opens — including the ones the export leaves out

This app exists to hold one rule: **a CSV of invoices contains only the
invoices that were actually sent to a customer.** Drafts and voids are shown in
the table on purpose, because a person needs to see them, but they must never
reach the file.

It would have been easy to let that rule leak into this change — to look an
invoice up in the exportable list, so that a draft's row led to a 404. That
would be wrong in a way that is hard to notice: the row is right there on the
screen, so clicking it has to work. The lookup therefore searches every
invoice, and `exportableInvoices` is untouched. The export still carries three
invoices; the button still says "Export 3 invoices as CSV"; "Total sent" still
reads $1,497.50. The rule stays exactly where it was, which is the point of
keeping it in one function.

## A wrong id says so, and offers the way back

An id nobody has gets a real 404, not a page of empty fields. That distinction
matters to anything reading the response — a crawler, a monitor, a person
following a stale link — because a 200 with nothing on it claims the invoice
exists.

The page it renders is this app's own, not the framework's. Next has a built-in
404 screen and it would have been one fewer file, but it is a bare page with no
idea what the reader was looking for and no way back to the list. Eleven lines
buy a screen that names the thing that is missing and puts the reader one click
from where they were.

## Why nothing else changed

The amount on the detail page reads `$1,180.00` because the app already had a
function that formats money that way, used today for the "Total sent" figure.
Writing a second one for this page would have left the codebase with two
answers to "how is money written here", and the two would eventually disagree.
The same reasoning put the lookup in `lib/` beside the existing accessors
rather than inside the page: there is one domain module, and the page should
not know how invoices are stored.

The table itself was not touched beyond the id cell — no sorting, no filtering,
no re-layout. Those are things someone might want next; they are not this
change.
