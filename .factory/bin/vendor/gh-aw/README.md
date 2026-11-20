# Vendored from githubnext/gh-aw (MIT)

`frontmatter_hash_pure.cjs` and its two helpers are gh-aw's own code, copied
verbatim. The commit they came from is in `COMMIT`; the licence is in `LICENSE`.

They are here for one reason: `bsf audit` has to answer whether a compiled
`.lock.yml` still matches the `.md` it was compiled from. gh-aw writes the
answer into the lock file's first line —

    # gh-aw-metadata: {"schema_version":"v4","frontmatter_hash":"…","body_hash":"…",…}

— but the hashes are over *normalized* frontmatter and body, with imports
resolved and merged in sorted order. Reimplementing that normalization from
the outside is how a staleness check ends up wrong in the field: it would
either miss a real edit or cry stale on every clone. gh-aw maintains a
parity test between this file and its Go implementation
(`pkg/parser/frontmatter_hash_parity_test.go`), so using the file itself
means `bsf audit` computes the same hash the compiler did.

Nothing here is modified. To update: copy the three files again from
`actions/setup/js/` in gh-aw and record the new commit.
