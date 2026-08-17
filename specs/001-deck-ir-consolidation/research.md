# Phase 0 Research: Deck IR Consolidation

**Feature**: 001-deck-ir-consolidation
**Date**: 2026-07-30

Seventeen decisions. Each is recorded with what was chosen, why, and what was rejected.

**R1–R10** were made before the first design pass. **R11–R17** were added on 2026-07-31
after an external review found five critical defects in the completed package; R1, R9, and
R10 carry corrections marked inline. The most consequential is **R11**, which introduces a
layer the original design lacked and which its own task list demonstrably violated.

---

## R1 — Plan format and how a shared schema survives divergent vocabularies

> **Scope note (added 2026-07-31)**: R1 concerns how a plan is *validated*. It says
> nothing about how a plan is *rendered*, and that omission was the feature's central
> defect — see **R11**, which introduces the second layer this decision left implicit.

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

## R3 — Runtime split: Node core, Python extraction adapter

**Decision**: The core pipeline, all renderers, and the scrub scanner are **Node**. The
presentation-file **extraction adapter** stays **Python**, invoked as a subprocess that
returns JSON on stdout. It extracts; it does not judge — comparison against the plan lives
in the shared Node verifier (see `contracts/cli-and-verifier.md`, R13).

**Rationale**: Both runtimes are already mandatory today, so this adds nothing. Node is
forced for rendering because the presentation-file library is Node-only. Python is
retained for extraction because reading a built presentation file — pulling per-slide
text, speaker notes, and attributions — is what the existing Python code already does
correctly and at length. Porting that to Node would be pure risk against zero benefit.

The JSON-over-stdout boundary keeps the two sides swappable and keeps the adapter
independently testable.

**Alternatives rejected**:

- *All-Node, replacing the Python extraction adapter with an OOXML library*: the mature
  reading path is Python; rewriting a working adapter to satisfy a tidiness preference
  risks regressing the exact checks that exist because they caught real defects.
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
gate as `passed`, `failed`, or `not_run` with a reason, and surface each of these states
in the verification report and the delivery summary (a fourth per-gate status,
`not_applicable`, is a separate concern discussed below).

**Rationale**: FR-019 forbids reporting a deck as fully verified when a gate could not
execute. A boolean pass/fail cannot express "this was never checked", which is exactly
the condition that misleads. Three states is the minimum honest model for this
degradation axis (`passed`/`failed`/`not_run`).

A per-gate `status` later gained a **fourth** value, `not_applicable`, on a *different*
axis — whether the format has the surface at all, not whether a toolchain ran (added with
the `carries` model; see `data-model.md` and `pack-contract.md`). The two never collapse:
`not_run` means a surface exists and nobody looked; `not_applicable` means there is no
such surface. The report-level `overall` stays three-valued (`passed`/`failed`/
`incomplete`), because `not_applicable` contributes nothing to it.

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

**Decision**: Four layers.

1. **Contract tests** — schema composition accepts valid plans and rejects invalid ones,
   naming slide and field.
2. **Golden-file tests on a normalized form** — see the correction below.
3. **Gate tests** — a deliberately defective deck (notes missing, count mismatch, plan
   content absent from the delivered artifact) must be blocked, proving SC-005.
4. **Isolation tests, in both directions** — add a throwaway vocabulary and assert no
   delivery format changed; add a throwaway delivery format and assert no vocabulary
   changed.

**Correction (2026-07-31): "byte-stable" was wrong for the presentation format.** A
presentation file is a ZIP archive carrying creation timestamps, entry ordering, and
generator metadata. Byte comparison would fail on a re-run that changed nothing, and the
usual response to a flaky test is to delete it. Golden comparison is therefore against a
**normalized extraction** — per-slide text, notes, attributions, ordering, and declared
theme tokens — not raw bytes. Where a format genuinely is deterministic text, byte
comparison is fine and cheaper.

**Rationale**: The isolation tests are the only ones that can fail the way this feature
most plausibly fails — by quietly requiring an edit in the other kind of pack. The
original single-direction isolation test would not have caught the defect that an external
review later found, because that defect edited a *sibling pack* rather than the core.
Testing both directions closes it.

**Alternatives rejected**:

- *Byte-stable golden files on the presentation format*: not achievable without
  normalizing archive metadata, and a test that fails for reasons unrelated to the change
  is a test that gets removed.
- *Visual regression on rendered images*: brittle across toolchain versions and platform
  font differences; the visual gate covers what it would, and R12 gives that gate a real
  verdict.

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

> **Correction (2026-07-31)**: this decision claimed the verification step is "placed
> after the copy because that is where the risk actually lands". That was inert as
> designed — the scan covered tracked files only, and freshly copied files are untracked,
> so it inspected nothing about the material it was supposed to gate. Fixed in **R15**.

---

## R11 — The vocabulary/format seam: a shared primitive layer

