---

description: "Task list for Deck IR Consolidation"
---

# Tasks: Deck IR Consolidation

**Input**: Design documents from `/specs/001-deck-ir-consolidation/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: INCLUDED. Research R9 defines a three-layer test strategy and quickstart.md
defines nine validation scenarios, so tests are part of the design rather than optional.

**Organization**: Grouped by user story so each remains an independently testable slice.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on incomplete work)
- **[Story]**: Which user story the task serves
- Exact file paths included in every task

## Terminology

`spec.md` says **delivery format pack**; this file and `contracts/` say **target**. They
are the same thing — the manifest field is literally `"kind": "target"`. Spec language is
stakeholder-facing; task and contract language matches the code.

## Path Conventions

Single project rooted at the repository (plan.md → Structure Decision): `bin/`, `src/`,
`packs/`, `tools/`, `tests/`, `examples/`, `references/`, with generated output in `out/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project skeleton and toolchain. No feature behaviour yet.

- [ ] T001 Create the directory skeleton (`bin/`, `src/plan/`, `src/packs/`, `src/gates/`, `src/scrub/`, `packs/`, `tools/`, `tests/`, `examples/`, `references/`) per plan.md Structure Decision
- [ ] T002 Initialize the Node project in `package.json` with a JSON Schema 2020-12 validator and the presentation-file generation library; pin versions and set `"type": "module"`
- [ ] T003 [P] Add `tools/requirements.txt` pinning the Python presentation-file reader used by the verifier
- [ ] T004 [P] Configure linting and formatting in `eslint.config.mjs` and `.editorconfig`
- [ ] T005 [P] Add the test runner configuration in `package.json` with separate `contract`, `golden`, `gates`, `isolation`, and `scrub` suites per research R9
- [ ] T006 Extend `.gitignore` with build-output patterns for the generated `out/` directory, keeping the existing scrub-denylist and workspace-artifact rules intact (FR-025)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The shared plan format and pack machinery. **Every user story depends on
this phase.** Nothing below can start until it completes.

- [ ] T007 Implement the core envelope schema as JSON Schema 2020-12 in `src/plan/envelope.schema.json`, exactly as specified in `contracts/deck-plan.schema.md` including `additionalProperties: false` throughout
- [ ] T008 Implement schema composition in `src/plan/compose.mjs` — dispatch each slide's `content` to the schema the declared vocabulary supplies for that slide's `type` (research R1)
- [ ] T009 Implement the eight non-schema constraints C1–C8 in `src/plan/constraints.mjs` per `contracts/deck-plan.schema.md`
- [ ] T010 Implement the unified error report shape in `src/plan/errors.mjs` so every failure carries `slide_id`, `slide_index`, `path`, `code`, and `message` (FR-003)
- [ ] T011 Implement pack discovery by directory scan in `src/packs/discover.mjs` — scan `packs/`, load each `pack.json`, assert `id` equals the directory name. **No registry file** (research R2)
- [ ] T012 Implement manifest validation for both pack kinds in `src/packs/manifest.mjs` per `contracts/pack-contract.md`
- [ ] T013 Implement the external-toolchain capability probe in `src/packs/capabilities.mjs`, returning per-toolchain availability for honest degradation (research R6)
- [ ] T014 Implement the three-state gate result model (`passed` / `failed` / `not_run`) and `overall` rollup in `src/gates/report.mjs`, where any `not_run` yields `incomplete` and never `passed` (FR-019)
- [ ] T015 Implement phase-named, non-overwriting backups in `src/gates/backup.mjs` (FR-021, research R8)
- [ ] T016 Implement the command surface skeleton in `bin/deck.mjs` with subcommands `packs`, `validate`, `render`, `verify`, `build`, `scrub` and the exit-code contract 0/1/2/3/4 per `contracts/cli-and-verifier.md`
- [ ] T017 [P] Write contract tests in `tests/contract/envelope.test.mjs` asserting valid plans pass and each of C1–C8 fails with the correct `code`, `slide_id`, and `path`
- [ ] T018 [P] Add `examples/sample-plan.json` and `examples/invalid-plan.json` as the shared fixtures used by later phases

