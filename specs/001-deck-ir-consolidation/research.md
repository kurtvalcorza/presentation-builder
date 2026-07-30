# Phase 0 Research: Deck IR Consolidation

**Feature**: 001-deck-ir-consolidation
**Date**: 2026-07-30

Ten decisions were required before design. Each is recorded with what was chosen, why,
and what was rejected.

---

## R1 — Plan format and how a shared schema survives divergent vocabularies

**Decision**: JSON, validated by a **composed schema**: a small core *envelope* schema
owned by the pipeline, plus a per-slide-type *content* schema contributed by whichever
vocabulary pack the deck declares. Validation composes the two at run time.

**Rationale**: This is the crux of the whole feature. The two existing plan formats are
irreconcilable at the content level — the keynote plan has `text`/`sub`/`nodes`/`items`
shaped per slide type, the research plan has archetype-shaped content blocks with
citations. Forcing one flat schema over both would produce a union type with dozens of
optional fields, which validates nothing.

Splitting it means the core owns only what is universal — slide ordering, type
reference, notes, attribution, timing — and each vocabulary owns the shape of its own
content. A vocabulary pack can then be added without editing the core schema, which is
precisely the Principle IV test.

**Alternatives rejected**:

- *One flat schema covering both vocabularies*: every field optional, so validation
  degenerates to "is it an object?" and FR-003 (name the offending slide and field)
  becomes unachievable.
- *Schema per vocabulary, no shared core*: no shared verifier is then possible, and
  non-slide targets would have to special-case each vocabulary. Recreates the current
  duplication one level up.
- *Freeform content with rules enforced only in prose*: the constitution's Principle I
  exists specifically because prose rules are not machine-checkable.

---

## R2 — Pack discovery: filesystem convention, not a registry file

**Decision**: A pack is a directory containing a `pack.json` manifest. Packs are
discovered by **scanning the packs directory**. There is no hand-edited registry file.

**Rationale**: The spec's SC-002 and SC-003 originally allowed "the pack directory and
the pack registry" to be modified. A scan removes even that. Adding a pack then touches
**zero** files outside its own directory, which is a stronger and much easier-to-verify
guarantee — a file-level diff proves it mechanically.

**Alternatives rejected**:

- *Hand-edited registry (`packs.json` listing every pack)*: one shared file every pack
  addition must touch, which is a merge-conflict magnet and weakens SC-002/SC-003 from
  "zero files" to "one file".
- *Package-manager dependencies per pack*: real isolation, but it forces publishing and
  versioning machinery onto what is currently a self-contained skill repository.

**Consequence for the spec**: SC-002 and SC-003 can be tightened from "zero files
outside the pack directory and the pack registry" to "zero files outside the pack
directory". Recorded for `/speckit-analyze` to reconcile.

---

## R3 — Runtime split: Node core, Python verifier

**Decision**: The core pipeline, all renderers, and the scrub scanner are **Node**. The
presentation-file verifier stays **Python**, invoked as a subprocess that returns JSON
on stdout.

**Rationale**: Both runtimes are already mandatory today, so this adds nothing. Node is
forced for rendering because the presentation-file library is Node-only. Python is
retained for verification because reading a built presentation file — pulling per-slide
text, speaker notes, and detecting icon-font remnants — is what the existing Python
verifiers already do correctly and at length. Porting that to Node would be pure risk
against zero benefit.

The JSON-over-stdout boundary keeps the two sides swappable and keeps the verifier
independently testable.

**Alternatives rejected**:

- *All-Node, replacing the Python verifier with an OOXML library*: the mature reading
  path is Python; rewriting a working verifier to satisfy a tidiness preference risks
  regressing the exact checks that exist because they caught real defects.
- *All-Python, driving the Node renderer as a subprocess*: inverts the dependency so the
  primary language shells out for its main job.

---

## R4 — Document/print format derives from the presentation file

**Decision**: Convert the built presentation file with the headless office toolchain
already required for visual review. No third renderer.

**Rationale**: Settled by clarification (FR-031). The toolchain is already a hard
dependency of the visual review gate, so the document format costs a subprocess call.

**Alternatives rejected**:

- *Print stylesheet on the web output*: better pagination control, but requires a
  headless browser — a dependency the project does not currently have.
- *Dedicated document renderer*: full layout control at the cost of a third renderer to
  build and maintain, for a format that is normally a derivative artifact.

---

## R5 — Non-slide targets need one new universal field

**Decision**: Treat the spoken script, producer rundown, and storyboard as delivery
formats over the same plan. This requires exactly one addition to the core envelope:
an optional **per-slide duration**.

**Rationale**: A spoken script is the notes in order. A storyboard is on-slide content
beside notes, two columns. Both are derivable from what the plan already carries. A
producer rundown is not — it needs running time per segment, which no current plan
format stores.

