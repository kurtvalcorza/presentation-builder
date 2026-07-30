# Feature Specification: Deck IR Consolidation

**Feature Branch**: `001-deck-ir-consolidation`

**Created**: 2026-07-30

**Status**: Draft

**Input**: Consolidate the duplicated presentation-skill suite into a single intermediate-representation-driven pipeline, in one pass (full replacement, not incremental).

## Problem

The suite builds decks three different ways, and two of those ways are the same design implemented twice.

The dense-cited research builder and the minimalist keynote builder are architecturally identical — both treat a structured plan as the source of truth, both run an intake phase that ends at an approved outline, both hand that plan to a deterministic renderer, both gate delivery behind a structural verifier plus a visual render pass, and both carry a hand-maintained list of rules learned from past defects. What differs is only the slide vocabulary and the visual idiom. Everything structural is duplicated.

A third path — a mode router over eight presentation modes — sits on top with its own conventions, and a fourth component produces deck outlines upstream and hands them across a text-based boundary.

The costs are concrete:

- **No shared schema.** Nothing can validate a deck plan generically, so every quality rule is re-implemented per builder and the two implementations have already drifted.
- **No shared verifier.** Two verifiers enforce overlapping rules with different failure semantics, so "the deck passed" means different things depending on which path produced it.
- **No seam for new output formats.** Adding one today means writing a fourth pipeline, which is why there is still no way to publish a deck as a web page or a document.
- **Author lock-in to a format.** Content authored for one output format cannot be re-rendered as another without being rewritten, so choosing an output format early is an irreversible content decision.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Author once, deliver in any format (Priority: P1)

A deck author points the tool at their material, picks a visual vocabulary and one or more delivery formats, and reviews a single plan describing the deck slide by slide. On approval, every selected format is produced from that one plan. Choosing to also deliver a web version or a document later costs a re-render, not a rewrite.

**Why this priority**: This is the feature's core value and the one thing no current path offers. It is also the forcing function for the shared schema — if one plan can drive every format, the abstraction is real; if it cannot, nothing else in this feature holds.

**Independent Test**: Author one deck plan, select two delivery formats, and confirm both are produced with matching content, matching slide count, and matching speaker notes, with no content authored twice.

**Acceptance Scenarios**:

1. **Given** an approved deck plan and two selected delivery formats, **When** the author requests delivery, **Then** both formats are produced from that single plan and every slide's visible text and speaker notes match across them.
2. **Given** a delivered deck, **When** the author changes a slide's wording in the plan and re-requests delivery, **Then** every selected format reflects the change with no per-format editing.
3. **Given** an approved deck plan, **When** the author adds a delivery format that was not originally selected, **Then** the new format is produced from the unchanged plan.
4. **Given** a deck plan that does not conform to the shared schema, **When** delivery is requested, **Then** delivery is refused with a message naming the offending slide and field, and no output files are produced.

---

### User Story 2 - Extend without touching the core (Priority: P2)

A maintainer adds a new slide vocabulary, or a new delivery format, by adding a self-contained pack. They do not edit the shared pipeline, the shared schema, or any other pack.

**Why this priority**: This is the reason to consolidate rather than tidy. If extension still requires editing shared code, the suite will grow a fourth duplicate the same way it grew the second and third. This story is the test that the seam exists.

**Independent Test**: Add a deliberately trivial new vocabulary pack and a trivial new delivery format pack, then confirm via file-level diff that no file outside each new pack's own directory was modified.

**Acceptance Scenarios**:

1. **Given** the consolidated pipeline, **When** a maintainer adds a new delivery format pack, **Then** the change touches only that pack's directory and the pack registry, and every pre-existing deck still delivers unchanged.
2. **Given** the consolidated pipeline, **When** a maintainer adds a new slide vocabulary pack, **Then** decks authored in existing vocabularies are unaffected and require no re-approval.
3. **Given** a proposed pack that cannot be added without editing the shared schema, **When** the maintainer attempts it, **Then** the schema gap is treated as a defect in the schema and fixed there first, rather than worked around inside the pack.

---