**Checkpoint**: `deck validate examples/sample-plan.json` succeeds and
`examples/invalid-plan.json` fails naming slide and field, with zero packs installed.

---

## Phase 3: User Story 1 — Author once, deliver in any format (Priority: P1) 🎯 MVP

**Goal**: One plan drives several delivery formats, and defective decks cannot ship.

**Independent test**: Author one plan, select two formats, confirm both are produced with
matching content, slide count, and notes, with nothing authored twice
(quickstart Scenario 1).

### Vocabulary and rules

- [ ] T019 [US1] Port the sparse keynote vocabulary to `packs/keynote/` — `pack.json`, per-type content schemas under `packs/keynote/types/`, and the three themes — from the existing `keynote-deck-builder/SLIDE_TYPES.md` and `references/outline_template.json`
- [ ] T020 [US1] Express the keynote vocabulary's verification rules as declared data in `packs/keynote/rules.json` using only generic rule kinds (FR-010)
- [ ] T021 [US1] Implement the generic rule-kind evaluator in `src/gates/rules.mjs` supporting `notes_word_count`, `attribution_required`, `no_adjacent_same_type`, and `required_boundary_types`, with **no branching on pack id** (FR-010)

### Renderers

- [ ] T022 [US1] Port the keynote presentation-file renderer to `packs/presentation-file/render.mjs`, adapting `keynote-deck-builder/scripts/build_keynote.js` to the `render({plan, vocabulary, theme, outDir, capabilities})` contract; it MUST NOT mutate the plan or read source material
- [ ] T023 [P] [US1] Copy the existing HTML style presets into `packs/web/runtime/` **verbatim and frozen** — this is SHIPPED code under Constitution Principle II, never regenerated at build time; fonts from the public font service are the only permitted external dependency
- [ ] T024 [US1] Implement the web renderer in `packs/web/render.mjs`, emitting a self-contained page that references the frozen runtime from T023
- [ ] T025 [P] [US1] Implement the document target as `packs/document/pack.json` declaring `derives_from: presentation-file` and `requires: [office-converter]` — **no renderer**, it converts the upstream artifact (FR-031, research R4)
- [ ] T026 [US1] Implement `derives_from` resolution in `src/packs/derive.mjs` so a deriving target receives the upstream target's artifacts and never reads the plan

### Verification and delivery

- [ ] T027 [US1] Merge the two existing Python verifiers into `tools/verify_deck.py`, porting the hard-fail checks (`notes_missing`, `slide_count_mismatch`, `plan_content_absent`, `render_artifact`) and emitting JSON on stdout per `contracts/cli-and-verifier.md`; it takes resolved rules as input and has **no knowledge of packs**
- [ ] T028 [US1] Implement the visual gate in `src/gates/visual.mjs`, rendering per-slide images into a fresh directory each run and reporting `not_run` with a reason when its toolchain is absent
- [ ] T029 [US1] Implement gate orchestration in `src/gates/run.mjs` wiring T027 and T028 into the three-state report, refusing delivery unless `overall` is `passed` (FR-018)
- [ ] T030 [US1] Implement `build` in `bin/deck.mjs` as validate → render → verify, with per-target reporting and partial-success handling that exits non-zero (FR-020)
- [ ] T031 [US1] Implement FR-011 in `src/plan/constraints.mjs` — report at validation time any slide type a selected target's `supported_types` excludes, **before** rendering

### Tests

