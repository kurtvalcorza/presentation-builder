# Implementation Plan: Deck IR Consolidation

**Branch**: `001-deck-ir-consolidation` | **Date**: 2026-07-30 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-deck-ir-consolidation/spec.md`

## Summary

Replace three overlapping deck-building paths with one plan-driven pipeline.

A single **deck plan** (JSON) becomes the only authored artifact. A small core envelope
schema owns what is universal — slide ordering, identity, notes, attribution, timing —
while each **vocabulary pack** contributes the content schema for its own slide types.

Vocabularies then **compile** their content into a pipeline-owned set of **layout
primitives**, and **delivery format packs** render primitives. Neither kind of pack
references the other, so adding either scales with one rather than with the count of the
other. Six delivery formats ship: a presentation file, a web page, a document, and three
non-slide views (spoken script, producer rundown, storyboard). Packs are discovered by
directory scan, so adding one touches zero files outside its own directory.

One shared verifier replaces the two existing ones, enforcing rule *kinds* declared as
data by each vocabulary rather than branching on vocabulary identity, and comparing
against canonical content that each format extracts from its own artifact type. Two gates
— structural and visual — stand between a rendered artifact and delivery, with a
three-state result so "could not check" is never reported as "verified". Rendering writes
to staging; artifacts reach their delivered location only by atomic promotion after the
gates pass.

## Technical Context

**Language/Version**: Node (current LTS) for core, renderers, and the scrub check;
Python 3.9+ for the presentation-file verifier only

**Primary Dependencies** (selected and licence-checked in research R16): Ajv on its
2020-12 entry point (MIT) for schema validation; PptxGenJS (MIT) for presentation
generation; the pdf.js distribution (Apache-2.0) with a prebuilt N-API canvas backend
(MIT) for rasterizing; python-pptx (MIT) for the verifier; and LibreOffice headless
(MPL-2.0) — the **single external system dependency**, invoked as a subprocess and never
vendored, shared by the visual gate and the document format

**Storage**: files on disk. The deck plan is the durable artifact; built outputs are
regenerable and deliberately untracked

**Testing**: contract tests for schema composition, golden tests per renderer comparing a
**normalized extraction** rather than raw bytes (a presentation file is a ZIP carrying
timestamps and entry ordering, so byte comparison fails on unchanged re-runs — research
R9), gate
tests over deliberately defective decks, and a pack-isolation test asserting via
file-level diff that adding a pack changes nothing outside its directory

**Target Platform**: Windows (PowerShell) and POSIX. Every shipped script must run on
both; the scrub check is a single Node implementation rather than one script per shell

**Project Type**: agent-operated skill suite — a CLI plus reference documentation, not a
service or an application

**Performance Goals**: not a driver. Deck sizes are 8–40 slides; render time is
dominated by the external office toolchain. No throughput or latency target is set,
deliberately — inventing one would create a constraint the feature does not have

**Constraints**: delivered artifacts self-contained and offline-capable, except that web
output may load fonts from a public font service; external toolchains may be absent and
must degrade honestly (exit 3, never exit 0); the denied-term list must never be
published

**Scale/Scope**: 2 vocabulary packs at delivery (extensible), **6** delivery format packs
(presentation-file, web, document, spoken-script, rundown, storyboard), 43 functional
requirements, 17 success criteria, 5 user stories; absorbs 2 standalone builders, 8 router
modes, 1 intake component, and 2 post-processing utilities

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Phase 0

| # | Principle | Assessment |
|---|---|---|
| I | IR is the only authored artifact | **PASS** — the plan is the sole authored input; renderers receive it and never read source material. |
| II | Three-layer determinism split | **PASS** — SHIPPED: renderers, verifier, scrub check, web runtime. TEMPLATED: themes and manifest. GENERATED: the plan only. |
| III | Two gates before delivery | **PASS** — structural and visual gates are pipeline stages, not optional flags; `build` refuses delivery unless both pass. |
| IV | Packs are additive | **PASS** — composed schema plus scan-based discovery; enforced by an isolation test, not by convention. |
| V | Progressive disclosure | **PASS** — reference material is per-pack and per-phase; each file carries a "When to read this" trigger. |
| VI | Public-repo scrub absolute | **PASS** — scrub check specified as fail-closed with a dedicated exit code; denied-term list untracked. |
| VII | Third-party provenance | **PASS** — the web pack reuses existing style presets already attributed in THIRD-PARTY-NOTICES.md; the excluded third-party design-prompt repository stays linked, not vendored. |

**Result: PASS. No violations. Complexity Tracking not required.**

### Post-Phase 1 re-check

| # | Principle | Assessment after design |
|---|---|---|
| I | IR only | **PASS** — reinforced: the pack contract explicitly forbids a renderer reading source material or mutating the plan. |
| II | Determinism split | **PASS** — the document format `derives_from` the presentation file rather than adding a third renderer, keeping SHIPPED code smaller than the original three-target design implied. |
| III | Two gates | **PASS, strengthened** — the three-state gate model (`passed`/`failed`/`not_run`) and exit code 3 close a hole the principle implied but did not name: a two-state model cannot distinguish "verified" from "never checked". |
| IV | Additive packs | **PASS, strengthened** — discovery by scan removes the registry file, so the guarantee tightens from "zero files outside the pack directory *and the registry*" to "zero files outside the pack directory". |
| V | Progressive disclosure | **PASS** — content schemas live beside the vocabulary that owns them, so a reader loads one vocabulary's rules, not all of them. |
| VI | Scrub absolute | **PASS, strengthened** — the mode-aware denylist was validated against the live corpus during specification and eliminated four measured false positives. |
| VII | Provenance | **PASS** — unchanged. |

**Result at the time: PASS. That result was wrong**, and the way it was wrong is worth
recording.

### Post-review re-check (2026-07-31)

An external review found that two principles the table above marked PASS were in fact
violated by the design it was assessing.

| # | Principle | Recorded | Actual | Now |
|---|---|---|---|---|
| I | IR only | PASS | PASS | **PASS** |
| II | Determinism split | PASS | PASS | **PASS** |
| III | Two gates | PASS | **FAIL** — the visual gate only rasterized and inspected nothing; structural verification covered one of six formats while the contract printed passing results for all | **PASS** — recorded verdicts (R12), per-format extraction adapters (R13) |
| IV | Additive packs | PASS | **FAIL** — adding a vocabulary required editing a delivery format (T040), directly violating FR-009 | **PASS** — shared primitive layer (R11), isolation tested in both directions |
| V | Progressive disclosure | PASS | PASS | **PASS** |
| VI | Scrub absolute | PASS | **FAIL** — scanned tracked files only, but ran immediately after copying untracked material in; and was documented rather than enforced | **PASS** — candidate-file scope and commit-time hook (R15) |
| VII | Provenance | PASS | AT RISK — the web runtime was copied in one phase and its attribution updated five phases later | **PASS** — attribution moved to the same change as the absorption |

**Why the original check passed a design that failed.** It was performed against the
principles as *stated intentions*, not against the task list as *written work*. Principle
IV was assessed by reading the pack contract, which was sound; the violation lived in a
task that edited a sibling pack. A constitution check that reads only the design documents
cannot see a design document contradicted by its own plan.

The correction is procedural as much as architectural: the check now asks, for each
principle, *which artifact would violate this if someone implemented the plan literally* —
and the isolation tests (both directions, plus the reference search) exist so the answer is
enforced by CI rather than by review attention.

**Result: PASS**, with the guarantees now mechanically checkable rather than asserted.

## Project Structure

### Documentation (this feature)

```text
specs/001-deck-ir-consolidation/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 output — 10 decisions
├── data-model.md        # Phase 1 output — entities and state transitions
├── quickstart.md        # Phase 1 output — 12 validation scenarios
├── contracts/           # Phase 1 output
│   ├── deck-plan.schema.md
│   ├── render-ir.md     # the closed primitive set (second seam)
│   ├── pack-contract.md
│   └── cli-and-verifier.md
├── migration-inventory.md   # Phase 0 input (moved from Phase 7 per research R17)
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT created here)
```

### Source Code (repository root)

```text
bin/
└── deck.mjs                     # command surface: packs/validate/render/verify/build/scrub

