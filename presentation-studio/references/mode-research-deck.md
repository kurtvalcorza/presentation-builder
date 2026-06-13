# Mode: Research Deck

> Synthesizes folders of notes and PDFs into framework-appropriate Marp presentations.

---

## When to Use

- Building presentations from research folders containing notes, PDFs, and AI summaries
- Creating strategic decks from multi-source content
- Synthesizing multi-source inputs into framework-structured slide decks
- **Trigger phrases:** "build a deck", "create slides from research", "synthesize into presentation"

---

## Dependencies

### Required Capabilities

- `file-read` — Folder scanning, file ingestion, PDF text extraction
- `file-write` — STAGING.md, presentation.md, visual-elements.json generation
- `file-edit` — Iterative refinement of outputs
- `file-search` — File discovery in target folders (`*.md`, `*.txt`, `*.pdf`)
- `content-search` — Search within file contents
- `user-interact` — Framework selection, gap filling, approval checkpoints
- `command-exec` — Marp CLI execution for PDF/PPTX/HTML export

### Required Inputs

- **Target folder path** (e.g., `research/my-project/` — any folder of notes/PDFs)
- **At least one source file** (`.md`, `.txt`, or `.pdf`)

### Optional Inputs

- Pre-existing `STAGING.md` in target folder (enables session resume)
- `.cache/research-deck/manifest.json` (machine-readable state for precise resume)
- Framework preference (if not specified, auto-selected based on audience/objective/stakes)
- Mode preference: Strategic, Quick, or Recording
- **`deck_activation` handoff with `source_outline`** — when dispatched from [source-to-presentation-synthesis](../../source-to-presentation-synthesis/SKILL.md), treat the referenced outline as the single source file and skip Phase 1 folder discovery
- **Re-ingested markdown** — output from `convert-pptx-to-handout` or `summarize-slide-images-to-note` works as a source file here (e.g. to redesign an existing deck)

### External Dependencies

- **Marp CLI** (optional for PDF/PPTX export)
  - Fallback: HTML export (no installation required)

### Related Skills

- **Interactive interrogation** — Phase 4 hardens narrative logic through provocation patterns
- **PDF-heavy sources (>5 PDFs)** — pre-process the corpus before synthesis

---

## Sub-Modes

| Mode | Phases Included | Time | Use When |
|:---|:---|:---|:---|
| **Strategic (Full)** | Discovery → Synthesis → Visual Extraction → Interrogation → Drafting → Production | 20–30 min | Leadership, conferences, high-stakes presentations |
| **Quick (Informational)** | Discovery → Synthesis → Visual Extraction → Drafting → Production | 10–15 min | Team updates, internal sharing |
| **Recording** | Discovery → Synthesis → Visual Extraction → Drafting → Production | 12–18 min | Video recording, screen capture, YouTube |

### Phase-Skipping Behavior

- **Quick Mode skips:** Phase 4 (Interrogation). Uses defaults for Implication/Action instead of interactive gap-filling.
- **Recording Mode skips:** Phase 4 (Interrogation). Additionally enforces visual-first extraction, chapter TOC generation, CSS-based diagrams, and high-contrast theme. Output is single-file HTML with embedded CSS/JS.

---

## Workflow Phases

### Phase 1: Discovery & State Check

**Goal:** Identify input scope, check for existing work, select framework and mode.

#### Actions

1. **Scan Target Folder:**
   - Use `file-search` to find `*.md`, `*.txt`, `*.pdf` files
   - Report: "Found [N] files ([X] MD, [Y] PDF, [Z] TXT)"

2. **Check for Resumable Session:**
   - IF `STAGING.md` exists in target folder:
     - Parse frontmatter to determine session state
     - Offer resume options via `user-interact`:
       1. Continue from last phase (use existing synthesis)
       2. Restart from Phase 2 (keep source list, redo synthesis)
       3. Start fresh (discard all state)
   - IF `.cache/research-deck/manifest.json` exists:
     - Use manifest.json for precise resume state (preferred over STAGING.md frontmatter)

