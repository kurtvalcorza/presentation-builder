---

description: "Task list for Deck IR Consolidation"
---

# Tasks: Deck IR Consolidation

**Input**: Design documents from `/specs/001-deck-ir-consolidation/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: INCLUDED. Research R9 defines a four-layer test strategy and quickstart.md
defines twelve validation scenarios.

**Organization**: Grouped by user story so each remains an independently testable slice.

**Revised 2026-07-31**, twice, after two external reviews.

The first found that the previous list required editing a delivery format in order to add
a vocabulary — a direct violation of FR-009, in the phase meant to prove additivity. The
response was structural: a capability-inventory phase now precedes all design work, and
the vocabulary/format seam is rebuilt around layout primitives.

The second found the same principle violated one level up: the rewritten task still
permitted extending the shared primitive set from inside the vocabulary-addition phase.
A missing primitive is now a **stop condition** that returns to Phase 0, and the isolation
property is asserted against the *real* research vocabulary and not only a throwaway pack
— the gap that let both violations through.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on incomplete work)
- **[Story]**: Which user story the task serves
- Exact file paths included in every task

## Terminology

`spec.md` says **delivery format pack**; this file and `contracts/` say **target**. Same
thing — the manifest field is `"kind": "target"`. Spec language is stakeholder-facing;
task and contract language matches the code.

## Path Conventions

Single project rooted at the repository: `bin/`, `src/`, `packs/`, `tools/`, `tests/`,
`examples/`, `references/`, with staged output in `out/staging/` and delivered output in
`out/delivered/`.

---

## Phase 0: Capability Inventory (Design Input)

**Purpose**: establish what the superseded components can express **before** designing the
primitive set that must express it. Research R17: the inventory is the requirements input
for the primitive layer, not a closing checklist. Designing primitives first and
inventorying later is how a consolidation silently loses capability.

- [ ] T001 Build the capability inventory in `specs/001-deck-ir-consolidation/migration-inventory.md` — every slide construct, rule, theme axis, and output behaviour of the two builders (`../research-deck-builder/SLIDE_BLUEPRINTS.md`, `keynote-deck-builder/SLIDE_TYPES.md`), the eight router modes, and the two post-processing utilities (FR-027, SC-012)
- [ ] T002 Derive the closed primitive set from T001 and record it in `specs/001-deck-ir-consolidation/contracts/render-ir.md` — every construct in the inventory MUST map to a primitive or be listed as an accepted drop with a reason. Apply the design test: a primitive a renderer cannot draw without knowing which vocabulary produced it is not a primitive
- [ ] T003 [P] Map each inventory entry to its replacement (vocabulary type, primitive kind, delivery format, or advisory utility) in `migration-inventory.md`, leaving zero unaccounted entries
- [ ] T004 Confirm the rule vocabulary covers every declared rule found in T001, extending the rule-kind list in `contracts/pack-contract.md` where it does not — a rule kind that only one vocabulary can use is a smell (FR-010)

**Checkpoint**: the primitive set and rule vocabulary are grounded in what actually has to
be expressed, not guessed.

---

## Phase 1: Setup (Shared Infrastructure)

- [ ] T005 Create the directory skeleton (`bin/`, `src/plan/`, `src/render-ir/`, `src/packs/`, `src/gates/`, `src/delivery/`, `src/scrub/`, `packs/`, `tools/`, `tests/`, `examples/`, `references/`) per plan.md Structure Decision
- [ ] T006 Initialize the Node project in `package.json` with the dependencies selected in research R16 — Ajv on its **2020-12 entry point** (the default export is an older draft), PptxGenJS, the pdf.js distribution, and the **prebuilt** N-API canvas backend (a source build would require a compiler on Windows); pin versions, set `"type": "module"`
- [ ] T007 [P] Add `tools/requirements.txt` pinning the Python presentation reader used by the presentation-file extraction adapter
- [ ] T008 [P] Configure linting and formatting in `eslint.config.mjs` and `.editorconfig`
- [ ] T009 [P] Add npm scripts in `package.json` covering **all twelve** quickstart scenarios — `deck` (the CLI entry every scenario invokes), `test:rerender`, `test:gates`, `test:isolation`, `test:adapters`, `test:visual`, `test:promotion`, `test:scrub`, `test:intake`, and `test:inventory` — so validation runs identically on Windows and POSIX with no shell built-ins (quickstart Platform note)
- [ ] T010 Extend `.gitignore` for `out/staging/` and `out/delivered/`, keeping the scrub-denylist and workspace-artifact rules intact (FR-025)
- [ ] T011 Record licences for every selected dependency in `THIRD-PARTY-NOTICES.md` **in this same change**, not later (Principle VII, research R16)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: both seams and the delivery boundary. Every user story depends on this phase.

### Seam 1 — the plan

- [ ] T012 Implement the core envelope schema in `src/plan/envelope.schema.json` per `contracts/deck-plan.schema.md`, with `additionalProperties: false` throughout
- [ ] T013 Implement schema composition in `src/plan/compose.mjs` — dispatch each slide's `content` to the schema the declared vocabulary supplies for that type (R1)
- [ ] T014 Implement constraints C1–C8 in `src/plan/constraints.mjs` per `contracts/deck-plan.schema.md`
- [ ] T015 Implement the unified error report in `src/plan/errors.mjs` carrying `slide_id`, `slide_index`, `path`, `code`, `message` (FR-003)

### Seam 2 — the Render IR

- [ ] T016 Implement the closed primitive set and Render IR schema in `src/render-ir/primitives.schema.json` from `contracts/render-ir.md` (FR-034, FR-036)
- [ ] T017 Implement compilation orchestration in `src/render-ir/compile.mjs` — invoke the declared vocabulary's compiler, resolve theme tokens to values, validate the result against the primitive schema, and carry slide `id` through onto each unit (FR-006)
- [ ] T018 Implement the FR-011 support check in `src/render-ir/support.mjs` — compare produced primitive kinds against the target's `supported_primitives`, exempting the decorative kinds (`motif`, `spacer`), and report before any rendering

### Packs

- [ ] T019 Implement pack discovery by directory scan in `src/packs/discover.mjs` — scan `packs/`, load each `pack.json`, assert `id` equals the directory name. **No registry file** (R2)
- [ ] T020 Implement manifest validation for both pack kinds in `src/packs/manifest.mjs` per `contracts/pack-contract.md`, **rejecting a target manifest that declares `supported_types`** — the coupled field name must fail loudly rather than work
- [ ] T021 Implement the toolchain capability probe in `src/packs/capabilities.mjs`. **Do not probe PATH alone** — check well-known install locations and an override environment variable. Measured: the office converter is installed at `C:\Program Files\LibreOffice\program\soffice.exe` but is not on PATH, so a PATH-only probe disables the visual gate and document target on the machine used to test them

### Gates and delivery boundary

- [ ] T022 Implement the three-state gate result model in `src/gates/report.mjs` — any `not_run` yields `incomplete`, never `passed` (FR-019); distinguish `not_run` (nobody looked) from `N/A` (no such surface)
- [ ] T023 Implement the generic rule-kind evaluator in `src/gates/rules.mjs` supporting the kinds confirmed in T004, with **no branching on pack id** (FR-010)
- [ ] T024 Implement the shared structural verifier in `src/gates/structural.mjs` — take each target's extraction and compare against the plan, hard-failing on notes missing, count mismatch, plan content absent, and render artifacts (FR-016). Comparison lives here; extraction never does
- [ ] T025 Implement staging in `src/delivery/staging.mjs` — renderers write only under `out/staging/<build-id>/` (FR-038)
- [ ] T026 Implement build records in `src/delivery/record.mjs` — plan digest, vocabulary, theme, per-target artifact digests and toolchain versions (FR-039)
- [ ] T027 Implement **per-target** atomic promotion in `src/delivery/promote.mjs` — each target promotes independently, gated on its own verification being `passed`; atomicity is within a target, so no state exists where a target is half-delivered. A target that did not pass MUST NOT block unrelated targets that did, and the run still reports `incomplete` at build level (FR-038, SC-015)
- [ ] T028 Implement phase-named, non-overwriting backups in `src/delivery/backup.mjs` (FR-021, R8)

### Command surface and fixtures

- [ ] T029 Implement `bin/deck.mjs` with subcommands `packs`, `validate`, `compile`, `render`, `verify`, `promote`, `build`, `scrub` and exit codes 0/1/2/3/4 per `contracts/cli-and-verifier.md`
- [ ] T030 Implement the two distinct verify claims in `bin/deck.mjs` — with a build record, "verified output of plan X"; without one, "checks passed, provenance unestablished". `promote` accepts only the first (FR-039)
- [ ] T031 [P] Contract tests in `tests/contract/envelope.test.mjs` — valid plans pass; each of C1–C8 fails with the correct `code`, `slide_id`, `path`
- [ ] T032 [P] Contract tests in `tests/contract/primitives.test.mjs` — a compiler emitting an unknown primitive kind is rejected at the seam, not silently rendered
- [ ] T033 [P] Add `examples/sample-plan.json` and `examples/invalid-plan.json`

**Checkpoint**: a plan validates, compiles to primitives, and the delivery boundary exists
— with zero packs installed.

---

## Phase 3: User Story 1 — Author once, deliver in any format (Priority: P1) 🎯 MVP

**Goal**: one plan drives several delivery formats through the primitive layer, and
defective decks cannot reach the delivered location.

**Independent test**: quickstart Scenario 1 — one plan, two formats, matching content and
notes, nothing authored twice.

### Vocabulary (compiles to primitives)

- [ ] T034 [US1] Port the sparse keynote vocabulary to `packs/keynote/` — `pack.json`, per-type content schemas under `types/`, theme token files under `themes/` — from `keynote-deck-builder/SLIDE_TYPES.md` and its outline template
- [ ] T035 [US1] Implement `packs/keynote/compile.mjs` translating each slide type into primitives per `contracts/render-ir.md`. **It MUST NOT contain any delivery format id** — this is where the old design put format knowledge, and SC-013 is checked by searching for exactly that
- [ ] T036 [US1] Express the keynote vocabulary's rules as declared data in `packs/keynote/rules.json` using only the confirmed rule kinds (FR-010)

### Delivery formats (render primitives)

- [ ] T037 [US1] Implement the presentation-file renderer in `packs/presentation-file/render.mjs` — one handler per **primitive kind**, taking the Render IR and never the plan. Adapt the drawing helpers from `keynote-deck-builder/scripts/build_keynote.js`, but leave its per-slide-type layout logic behind: that logic belongs to the vocabulary now (R11)
- [ ] T038 [P] [US1] Copy the existing HTML style presets into `packs/web/runtime/` **verbatim and frozen** — SHIPPED code under Principle II, never regenerated at build time. Update `THIRD-PARTY-NOTICES.md` in the **same change**, not a later phase (Principle VII)
- [ ] T039 [US1] Implement the web renderer in `packs/web/render.mjs` — one handler per primitive kind, referencing the frozen runtime from T038
- [ ] T040 [P] [US1] Implement the document target as `packs/document/pack.json` declaring `derives_from: presentation-file` and `requires: [office-converter]` — **no renderer** (FR-031, R4)
- [ ] T041 [US1] Implement `derives_from` resolution in `src/packs/derive.mjs` — a deriving target receives the upstream target's **staged** artifacts and reads neither plan nor Render IR

### Verification adapters

- [ ] T042 [US1] Implement `tools/verify_deck.py` as the presentation-file **extraction adapter** — emit units, content, notes, attributions, and count as JSON on stdout per `contracts/cli-and-verifier.md`. Port the reading logic from the two superseded verifiers, but **drop their judgement logic**: comparison now lives in the shared verifier (R13)
- [ ] T043 [P] [US1] Implement `packs/web/extract.mjs` — extraction adapter for the web format
- [ ] T044 [P] [US1] Implement `packs/document/extract.mjs` — extraction adapter for the document format
- [ ] T045 [US1] Wire adapter dispatch in `src/gates/structural.mjs` so structural verification runs for **every** target with an adapter, and a target without one cannot report a structural result at all (FR-037, SC-014)

### Visual gate

- [ ] T046 [US1] Implement rasterizing in `src/gates/visual-render.mjs` — office converter for presentation-file → PDF, then the Node PDF rasterizer → per-slide images, into a fresh directory each run
- [ ] T047 [US1] Implement the visual **inspection** in `src/gates/visual.mjs` — automated checks for the mechanically detectable defects the superseded builders enumerated (text overflow, clipping, element overlap, contrast below threshold, margin breach), producing a recorded verdict naming what was inspected and what was found. **Rasterizing alone reports `not_run`, never `passed`** (FR-017, R12)
- [ ] T048 [US1] Implement the human-review path in `src/gates/visual.mjs` — record an explicit verdict against the rendered images, so a human pass is auditable and distinguishable from nobody looking (R12)

### Build pipeline

- [ ] T049 [US1] Implement `build` in `bin/deck.mjs` as validate → compile → render(staging) → verify → promote, with per-target reporting and partial-success handling that exits non-zero (FR-020)

### Tests

- [ ] T050 [P] [US1] Golden tests in `tests/golden/` comparing a **normalized extraction** — units, text, notes, attributions, ordering, theme tokens — not raw bytes. A presentation file is a ZIP carrying timestamps and entry ordering, so byte comparison fails on unchanged re-runs and the test gets deleted (R9 correction)
- [ ] T051 [P] [US1] Add defect fixtures `examples/defect-notes-missing.json`, `examples/defect-count-mismatch.json`, `examples/defect-content-absent.json`
- [ ] T052 [US1] Gate tests in `tests/gates/blocked.test.mjs` — each fixture exits 1, names the failing slide, delivers nothing (SC-005, quickstart 4)
- [ ] T053 [US1] Degradation test in `tests/gates/degradation.test.mjs` — office converter absent ⇒ exit **3 not 0**, document unavailable, overall `incomplete` (FR-019, quickstart 5)
- [ ] T054 [US1] Refusal test in `tests/contract/refusal.test.mjs` — an invalid plan creates zero output files anywhere, staging included (quickstart 3)
- [ ] T055 [US1] **Note-binding test** in `tests/contract/note-binding.test.mjs` — reorder, insert, and delete slides, then assert notes and attributions still belong to the slide they started on, keyed by `id`. Only test covering FR-006, which is what justifies stable ids over ordinals; a regression still renders and passes every other gate
- [ ] T056 [P] [US1] Re-render invariance test in `tests/golden/rerender.test.mjs` — a wording change reaches every target with no per-format edit; a theme-only change leaves unit text identical (FR-005, SC-009, quickstart 2)
- [ ] T057 [US1] Adapter tests in `tests/adapters/` — corrupt each delivered artifact per format and confirm that format's own adapter causes the structural gate to fail (SC-014, quickstart 8)
- [ ] T058 [US1] Visual gate tests in `tests/gates/visual.test.mjs` against fixtures with deliberate overflow, overlap, contrast, and margin defects (FR-017, quickstart 9)
- [ ] T059 [US1] Promotion tests in `tests/delivery/promotion.test.mjs` — failed gates leave the delivered location untouched; passing gates promote atomically; an artifact with no build record reports provenance unestablished and cannot be promoted (SC-015, quickstart 10)

**Checkpoint**: MVP. One plan → primitives → several formats, every format structurally
verified by its own adapter, visual defects actually caught, nothing delivered ungated.

---

## Phase 4: User Story 2 — Extend without touching the core (Priority: P2)

**Goal**: adding a vocabulary or a delivery format touches zero files outside its own
directory, **in both directions**.

- [ ] T060 [US2] Add the dense attribution-carrying research vocabulary to `packs/research/` — `pack.json`, content schemas, theme tokens, `rules.json` — from `../research-deck-builder/SLIDE_BLUEPRINTS.md`
- [ ] T061 [US2] Implement `packs/research/compile.mjs` translating the research archetypes into primitives, **touching no file outside `packs/research/`**. If a needed primitive kind does not exist, **STOP** — do not extend `src/render-ir/` from inside this phase. A missing primitive here is evidence that the Phase 0 derivation (T002) was incomplete: return there, fix the inventory-to-primitive mapping and the primitive set as foundational work, then restart this task from a clean tree. Adding a vocabulary must remain a zero-outside-pack change (FR-009, SC-003, Principle IV) — permitting an inline core edit is how the previous task list violated the principle it was meant to prove
- [ ] T062 [US2] Assert the isolation property on the **real** vocabulary, not just the throwaway one, in `tests/isolation/add-research-vocabulary.test.mjs` — record the tree before T060–T061 and confirm every changed file is inside `packs/research/`. The throwaway-pack tests cannot catch a real vocabulary quietly requiring core edits, which is precisely the gap that let the previous violation through
- [ ] T063 [US2] Implement attribution rendering for the styles the research vocabulary declares, as an `attribution-line` primitive emitted by its compiler (FR-014)
- [ ] T064 [P] [US2] Add throwaway fixture packs `examples/throwaway-vocabulary/` and `examples/throwaway-target/` with minimal valid manifests, compiler, renderer, and adapter
- [ ] T065 [US2] **Isolation test, direction A** in `tests/isolation/add-vocabulary.test.mjs` — add the throwaway vocabulary, render to an existing format, assert every changed file is inside the new pack and **no delivery format changed**
- [ ] T066 [US2] **Isolation test, direction B** in `tests/isolation/add-target.test.mjs` — add the throwaway target, render an existing vocabulary's plan to it, assert every changed file is inside the new pack and **no vocabulary changed**
- [ ] T067 [US2] **Reference search test** in `tests/isolation/no-cross-reference.test.mjs` — no vocabulary pack contains a delivery format id; no delivery format pack contains a vocabulary id or slide type name (SC-013). Catches coupling written in from the start, which a diff cannot see

**Checkpoint**: two real vocabularies and six formats coexist; additivity proven by test in
both directions.

---

## Phase 5: User Story 3 — From a long source to a reviewed plan (Priority: P3)

- [ ] T068 [US3] Implement intake as an invocable phase in `src/intake/propose.mjs` with declared supported input types, a defined output location, and an explicit approval state — not guidance prose alone (FR-041)
- [ ] T069 [US3] Implement source traceability in `src/intake/trace.mjs` — every proposed slide records the location in the source it derives from (FR-042, SC-017)
- [ ] T070 [US3] Implement attribution extraction and consistency checking in `src/intake/attributions.mjs`, surfacing prose-versus-list mismatches rather than resolving them (FR-015)
- [ ] T071 [US3] Implement the approval checkpoint in `bin/deck.mjs` — present the slide-by-slide plan and require explicit approval before any compile or render (FR-013)
- [ ] T072 [P] [US3] Write intake guidance in `references/intake.md` with a "When to read this" trigger (Principle V), absorbing `source-to-presentation-synthesis/SKILL.md` and the router's speaker-script guidance
- [ ] T073 [P] [US3] Add the non-slide targets `packs/spoken-script/`, `packs/rundown/`, `packs/storyboard/` — renderers over the same primitives plus unit notes, each with its own extraction adapter; `rundown` consumes `duration_sec` (FR-032, R5)
- [ ] T074 [P] [US3] Add intake fixtures in `examples/intake/` — a long-form source with known load-bearing figures, claims, and attributions, plus a variant whose attribution list is deliberately inconsistent with its prose
- [ ] T075 [US3] Traceability test in `tests/intake/trace.test.mjs` — every slide in a proposed plan resolves to a source location (SC-017)
- [ ] T076 [US3] Generation test in `tests/intake/propose.test.mjs` — intake on the fixture produces a plan that **passes `validate`** against its declared vocabulary, with no hand-editing (FR-012, SC-008)
- [ ] T077 [US3] Fidelity test in `tests/intake/fidelity.test.mjs` — every known load-bearing figure and claim in the fixture appears in the proposed plan carrying the attribution the source gave it (FR-014). This is the requirement most likely to degrade silently, because a plan that drops a citation still renders and still passes every structural gate
- [ ] T078 [US3] Inconsistency test in `tests/intake/attributions.test.mjs` — the deliberately inconsistent fixture causes intake to surface the mismatch to the author rather than resolving it (FR-015)
- [ ] T079 [US3] Approval-blocking test in `tests/intake/approval.test.mjs` — a proposed but unapproved plan cannot compile, render, or promote; the checkpoint is a gate, not a prompt (FR-013)

---

## Phase 6: User Story 4 — Nothing unpublishable can be published (Priority: P4)

- [ ] T080 [US4] Implement the scanner in `src/scrub/scan.mjs` — parse the `[cs-word]` / `[ci-word]` / `[regex]` denylist sections; scan **tracked files and candidate files** (staged, or newly present and not ignored). A tracked-only scan is blind exactly when material has just been copied in (FR-022, R15)
- [ ] T081 [US4] Implement fail-closed behaviour in `src/scrub/scan.mjs` — missing or unreadable denylist exits **4**, never 0 (FR-023)
- [ ] T082 [P] [US4] Add the false-positive regression fixture in `tests/scrub/fixtures/` — *forecasting*, *lasting*, *contrasting*, and a currency code used as a language name, none of which may match (FR-024)
- [ ] T083 [US4] Install the commit-time hook in `tools/hooks/pre-commit` and wire its installation into project setup, so a denied term blocks the commit without anyone remembering to run the check (FR-040)
- [ ] T084 [US4] Report hook installation status in `deck packs`, so a repository missing its enforcement is visible rather than silently unprotected
- [ ] T085 [US4] Scrub tests in `tests/scrub/scan.test.mjs` — tracked hit exits 1; **untracked newly copied hit exits 1**; missing denylist exits 4; regression fixture yields zero findings; `git ls-files` never contains the denylist path (SC-006, SC-016, FR-026)
- [ ] T086 [US4] Document the check in `references/publishing.md`, noting that the hook is the control and the documentation is not

**Checkpoint**: publish safety is enforced, covers newly copied material, and is auditable.

---

## Phase 7: User Story 5 — Retire the duplicates cleanly (Priority: P5)

**Depends on**: US4 — absorbing external material without the scrub check in place would
violate Principle VI at the moment of highest risk.

- [ ] T087 [US5] Absorb **tracked files only** from `../research-deck-builder`; run `deck scrub` after the copy and **before** staging — now meaningful, since the scan covers untracked candidate files (FR-030, R10, R15)
- [ ] T088 [P] [US5] Absorb `convert-pptx-to-handout/` and `summarize-slide-images-to-note/` as post-processing utilities under `tools/`, preserving behaviour
- [ ] T089 [P] [US5] Absorb the two advisory router modes into `references/advisory.md` as utilities alongside the pipeline (FR-032)
- [ ] T090 [US5] Verify `THIRD-PARTY-NOTICES.md` covers every absorbed artifact, having been updated in each absorbing change rather than retrospectively (FR-029, Principle VII)
- [ ] T091 [US5] Rewrite `SKILL.md` as a lean router with "When to read this" triggers on every reference file (Principle V, FR-028)
- [ ] T092 [US5] Rewrite `README.md` for the consolidated pipeline, removing the five-skill table and the superseded sibling-repository arrangement (FR-028, SC-010)
- [ ] T093 [US5] **Cross-repository change** — in `../research-deck-builder` (a separate Git repository, `github.com/kurtvalcorza/research-deck-builder`): create a branch, add a deprecation notice to `README.md` directing readers here within the first screen, and open a PR. Do not commit to its default branch. This is a second repository's release cycle, not a file edit in this one (FR-033)
- [ ] T094 [US5] Record the cross-repository dependency in `specs/001-deck-ir-consolidation/migration-inventory.md` — SC-011 cannot be marked satisfied from inside this repository, because it is a claim about a different one. It closes only when T087's PR merges, and this feature MUST NOT be reported complete while that is outstanding
- [ ] T095 [US5] Re-confirm `migration-inventory.md` from T001 shows zero unaccounted entries now that everything is built (SC-007, SC-012)
- [ ] T096 [US5] **Last step, gated on T095**: delete the superseded directories `presentation-studio/`, `keynote-deck-builder/`, `source-to-presentation-synthesis/`, `convert-pptx-to-handout/`, `summarize-slide-images-to-note/`

---

## Phase 8: Polish & Cross-Cutting Concerns

- [ ] T097 [P] Add "When to read this" headers to every file in `references/` and verify none is loaded upfront (Principle V)
- [ ] T098 [P] Write `examples/README.md` explaining each fixture and the quickstart scenario it serves
- [ ] T099 Run every quickstart scenario on Windows and on POSIX via the npm scripts from T009, confirming identical exit codes
- [ ] T100 Verify all 42 functional requirements are exercised by a test or quickstart scenario; record gaps in `specs/001-deck-ir-consolidation/coverage.md`
- [ ] T101 Run `deck scrub` over the final tree and confirm zero violations before proposing the branch for merge (Principle VI)

---

## Dependencies

```
Phase 0 Capability Inventory  ←── design input; primitives derive from it
     ↓