src/
├── plan/                        # envelope schema, composition, validation, error reporting
├── render-ir/                   # the closed primitive set + Render IR schema (pipeline-owned)
├── packs/                       # discovery by scan, manifest loading, capability probing
├── gates/                       # gate orchestration, three-state reporting, backups
├── delivery/                    # staging, build records, atomic promotion
└── scrub/                       # fail-closed mode-aware denylist scanner

packs/
├── research/                    # vocabulary: dense, attribution-carrying
├── keynote/                     # vocabulary: sparse, one idea per slide
├── presentation-file/           # target: renders the plan
├── web/                         # target: shipped CSS/JS runtime, never regenerated
├── document/                    # target: derives_from presentation-file
├── spoken-script/               # target: non-slide view
├── rundown/                     # target: non-slide view, consumes duration_sec
└── storyboard/                  # target: non-slide view

tools/
├── verify_deck.py               # Python verifier, JSON on stdout
└── …                            # absorbed post-processing utilities (handout, image-summary)

out/                             # build output — generated, untracked, never authored

references/                      # progressive-disclosure docs, "When to read this" headers

tests/
├── contract/                    # schema composition accepts/rejects
├── golden/                      # per-renderer normalized-extraction comparison
├── gates/                       # defective decks are blocked
└── isolation/                   # adding a pack changes nothing outside it

