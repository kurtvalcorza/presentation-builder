# Quickstart: Validating Deck IR Consolidation

**Feature**: 001-deck-ir-consolidation
**Purpose**: runnable scenarios proving the feature works end to end. Each maps to a
user story and its success criteria.

**Platform note**: every scenario runs through `npm run` scripts rather than shell
built-ins. The earlier draft used `/tmp`, `cp -r`, `diff`, and `mv`, which cannot run in
PowerShell — while a task required the whole guide to pass on both platforms. Test logic
that needs a filesystem lives in Node, so the commands below are identical on Windows and
POSIX.

---

## Prerequisites

| Requirement | Needed for | If absent |
|---|---|---|
| Node (current LTS) | everything | nothing runs |
| Python 3.9+ with the presentation reader | presentation-file extraction adapter | that format's structural gate reports `not_run`, exit 3 |
| Headless office converter | visual gate, document format | both report unavailable, exit 3 |

The office converter is the **only** external system dependency. Per-slide image
extraction is done in Node from the converted PDF. If the converter is installed but not
on `PATH` — the common case on Windows — the capability probe finds it at its well-known
location or via the override environment variable.

```bash
npm install
```

---

## Scenario 1 — Author once, deliver in several formats

*Proves: US1 · SC-001 · FR-005*

```bash
npm run deck -- build examples/sample-plan.json --target presentation-file --target web --target spoken-script
```

**Expected**: three artifacts from one plan; identical unit count; every unit's visible
text and notes matching across formats; exit 0.

**The check that matters**: confirm no per-format content file exists anywhere in output.

---

## Scenario 2 — Re-render and theme swap

*Proves: US1 · FR-005 · SC-009*

Change one slide's wording, rebuild, and confirm every format reflects it with no
per-format editing. Then change **only** `theme` and confirm each unit's text is
byte-identical to the previous run — the theme moved, the content did not.

```bash
npm run test:rerender
```

Note SC-009 covers *theme* changes. Changing **vocabulary** is a migration, not a
re-theme: it either maps cleanly or reports which content has no equivalent.

---

## Scenario 3 — Invalid plan refused before anything renders

*Proves: US1 · FR-002 · FR-003*

```bash
npm run deck -- build examples/invalid-plan.json --target presentation-file
```

**Expected**: exit 1; error names the offending slide `id` and field path; **zero output
files**, in staging or anywhere else.

---

## Scenario 4 — Gates block a defective deck

*Proves: US1 · SC-005 · FR-016 · FR-018*

```bash
npm run test:gates
```

Three defect fixtures, each isolating one hard-fail code (notes missing, count mismatch,
plan content absent). Each must exit 1, name the failing slide, and **deliver nothing**.

Then confirm the recovery path: the pre-run backup exists, and re-running after fixing the
*plan* succeeds. Confirm no command accepts a hand-edited artifact as verified output of a
plan — `verify <artifact>` without a build record reports provenance as unestablished, and
`promote` refuses it.

---

## Scenario 5 — Honest degradation

*Proves: FR-019 · FR-031*

With the office converter unavailable:

```bash
npm run deck -- build examples/sample-plan.json --target presentation-file --target document
```

**Expected**: presentation file produced and structurally verified; visual gate `not_run`
with a reason; document format **unavailable**, not "skipped"; **exit 3, not 0**; overall
`incomplete`, never `passed`.

This is the most important assertion in the guide: a caller treating exit 0 as "verified"
must never receive 0 here.

---

## Scenario 6 — Pack isolation, both directions

*Proves: US2 · SC-002 · SC-003 · SC-013 · Principle IV*

```bash
npm run test:isolation
```

Three checks, run in Node so they work on either platform:

- **A** — add a throwaway *vocabulary*, render to an existing format, assert every changed
  file is inside the new pack **and no delivery format changed**.
- **B** — add a throwaway *delivery format*, render an existing vocabulary's plan to it,
  assert every changed file is inside the new pack **and no vocabulary changed**.
- **C** — search every vocabulary pack for delivery format ids and every delivery format
  pack for vocabulary ids or slide type names. Both must return nothing.

