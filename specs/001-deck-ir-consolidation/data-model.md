# Phase 1 Data Model: Deck IR Consolidation

**Feature**: 001-deck-ir-consolidation
**Date**: 2026-07-30

The deck plan is the only authored artifact (Constitution Principle I). Everything here
describes its shape and the shape of the packs that give it meaning.

---

## Two seams, not one

There are two places where ownership changes hands, and the original model only had the
first. Missing the second is what let delivery formats couple to vocabularies.

```
Deck Plan ──validate──▶ ok ──compile──▶ Render IR ──render──▶ artifact ──extract──▶ canonical
   │                          │        (primitives)    │                    │
   └─ seam 1: content schema ─┘                        └─ seam 2: primitives┘
      owned by vocabulary                                 owned by pipeline
```

**Seam 1 — validation.** The plan's `content` shape is owned by the vocabulary.
**Seam 2 — rendering.** The vocabulary compiles content into pipeline-owned primitives;
delivery formats render primitives and never see slide types.

Everything below describes both.

## The composition rule (seam 1)

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

### LayoutPrimitive

A presentation-neutral unit of layout, owned by the pipeline. The shared currency between
vocabularies and delivery formats (R11).

| Field | Required | Description |
|---|---|---|
| `kind` | yes | Primitive kind, from the pipeline's closed set. |
| `role` | no | Semantic hint — heading, body, caption, attribution — for formats that style by role. |
| `payload` | yes | Kind-shaped content, validated by the pipeline's schema for that kind. |

**Rules**

- The primitive set is **closed and pipeline-owned**. A vocabulary needing a kind that does
  not exist is a gap in the set, closed there (FR-036) — never worked around by a format
  special-casing a vocabulary.
- A primitive MUST be renderable by a format that knows nothing about why it exists. The
  test: if a proposed primitive can only be explained by naming a vocabulary, it is not a
  primitive — it is vocabulary content wearing a disguise.
- Primitives carry no vocabulary identifiers and no format identifiers (SC-013).

---

### RenderIR

The compiled form of a plan: what delivery formats actually consume.

| Field | Required | Description |
|---|---|---|
| `deck` | yes | Deck-level metadata carried through from the plan. |
| `theme_tokens` | yes | Resolved visual tokens — the vocabulary's theme, flattened to values. |
| `units` | yes | Ordered; one per slide. Each carries the slide's `id`, its primitives, its notes, its attributions, and its duration. |

**Rules**

- Produced by the vocabulary's compiler; consumed by delivery formats.
- Carries the slide `id` through unchanged, so notes and attributions stay bound to their
  slide across the whole pipeline (FR-006).
- A format MUST NOT read the deck plan. The Render IR is its only input, which is what
  makes SC-013 mechanically checkable by search.

---

### VocabularyPack

A named slide idiom — the dense attribution-carrying research catalog, the sparse
keynote catalog, or any future one.

| Field | Required | Description |
|---|---|---|
| `id` | yes | Unique pack identifier. |
| `kind` | yes | `vocabulary`. |
| `slide_types` | yes | Map of type name to the content schema for that type. |
| `compiler` | yes | Entry point translating slide content into layout primitives. |
| `themes` | yes | Named visual variants, each resolving to theme tokens. At least one. |
| `default_theme` | yes | Which theme applies when the plan does not choose. |
| `attribution_styles` | no | Attribution renderings this vocabulary supports. |
| `rules` | no | Vocabulary-specific verification rules, declared for the shared verifier. |

**Rules**

- `rules` are **declared, not coded**. The shared verifier enforces them generically and
  MUST NOT branch on pack id (FR-010). A rule the verifier cannot express generically is
  a gap in the rule vocabulary, to be fixed there.
- The `compiler` MUST NOT reference any delivery format identifier (FR-034, SC-013).
- A pack is self-contained: everything above lives inside its own directory (R2).

---

### DeliveryFormatPack

A named output. Covers both slide outputs and the non-slide views of the same plan.

| Field | Required | Description |
|---|---|---|
| `id` | yes | Unique pack identifier. |
| `kind` | yes | `target`. |
| `produces` | yes | What it emits — a presentation file, a web page, a document, or a text artifact. |
| `supported_primitives` | yes | Primitive kinds it can render, or a wildcard. Drives FR-011. |
| `verification_adapter` | yes | Entry point extracting canonical content from its artifact type (FR-037). |
| `requires` | no | External toolchains it needs. Absence triggers honest degradation (R6). |
| `derives_from` | no | Another format id this one converts. Used by the document format (R4). |

**Rules**

