# Phase 1 Data Model: Deck IR Consolidation

**Feature**: 001-deck-ir-consolidation
**Date**: 2026-07-30

The deck plan is the only authored artifact (Constitution Principle I). Everything here
describes its shape and the shape of the packs that give it meaning.

---

## The composition rule

One schema cannot describe both a dense attribution-carrying research slide and a
one-word keynote beat without degenerating into "any object". So the schema is composed
from two owners:

```
┌─ core envelope schema ────────────── owned by the pipeline ─┐
│  deck metadata · slide ordering · type reference            │
│  notes · attribution · duration                             │
│                                                             │
│   ┌─ content ─────────── owned by the vocabulary pack ──┐   │
│   │  shape determined by the slide's declared type      │   │
│   └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

The core validates the envelope and dispatches `content` to the schema the declared
vocabulary supplies for that slide type. Neither owner can see inside the other. Adding
a vocabulary adds content schemas and touches no core file (R1, R2).

---

## Entities

### DeckPlan

The root artifact. The single source of truth for every delivery format.

| Field | Required | Description |
|---|---|---|
| `schema_version` | yes | Version of the core envelope schema this plan targets. |
| `title` | yes | Deck title. Used by every delivery format. |
| `vocabulary` | yes | Id of the vocabulary pack whose slide types this plan uses. |
| `theme` | no | Id of a theme offered by the vocabulary pack. Defaults to the pack's default theme. |
| `targets` | no | Delivery format ids requested by default. Overridable per run. |
| `attribution_style` | no | How attributions are rendered on slides. Constrained to the styles the vocabulary declares. |
| `slides` | yes | Ordered, non-empty list of Slide. |

**Rules**

- `vocabulary` MUST name a discoverable pack (FR-002).
- Every id in `targets` MUST name a discoverable delivery format pack.
- `slides` MUST be non-empty; ordering is by array position, which is authoritative.
- Changing `theme` or `vocabulary` MUST NOT require editing any Slide content (SC-009);
  where a vocabulary change leaves content with no equivalent type, that is reported
  rather than silently coerced.

---

### Slide

One unit of the plan. The envelope is universal; `content` is not.

| Field | Required | Description |
|---|---|---|
| `id` | yes | Stable identifier, unique within the plan. Survives reordering. |
| `type` | yes | Slide type, MUST be one the declared vocabulary offers. |
| `content` | yes | Type-shaped payload. Validated by the vocabulary's schema for `type`. |
| `notes` | yes | What the speaker says on this slide. |
| `attribution` | no | Source credit for claims or figures on this slide. |
| `duration_sec` | no | Intended spoken duration. Consumed by the rundown format (R5). |

**Rules**

- `notes` is **required, not optional**. Both superseded verifiers hard-fail a slide with
  no notes, and the spoken-script delivery format is unrenderable without it (FR-016).
- `id` is what makes FR-006 achievable: notes travel with the slide because they are
  *inside* it, and identity does not depend on position. The superseded formats keyed
  slides by ordinal number, which is exactly why they required manual re-keying after any
  reorder and could silently attach notes to the wrong slide.
- `content` MUST validate against the vocabulary's schema for `type`; failure reports the
  slide `id` and the offending field path (FR-003).
- A `type` no selected delivery format can render is reported at approval time (FR-011).

---

### VocabularyPack

A named slide idiom — the dense attribution-carrying research catalog, the sparse
keynote catalog, or any future one.

| Field | Required | Description |
|---|---|---|
| `id` | yes | Unique pack identifier. |
| `kind` | yes | `vocabulary`. |
| `slide_types` | yes | Map of type name to the content schema for that type. |
| `themes` | yes | Named visual variants the pack offers. At least one. |
| `default_theme` | yes | Which theme applies when the plan does not choose. |
| `attribution_styles` | no | Attribution renderings this vocabulary supports. |
| `rules` | no | Vocabulary-specific verification rules, declared for the shared verifier. |

**Rules**

- `rules` are **declared, not coded**. The shared verifier enforces them generically and
  MUST NOT branch on pack id (FR-010). A rule the verifier cannot express generically is
  a gap in the rule vocabulary, to be fixed there.
- A pack is self-contained: everything above lives inside its own directory (R2).

---

### DeliveryFormatPack

A named output. Covers both slide outputs and the non-slide views of the same plan.

| Field | Required | Description |
|---|---|---|
| `id` | yes | Unique pack identifier. |
| `kind` | yes | `target`. |
| `produces` | yes | What it emits — a presentation file, a web page, a document, or a text artifact. |
| `supported_types` | yes | Slide types it can render, or a wildcard. Drives FR-011. |
| `requires` | no | External toolchains it needs. Absence triggers honest degradation (R6). |
| `derives_from` | no | Another format id this one converts. Used by the document format (R4). |

**Rules**

- A format declaring `derives_from` MUST NOT read the plan directly; it converts the
  named format's output. This keeps the document format from becoming a third renderer.
- A format whose `requires` are unmet is reported unavailable, never silently skipped
  (FR-031).

---

### VerificationReport

The outcome of the gates. Three states, because two cannot express "never checked" (R6).

| Field | Required | Description |
|---|---|---|
| `deck` | yes | Which built artifact was verified. |
| `gates` | yes | List of gate results. |
| `overall` | yes | `passed`, `failed`, or `incomplete`. |

Each gate result carries: gate name; status `passed` \| `failed` \| `not_run`; a reason
when not `passed`; and per-finding detail identifying slide and field.

**Rules**

- `overall` is `passed` only when every gate is `passed`. Any `not_run` yields
  `incomplete` — never `passed` (FR-019).
- Delivery proceeds only on `passed` (FR-018). `incomplete` does not authorise delivery;
  it authorises an explicit, informed decision by the author.

---

### DeniedTermList

The unpublished list backing the publish-safety check.

| Field | Required | Description |
|---|---|---|
| `entries` | yes | Terms, each with a matching mode. |

Matching modes: case-sensitive whole word (acronyms); case-insensitive word-with-suffix
(names, nationality terms); raw regex (context-dependent terms).

**Rules**

- MUST NOT be tracked in version control (FR-026).
- Absent or unreadable is a hard error; never a clean result (FR-023).
- The three modes exist because single-mode matching produced false positives on the
  current corpus (R7, FR-024).

---

### SourceMaterial

Long-form input to intake. Read-only.

| Field | Required | Description |
|---|---|---|
| `path` | yes | Location of the source. |
| `attributions` | no | Reference list extracted from the source, where it has one. |

**Rules**

- Never modified by the system.
- Internal inconsistency in `attributions` — a claim crediting a source absent from the
  list, or a reference to a non-existent entry — is surfaced to the author, never
  silently resolved (FR-015).

---

## Relationships

```
DeckPlan ──1:N──▶ Slide
   │                 │
   │ declares        │ type ∈ pack.slide_types
   ▼                 ▼
VocabularyPack ──supplies──▶ content schema (per type)
   │
   │ rules
   ▼
Verifier ──produces──▶ VerificationReport
   ▲
   │ verifies
DeliveryFormatPack ──renders──▶ built artifact
   │
   └── derives_from ──▶ DeliveryFormatPack

SourceMaterial ──intake──▶ DeckPlan (proposed, pending approval)
DeniedTermList ──gates──▶ commit
```

---

## State transitions

A plan moves through states; delivery is reachable only one way.

```
     proposed ──author approves──▶ approved ──render──▶ built
        │                              ▲                  │
        │ author edits                 │                  │ verify
        └──────────────────────────────┘                  ▼
                                                   ┌─────────────┐
                        ┌──────────────────────────│  verified?  │
                        │                          └─────────────┘
                   failed / incomplete                    │ passed
                        │                                 ▼
                        ▼                             delivered
                 restore backup,
                 fix the PLAN,
                 re-render
```

The loop from a failed gate returns to the **plan**, never to the built artifact. There
is deliberately no edge from `built` to `delivered` that bypasses verification (FR-018),
and no edge that repairs a built artifact in place — that is the inversion of truth
Principle III forbids.