### User Story 3 - From a long source to a reviewed plan (Priority: P3)

An author supplies long-form material — a written module, a transcript, a talk script, a document set — and receives a proposed deck plan: slide by slide, each with its type, its on-slide content, its attribution where the source carries one, and a note on what the speaker says. They review and correct the plan before anything is rendered.

**Why this priority**: The review checkpoint is where deck quality is actually decided, and it is cheap to change a plan and expensive to change a rendered deck. This absorbs the separate upstream outline step and removes the handoff boundary between it and the builders.

**Independent Test**: Supply one long-form source, confirm a reviewable plan is produced covering the source's main argument, make corrections, and confirm the corrections carry into delivery without re-running intake.

**Acceptance Scenarios**:

1. **Given** a long-form source, **When** intake runs, **Then** the author is presented a slide-by-slide plan for approval before any rendering occurs.
2. **Given** a proposed plan, **When** the author edits, reorders, inserts, or deletes slides, **Then** the plan remains internally consistent and speaker notes stay attached to the slides they belong to.
3. **Given** a source carrying attributions, **When** intake proposes slides, **Then** every load-bearing figure and claim carries the attribution the source gave it.
4. **Given** a source whose attribution list is internally inconsistent, **When** intake runs, **Then** the inconsistency is surfaced to the author rather than silently resolved.

---

### User Story 4 - Nothing unpublishable can be published (Priority: P4)

A maintainer commits work to this public repository with confidence that no work-identifying material and no build artifacts can slip in, whether or not they remember to check.

**Why this priority**: This repository is public and is a genericized fork of private material. The failure is irreversible once pushed, and the current protection is vigilance plus an incomplete ignore list — a single bulk add of an untracked working directory would publish client material.

**Independent Test**: Introduce a known-bad string into a tracked file and confirm the check fails; remove the term list entirely and confirm the check also fails rather than reporting success.

**Acceptance Scenarios**:

1. **Given** a tracked file containing a denied term, **When** the publish-safety check runs, **Then** it fails and names the file, the line, and the matched term.
2. **Given** the term list is missing or unreadable, **When** the check runs, **Then** it fails with an explicit error and never reports a clean result.
3. **Given** ordinary English words that merely contain a denied acronym as a substring, **When** the check runs, **Then** they are not reported.
4. **Given** working directories holding per-deck material, **When** a maintainer stages everything at once, **Then** those directories are excluded by pattern and cannot be staged.

---

### User Story 5 - Retire the duplicates cleanly (Priority: P5)

Someone arriving at this project finds one documented way to build a deck. The superseded builders, router modes, and their documentation no longer describe how the project works, and no capability was silently dropped in the move.

**Why this priority**: Consolidation that leaves the old paths in place has not consolidated anything — it has added a fourth path. This story is what converts the work from "a new tool exists" to "the duplication is gone." It is last because it depends on the replacement being complete.

**Independent Test**: Enumerate every capability offered by the superseded components and confirm each is either available in the consolidated pipeline or explicitly recorded as dropped with a reason.

**Acceptance Scenarios**:

1. **Given** the consolidated pipeline is delivered, **When** a reader consults the project documentation, **Then** it describes the consolidated pipeline and does not present the superseded builders as current.
2. **Given** the capability inventory of the superseded components, **When** consolidation completes, **Then** every capability is mapped to its replacement or listed as an accepted drop with a rationale.
3. **Given** a deck produced by a superseded builder, **When** an author opens it, **Then** it still opens and remains usable, even though it was not produced by the consolidated pipeline.

---

### Edge Cases