- `supported_primitives` lists **primitive kinds, not slide types**. A format that named
  slide types would be coupled to the vocabularies defining them, which is the defect R11
  exists to remove (FR-034, SC-013).
- A format declaring `derives_from` MUST NOT read the plan or the Render IR directly; it
  converts the named format's output. This keeps the document format from becoming a third
  renderer.
- A format whose `requires` are unmet is reported unavailable, never silently skipped
  (FR-031).
- Every format supplies a `verification_adapter`, so structural verification covers 100% of
  delivered artifacts rather than one privileged format (SC-014).

---

### VerificationAdapter

Supplied by each delivery format. Turns that format's artifact back into something the
shared verifier can compare against the plan (R13).

| Field | Required | Description |
|---|---|---|
| `units` | yes | Ordered extraction, one per slide/section, each identified by slide `id` where the format preserves it. |
| `unit_content` | yes | Visible text extracted per unit. |
| `unit_notes` | yes | Speaker notes per unit, where the format carries them. |
| `unit_attributions` | no | Attributions extracted per unit. |
| `count` | yes | Number of units found in the artifact. |

**Rules**

- Extraction is format-specific; **comparison is not**. The adapter only extracts; the
  shared verifier decides pass or fail. This is what keeps verification logic out of the
  packs and pack knowledge out of the verifier.
- A format that cannot preserve a field reports it absent rather than inventing it — a
  text artifact with no notes channel says so, and the verifier judges that against the
  format's declared capability rather than failing blindly.

---

### BuildRecord

Binds a verification result to what was actually rendered (R14, FR-039).

| Field | Required | Description |
|---|---|---|
| `plan_digest` | yes | Digest of the plan the build consumed. |
| `vocabulary` / `theme` | yes | What the plan was compiled with. |
| `artifacts` | yes | Per target: staged path, digest, and the toolchain versions used. |
| `verification` | no | The VerificationReport, once gates have run. |

**Rules**

- Verification is performed against a BuildRecord, not a bare path. An artifact with no
  matching record can be verified on request, but the result MUST state that provenance
  could not be established — "these checks passed" is a weaker claim than "this is the
  verified output of this plan", and the two MUST NOT be reported identically.
- Promotion from staging to the delivered location consumes the record and requires
  `verification.overall == passed` (FR-038).

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
SourceMaterial ──intake──▶ DeckPlan (proposed, pending approval)
                              │
DeckPlan ──1:N──▶ Slide ──────┘
   │                 │
   │ declares        │ type ∈ pack.slide_types
   ▼                 ▼
VocabularyPack ──supplies──▶ content schema (seam 1)
   │        │
   │        └──compiler──▶ RenderIR ──1:N──▶ LayoutPrimitive   (seam 2)
   │ rules                    │
   ▼                          │ consumed by
Verifier                      ▼
   ▲  ▲              DeliveryFormatPack ──renders──▶ staged artifact
   │  │                   │        │                      │
   │  │  derives_from ────┘        │ verification_adapter │
   │  │                            ▼                      │
   │  └──────────── canonical extraction ◀────────────────┘
   │
   └──produces──▶ VerificationReport ──▶ BuildRecord ──promote (if passed)──▶ delivered

DeniedTermList ──blocks──▶ commit
```

Note what is *absent*: there is no edge from `DeliveryFormatPack` to `VocabularyPack` or
to `DeckPlan`. That absence is the guarantee (SC-013), and it is checkable by search.

---

## State transitions

A plan moves through states; delivery is reachable only one way.

```
   proposed ──approves──▶ approved ──compile──▶ compiled ──render──▶ STAGED
      │                       ▲                                        │
      │ author edits          │                                        │ verify
      └───────────────────────┘                                        ▼
                              │                                 ┌─────────────┐
                              │            ┌────────────────────│  verified?  │
                              │            │                    └─────────────┘
                              │      failed / incomplete               │ passed
                              │            │                           ▼
                              │            ▼                    promote (atomic)
                              └──── fix the PLAN,                      │
                                    discard staging                    ▼
                                                                  DELIVERED
```

Three properties this encodes:

- **Nothing reaches `DELIVERED` except by atomic promotion from `STAGED` after `passed`**
  (FR-038). A failed or incomplete build leaves the delivered location untouched, so a
  crash mid-run cannot deliver ungated output.
- **The failure loop returns to the plan**, never to the artifact. There is deliberately no
  edge that repairs a staged artifact in place — that is the inversion of truth Principle
  III forbids, and staging makes it structurally awkward rather than merely discouraged.
- **`compiled` is a distinct state.** FR-011 is answered there: unrenderable content is
  detected by comparing produced primitives against the target's `supported_primitives`,
  before anything is rendered.