- [ ] T032 [P] [US1] Golden-file tests in `tests/golden/` asserting byte-stable output per renderer for `examples/sample-plan.json`
- [ ] T033 [P] [US1] Add the three defect fixtures `examples/defect-notes-missing.json`, `examples/defect-count-mismatch.json`, `examples/defect-content-absent.json`
- [ ] T034 [US1] Gate tests in `tests/gates/blocked.test.mjs` asserting each defect fixture exits 1, names the failing slide, and produces **no delivered artifact** (SC-005, quickstart Scenario 4)
- [ ] T035 [US1] Degradation test in `tests/gates/degradation.test.mjs` asserting that with the office toolchain absent the run exits **3, not 0**, the document target reports unavailable, and `overall` is `incomplete` (FR-019, quickstart Scenario 5)
- [ ] T036 [US1] Test in `tests/contract/refusal.test.mjs` asserting an invalid plan creates **zero output files** (quickstart Scenario 3)
- [ ] T037 [US1] **Note-binding test** in `tests/contract/note-binding.test.mjs` — reorder, insert, and delete slides in a plan, then assert every slide's `notes` and `attribution` still belong to the slide they started on, keyed by `id`. This is the only test covering FR-006, and FR-006 is what justifies stable ids over ordinals in data-model.md; a regression here still renders and still passes every other gate, so nothing else would catch it
- [ ] T038 [P] [US1] Re-render invariance test in `tests/golden/rerender.test.mjs` — change one slide's wording and assert every target reflects it with no per-format edit; then change only `theme` and assert each slide's text is byte-identical to the prior run (FR-005, SC-009, quickstart Scenario 2)

**Checkpoint**: MVP complete. One plan renders to presentation file, web, document, and
gates block every defective deck.

---

## Phase 4: User Story 2 — Extend without touching the core (Priority: P2)

**Goal**: Adding a vocabulary or a delivery format touches zero files outside its own
directory.

**Independent test**: Add throwaway packs and assert via file-level diff that nothing
outside their directories changed (quickstart Scenario 6).

- [ ] T039 [US2] Add the dense attribution-carrying research vocabulary to `packs/research/` — `pack.json`, per-type content schemas, themes, `rules.json` — ported from `../research-deck-builder/SLIDE_BLUEPRINTS.md`. **Treat this as the first real test of additivity**: if it cannot be added without editing the core, fix the schema, not the pack (User Story 2 scenario 3)
- [ ] T040 [US2] Extend the presentation-file renderer in `packs/presentation-file/` to cover the research vocabulary's slide types, adapting `../research-deck-builder/scripts/build_deck_template.js`
- [ ] T041 [US2] Add attribution rendering to `packs/research/` supporting the attribution styles the vocabulary declares (FR-014)
- [ ] T042 [P] [US2] Add throwaway fixture packs `examples/throwaway-vocabulary/` and `examples/throwaway-target/` with minimal valid manifests
- [ ] T043 [US2] **Pack isolation test** in `tests/isolation/pack-isolation.test.mjs` — record repository file state, add each throwaway pack, run discovery/validate/render, assert every changed file is inside the new pack's directory. This is the mechanical proof of Constitution Principle IV (SC-002, SC-003)
- [ ] T044 [US2] Reconcile the registry wording in `spec.md` in **all three places** — SC-002, SC-003, **and User Story 2 acceptance scenario 1** (`spec.md:55`). Scan-based discovery (research R2) means no registry file exists, so drop every "and the pack registry" clause and tighten each to "zero files outside the pack directory". Missing the acceptance scenario would leave it contradicting the architecture

**Checkpoint**: Two real vocabularies and several targets coexist; additivity is proven
by test rather than asserted.

---

## Phase 5: User Story 3 — From a long source to a reviewed plan (Priority: P3)

**Goal**: Long-form material becomes a proposed plan the author reviews before rendering.

**Independent test**: Supply one long-form source, confirm a reviewable plan is produced
and passes `validate`, correct it, and confirm corrections reach delivery without
re-running intake.