**Decision**: Vocabularies and delivery formats never reference each other. A vocabulary
**compiles** its slide content into a shared set of **layout primitives**; a delivery
format **renders** primitives. The primitive set is owned by the pipeline.

```
Deck Plan ──compile──▶ Render IR (primitives) ──render──▶ artifact
           owned by                              owned by
           vocabulary                            delivery format
```

**Rationale**: The original design had delivery formats switch on slide types. An external
review found the consequence written into the task list itself: adding the research
vocabulary required editing the presentation-file *delivery format*, violating FR-009 in
the very phase meant to prove additivity. This is the classic N×M coupling, and the
symptom appeared exactly where the design was weakest.

The alternative fix — vocabularies shipping one adapter per delivery format — is a trap.
It repairs adding a vocabulary and breaks adding a delivery format, which is the direction
this project exists to fix:

| Approach | Add a vocabulary | Add a delivery format |
|---|---|---|
| Formats switch on slide types *(original)* | edits every format | clean |
| Vocabularies ship per-format adapters | clean | edits every vocabulary |
| **Shared primitive layer** | clean | clean |

Only the third is N+M. It also makes the *expected* side of structural verification
uniform, which R13 builds on.

**Cost, stated plainly**: this is a second intermediate representation, and both existing
renderers are restructured rather than ported as-is. Their drawing helpers become
primitive renderers; their per-slide-type layout logic moves into the vocabulary that owns
it. That is more work than a port and it is the price of the guarantee.

**What makes a good primitive**: something a *format* can render without knowing why it
exists — a title block, a body run, a hero figure, a labelled sequence, a comparison grid,
an attribution line, a spoken-note block. If a proposed primitive can only be understood
by naming a vocabulary, it is not a primitive.

**Alternatives rejected**:

- *Per-format adapters inside each vocabulary*: moves the coupling, does not remove it.
- *Weakening FR-009 and Principle IV to permit the coupling*: honest and cheap, but
  Principle IV is the entire reason for consolidating. Dropping it means the suite regrows
  a duplicate later by the same route it grew the second and third.
- *Rendering directly from the plan with format-specific hints embedded in content*: an
  unvalidated escape hatch, and it puts presentation concerns into the authored artifact,
  violating Principle I.

---

## R12 — The visual gate must produce a verdict, not images

**Decision**: The visual gate produces per-slide images **and** a recorded verdict
identifying what was inspected and what was found. A step that only rasterizes reports
`not_run`, never `passed`.

**Rationale**: As originally specified the gate converted slides to images and nothing
looked at them, yet the pipeline reported it as passing. That is worse than having no
visual gate, because it manufactures confidence.

Two honest implementations exist and both are supported: **automated checks** for the
mechanically detectable defects the superseded builders enumerated — text overflow,
clipping, element overlap, contrast below threshold, margin violations — and **human
review**, which records an explicit verdict against the format's rendered surface: the
rasterized images where a raster capture path exists, or the rendered page in a browser
for a format with none (web/HTML).

Where neither has occurred, the gate is `not_run` and the deck is `incomplete`. The
existing status model (R6) — `passed`/`failed`/`not_run`, plus `not_applicable` for a
surface a format lacks — already carries this correctly; the defect was that the gate
lied about which state it was in.

**Not every visual-bearing format has the automated path.** The automated checks operate
on rasterized images, and rasterization exists only for the presentation file and formats
derived from it (through the office toolchain). A web/HTML target has a real visual
surface but no automated capture — that would require the headless browser R4 declines —
so its visual gate runs only through human review. This is not `not_applicable` (the
surface exists), and it is not an automated pass; absent a recorded human verdict it is
`not_run`, which keeps the target `incomplete` rather than silently promoting an
un-inspected page. Adding an automated HTML capture path later is a self-contained
extension: it would give web the automated path without changing this model.

**Alternatives rejected**:

- *Keep rasterization as the gate*: the defect being fixed.
- *Human review only, unrecorded*: unauditable, and indistinguishable from nobody looking.
- *Automated checks only*: cannot judge whether a slide reads well, which is a real part
  of what the superseded builders asked a human to check.

---

## R13 — Verification adapters per delivery format

**Decision**: Every delivery format supplies a **verification adapter** that extracts,
from its own artifact type, a canonical structure: ordered units, per-unit content, notes,
attributions, and count. The shared verifier compares that extraction against the plan.

**Rationale**: FR-016 said "every deck" but only a presentation-file verifier existed —
while the command contract printed passing structural gates for web and text outputs. The
guarantee was one format wide and the reporting was six formats wide.

Extraction is inherently format-specific: reading a presentation file, parsing a web page,
reading a text artifact. Comparison is not. Splitting on that line puts the format-specific
part in the format's own pack, which also satisfies Principle IV.

R11 helps here: because every format renders the same primitives, the *expected* side of
the comparison is uniform, and only extraction differs.

**Alternatives rejected**:

- *One verifier that understands every artifact type*: a shared component that must change
  whenever a format is added, violating Principle IV.
