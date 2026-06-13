# Shared Reference: Quality Gates

> **Scope:** This file defines phase-transition validation criteria used across multiple [Presentation Studio](../../SKILL.md) modes (research-deck). Mode reference files should link here instead of duplicating quality gate content.

---

## Overview

Quality gates are validation checkpoints at phase boundaries. Each gate defines conditions that must be met before proceeding to the next phase. Gates are enforced through a combination of automated checks (file existence, YAML validity) and manual review (content quality, audience fit).

### Enforcement Strategy

| Approach | When to Use |
|----------|-------------|
| **Automatic** | File existence, YAML validity, structural completeness |
| **Manual Review** | Content specificity, audience fit, narrative quality |
| **Hybrid** | Automatic for critical gates; manual for subjective gates |

---

## Research-Deck Quality Gates

These gates apply to the research-deck mode's 6-phase workflow (Discovery → Synthesis → Visual Extraction → Interrogation → Drafting → Production).

### Gate: Phase 1 → Phase 2 (Synthesis → Interrogation)

**Trigger:** STAGING.md created, synthesis complete.

**STAGING.md Validity:**
- [ ] STAGING.md file exists in target folder
- [ ] STAGING.md has valid YAML frontmatter
- [ ] Frontmatter contains required fields: `session_id`, `target_folder`, `source_count`, `last_updated`, `status: synthesis-complete`

**Content Completeness:**
- [ ] "Source Inventory" section lists all ingested files
- [ ] At least 3 key arguments extracted and documented
- [ ] Each argument cites at least one source file
- [ ] "Contradictions Found" section exists (may be empty if no contradictions)
- [ ] "Gaps to Fill" section exists and identifies missing information

**Framework Seed:**
- [ ] Framework seed section exists (SCIPAB/SCQA/PSI/Pyramid — see [Frameworks](frameworks.md))
- [ ] At least 50% of framework elements have initial content
- [ ] Elements marked as "Needs user input" if incomplete

**User Approval:**
- [ ] User has reviewed STAGING.md
- [ ] User approves synthesis or provides corrections
- [ ] No major gaps flagged by user as blocking


### Gate: Phase 2 → Phase 3 (Interrogation → Drafting)

**Trigger:** Framework elements populated, gaps filled.

**Implication Specificity (SCIPAB/SCQA):**
- [ ] Implication is NOT generic (e.g., "we'll fall behind")
- [ ] Implication is specific to the audience's concerns
- [ ] Implication includes concrete consequences
- [ ] Implication length: 1-3 sentences (not a paragraph)

**Action Concreteness (SCIPAB/PSI):**
- [ ] Action is NOT an outcome (e.g., "Adopt the platform")
- [ ] Action is a concrete first step
- [ ] Action is achievable in 90 days or less
- [ ] Action specifies WHO does WHAT

**Question Quality (SCQA):**
- [ ] Question is NOT too broad or philosophical
- [ ] Question has a concrete, actionable answer
- [ ] Question directly arises from the Complication

**BLUF Clarity (Pyramid):**
- [ ] BLUF states recommendation in 1-2 sentences
- [ ] BLUF includes decision needed (approve/reject/defer)
- [ ] BLUF specifies budget/timeline if applicable

**Gaps Filled:**
- [ ] All items in "Gaps to Fill" have been addressed
- [ ] User has answered all framework-specific questions
- [ ] No "Needs user input" placeholders remain

**Framework Completeness:**

| Framework | Required Elements |
|-----------|-------------------|
| **SCIPAB** | Situation ✓, Complication ✓, Implication (specific) ✓, Position ✓, Action (concrete) ✓, Benefit ✓ |
| **SCQA** | Situation ✓, Complication (urgent) ✓, Question (answerable) ✓, Answer (2+ supporting points) ✓ |
| **PSI** | Problem (customer-centric) ✓, Solution (demo/proof) ✓, Impact (with metrics) ✓, Constraints (optional, for skeptical audiences) |
| **Pyramid** | BLUF (clear) ✓, Arguments (2-4) ✓, Evidence (≥1 per argument) ✓ |

> For full framework definitions and failure modes, see [Frameworks](frameworks.md).