3. **PDF Handling Decision:**
   - IF folder contains >5 PDFs:
     - Recommend pre-processing the PDF corpus first
     - Pre-processing produces structured summaries for better synthesis
     - User can proceed directly if preferred (less depth)

4. **Framework Selection:**
   - Determine optimal framework based on audience, objective, and stakes
   - Use the Framework Selection Matrix from [Frameworks](shared/frameworks.md)
   - **Defaults:**
     - High-stakes with mixed audience → SCIPAB
     - Executive decision required → Pyramid
     - Narrative persuasion needed → SCQA
     - Demo or proof required → PSI

5. **Mode Selection:**
   - **Strategic (Full):** All 6 phases (20–30 min). Includes Phase 4 interrogation for hardening narrative logic.
   - **Quick (Informational):** Skips Phase 4 (10–15 min). Uses defaults for Implication/Action.
   - **Recording:** Skips Phase 4 (12–18 min). Enforces visual-first extraction, chapter navigation TOC, CSS-based diagrams, high-contrast theme. Output: single-file HTML with embedded CSS/JS.

6. **Template Variant Selection:**
   - Based on framework and audience, choose a variant:
     - SCIPAB: executive, academic, or technical
     - SCQA / PSI / Pyramid: one standard structure each
   - For each framework's structure, variant selection, and failure mode warnings, see [Frameworks](shared/frameworks.md)

**Checkpoint:** Framework, mode, and template selected.

---

### Phase 2: Synthesis (Checkpoint: STAGING.md)

**Goal:** Extract grounded truths, surface contradictions, identify gaps.

**Behavior:** Analytical (not provocative).

#### Actions

1. **Ingest All Sources:**
   - Read Markdown files (full content)
   - Read PDFs (extract text)
   - Parse existing AI summaries (if present)

2. **Create/Update STAGING.md:**

   STAGING.md is the human-readable synthesis checkpoint. It uses YAML frontmatter for session state and structured sections for content.

   **Frontmatter Schema:**
   ```yaml
   ---
   session_id: research-deck-[timestamp]
   target_folder: [path]
   framework: [scipab|scqa|psi|pyramid]
   template: [executive|academic|technical|narrative|demo]
   mode: [strategic|informational|recording]
   source_count: [number]
   last_updated: [ISO timestamp]
   status: synthesis-complete
   current_phase: 2
   ---
   ```

   **Required Sections:**
   - **Source Inventory** — List of all ingested files with brief descriptions
   - **Key Arguments (Grounded Truths)** — Numbered arguments with source citations (minimum 3)
   - **Contradictions Found** — Cross-source conflicts (may be empty)
   - **Gaps to Fill** — Missing information as checklist items
   - **Framework Seed** — Initial draft using the selected framework structure

   **Framework Seeds:**

   Each framework has a seed template populated during synthesis. For full framework element definitions, see [Frameworks](shared/frameworks.md).

   **SCIPAB Seed:**
   ```markdown
   ## SCIPAB Seed
   **Situation:** [Current state from sources]
   **Complication:** [Problem/tension identified]
   **Implication:** [Needs interrogation input — or use default in Quick Mode]
   **Position:** [Thesis emerging from arguments]
   **Action:** [Needs interrogation input — or use default in Quick Mode]
   **Benefit:** [Potential outcome from sources]
   ```

   **SCQA Seed:**
   ```markdown
   ## SCQA Seed
   **Situation:** [Set the scene from sources]
   **Complication:** [Disruptive event/problem]
   **Question:** [Burning question arising from complication]
   **Answer:** [Response with supporting points]
   ```

   **PSI Seed:**
   ```markdown
   ## PSI Seed
   **Problem:** [Pain point from sources]
   **Solution:** [Approach/capability]
   **Impact:** [Measurable results]
   **Constraints (optional):** [Honest limitations]
   ```

   **Pyramid Seed:**
   ```markdown
   ## Pyramid Seed
   **BLUF:** [Bottom line recommendation]
   **Argument 1:** [Supporting reason]
   **Argument 2:** [Supporting reason]
   **Argument 3:** [Supporting reason]
   **Evidence:** [Data points for each argument]
   ```

