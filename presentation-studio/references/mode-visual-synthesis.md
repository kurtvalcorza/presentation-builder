# Mode: Visual Synthesis

> **Source:** New mode — no prior skill. Compares multiple presentation versions (markdown, HTML, visual blueprint, or producer-rundown files) and synthesizes the strongest elements into a unified output with explicit attribution and a numbered cue sheet for production handoff.

---

## When to Use

- You have 2+ draft presentations and need to converge on a final version
- Comparing visual blueprints, producer rundowns, slide decks, or HTML presentations side-by-side
- Cherry-picking the best elements from competing approaches
- Producing a numbered cue sheet that a production team can execute from
- **Trigger phrases:** "compare presentations", "synthesize approaches", "combine versions"

**Do NOT use when:**
- You only have one presentation version (nothing to compare — use the appropriate generation mode instead)
- You need to create a presentation from scratch (use [Research Deck Mode](mode-research-deck.md), [HTML Slides Mode](mode-html-slides.md), or [PPTX Mode](mode-pptx.md))
- You need framework selection guidance (use [Framework Selection Mode](mode-framework.md))
- You want to convert a speech into a visual blueprint or producer rundown (use [Visual Blueprint Mode](mode-visual-blueprint.md) or [Visual Script Mode](mode-visual-script.md))

---

## Dependencies

### Required Capabilities

- `file-read` — Read input presentation versions (markdown, HTML, visual blueprint, or producer-rundown files)
- `file-write` — Generate comparative analysis, synthesized output, and numbered cue sheet
- `user-interact` — Clarify synthesis preferences, present comparative analysis, confirm cherry-pick choices

### Required Inputs

- **Two or more presentation versions** — Any combination of:
  - Markdown slide decks (Marp, raw markdown)
  - HTML presentation files
  - Visual blueprint or producer-rundown tables from [Visual Blueprint Mode](mode-visual-blueprint.md) or [Visual Script Mode](mode-visual-script.md)
  - PowerPoint export notes or outlines

### Optional Inputs

| Input | Default | Options |
|:---|:---|:---|
| Synthesis priority | Balanced | Content-first / Visual-first / Narrative-first |
| Output format | Numbered cue sheet | Cue sheet / Merged markdown / Merged visual blueprint / Merged producer rundown |
| Attribution detail | Per-element | Per-element / Per-section / Summary only |

---

## Workflow Phases

### Phase 0: Input Validation

Before any analysis begins, validate that the minimum input threshold is met.

1. Use `file-read` to confirm each provided file exists and is readable
2. Count the number of distinct presentation versions provided
3. **If fewer than 2 versions are provided:**
   - Return a descriptive error to the user via `user-interact`:
     > "Visual Synthesis requires at least 2 presentation versions to compare. You provided [N]. Please provide additional versions, or use a single-mode workflow (research-deck, html-slides, pptx) to refine your existing draft."
   - **Halt execution.** Do not proceed to Phase 1.
4. Identify the format of each version (markdown, HTML, visual blueprint, producer rundown) and note any format mismatches for normalization in Phase 1

---

### Phase 1: Inventory & Normalization

Prepare all inputs for side-by-side comparison.

1. **Catalog each version:**
   - Assign a short label (e.g., Version A, Version B, Version C)
   - Record format type, section/slide count, and estimated duration (if available)
   - Note the original source or author if identifiable

2. **Normalize structure:**
   - Map each version's sections to a common outline (e.g., Opening → Problem → Evidence → Solution → Close)
   - Where versions use different structural approaches, note the divergence rather than forcing alignment
   - For mixed formats (e.g., one markdown, one HTML), extract the logical structure from each without converting formats

3. **Present inventory to user** via `user-interact`:
   > "I've cataloged [N] presentation versions. Here's the inventory: [table]. Shall I proceed with comparative analysis, or would you like to adjust the inputs?"

---

### Phase 2: Comparative Analysis

Systematically evaluate each version's strengths and weaknesses.

1. **Section-by-section comparison:**
   For each section in the common outline, evaluate across all versions:

   | Dimension | What to Assess |
   |:---|:---|
   | **Narrative clarity** | Which version communicates the core message most effectively? |
   | **Evidence strength** | Which version provides the strongest supporting data or examples? |
   | **Visual impact** | Which version's visual approach is most compelling or production-ready? |
   | **Audience fit** | Which version best matches the target audience's expectations? |
   | **Pacing & flow** | Which version has the best rhythm and transitions? |

2. **Build a comparison matrix:**

   ```markdown
   | Section | Version A | Version B | Strongest |
   |:---|:---|:---|:---|
   | Opening | Clear hook, weak data | Data-rich, slow start | A (narrative) + B (data) |
   | Problem | ... | ... | ... |
   | Evidence | ... | ... | ... |
   ```

3. **Identify cross-cutting patterns:**
   - Which version has the strongest overall narrative arc?
   - Which version has the best visual language or production readiness?
   - Are there elements unique to one version that should not be lost?