examples/                        # sample plan, invalid plan, 3 defect plans, throwaway packs

SKILL.md                         # lean router (Principle V)
```

**Structure Decision**: A single project rooted at the repository, not a monorepo of
skills. The current five-skill layout is what produced the duplication — each skill
carried its own `scripts/`, `references/`, and verifier. Collapsing to one `src/` with
`packs/` as the only extension point is the structural expression of Principle IV.

`tools/` sits outside `src/` deliberately. It holds everything that is *not* the Node
pipeline: `verify_deck.py`, whose directory boundary marks the subprocess boundary of the
one component in a different runtime, and the absorbed post-processing utilities, which
act on finished artifacts rather than on the plan and so are not pipeline stages.

`out/` is generated and untracked. It appears here only so that every directory a task
references is documented; nothing is ever authored into it.

**On FR-004 ("rendered output MUST NOT be edited")**: this is enforced *by absence*.
No command accepts a built artifact as an input to be modified, and no command treats a
hand-edited artifact as verified — `verify` always re-derives its expectations from the
plan. There is deliberately no guard rail beyond that, because the only way to edit
output is to leave the tool entirely, and a tool cannot prevent that. Recorded explicitly
so the absence reads as a decision rather than an oversight.

The superseded skill directories (`presentation-studio/`, `keynote-deck-builder/`,
`source-to-presentation-synthesis/`, `convert-pptx-to-handout/`,
`summarize-slide-images-to-note/`) are removed only once their capabilities are mapped
into the inventory required by FR-027 — deletion is the last step of User Story 5, not
the first step of the build.

## Complexity Tracking

> Fill ONLY if Constitution Check has violations that must be justified

No unjustified violations. One piece of added complexity is deliberate and is recorded
here because it deserves scrutiny rather than a silent pass:

| Addition | Why needed | Simpler alternative rejected because |
|---|---|---|
| A second intermediate representation (Render IR / layout primitives) between the plan and the renderers | Without it, delivery formats switch on slide types and every format is coupled to every vocabulary — the N×M coupling that made the original task list violate FR-009 | Having vocabularies ship one adapter per delivery format repairs adding a vocabulary but breaks adding a format, which is the direction this project exists to fix. It moves the coupling rather than removing it (research R11). |

The cost is real and is stated in R11: both existing renderers are restructured rather
than ported, since their per-slide-type layout logic moves into the vocabularies that own
it. That is the price of the guarantee, paid once.