- [ ] T045 [US3] Write the intake phase guidance in `references/intake.md` with a "When to read this" trigger (Principle V), absorbing `source-to-presentation-synthesis/SKILL.md` and the router's speaker-script guidance
- [ ] T046 [US3] Implement attribution-list extraction and consistency checking in `src/plan/attributions.mjs`, surfacing prose-versus-list mismatches to the author rather than resolving them (FR-015)
- [ ] T047 [US3] Implement the approval checkpoint in `bin/deck.mjs` — present the slide-by-slide plan and require explicit approval before any render (FR-013)
- [ ] T048 [P] [US3] Add the non-slide targets `packs/spoken-script/`, `packs/rundown/`, and `packs/storyboard/`, all rendering from the same plan; `rundown` consumes `duration_sec` (research R5, FR-032)
- [ ] T049 [US3] Verify the envelope carries enough for all three non-slide targets; if any needs a field beyond `duration_sec`, add it to the **envelope** in `src/plan/envelope.schema.json` rather than adding a per-format escape hatch (research R5)

**Checkpoint**: A long source becomes an approved plan that renders to slide and
non-slide formats alike.

---

## Phase 6: User Story 4 — Nothing unpublishable can be published (Priority: P4)

**Goal**: A fail-closed publish-safety check with no false positives.

**Independent test**: A known-bad string fails the check; a missing denylist also fails
rather than reporting success (quickstart Scenario 8).

- [ ] T050 [US4] Port the validated PowerShell prototype to a single cross-platform Node implementation in `src/scrub/scan.mjs`, parsing the `[cs-word]` / `[ci-word]` / `[regex]` sections of the denylist and scanning **tracked files only** (FR-022, FR-024, research R7)
- [ ] T051 [US4] Implement fail-closed behaviour in `src/scrub/scan.mjs` — a missing or unreadable denylist exits **4**, never 0 (FR-023)
- [ ] T052 [P] [US4] Add the false-positive regression fixture in `tests/scrub/fixtures/` containing *forecasting*, *lasting*, and *contrasting*, plus a currency code used as a programming-language name — all of which MUST NOT match (FR-024)
- [ ] T053 [US4] Scrub tests in `tests/scrub/scan.test.mjs` covering: a real hit exits 1 naming file and line; a missing denylist exits 4; the regression fixture yields zero findings; and **`git ls-files` never contains the denylist path**, so FR-026 cannot silently regress if the ignore rule is edited (SC-006, FR-026)
- [ ] T054 [US4] Wire `scrub` into `bin/deck.mjs` and document it in `references/publishing.md` as the required pre-commit check

**Checkpoint**: The publish-safety guarantee is executable rather than a habit.

---

## Phase 7: User Story 5 — Retire the duplicates cleanly (Priority: P5)

**Goal**: One documented way to build a deck, with no capability silently dropped.

**Independent test**: Every superseded capability maps to a replacement or an accepted
drop with a reason; expected drop count is zero (quickstart Scenario 9).

**Depends on**: US4 — the scrub check must exist before absorbing external material.

- [ ] T055 [US5] Build the capability inventory in `specs/001-deck-ir-consolidation/migration-inventory.md`, enumerating every capability of the two builders, the eight router modes, and the two post-processing utilities, each mapped to its replacement or recorded as an accepted drop (FR-027, SC-012)
- [ ] T056 [US5] Absorb **tracked files only** from `../research-deck-builder` into this repository; run `deck scrub` immediately after the copy and **before** staging, and do not commit unless it exits 0 (FR-030, research R10)
- [ ] T057 [P] [US5] Absorb `convert-pptx-to-handout/` and `summarize-slide-images-to-note/` as post-processing utilities under `tools/`, preserving their behaviour
- [ ] T058 [P] [US5] Absorb the two advisory router modes (version comparison, structure selection) into `references/advisory.md` as utilities alongside the pipeline rather than pipeline stages (FR-032)
- [ ] T059 [US5] Update `THIRD-PARTY-NOTICES.md` to cover every absorbed third-party artifact, including the frozen web runtime from T023, **before** the commit that absorbs it (FR-029, Principle VII)
- [ ] T060 [US5] Rewrite `SKILL.md` as a lean router with "When to read this" triggers on every reference file (Principle V, FR-028)
- [ ] T061 [US5] Rewrite `README.md` to describe the consolidated pipeline, removing the five-skill table and the superseded "sibling repository" arrangement (FR-028, SC-010)
- [ ] T062 [US5] Add a deprecation notice to the standalone `../research-deck-builder` README directing readers here, within the first screen (FR-033, SC-011)
- [ ] T063 [US5] **Last step, gated on T055 being complete with zero unaccounted entries**: delete the superseded directories `presentation-studio/`, `keynote-deck-builder/`, `source-to-presentation-synthesis/`, `convert-pptx-to-handout/`, `summarize-slide-images-to-note/`

