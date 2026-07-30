<!--
SYNC IMPACT REPORT
==================
Version change: (none) → 1.0.0
Bump rationale: Initial ratification. The repository previously had no constitution;
                this establishes all governance from scratch, so MAJOR is not applicable
                and the baseline is set at 1.0.0.

Principles defined (7 — template ships 5 slots; extended per template guidance):
  I.   IR Is the Only Authored Artifact
  II.  Three-Layer Determinism Split
  III. Two Gates Before Delivery (NON-NEGOTIABLE)
  IV.  Packs Are Additive
  V.   Progressive Disclosure
  VI.  Public-Repo Scrub Is Absolute (NON-NEGOTIABLE)
  VII. Third-Party Provenance Is Maintained

Sections added:
  - Consolidation Scope (fills the template's second free-form section slot)
  - Development Workflow & Quality Gates (fills the third free-form section slot)
  - Governance

Renamed principles: none (initial ratification)
Removed sections: none (initial ratification)

Templates requiring updates:
  ✅ .specify/templates/plan-template.md  — "Constitution Check" already delegates to
     this file via the generic `[Gates determined based on constitution file]` slot.
     No edit required; /speckit-plan fills it per feature.
  ✅ .specify/templates/spec-template.md  — no constitution-mandated sections added or
     removed; scope/requirements structure remains compatible.
  ✅ .specify/templates/tasks-template.md — principle-driven task types (gate runs,
     scrub verification, attribution updates) fit existing categorization.
  ✅ .claude/skills/speckit-*/SKILL.md    — inspected for stale agent-specific
     references; all use generic guidance. No edit required.
  ⚠ README.md — describes the pre-consolidation five-skill suite and the
     "research-deck-builder stays a sibling repo" arrangement, both superseded by
     Principle IV and the Consolidation Scope section. Deferred deliberately: the
     README is user-facing documentation of shipped behavior and MUST NOT be updated
     until the consolidation actually lands, or it would document software that does
     not exist. Tracked as a required task in the consolidation feature.

New artifacts required by Principle VI (created alongside this ratification):
  - .scrub-denylist.txt — the work-identifying term list. Deliberately UNTRACKED and
    gitignored: this constitution is a tracked file in a PUBLIC repository, so
    enumerating the terms here would disclose exactly the affiliations the scrub
    protects. Policy lives in this document; the list lives outside version control,
    with the canonical copy in the private vault.
  - .gitignore — entries for .scrub-denylist.txt and for workspace/build artifact
    patterns, so Principle VI is enforced by pattern rather than by vigilance.

Deferred TODOs: none. No placeholder tokens remain.
-->

# Presentation Builder Constitution

## Core Principles

### I. IR Is the Only Authored Artifact

The agent authors schema-conformant JSON — the deck intermediate representation (IR) —
and nothing else. It MUST NOT write renderer code, MUST NOT hand-write final `.pptx`,
HTML, or PDF markup, and MUST NOT edit built output in place.

Re-theming, re-ordering, inserting, and deleting slides are IR changes. A per-slide
redraw of built output is a violation, not a shortcut.

**Rationale**: Schema conformance is machine-checkable; prose and markup are not. Every
byte the agent produces is therefore mechanically verifiable before it reaches a
renderer, which collapses the failure surface from "did it write correct code?" to "does
this document match a schema?"

### II. Three-Layer Determinism Split

Every byte of output MUST be classified into exactly one layer, and the layer determines
who may produce it:

- **SHIPPED** — renderers, verifiers, render-check scripts, CSS/JS runtimes. Copied
  verbatim. NEVER regenerated, never "improved in passing", never rewritten to fit a
  deck.
- **TEMPLATED** — theme tokens and the deck manifest. Bounded substitutions only; the
  set of substitutable fields is finite and declared.
- **GENERATED** — the IR, and only the IR.

Adding a rendering capability means deliberately changing SHIPPED code under review. It
never means letting the agent improvise markup at build time.

**Rationale**: The bulk of any deck's bytes are identical across every run. Treating
them as generated spends tokens to reintroduce variance into the one part of the system
that was already correct.

### III. Two Gates Before Delivery (NON-NEGOTIABLE)

No deck is delivered until both gates pass:

1. **Structural + fidelity verifier.** HARD-fails (non-zero exit) on: any slide with no
   speaker notes; slide count not matching the IR; an IR title or IR citation absent
   from its rendered slide; leftover icon-font text.
2. **Visual render pass.** Every slide rendered and inspected for overflow, wrap,
   overlap, collision, contrast, and margin violations.

A deck whose last gate run failed MUST NOT be iterated on. Restore the phase backup, fix
the IR, re-apply, re-run. Fixing built output to make a gate pass inverts the direction
of truth and is forbidden.

**Rationale**: These gates encode defects that actually shipped in the predecessor
skills. A gate that can be skipped under deadline is not a gate.

### IV. Packs Are Additive

A slide vocabulary (the dense-cited catalog, the minimalist keynote catalog, any future
one) and an output target (pptx, HTML, PDF, any future one) are each added as a **pack**.

Adding a pack MUST NOT require editing the core pipeline, the IR schema, or any other
pack. If adding one does require such an edit, the abstraction is wrong: fix the IR
first, then add the pack.

**Rationale**: The predecessor suite built the same pipeline twice because there was no
seam to extend. This principle is the test that the seam is real — and it fails loudly
and early rather than silently accumulating a third copy.

### V. Progressive Disclosure

`SKILL.md` stays lean and routes. Every reference file MUST open with an explicit
"When to read this" trigger naming the phase that requires it. Detailed catalogs, design
tokens, and element patterns are read on demand at that phase, never loaded upfront.

**Rationale**: Context spent on a catalog the current phase will not use is context
unavailable to the work the phase is actually doing.

### VI. Public-Repo Scrub Is Absolute (NON-NEGOTIABLE)

This repository is a genericized public fork. The private vault copies remain the source
of truth for real content; only the fork is scrubbed, and the scrub is not negotiable.

A denylist of work-identifying strings — organization names and acronyms, programme
names, personal names, nationality and language terms, local currency amounts, vault
PARA paths, and internal skill names — MUST NEVER appear in tracked files.

**The denylist itself is NOT tracked.** It is maintained at `.scrub-denylist.txt`, which
is excluded by `.gitignore`, with the canonical copy held in the private vault.
Enumerating the terms in a public file would disclose precisely the affiliations the
scrub exists to protect, so this document states the policy and the tooling reads the
list. Any scanner, hook, or CI step MUST read the denylist from that path and MUST fail
closed — an absent or unreadable denylist is a hard error, never a silent pass.

Workspace and build artifacts — outline JSONs, per-deck build scripts, rendered decks,
review and render directories — MUST NEVER be tracked. They are excluded by `.gitignore`
**pattern**, not by individually listing files, and the pattern MUST be verified
(`git check-ignore -v`, `git status --short`) before any bulk `git add`.

**Rationale**: A single bulk add of an untracked workspace directory publishes client
material irreversibly. Pattern-based exclusion plus pre-add verification is the only
control that survives a hurried commit.

### VII. Third-Party Provenance Is Maintained

`THIRD-PARTY-NOTICES.md` MUST stay accurate and current. Any absorbed or adapted
third-party material is attributed **before** it is committed, never after.

Standing obligation: the HTML style presets derive from `zarazhangrui/frontend-slides`
(MIT, © 2025 Zara Zhang), which builds on `zarazhangrui/beautiful-html-templates`
(MIT, © 2026 Zara Zhang).

Material whose redistribution terms are unclear, encumbered, or subject to a takedown
clause MUST be linked, never vendored.

**Rationale**: This repository is public and MIT-licensed. Vendoring material with
unclear terms transfers someone else's legal risk onto it for convenience that a link
supplies just as well.

## Consolidation Scope

This constitution governs the consolidation of a duplicated presentation-skill suite
into one IR-driven pipeline.

**In scope — absorbed into this repository:**

- `research-deck-builder` (dense, citation-grade decks). Its **tracked** files scan clean
  against the Principle VI denylist; its untracked workspace artifacts do not, and MUST
  NOT follow it in. Absorb tracked files only.
- `presentation-studio` and its eight Marp modes.
- `source-to-presentation-synthesis` (upstream intake).
- `convert-pptx-to-handout` (post-processing).
- `summarize-slide-images-to-note` (post-processing).

**Explicitly out of scope:**

- `PPT-Design-Prompt` — a third-party repository
  (`github.com/Russell-cell/PPT-Design-Prompt`) carrying brand-derived content and an
  explicit takedown clause. Per Principle VII it is linked, never vendored. Revisiting
  this requires a constitution amendment, not a scope call during implementation.

## Development Workflow & Quality Gates

- Work proceeds through Spec Kit: `/speckit-specify` → `/speckit-clarify` →
  `/speckit-plan` → `/speckit-tasks` → `/speckit-analyze` → `/speckit-implement`.
- Feature work happens on feature branches. Direct commits to `main` are not permitted.
- Every change that touches a renderer, verifier, or the IR schema MUST demonstrate both
  Principle III gates passing on at least one deck per affected vocabulary pack.
- Every change that adds or moves files MUST be preceded by the Principle VI ignore-
  pattern verification.
- Pull requests MUST state which principles the change engages and how compliance was
  demonstrated. "No principles engaged" is an acceptable answer when true.

## Governance

This constitution supersedes all other development practices in this repository. Where
a reference file, README, or inherited skill document conflicts with it, this file wins
and the conflicting document is corrected.

**Amendment procedure.** Amendments MUST be proposed as a change to this file,
accompanied by (a) the rationale, (b) the semantic version bump and its justification,
and (c) a migration note for any artifact the amendment invalidates. Amendments are
adopted when merged to `main`.

**Versioning policy.** Semantic versioning applies to this document:

- **MAJOR** — a principle is removed or redefined in a backward-incompatible way.
- **MINOR** — a principle or section is added, or existing guidance is materially
  expanded.
- **PATCH** — clarifications, wording, and typo fixes that do not change meaning.

**Compliance review.** Principles III and VI are gating and are verified mechanically on
every build and every commit respectively. The remaining principles are verified at
review time. Complexity that violates a principle MUST be recorded in the plan's
Complexity Tracking table with the simpler alternative that was rejected and why — an
unjustified violation blocks the merge.

**Version**: 1.0.0 | **Ratified**: 2026-07-30 | **Last Amended**: 2026-07-30