3. **Display Summary:**
   - Top 3 arguments extracted
   - Critical contradictions (if any)
   - Major gaps identified

**Checkpoint:** STAGING.md created and synthesis approved by user. Proceed to Phase 3 (Visual Extraction).

---

### Phase 3: Visual Extraction

**Goal:** Extract visual anchors and quantitative data for CSS-based diagrams and visual-first slides.

**Behavior:** Data-driven extraction focused on numbers, key phrases, and diagram-worthy content.

**Applies to:** All sub-modes (Strategic, Quick, Recording). Recording mode enforces enhanced visual-first prioritization.

#### Actions

1. **Parse STAGING.md for Visual Elements:**
   - **Numbers & Statistics:** Percentages, counts, metrics, financial figures
   - **Key Phrases:** Single impactful statements (< 10 words)
   - **Processes:** Sequential steps (A → B → C)
   - **Comparisons:** Before/after, old vs. new, option A vs. option B
   - **Arguments:** Numbered reasons, benefits, or evidence points

2. **Generate visual-elements.json:**
   - Create in target folder alongside STAGING.md
   - Structure includes: `numbers[]`, `key_phrases[]`, `processes[]`, `comparisons[]`, `arguments[]`, `chapters[]`
   - Each element includes `source` (file attribution) and `slide_context` (framework section mapping)

3. **Map Visual Elements to Framework Sections:**

   | Framework | Section → Visual Element Types |
   |:---|:---|
   | **SCIPAB** | Situation → Numbers, key phrases · Complication → Comparisons · Implication → Key phrases (stakes) · Position → Arguments (reason cards) · Action → Processes (flow diagrams) · Benefit → Numbers, arguments |
   | **SCQA** | Situation → Numbers, key phrases · Complication → Comparisons, key phrases · Question → Key phrases · Answer → Arguments, processes |
   | **PSI** | Problem → Numbers, comparisons · Solution → Processes, arguments · Impact → Numbers (metrics) |
   | **Pyramid** | BLUF → Key phrases · Arguments → Arguments (numbered cards) · Evidence → Numbers |

4. **Recording Mode Enhancements:**
   When `mode: recording`:
   - Enforce chapter extraction from framework sections
   - Skip title slides — start with first content slide
   - Prioritize CSS diagrams over text-heavy slides
   - Extract slide metadata for chapter navigation (`data-chapter` attributes, chapter start indices)

5. **Update STAGING.md:**
   - Append "Visual Extraction Summary" section with counts of numbers, key phrases, diagrams identified, and CSS template recommendations
   - For CSS template class definitions, see [Marp Visual Design](shared/marp-visual-design.md)

6. **Display Visual Extraction Report:**
   - Summary of extracted elements by type
   - CSS template recommendations
   - Recording mode status and chapter count (if applicable)

**Checkpoint:** visual-elements.json created. Proceed to Phase 4 (Strategic) or Phase 5 (Quick/Recording).

---

### Phase 4: Interrogation (Strategic Mode Only)

**Goal:** Harden narrative logic by filling framework gaps through interactive questioning.

**Quick Mode / Recording Mode:** This phase is **SKIPPED**. Proceed directly to Phase 5 using defaults for missing elements.

#### Actions

1. **Identify Missing Elements:**
   - Review STAGING.md framework seed
   - List elements marked "Needs user input" or empty

2. **Fill Gaps Using Defaults (when skipping or as fallback):**

   | Framework | Missing Element | Default Template |
   |:---|:---|:---|
   | SCIPAB | Implication | "If [Complication] is not addressed, [negative consequence from Position]" |
   | SCIPAB | Action | "Pilot [Position] in [specific agency/team] within 90 days" |
   | SCQA | Question | "How do we [resolve Complication] without [trade-off]?" |
   | PSI | Impact | "[Solution] delivers [benefit 1], [benefit 2], [benefit 3]" |
   | Pyramid | Evidence | "Argument supported by [source file] showing [metric/fact]" |

