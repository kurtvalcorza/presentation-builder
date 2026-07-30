# Implementation Plan: Deck IR Consolidation

**Branch**: `001-deck-ir-consolidation` | **Date**: 2026-07-30 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-deck-ir-consolidation/spec.md`

## Summary

Replace three overlapping deck-building paths with one plan-driven pipeline.

A single **deck plan** (JSON) becomes the only authored artifact. A small core envelope
schema owns what is universal — slide ordering, identity, notes, attribution, timing —
while each **vocabulary pack** contributes the content schema for its own slide types.
**Delivery format packs** render that plan to a presentation file, a web page, a
document, and three non-slide views (spoken script, producer rundown, storyboard). Packs
are discovered by directory scan, so adding one touches zero files outside its own
directory.

One shared verifier replaces the two existing ones, enforcing rule *kinds* declared as
data by each vocabulary rather than branching on vocabulary identity. Two gates —
structural and visual — stand between a built artifact and delivery, with a three-state
result so "could not check" is never reported as "verified".

## Technical Context

**Language/Version**: Node (current LTS) for core, renderers, and the scrub check;
Python 3.9+ for the presentation-file verifier only

**Primary Dependencies**: a Node presentation-file generation library; a JSON Schema
2020-12 validator; a Python presentation-file reader; a headless office converter and an
image extraction tool for the visual gate and the document format

**Storage**: files on disk. The deck plan is the durable artifact; built outputs are
regenerable and deliberately untracked

**Testing**: contract tests for schema composition, golden-file tests per renderer, gate
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

**Scale/Scope**: 2 vocabulary packs at delivery (extensible), 7 delivery format packs,
33 functional requirements, 5 user stories; absorbs 2 standalone builders, 8 router
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

**Result: PASS.** One design decision (R2, scan-based discovery) makes two success
criteria *stricter* than written. SC-002 and SC-003 still say "the pack directory and
the pack registry"; the design supports dropping the registry clause. Flagged for
`/speckit-analyze` to reconcile.

## Project Structure

### Documentation (this feature)

```text
specs/001-deck-ir-consolidation/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 output — 10 decisions
├── data-model.md        # Phase 1 output — entities and state transitions
├── quickstart.md        # Phase 1 output — 9 validation scenarios
├── contracts/           # Phase 1 output
│   ├── deck-plan.schema.md
│   ├── pack-contract.md
│   └── cli-and-verifier.md
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
├── packs/                       # discovery by scan, manifest loading, capability probing
├── gates/                       # gate orchestration, three-state reporting, backups
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
├── golden/                      # per-renderer byte-stable output
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

No violations. Both Constitution Checks pass, and two design decisions tighten the
guarantees rather than relaxing them. This table is intentionally empty.