- **A vocabulary cannot express a slide a format supports, or vice versa.** A vocabulary offering a slide type that a selected format cannot render must be reported at plan approval, not discovered at delivery.
- **Visual inspection tooling is unavailable.** When the environment cannot render slides for visual review, the structural checks must still run and the author must be told plainly which gate did not execute, rather than being handed a deck that appears fully verified.
- **A plan change alters slide count after notes were written.** Reordering, inserting, or deleting slides must not leave speaker notes attached to the wrong slides.
- **A source's figures conflict with the plan's figures.** Any on-slide figure absent from the source must be surfaced before delivery.
- **Delivery to several formats where one fails.** Partial success must be reported explicitly; the author must never believe all formats were produced when one was not.
- **The same content in two visual vocabularies.** Re-rendering a plan under a different vocabulary must either succeed or explain precisely which content has no equivalent in the target vocabulary.
- **A gate fails, and the author edits the output to make it pass.** The pipeline must make correcting the plan the path of least resistance and must not treat a hand-edited output as verified.

## Requirements *(mandatory)*

### Functional Requirements

**Shared plan and schema**

- **FR-001**: The system MUST define one deck plan format that every vocabulary and every delivery format consumes.
- **FR-002**: The system MUST validate a deck plan against that format before any rendering begins, and MUST refuse to render an invalid plan.
- **FR-003**: Validation failures MUST identify the specific slide and field at fault.
- **FR-004**: The deck plan MUST be the sole authored artifact. Rendered output MUST NOT be edited to alter deck content.
- **FR-005**: The system MUST support re-rendering an unchanged plan to any supported delivery format without content changes.
- **FR-006**: Speaker notes MUST travel with the slide they belong to across every reorder, insertion, and deletion.

**Packs and extension**

- **FR-007**: Slide vocabularies MUST be supplied as self-contained packs.
- **FR-008**: Delivery formats MUST be supplied as self-contained packs.
- **FR-009**: Adding a vocabulary pack or a delivery format pack MUST NOT require modifying the shared pipeline, the plan format, or any other pack.
- **FR-010**: Each vocabulary pack MUST declare the slide types it offers and the rules unique to it, and the shared verifier MUST enforce those declared rules without special-casing individual packs.
- **FR-011**: The system MUST report, at plan approval time, any slide type in the plan that a selected delivery format cannot render.

**Intake and review**

- **FR-012**: The system MUST accept long-form source material and propose a complete deck plan from it.
- **FR-013**: The system MUST present the proposed plan for author approval before rendering.
- **FR-014**: Intake MUST carry every load-bearing figure and claim from the source with the attribution the source gave it.
- **FR-015**: Intake MUST surface inconsistencies in a source's attribution list rather than resolving them silently.

**Verification and delivery**

- **FR-016**: The system MUST run a structural verification of every deck before delivery, failing on: a slide missing speaker notes, a slide count that disagrees with the plan, plan content absent from the rendered slide, and rendering artifacts that indicate a broken build.
- **FR-017**: The system MUST run a visual review pass over every slide before delivery.
- **FR-018**: The system MUST refuse to deliver a deck whose verification has not passed.
- **FR-019**: When a verification environment is unavailable, the system MUST state which checks did not run and MUST NOT report the deck as fully verified.
- **FR-020**: When delivering to several formats and one fails, the system MUST report which succeeded and which did not.
- **FR-021**: The system MUST preserve a recoverable prior state before applying changes to a deck, so a failed run can be rolled back rather than iterated on.

**Publish safety**

- **FR-022**: The system MUST provide a check that scans tracked files for denied work-identifying terms and reports file, line, and matched term for every hit.
- **FR-023**: That check MUST fail with an explicit error when its term list is absent or unreadable, and MUST NOT report a clean result in that condition.
- **FR-024**: That check MUST NOT report ordinary words that merely contain a denied acronym as a substring.
- **FR-025**: Working and build artifacts MUST be excluded from version control by pattern rather than by enumerating individual files.
- **FR-026**: The denied-term list MUST NOT itself be published.

**Consolidation and migration**

- **FR-027**: Every capability of the superseded components MUST be mapped to its replacement in the consolidated pipeline or explicitly recorded as an accepted drop with a rationale.
- **FR-028**: Project documentation MUST describe the consolidated pipeline and MUST NOT present superseded components as current.
- **FR-029**: Attribution records for third-party material MUST be accurate and current at every point where material is absorbed.
- **FR-030**: Material absorbed from elsewhere MUST bring only its publishable content; working artifacts carrying denied terms MUST NOT be absorbed.

