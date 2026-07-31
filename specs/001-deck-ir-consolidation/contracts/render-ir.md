# Contract: Render IR and the Layout Primitive Set

**Owner**: the pipeline. Neither vocabulary packs nor delivery format packs may extend it.
**Producers**: vocabulary compilers. **Consumers**: delivery format renderers.

This is the second seam (R11). It exists because delivery formats that switch on slide
types are coupled to every vocabulary — a coupling the original design had, and which its
own task list violated in the phase meant to prove additivity.

## Shape

```jsonc
{
  "deck":  { "title": "…", "attribution_style": "author-date" },
  "theme_tokens": {
    "bg": "#0E1A2B", "panel": "#16263F", "accent": "#5EA8FF",
    "ink": "#FFFFFF", "muted": "#9DB0C9",
    "font_display": "…", "font_body": "…", "font_mono": "…"
  },
  "units": [
    {
      "id": "opening-claim",
      "primitives": [
        { "kind": "title-block", "role": "heading",
          "payload": { "eyebrow": "SECTION", "title": "…", "subtitle": "…" } },
        { "kind": "attribution-line",
          "payload": { "text": "(Author, 2024)" } }
      ],
      "notes": "What the speaker says here.",
      "attributions": [{ "text": "(Author, 2024)", "source": "…" }],
      "duration_sec": 90
    }
  ]
}
```

`theme_tokens` are **resolved values, not names**. A renderer never looks up a theme; the
vocabulary flattens its chosen theme before the IR is handed over. That is what lets a
format render any vocabulary's theme without knowing the vocabulary exists.

## The primitive set (closed)

| Kind | Payload | Covers |
|---|---|---|
| `title-block` | eyebrow, title, subtitle | Openers, section headers, closings |
| `text-run` | lines[], emphasis_index | Statements, body copy, single claims |
| `hero` | value, label | One dominant word or number — keynote hero beats, stat callouts |
| `sequence` | nodes[], sublabels[], highlight_index | Pipelines, step chains, flow diagrams |
| `parallel-set` | items[] each {text, accent, icon} | Triads, feature cards, pattern cards |
| `matrix` | columns[], rows[][] | Comparison grids, decision matrices |
| `figure` | ref, caption, alt | Images and vector assets |
| `callout` | text, tone | Asides, warnings, "aha" boxes |
| `attribution-line` | text | Citations rendered on the unit |
| `motif` | name, weight | Decorative vector hints. **Non-content.** |
| `spacer` | size | Deliberate negative space |

### Rules

- **Closed set.** A vocabulary needing a kind not listed raises it against this contract
  (FR-036). It does not invent one locally, and it never asks a format to special-case it.
  Extending this file is a normal, expected change; smuggling a kind past it is not.
- **No vocabulary or format identifiers** appear in any payload (SC-013).
- **Content vs decoration.** All kinds except `motif` and `spacer` are content-bearing. A
  format that does not support a content-bearing kind present in the IR MUST fail at the
  FR-011 check, before rendering. A format MAY silently ignore `motif` and `spacer` — a
  plain-text artifact has nowhere to put an orbit motif, and refusing to render for that
  reason would be absurd.
- **`role`** is an optional styling hint. A format MAY use it; correctness never depends
  on it.

## The design test for a new primitive

A proposed kind belongs here only if a renderer can draw it **without knowing why it
exists**. If explaining the kind requires naming a vocabulary — "this is the one the
research archetypes use for their stat slides" — it is not a primitive. It is vocabulary
content wearing a disguise, and admitting it reintroduces the coupling this layer removes.

The inverse test is also useful: if two vocabularies independently need the same shape,
that shape is almost certainly a primitive.

## Why `hero` merges two apparently different things

The keynote vocabulary's single-word beat and the research vocabulary's large statistic
look unrelated at the level of slide types, and the two superseded builders implemented
them separately. As layout they are identical: one dominant value with an optional label,
sized to fill. Merging them is the clearest available evidence that the primitive layer
is at the right altitude — it found shared structure the type-level design could not see.

Where they genuinely differ is in the *rules* attached to them (the research vocabulary
requires an attribution on a statistic; the keynote vocabulary forbids numbers when the
source withholds them). Those are vocabulary rules, declared as data, and enforced by the
shared verifier — not rendering differences.