3. **Interactive Interrogation (Strategic Mode):**
   - Use `user-interact` to challenge weak elements and fill gaps
   - For agents with conversational capabilities, use interactive provocation patterns
   - See agent-specific skill directories for platform extensions on interrogation patterns

4. **Update STAGING.md:**
   - Fill in missing framework elements
   - Mark status: `interrogation-complete` or `interrogation-skipped`
   - Update `current_phase: 4`

**Quality Gate:** All framework elements populated. See [Quality Gates](shared/quality-gates.md) for Phase 2→4 and Phase 4→5 validation criteria.

**Checkpoint:** Framework seed is complete (all elements filled).

---

### Phase 5: Drafting (Checkpoint: presentation.md)

**Goal:** Generate Marp-formatted deck using the selected framework and template.

#### Actions

1. **Variant Selection:**
   - Use the framework variant selected in Phase 1
   - For template structure details, see [Frameworks](shared/frameworks.md)

2. **Generate presentation.md:**

   **Marp Header:**
   ```markdown
   ---
   marp: true
   theme: default
   paginate: true
   backgroundColor: #fff
   style: |
     [CSS classes for framework]
   ---
   ```

   For the full CSS class system and framework-specific visual cues, see [Marp Visual Design](shared/marp-visual-design.md).

3. **Apply Framework Structure:**
   - Map framework elements to slides using the selected framework's structure
   - Apply CSS classes for visual cues per framework element:
     - **SCIPAB:** `situation`, `complication`, `implication`, `position`, `action`, `benefit`
     - **SCQA:** `scqa-situation`, `scqa-complication`, `question-slide`, `scqa-answer`
     - **PSI:** `psi-problem`, `psi-solution`, `psi-constraints`, `psi-impact`
     - **Pyramid:** `bluf`, `pyramid-argument`, `pyramid-evidence`, `pyramid-decision`

4. **Include Speaker Notes:**
   - Add contradictions from STAGING.md as speaker notes
   - Add gaps or caveats as speaker notes
   - Format: `<!-- Note: [speaker note content] -->`

5. **Validate Structure:**
   - Check for unclosed code blocks
   - Verify all framework elements present as slides
   - Confirm slide count matches framework expectations:

     | Framework | Expected Slide Range |
     |:---|:---|
     | SCIPAB | 8–12 slides |
     | SCQA | 8–10 slides |
     | PSI | 8–12 slides |
     | Pyramid | 10–14 slides |

   - See [Quality Gates](shared/quality-gates.md) for Phase 5→6 validation criteria

6. **Display Preview:**
   - Report slide count per section
   - Show total slides
   - List framework elements included

**Checkpoint:** presentation.md created and structure approved by user.

---

### Phase 6: Production (Export with Pre-flight)

**Goal:** Export to PDF/PPTX/HTML using Marp CLI.

#### Actions

1. **Dependency Check:**
   ```bash
   npx @marp-team/marp-cli@latest --version
   ```
   - IF installed: Proceed to export
   - IF NOT found: Offer HTML fallback or setup guide

2. **Export Commands:**

   | Format | Command |
   |:---|:---|
   | PDF (default) | `npx @marp-team/marp-cli@latest presentation.md -o presentation.pdf` |
   | PPTX | `npx @marp-team/marp-cli@latest presentation.md --pptx -o presentation.pptx` |
   | HTML | `npx @marp-team/marp-cli@latest presentation.md -o presentation.html` |

3. **Recording Mode Enhanced HTML:**
   When `mode: recording`:
   - Load visual-elements.json and map extracted elements to CSS diagram components
   - Generate single-file HTML with embedded CSS/JS
   - Include chapter navigation sidebar, slide counter, and keyboard hints
   - Inject CSS-based diagrams (stats grids, comparisons, flow diagrams, reason cards)
   - For CSS diagram component classes, see [Marp Visual Design](shared/marp-visual-design.md)