This is a useful early confirmation that the envelope is the right place for the
seam: three non-slide formats needed one field between them, not a per-format escape
hatch. Had they each needed bespoke fields, that would have been evidence against
treating them as delivery formats at all.

**Alternatives rejected**:

- *Keep the non-slide outputs as separate tools*: preserves the current fragmentation
  and forfeits the strongest available proof that the plan is presentation-agnostic.
- *A freeform per-format extension bag on each slide*: an unvalidated escape hatch that
  would let packs smuggle in requirements the core cannot see, defeating FR-011.

---

## R6 — Capability probing and honest degradation

**Decision**: Probe for the office and image toolchains once at startup. Record each
gate as `passed`, `failed`, or `not_run` with a reason, and surface all three states
in the verification report and the delivery summary.

**Rationale**: FR-019 forbids reporting a deck as fully verified when a gate could not
execute. A boolean pass/fail cannot express "this was never checked", which is exactly
the condition that misleads. Three states is the minimum honest model.

**Alternatives rejected**:

- *Treat a missing toolchain as a pass*: silently downgrades the guarantee, the precise
  failure FR-019 names.
- *Treat a missing toolchain as a hard failure*: blocks work on machines that legitimately
  cannot render, when the structural gate still delivers real value there.

---

## R7 — Scrub scanner: one Node implementation, mode-aware, fail-closed

**Decision**: A single Node script reading the untracked denied-term list, which carries
three matching modes — case-sensitive whole word, case-insensitive word-with-suffix,
and raw regex. Missing or unreadable list is a hard error.

**Rationale**: A prototype run during specification proved the design necessary rather
than theoretical: naive substring matching produced four false positives on the current
corpus — three ordinary English words containing an acronym as a substring
(`forec•asti•ng`, `l•asti•ng`, `Contr•asti•ng`) and one where a currency code is also a
programming language name. A checker that cries wolf is a checker that gets bypassed,
so FR-024 is a correctness requirement, not a nicety.

Case sensitivity kills the acronym-substring class. Regex mode handles context-dependent
terms — a currency code only leaks when adjacent to an amount.

One Node implementation runs identically on both target platforms, unlike the shell-
specific prototype.

**Alternatives rejected**:

- *Plain substring matching*: demonstrated to produce false positives on the existing
  corpus.
- *Separate PowerShell and POSIX implementations*: two implementations of a security
  control drift, and the drift is silent.
- *A published denied-term list*: self-defeating — publishing the list discloses what the
  scrub protects. Hence FR-026.

---

## R8 — Recoverable state before mutation

**Decision**: Phase-named backups written before any mutating operation, never
overwriting an existing backup for that phase.

**Rationale**: FR-021 requires rollback rather than iteration on a failed run. This is
carried over unchanged from the existing builders, where it was arrived at the hard way
and is documented as such.

**Alternatives rejected**:

- *Rely on version control*: build outputs are deliberately untracked, so version control
  cannot restore them.
- *A single overwriting backup*: the second failed run destroys the last good state.

---

## R9 — Testing strategy

**Decision**: Three layers.

1. **Contract tests** — schema composition accepts valid plans and rejects invalid ones,
   naming slide and field.
2. **Golden-file tests** — each renderer produces byte-stable output for a fixed plan,
   so a refactor that changes rendering is caught rather than eyeballed.
3. **Gate tests** — a deliberately defective deck (notes missing, count mismatch, plan
   content absent from the rendered slide) must be blocked, proving SC-005.

Plus an **isolation test** for Principle IV: add a throwaway pack, assert via file-level
diff that nothing outside its directory changed.

**Rationale**: The isolation test is the only one that can actually fail the way this
feature most plausibly fails — by quietly requiring a core edit per pack. It deserves to
be a test rather than a review habit.

**Alternatives rejected**:

- *Visual regression on rendered images*: brittle across toolchain versions and platform
  font differences; the human visual gate already covers what it would.

---

## R10 — Absorbing the standalone research builder

**Decision**: Copy its **tracked** files only. Verify with the scrub scanner immediately
after the copy and before the commit.

**Rationale**: Its tracked files scan clean; its untracked working artifacts do not —
they contain denied terms across several files. The `.gitignore` in that repository
already excludes them by pattern, so a tracked-files-only copy is both correct and
mechanically enforceable.

The verification step is placed *after* the copy because that is where the risk actually
lands, and Principle VI requires the check to precede any bulk staging.

**Alternatives rejected**:

- *Copy the working directory wholesale, then clean up*: puts denied terms in the working
  tree of a public repository, one careless `add -A` away from publication.
- *Git history merge (subtree/submodule)*: drags that repository's full history in, which
  has never been scanned against the denied-term list.