### Key Entities

- **Deck Plan**: The single authored artifact. An ordered set of slides, each carrying a slide type, its on-slide content, attributions where applicable, and the speaker's notes. Authoritative for every delivery format.
- **Slide**: One unit of the plan. Has a type drawn from a vocabulary, content shaped by that type, optional attribution, and speaker notes.
- **Vocabulary Pack**: A named set of slide types with the rules and visual conventions that define an idiom — for example a dense, attribution-carrying research idiom versus a sparse, one-idea-per-slide keynote idiom.
- **Delivery Format Pack**: A named output target that turns a plan into a finished artifact, declaring which slide types it can render.
- **Theme**: The bounded set of visual choices — palette, typography, motifs — applied to a plan at render time without altering content.
- **Verification Report**: The outcome of the gates: what passed, what failed, what did not run, and why.
- **Denied-Term List**: The unpublished list of work-identifying strings that must never appear in tracked files, with the matching mode for each.
- **Source Material**: The long-form input intake reads to propose a plan. Never modified by the system.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: One deck plan produces every selected delivery format with zero content authored more than once.
- **SC-002**: Adding a new delivery format modifies zero files outside that format's own pack directory and the pack registry.
- **SC-003**: Adding a new slide vocabulary modifies zero files outside that vocabulary's own pack directory and the pack registry.
- **SC-004**: The number of independent deck-building pipelines in the project falls from three to one.
- **SC-005**: 100% of decks that fail verification are blocked from delivery.
- **SC-006**: The publish-safety check reports zero false positives across the entire tracked corpus, and fails closed in 100% of runs where its term list is unavailable.
- **SC-007**: Every capability offered by the superseded components is accounted for — replaced or explicitly dropped with a rationale — with none unaccounted for.
- **SC-008**: An author can go from long-form source to an approved plan without hand-writing any structured data.
- **SC-009**: Changing a deck's visual vocabulary or theme requires no edit to slide content.
- **SC-010**: A reader consulting project documentation finds exactly one documented way to build a deck.

## Assumptions

- **Absorption is limited to publishable content.** The standalone research builder's tracked files are clean against the denied-term list and may be absorbed; its untracked working artifacts are not clean and are excluded.
- **A third-party design-prompt repository is out of scope.** It is not owned by this project, carries brand-derived content and a takedown clause, and is therefore linked rather than absorbed. Changing this requires amending the constitution, not a scope decision during implementation.
- **Development is Windows-first, but scripts must also run on POSIX.** Both are treated as supported environments.
- **Visual review tooling may be absent.** Where it is, structural checks still run and the gap is reported rather than hidden.
- **Existing decks remain openable but are not guaranteed re-renderable.** Re-rendering an old deck through the new pipeline is migration work, not a compatibility promise.
- **Web-delivered decks may load fonts from a public font service.** Otherwise, delivered artifacts are self-contained and work offline.
- **The audience is deck authors and the maintainers of this suite**, not end-recipients of the decks. Recipients only ever see finished artifacts.
- **Approval is a human checkpoint.** Automated intake proposes; a person approves before rendering.

## Clarifications Needed

- **[NEEDS CLARIFICATION: Is a document/print delivery format produced directly, or derived from another delivery format?]** Producing it directly gives control over pagination and layout but means a third full renderer to build and maintain. Deriving it from an existing format is far cheaper but inherits that format's layout constraints. The choice materially changes the size of this feature.

- **[NEEDS CLARIFICATION: Do the eight existing router modes survive as first-class capabilities, or does the consolidation reduce them?]** Several are not deck-building at all — they produce rundowns, storyboards, and comparisons. They can become delivery format packs, become separate post-processing utilities, or be dropped. This determines whether the feature absorbs eight modes or a smaller number, and is the single largest driver of scope.

- **[NEEDS CLARIFICATION: What becomes of the standalone research-builder repository once its content is absorbed?]** It is public and independently discoverable. It can be archived with a pointer here, left published and frozen, or deleted. This is an outward-facing decision affecting anyone who has already found or linked it.