- *Verify only the presentation format*: the status quo defect; it also makes the non-slide
  formats untrustworthy precisely where they are most useful.

---

## R14 — Staging, atomic promotion, and a build record

**Decision**: Rendering writes only into a staging location. Artifacts are promoted to
their delivered location atomically, only after verification passes. A **build record**
identifies the plan and the artifacts produced from it, and verification is bound to it.

**Rationale**: The command surface exposed `verify <artifact> --plan <plan>` against any
path, while the validation guide claimed no command accepted a hand-edited artifact as
verified. Both could not be true. More importantly, without a binding between plan and
artifact, "verified" means only "this file happened to satisfy these checks", which is not
the same claim.

Staging also fixes a quieter problem: `render` previously produced artifacts in their
final location before any gate ran, so a failed build left ungated output sitting where a
delivered deck belongs.

**Alternatives rejected**:

- *Soften the validation guide's claim*: preserves a real hole to keep a document honest.
- *Refuse to verify a pre-existing artifact at all*: makes re-verifying a delivered deck
  impossible, which is a legitimate need.
- *Verify in place, delete on failure*: destructive, and a crash mid-run leaves ungated
  output delivered.

---

## R15 — Scrub scope and commit-time enforcement

**Decision**: The publish-safety check scans **tracked files and candidate files** —
anything staged, or newly present in the working tree and not excluded by ignore pattern.
It runs mechanically at commit time and blocks the commit on failure.

**Rationale**: Two holes, both in the highest-risk path.

Scope: the check scanned tracked files only, and was scheduled to run immediately after
copying external material in — when that material is untracked and therefore invisible.
The one moment the check existed for was the one moment it could see nothing.

Enforcement: it was documented as "the required pre-commit check", which is a habit, not a
control. The constitution requires publish safety to be verified on every commit, and a
step someone must remember is not verification.

Ignore-pattern exclusion is deliberately honoured, because legitimate working artifacts
do contain denied terms; the ignore rules are the mechanism that keeps them unpublished,
and the check must agree with them rather than fight them.

**Alternatives rejected**:

- *Scan the entire working tree including ignored paths*: floods the report with
  legitimate local material and trains everyone to ignore it (the same failure mode R7
  addressed for false positives).
- *Documentation-only enforcement*: the defect being fixed.

---

## R16 — Concrete dependency selections

**Decision**: Named, with licences checked against the repository's MIT licence and
Principle VII.

| Need | Selection | Licence | Note |
|---|---|---|---|
| JSON Schema 2020-12 validation | Ajv (2020 build) | MIT | Explicit 2020-12 entry point required; the default export is an older draft. |
| Presentation generation | PptxGenJS | MIT | Already the basis of both superseded renderers. |
| PDF rasterizing | pdf.js distribution | Apache-2.0 | Permissive, compatible with MIT. |
| Canvas backend for rasterizing | prebuilt N-API canvas | MIT | Prebuilt binaries — avoids a native compile step on Windows. |
| Presentation reading (verifier) | python-pptx | MIT | Retained from the superseded verifiers (R3). |
| Presentation → PDF | LibreOffice headless | MPL-2.0 | Invoked as a subprocess, never vendored, so its licence does not propagate. |

**Rationale**: The plan previously said "a JSON Schema validator", "a Node PDF
rasterizer", and so on. For a public MIT repository under Principle VII, an unnamed
dependency is an unchecked licence, and the choice of rasterizer in particular determines
whether the project needs a native build toolchain on Windows.

**Two things to confirm at implementation, not assume**: the validator's 2020-12 entry
point differs from its default export, and the canvas backend must be the prebuilt variant
or Windows installs will require a compiler.

**Alternatives rejected**:

- *A native PDF rasterizing binary*: reintroduces the system dependency R-era decisions
  removed.
- *AGPL-licensed PDF tooling*: incompatible with redistribution under MIT.

---

## R17 — Capability inventory moves to Phase 0

**Decision**: The inventory of what the superseded components do is built **first**, before
the primitive set, the envelope, and the rule vocabulary are designed.

**Rationale**: It was originally scheduled in the final phase, as a checklist confirming
nothing had been lost. That ordering asserts "zero capabilities dropped" before the
document establishing what the capabilities *were* exists — and worse, it means the
primitive set was to be designed without knowing the full range of slide constructs it has
to express.

The inventory is not a closing formality. It is the requirements input for R11's primitive
set: every construct the two vocabularies and the eight superseded modes can express is a
candidate primitive, and finding that out after choosing the primitives is how a
consolidation silently loses capability.

**Alternatives rejected**:

- *Inventory last, as a completeness check*: the original ordering; asserts its conclusion
  before its evidence exists.
- *No inventory, rely on porting fidelity*: the single largest risk in any consolidation is
  silent capability loss, and porting fidelity is exactly what cannot be assumed when the
  target structure differs.