4. **Error Handling:**
   - Marp CLI not found → Use HTML fallback or setup guide
   - PDF extraction fails → Skip PDF, continue with other sources
   - Corrupted STAGING.md → Auto-repair frontmatter or use validation utility
   - Contradictory sources → Document in STAGING.md, resolve in Phase 4

5. **Final Report:**
   ```
   Export complete! Generated files in [folder]:
   ✓ STAGING.md (synthesis checkpoint)
   ✓ presentation.md (Marp source)
   ✓ presentation.pdf|pptx|html (exported deck)

   Next Steps:
   - Review presentation file
   - Edit presentation.md for refinements
   - Re-run export command to regenerate
   ```

**Checkpoint:** Exportable deck files created.

---

## Output Contract

### Files Generated (in target folder)

| File | Purpose | Created In |
|:---|:---|:---|
| `STAGING.md` | Synthesis checkpoint — grounded truths, contradictions, gaps, framework seed | Phase 2 |
| `visual-elements.json` | Extracted visual anchors and quantitative data | Phase 3 |
| `presentation.md` | Marp-formatted slide deck | Phase 5 |
| `presentation.pdf` | Exported PDF (if Marp CLI available) | Phase 6 |
| `presentation.pptx` | Exported PPTX (if Marp CLI available) | Phase 6 |
| `presentation.html` | Exported HTML (always available as fallback) | Phase 6 |

### Recording Mode Additional Output

| File | Purpose |
|:---|:---|
| `presentation.html` | Single-file HTML with embedded CSS/JS, chapter navigation, keyboard controls |
| `css-templates/` | Symlinked CSS assets for editing |

---

## STAGING.md Checkpoint Pattern

STAGING.md serves as the **resumable session state** for the research-deck workflow. It is both human-readable (for review) and machine-parseable (for session resume).

### Resume Logic

**Detection Order:**
1. Check for `.cache/research-deck/manifest.json` (preferred — machine-readable state)
2. Fall back to STAGING.md frontmatter
3. No resumable state → start new session

### Session State Fields

| Field | Purpose |
|:---|:---|
| `session_id` | Unique identifier for the session |
| `target_folder` | Path to the source folder |
| `framework` | Selected framework (scipab, scqa, psi, pyramid) |
| `template` | Selected template variant |
| `mode` | Sub-mode (strategic, informational, recording) |
| `source_count` | Number of ingested source files |
| `last_updated` | ISO timestamp of last modification |
| `status` | Current phase status (e.g., `synthesis-complete`, `interrogation-complete`) |
| `current_phase` | Phase number for resume |

### Resume Options (presented via `user-interact`)

1. **Continue from last phase** — Use existing synthesis and state
2. **Restart from Phase 2** — Keep source list, redo synthesis
3. **Start fresh** — Discard all state

---

## Integration Points

- **Frameworks:** [Frameworks](shared/frameworks.md) — Framework definitions, selection matrix, failure modes, template auto-selection, framework seeds, compression patterns
- **Quality Gates:** [Quality Gates](shared/quality-gates.md) — Phase-transition validation criteria for all gate boundaries
- **Marp Visual Design:** [Marp Visual Design](shared/marp-visual-design.md) — CSS class system, visual cues per framework, recording mode diagram components
- **Router:** [Presentation Studio](../SKILL.md) — Dispatches to this mode via trigger phrases or YAML handoff

---

## Anti-Patterns

- **Do not** inline framework definitions, selection matrices, or failure modes — link to [Frameworks](shared/frameworks.md)
- **Do not** inline CSS class definitions or visual cue specs — link to [Marp Visual Design](shared/marp-visual-design.md)
- **Do not** inline quality gate criteria — link to [Quality Gates](shared/quality-gates.md)
- **Do not** skip STAGING.md creation — it is the resumable checkpoint and audit trail
- **Do not** skip Visual Extraction (Phase 3) in any mode — it runs in Strategic, Quick, and Recording
- **Do not** use agent-specific tool names — describe capabilities generically (read, write, search, run-command)