**Checkpoint**: The duplication is gone, not merely supplemented.

---

## Phase 8: Polish & Cross-Cutting Concerns

- [ ] T064 [P] Add `references/` "When to read this" headers to every reference file and verify none is loaded upfront (Principle V)
- [ ] T065 [P] Write `examples/README.md` explaining each fixture and which quickstart scenario it serves
- [ ] T066 Run the full quickstart end to end on Windows and on POSIX, confirming identical exit codes on both (plan.md Target Platform)
- [ ] T067 Verify every one of the 33 functional requirements is exercised by at least one test or quickstart scenario; record gaps in `specs/001-deck-ir-consolidation/coverage.md`
- [ ] T068 Run `deck scrub` over the final tree and confirm zero violations before the feature branch is proposed for merge (Principle VI)

---

## Dependencies

```
Phase 1 Setup
     ↓
Phase 2 Foundational  ←── blocks everything
     ↓
   ┌─┴──────────────┬──────────────┬─────────────┐
   ↓                ↓              ↓             ↓
US1 (P1) MVP    US3 (P3)       US4 (P4)     (US2 needs US1)
   ↓                                ↓
US2 (P2)                            ↓
   └──────────────┬─────────────────┘
                  ↓
              US5 (P5)  ←── needs US4 (scrub) and the T055 inventory
                  ↓
             Phase 8 Polish
```

**Story dependency notes**:

- **US2 depends on US1** — it proves additivity by adding a *second* vocabulary, which
  requires a first one to exist.
- **US5 depends on US4** — absorbing external material without the scrub check in place
  would violate Principle VI at exactly the moment of highest risk.
- **US3 is independent of US1/US2** after Phase 2 and can proceed in parallel.
- **T063 is gated on T055**, not merely ordered after it. Deleting a superseded directory
  before its capabilities are inventoried is how capability loss becomes silent.

## Parallel Execution Examples

**Phase 2**: T017 and T018 run together once T007–T016 land.

**Phase 3 (US1)**: T023 (freeze web runtime) and T025 (document target manifest) are
independent of the renderer work in T022/T024. T032 and T033 run together, as do T037 and
T038 once T030 lands.

**Phase 4 (US2)**: T042 (throwaway fixtures) is independent of T039–T041.

**Phase 5 (US3)**: T048 (three non-slide targets) is independent of T045–T047.

**Phase 6 (US4)**: T052 (regression fixture) is independent of T050–T051.

**Phase 7 (US5)**: T057 and T058 are independent absorptions. T059 must precede the
commit for whichever absorption lands first.

## Implementation Strategy

**MVP = Phase 1 + Phase 2 + Phase 3 (US1).** That delivers the feature's core claim —
one plan, several formats, gates that actually block — with one vocabulary. It is
independently valuable and independently shippable.

**Then US2**, because it is the load-bearing architectural claim. If adding the second
vocabulary requires touching the core, that must surface early, while only one renderer
exists to fix. Deferring US2 would let a leaky abstraction harden.

**Then US4 before US5**, because US5 copies external material into a public repository
and US4 is the check that makes that safe.

**US3 can run in parallel** with any of the above once Phase 2 completes.

**Do not start Phase 7 deletions until T055 shows zero unaccounted capabilities.** The
whole risk of a consolidation is silent capability loss, and the inventory is the only
thing standing against it.