Direction B and check C are what the original single-direction test lacked, which is why
it did not catch a task that edited a sibling pack.

---

## Scenario 7 — Unrenderable content caught at compile

*Proves: FR-011*

Compile a plan whose vocabulary emits a primitive the selected format's
`supported_primitives` excludes.

```bash
npm run deck -- compile examples/sample-plan.json --target text-only
```

**Expected**: reported at compile, **before** rendering — naming the primitive kind and
the slide, not discovered as a missing slide in the output. Decorative primitives
(`motif`, `spacer`) are exempt: a text artifact ignoring an orbit motif is correct, not a
failure.

---

## Scenario 8 — Structural verification covers every format

*Proves: FR-016 · FR-037 · SC-014*

```bash
npm run test:adapters
```

For each delivery format, corrupt one delivered artifact — delete a unit, strip notes,
remove an attribution — and confirm that format's own extraction adapter causes the
structural gate to fail.

**Expected**: every format fails on its own corruption. A format with no adapter must be
unable to report a structural result at all, rather than printing a pass it did not earn.

---

## Scenario 9 — The visual gate produces a verdict

*Proves: FR-017 · R12*

```bash
npm run test:visual
```

Run against fixtures with deliberate visual defects — overflowing text, overlapping
elements, a contrast violation, a margin breach.

**Expected**: the gate reports `failed` with findings naming the affected slides. A run
that only produces images and records no verdict must report `not_run`, never `passed`.

---

## Scenario 10 — Staging and promotion boundary

*Proves: FR-038 · FR-039 · SC-015*

```bash
npm run test:promotion
```

- A build whose gates fail leaves the delivered location **untouched**; staged output is
  discarded.
- A build whose gates pass promotes atomically — no state where some targets are delivered
  and others half-written.
- `verify` on an artifact with no build record reports provenance unestablished, and
  `promote` refuses it.

---

## Scenario 11 — Publish safety

*Proves: US4 · SC-006 · SC-016 · FR-022 · FR-023 · FR-024 · FR-040*

```bash
npm run test:scrub
```

Five cases:

1. Baseline — zero violations across the corpus, exit 0.
2. A denied term in a **tracked** file — exit 1, names file and line.
3. A denied term in a **newly copied, untracked** file — exit 1. *This is the case the
   original tracked-only design missed, and it is the exact situation the absorption step
   creates.*
4. Denylist missing — **exit 4, not 0**. A scanner reporting clean when its denylist is
   gone is worse than no scanner.
5. No false positives — *forecasting*, *lasting*, *contrasting*, and a currency code used
   as a language name must not match.

Then confirm enforcement rather than documentation: attempt a commit carrying a denied
term and confirm the hook blocks it without anyone running the check by hand.

---

## Scenario 12 — Capability inventory is complete

*Proves: US5 · SC-007 · SC-012 · FR-027*

The inventory is a **Phase 0** artifact (research R17): it is the requirements input for
the primitive set, not a closing checklist. Confirm every capability of the two builders,
the eight router modes, and the two utilities maps to a replacement or an accepted drop
with a reason.

**Expected**: zero unaccounted entries; expected drop count zero.

---

## Coverage map

| Scenario | Story | Key criteria |
|---|---|---|
| 1, 2 | US1 | SC-001, SC-009 |
| 3, 4 | US1 | SC-005 |
| 5 | US1 | FR-019, FR-031 |
| 6 | US2 | SC-002, SC-003, SC-013 |
| 7 | US1/US2 | FR-011 |
| 8 | US1 | SC-014 |
| 9 | US1 | FR-017 |
| 10 | US1 | SC-015 |
| 11 | US4 | SC-006, SC-016 |
| 12 | US5 | SC-007, SC-012 |

**US3 (intake)** has no deterministic scenario — its output is a proposed plan produced by
judgement, and its acceptance is the author's review. It is validated by three checkable
properties rather than by asserting slide content: the approval checkpoint exists and
blocks rendering; the proposed plan passes `validate`; and every proposed slide carries a
traceable location in the source material (SC-017).
