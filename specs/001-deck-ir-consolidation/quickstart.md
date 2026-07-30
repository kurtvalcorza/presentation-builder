# Quickstart: Validating Deck IR Consolidation

**Feature**: 001-deck-ir-consolidation
**Purpose**: runnable scenarios proving the feature works end to end. Each maps to a
user story and its success criteria.

---

## Prerequisites

| Requirement | Needed for | If absent |
|---|---|---|
| Node (current LTS) | core, renderers, PDF rasterizing, scrub check | nothing runs |
| Python 3.9+ with a presentation-file reader | structural gate | gate reports `not_run`, exit 3 |
| Headless office converter | visual gate, document format | both report unavailable, exit 3 |

The office converter is the **only** external system dependency. Per-slide image
extraction for the visual gate is done in Node from the converted PDF, so there is no
separate image tool to install. If the converter is installed but not on `PATH` — the
common case on Windows — the capability probe finds it at its well-known location or via
the override environment variable; it does not report unavailable.

The degradation path is itself a scenario — see Scenario 5. Do not treat a missing
toolchain as a blocked quickstart; treat it as the case that must report honestly.

```bash
npm install
```

---

## Scenario 1 — Author once, deliver in several formats

*Proves: User Story 1 · SC-001 · FR-005*

```bash
node bin/deck.mjs build examples/sample-plan.json \
  --target presentation-file --target web --target spoken-script
```

**Expected**

- Three artifacts produced from one plan file.
- Slide count identical across all three.
- Every slide's visible text and speaker notes match across formats.
- Exit 0 when all gates pass.

**The check that matters**: the plan was authored once. Confirm no per-format content
file exists anywhere in the output.

---

## Scenario 2 — Re-render after a content change

*Proves: User Story 1 scenario 2 · SC-009*

Edit one slide's wording in the plan, then:

```bash
node bin/deck.mjs build examples/sample-plan.json --target presentation-file --target web
```

**Expected**: both formats reflect the change; nothing was edited per format.

Then change only `theme`, rebuild, and confirm every slide's text is byte-identical to
the previous run — the theme moved, the content did not.

---

## Scenario 3 — Invalid plan is refused before anything renders

*Proves: User Story 1 scenario 4 · FR-002 · FR-003*

```bash
node bin/deck.mjs build examples/invalid-plan.json --target presentation-file
```

**Expected**

- Exit 1.
- Error names the offending slide `id` and the field path.
- **Zero output files created.** Check the output directory is empty — refusing after
  writing a partial artifact would violate FR-002.

---

## Scenario 4 — Gates block a defective deck

*Proves: User Story 1 · SC-005 · FR-016 · FR-018*

Three deliberately defective plans, each isolating one hard-fail code:

```bash
node bin/deck.mjs build examples/defect-notes-missing.json  --target presentation-file
node bin/deck.mjs build examples/defect-count-mismatch.json --target presentation-file
node bin/deck.mjs build examples/defect-content-absent.json --target presentation-file
```

**Expected**: each exits 1, names the failing slide, and **delivers nothing**.

Then confirm the recovery path: the backup from before the run exists, and re-running
after fixing the *plan* succeeds. Confirm that editing the built artifact to make the
gate pass is not a supported path — there is no command that accepts a hand-edited
artifact as verified (FR-021, Principle III).

---

## Scenario 5 — Honest degradation

*Proves: FR-019 · FR-031 · R6*

With the office converter unavailable (rename it, or run in a container without it):

```bash
node bin/deck.mjs build examples/sample-plan.json --target presentation-file --target document
```

**Expected**

- Presentation file is produced; structural gate runs.
- Visual gate reports `not_run` with a reason.
- Document format reports **unavailable**, not "skipped" and not silently omitted.
- **Exit 3, not 0.** This is the single most important assertion in the quickstart: a
  caller treating exit 0 as "verified" must never receive 0 here.
- The report never uses the word "passed" for the deck overall — `overall` is
  `incomplete`.

---

## Scenario 6 — Pack isolation

*Proves: User Story 2 · SC-002 · SC-003 · Principle IV*

```bash
git status --porcelain > /tmp/before.txt
cp -r examples/throwaway-pack packs/throwaway
node bin/deck.mjs packs                     # discovers it without any registry edit
node bin/deck.mjs build examples/sample-plan.json --target throwaway
git status --porcelain > /tmp/after.txt
diff /tmp/before.txt /tmp/after.txt
```

**Expected**: every difference is inside `packs/throwaway/` and the output directory.
A change to any core file means the abstraction leaked — fix the schema, not the pack
(User Story 2 scenario 3).

Repeat with a throwaway **vocabulary** pack for SC-003.

---

## Scenario 7 — Unrenderable slide type is caught at approval

*Proves: FR-011*

Build a plan using a slide type the selected format's `supported_types` excludes.

**Expected**: reported at validation, **before** rendering — not discovered as a missing
slide in the output.

---

## Scenario 8 — Publish safety

*Proves: User Story 4 · SC-006 · FR-022 · FR-023 · FR-024*

```bash
node bin/deck.mjs scrub                      # baseline: exit 0, zero violations
```

Then the three cases that matter:

```bash
# a) a real hit is caught
echo "<denied term>" >> README.md && node bin/deck.mjs scrub    # exit 1, names file+line
git checkout README.md

# b) fail-closed when the list is gone
mv .scrub-denylist.txt .scrub-denylist.bak && node bin/deck.mjs scrub   # exit 4, NOT 0
mv .scrub-denylist.bak .scrub-denylist.txt

# c) no false positives
node bin/deck.mjs scrub                      # exit 0 across the whole tracked corpus
```

Case (b) is the one that protects the repository. A scanner that reports clean when its
denylist is missing is worse than no scanner, because it manufactures false confidence.

Case (c) has a known regression target: words like *forecasting*, *lasting*, and
*contrasting* contain a denied acronym as a substring and MUST NOT be reported. Keep
them in a fixture so the regression cannot return.

---

## Scenario 9 — Capability inventory is complete

*Proves: User Story 5 · SC-007 · SC-012 · FR-027*

Check the migration inventory: every capability of the superseded builders and the eight
router modes is mapped to a replacement or recorded as an accepted drop with a reason.

**Expected**: zero unaccounted entries. Per the resolved clarification, the expected
drop count is zero — all eight router capabilities survive, reclassified.

---

## Coverage map

| Scenario | User Story | Key criteria |
|---|---|---|
| 1, 2 | US1 | SC-001, SC-009 |
| 3, 4 | US1 | SC-005 |
| 5 | US1 | FR-019, FR-031 |
| 6 | US2 | SC-002, SC-003 |
| 7 | US1/US2 | FR-011 |
| 8 | US4 | SC-006 |
| 9 | US5 | SC-007, SC-012 |

**Not covered here**: User Story 3 (intake from long-form source) has no deterministic
scenario — its output is a proposed plan produced by judgement, and its acceptance is the
author's review. It is validated by the checkpoint existing and by the proposed plan
passing `validate`, not by asserting particular slide content.
