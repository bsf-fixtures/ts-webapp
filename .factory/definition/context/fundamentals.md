<!--
  The conventions no check enforces. Everything here is something a script
  could not decide, which is why it is prose.

  The bar for a line in this file: it has to be a judgement. If a static rule
  could catch it, it belongs in .factory/guardrails/ instead, because a rule
  is reproducible and prose is something agents argue with.

  Each line carries where it came from, so a line nobody can justify can be
  removed later.
-->

# Fundamentals — {{REPO_NAME}}

## Dominant patterns

For each recurring concern, the pattern most of this codebase already uses.
Follow it rather than introducing a second way of doing the same thing.

| Concern | The pattern here | Source |
| --- | --- | --- |
{{DOMINANT_PATTERN_ROWS}}

## Product intent

What this product is trying to be, where that would change a decision an
agent has to make.

{{PRODUCT_INTENT}}

## Taste

Things a reviewer would ask for that no rule states.

{{TASTE_LINES}}

## Deliberate exceptions

Places that look like they break a rule and should stay as they are, with the
reason. Without this section, cleanup keeps rediscovering them.

{{EXCEPTION_ROWS}}