4. **Present analysis to user** via `user-interact`:
   > "Here's the comparative analysis. [Matrix]. I recommend cherry-picking [summary]. Want to adjust any of these assessments before I synthesize?"

---

### Phase 3: Synthesis

Cherry-pick the best elements from each version into a unified output.

1. **Apply synthesis priority** (from optional inputs or user confirmation):
   - **Content-first:** Prioritize the version with the strongest arguments and evidence, then layer in visuals
   - **Visual-first:** Prioritize the version with the best visual design, then adjust content to fit
   - **Narrative-first:** Prioritize the version with the best story arc, then fill in evidence and visuals

2. **For each section in the common outline:**
   - Select the primary source version (the one rated strongest for that section)
   - Identify supplementary elements from other versions to merge in
   - Record explicit attribution: `[Source: Version B, Section 3]`
   - Resolve conflicts where versions contradict each other — flag for user decision if ambiguous

3. **Stitch transitions:**
   - Ensure the synthesized output flows naturally between sections sourced from different versions
   - Rewrite transition sentences where a version boundary creates a jarring shift
   - Preserve the overall narrative arc identified in Phase 2

4. **Quality check:**
   - Verify every section has a clear source attribution
   - Confirm no orphaned content (elements that don't connect to the narrative)
   - Check that the synthesized version is not longer than the longest input (synthesis should tighten, not bloat)

---

### Phase 4: Cue Sheet Generation

Produce a numbered cue sheet suitable for production handoff.

1. **Number every production moment** sequentially across the entire presentation:

   ```markdown
   # Cue Sheet — [Presentation Title]
   ## Generated by Visual Synthesis from [N] versions

   | Cue # | Section | On Screen | Narration/Action | Source |
   |:---|:---|:---|:---|:---|
   | 1 | Opening | Title card: **"Presentation Title"** — 3s hold | *—* | Version A |
   | 2 | Opening | Hook visual: [description] | "[Opening line]" | Version B |
   | 3 | Problem | Data chart: [description] | "[Problem statement]" | Version A |
   | ... | ... | ... | ... | ... |
   ```

2. **Cue sheet columns:**
   - **Cue #** — Sequential number for unambiguous production reference
   - **Section** — Which section of the presentation this cue belongs to
   - **On Screen** — What the audience sees (visual description, text overlays, holds)
   - **Narration/Action** — What the speaker says or does; use *—* for silent moments
   - **Source** — Which input version this element was drawn from (attribution)

3. **Include a summary header** with:
   - Total cue count
   - Estimated total duration
   - Versions used and their contribution percentage (e.g., "Version A: 45%, Version B: 35%, Version C: 20%")
   - Synthesis priority applied

4. **Write the cue sheet** to the output location using `file-write`

---

## Output Contract

### Files Generated

| Deliverable | Description |
|:---|:---|
| Comparative Analysis | Section-by-section comparison matrix with strength/weakness assessments |
| Synthesized Presentation | Unified output combining the best elements from all input versions |
| Numbered Cue Sheet | Production-ready cue sheet with sequential numbering and source attribution |

### Output Guarantees

- Every element in the synthesized output has explicit source attribution
- The cue sheet is numbered sequentially with no gaps — production teams can reference cues unambiguously
- The synthesized version does not exceed the length of the longest input version
- All input versions are represented in the final output (no version is entirely discarded unless the user explicitly requests it)
- Format mismatches between inputs are resolved transparently in the inventory phase

---

## Integration Points

- **Router:** [Presentation Studio](../SKILL.md) — Dispatches to this mode via trigger phrases
- **Upstream:** [Research Deck Mode](mode-research-deck.md) — Produces markdown decks that can be compared in this mode
- **Upstream:** [HTML Slides Mode](mode-html-slides.md) — Produces HTML presentations that can be compared in this mode
- **Upstream:** [Visual Blueprint Mode](mode-visual-blueprint.md) and [Visual Script Mode](mode-visual-script.md) — Produce blueprint or rundown artifacts that can be compared in this mode
- **Downstream:** Production teams consume the numbered cue sheet directly
- **Related:** [Framework Selection Mode](mode-framework.md) — If synthesis reveals a framework mismatch, route back to framework selection

---

## Anti-Patterns

- **Do not** proceed with fewer than 2 input versions — halt and return a descriptive error (see Phase 0)
- **Do not** silently discard an input version — every version must be represented in the comparative analysis, even if its contribution to the final synthesis is minimal
- **Do not** synthesize without user confirmation of the comparative analysis — the user must approve or adjust assessments before cherry-picking begins
- **Do not** produce a synthesis longer than the longest input — synthesis tightens, it does not bloat
- **Do not** omit source attribution — every element in the cue sheet must trace back to its origin version
- **Do not** force-convert formats during normalization — compare logical structure, not file formats
- **Do not** rewrite the speaker's words during synthesis — preserve original phrasing from the selected source version
- **Do not** use agent-specific tool names — describe capabilities generically (read, write, search, run-command)