Phase 1 Setup
     ↓
Phase 2 Foundational (both seams + delivery boundary)  ←── blocks everything
     ↓
   ┌─┴───────────────┬──────────────┐
   ↓                 ↓              ↓
US1 (P1) MVP     US3 (P3)      US4 (P4)
   ↓                                ↓
US2 (P2)                            ↓
   └───────────────┬────────────────┘
                   ↓
               US5 (P5)  ←── needs US4's scrub; T096 gated on T095
                   ↓
              Phase 8 Polish
```

- **Phase 0 precedes design**, not delivery. Deriving the primitive set from a guess and
  inventorying afterwards is how capability loss becomes silent (R17).
- **US2 depends on US1** — additivity is proven by adding a *second* vocabulary.
- **US5 depends on US4** — and now genuinely benefits from it, since the scan finally sees
  the untracked files the absorption creates.
- **T096 is gated on T095**, not merely ordered after it.

## Parallel Execution Examples

**Phase 0**: T003 runs alongside T002 once T001 lands.

**Phase 2**: T031–T033 run together once T012–T030 land.

**Phase 3**: T038 (freeze runtime) and T040 (document manifest) are independent of the
renderer work. T043/T044 (adapters) run together. T050/T051 and T056 run together.

**Phase 4**: T064 (throwaway fixtures) is independent of T060–T063.

**Phase 5**: T072 (guidance) and T073 (non-slide targets) are independent of T068–T071; T074 (fixtures) is independent of all of them.

**Phase 7**: T088 and T089 are independent absorptions.

## Implementation Strategy

**MVP = Phase 0 + 1 + 2 + US1.** Delivers the core claim — one plan, several formats via
primitives, gates that actually inspect and actually block — with one vocabulary.

**Then US2**, because it is the load-bearing architectural claim and the one that already
failed once. If the research vocabulary cannot be added without touching a delivery
format, that must surface while only one renderer exists to fix.

**Then US4 before US5**, because US5 copies external material into a public repository and
US4 is what makes that safe.

**US3 can run in parallel** once Phase 2 completes.

**Do not start Phase 7 deletions until T095 shows zero unaccounted capabilities.**