### Gate: Phase 3 → Phase 4 (Drafting → Production)

**Trigger:** presentation.md created, structure approved.

**presentation.md Validity:**
- [ ] presentation.md file exists in target folder
- [ ] File has valid Marp frontmatter (`---`, `marp: true`, `theme`, `---`)
- [ ] No unclosed code blocks (``` must have closing ```)
- [ ] No malformed HTML comments

**Framework Structure:**
- [ ] All framework elements are present as slides
- [ ] Visual CSS classes applied correctly:
  - SCIPAB: `complication`, `implication`, `position`, `action`, `benefit`
  - SCQA: `scqa-situation`, `scqa-complication`, `question-slide`, `scqa-answer`
  - PSI: `psi-problem`, `psi-solution`, `psi-constraints`, `psi-impact`
  - Pyramid: `bluf`, `pyramid-argument`, `pyramid-evidence`, `pyramid-decision`

> For CSS class definitions, see [Marp Visual Design](marp-visual-design.md).

**Slide Count:**

| Framework | Expected Range |
|-----------|---------------|
| SCIPAB | 8-12 slides |
| SCQA | 8-10 slides |
| PSI | 8-12 slides |
| Pyramid | 10-14 slides |

**Content Quality:**
- [ ] No placeholder text (e.g., "[Insert content here]", "[TODO]")
- [ ] All sources cited in speaker notes (if applicable)
- [ ] Slides are concise (max 5-7 bullets per slide)
- [ ] No slide exceeds ~50 words (guideline, not strict)

**User Approval:**
- [ ] User has reviewed presentation.md structure
- [ ] User approves slide count and flow
- [ ] User ready for export

---

## Phase-Independent Quality Checks

These checks apply across all modes at any phase boundary.

### WikiLink Integrity

All WikiLinks (`[[...]]`) in generated or edited files must resolve to existing notes. Broken links indicate missing references or incorrect paths.

**Check:** Search file for `[[` patterns and verify each target exists.

### Frontmatter Consistency

When using resumable sessions (STAGING.md + optional manifest.json):
- `session_id` must match across files
- `current_phase` / `status` must reflect actual progress
- `last_updated` timestamp should be current

### Source Attribution

Every claim or argument in the final output should trace back to a source file listed in the Source Inventory. Unattributed claims should be flagged for user review.

---

## Validation Reference

### Generic Validation Patterns

These patterns can be applied by any agent using generic capabilities:

| Check | Capability | What to Verify |
|-------|-----------|----------------|
| File exists | `file-search` | Target file present in expected location |
| YAML valid | `file-read` | Frontmatter parses without errors, required fields present |
| Section exists | `content-search` | Required heading (e.g., `## Key Arguments`) found in file |
| No placeholders | `content-search` | No `[TODO]`, `[Insert]`, `Needs user input` in final output |
| Link integrity | `content-search` | All `[[...]]` targets resolve to existing files |
| Tool compliance | `content-search` | No agent-specific tool names in shared skill files |

### Executable QA (for `.pptx` outputs)

Decks exported as `.pptx` (pptx mode, or a Marp PPTX export) can reuse the runnable checks shipped by the `keynote-deck-builder` skill:

- `scripts/verify_keynote.py --deck <file>.pptx --no-require-notes` — slide count and no leftover icon-font glyphs (drop `--no-require-notes` to also require speaker notes).
- `scripts/render_check.sh <file>.pptx <dir>` — render per-slide images for a visual pass (overflow, contrast, legibility).

### Remediation Patterns

| Failure | Recovery |
|---------|----------|
| STAGING.md missing | Re-run synthesis phase; check target folder path |
| Frontmatter invalid | Auto-repair missing fields with defaults; prompt user for required values |
| Arguments < 3 | Expand source ingestion; re-read PDFs or additional files |
| Generic Implication | Force specificity: Who loses what, by when, measured how? |
| Vague Action | Apply 90-day test: Is this achievable in 90 days? If not, break down |
| Unclosed code blocks | Count ``` markers; add closing marker where missing |
| Placeholder text | Search and replace; prompt user for actual content |

---

_Phase-transition validation criteria for all gate boundaries._
