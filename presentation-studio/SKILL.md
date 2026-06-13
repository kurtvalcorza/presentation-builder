---
name: presentation-studio
description: >-
  Router for presentation work: turns research, notes, outlines, or speeches into
  decks and production documents via mode-based dispatch. Use it to build a slide
  deck from research, generate a PowerPoint (.pptx) or HTML/web slides, draft a
  spoken talk script, turn a speech into a producer rundown or "On Screen | Script"
  storyboard, compare and merge presentation versions, or choose a presentation
  framework. Triggers include "build a deck", "create slides", "generate pptx",
  "HTML presentation", "write a talk / speaker script", "producer rundown",
  "visual blueprint / storyboard", "compare presentations", "which framework", or
  a deck_activation YAML block. For finished keynote slides from a script, use the
  separate keynote-deck-builder skill.
---

# Presentation Studio

> **Single entry point for all presentation workflows.** Detects user intent and dispatches to the appropriate mode reference file.

## Required Capabilities

- `file-read` — Load mode reference files and source materials
- `file-write` — Generate outputs (presentations, staging files)
- `file-edit` — Iterative refinement of outputs
- `file-search` — Discover files in target folders
- `content-search` — Search within file contents
- `user-interact` — Ambiguity resolution, interrogation workflows
- `command-exec` — Marp CLI, python-pptx execution

## Mode Detection Table

| Trigger Pattern | Mode | Reference File |
|:---|:---|:---|
| "build a deck", "create slides from research", "synthesize into presentation" | `research-deck` | `references/mode-research-deck.md` |
| "write a talk", "draft a speech", "speaker script", "keynote script" | `speaker-script` | `references/mode-speaker-script.md` |
| "HTML presentation", "web slides", "convert PPT to web" | `html-slides` | `references/mode-html-slides.md` |
| "generate pptx", "PowerPoint file", "create .pptx" | `pptx` | `references/mode-pptx.md` |
| "visual script", "producer rundown", "production script" | `visual-script` | `references/mode-visual-script.md` |
| "visual blueprint", "visual rundown", "keynote storyboard", "storyboard", "On Screen \| Script" | `visual-blueprint` | `references/mode-visual-blueprint.md` |
| "compare presentations", "synthesize approaches", "combine versions" | `visual-synthesis` | `references/mode-visual-synthesis.md` |
| "which framework", "help me choose", "what structure" | `framework-selection` | `references/mode-framework.md` |
| `deck_activation.mode` field present | *(parsed from YAML)* | *(corresponding mode file)* |

> **Keynote routing (disambiguation):** "keynote" alone is ambiguous. For finished keynote **slides** from a script, use the separate **`keynote-deck-builder`** skill — *not* a studio mode. For a keynote **rundown / storyboard** from a speech, use `visual-script` / `visual-blueprint`. To draft the keynote **script** itself, use `speaker-script`.

## Mode Summaries

| Mode | One-Line Description |
|:---|:---|
| `research-deck` | Synthesize folders of notes/PDFs into framework-appropriate Marp presentations |
| `speaker-script` | Draft a read-ready spoken talk script from research/outline; the on-ramp to keynote-deck-builder and the rundown modes |
| `html-slides` | Create zero-dependency, animation-rich HTML presentations with style discovery |
| `pptx` | Generate native PowerPoint files with branded layouts using python-pptx |
| `visual-script` | Transform speeches/keynotes into clean producer rundowns |
| `visual-blueprint` | Transform speeches/keynotes into `On Screen \| Script` visual blueprints |
| `visual-synthesis` | Compare multiple presentation versions and synthesize the best elements |
| `framework-selection` | Guided interrogation to choose the right presentation framework |

## Dispatch Logic

### Step 1: Check for YAML Handoff

If the user input contains a `deck_activation` YAML block:

```yaml
deck_activation:
  mode: research-deck
  source_outline: "<optional path to a presentation-outline .md>"
  speaking_time_min: <int>
  audience: "<description>"
  slide_density: slide-light|balanced|slide-driven
```

1. Extract the `mode` field from `deck_activation`.
2. Map it to the corresponding mode name and load its reference file with `file-read`.
3. Pass the full `deck_activation` block as structured input to the mode workflow.
4. **Skip** all further detection steps — dispatch directly.

If a `source_outline` path is present (e.g. handed off from [source-to-presentation-synthesis](../source-to-presentation-synthesis/SKILL.md)), the loaded mode reads that file as its primary source: `research-deck` treats it as its single source file (skipping folder discovery).

### Step 2: Match Trigger Phrases

Scan the user's request against the **Trigger Pattern** column in the Mode Detection Table above.

- **Single match found:** Proceed to Step 4.
- **Multiple matches found:** Proceed to Step 3.
- **No match found:** Proceed to Step 3.

### Step 3: Resolve Ambiguity

When the mode cannot be determined from trigger phrases alone:

Use `user-interact` to present the mode list:

> **Which presentation mode would you like?**
>
> 1. **research-deck** — Synthesize notes/PDFs into Marp presentations
> 2. **speaker-script** — Draft a spoken talk script (feeds keynote-deck-builder / rundowns)
> 3. **html-slides** — Animation-rich HTML presentations with style discovery
> 4. **pptx** — Native PowerPoint files with branded layouts
> 5. **visual-script** — Clean producer rundowns from speeches
> 6. **visual-blueprint** — `On Screen | Script` storyboard/blueprint documents
> 7. **visual-synthesis** — Compare and merge multiple presentation versions
> 8. **framework-selection** — Help choosing the right framework first

Accept the user's selection and proceed to Step 4.

### Step 4: Load and Execute Mode

1. Use `file-read` to load the matched reference file from `references/mode-*.md`.
2. Follow the workflow phases defined in the loaded mode file.
3. Reference [frameworks](references/shared/frameworks.md), [quality-gates](references/shared/quality-gates.md), or [marp-visual-design](references/shared/marp-visual-design.md) as directed by the mode file.

## Framework Selection → Mode Handoff

When `framework-selection` mode completes its interrogation:

1. The mode produces a framework recommendation.
2. It generates a YAML handoff block with the recommended mode.
3. Use `user-interact` to offer dispatch to the appropriate generation mode:
   - SCIPAB / SCQA / PSI / Pyramid → `research-deck`
   - Native PowerPoint needed → `pptx`
   - Web-first / interactive → `html-slides`
   - A spoken talk → `speaker-script` (then the `keynote-deck-builder` skill, or `visual-script`)
4. If the user accepts, loop back to **Step 4** with the selected mode.

## Integration Points

- **Upstream:** [source-to-presentation-synthesis](../source-to-presentation-synthesis/SKILL.md) can hand off a `deck_activation` YAML block with a `source_outline` path for research-deck mode
- **Shared References:** [frameworks](references/shared/frameworks.md) · [quality-gates](references/shared/quality-gates.md) · [marp-visual-design](references/shared/marp-visual-design.md)
- **Downstream:** All modes produce output files via `file-write`; Marp and python-pptx modes use `command-exec` for final rendering

## Beyond the Studio — Sibling Skills

This skill routes presentation *generation*. Sibling skills in the suite handle adjacent jobs the studio does **not** — route to them directly:

| If the user wants… | Use this skill (not a studio mode) |
|:---|:---|
| Finished **keynote slides** (minimalist, one-idea-per-slide `.pptx`) from a script | **`keynote-deck-builder`** |
| A **handout / notes** from an existing `.pptx` (→ DOCX or Markdown) | **`convert-pptx-to-handout`** |
| A **summary note** from a folder of exported slide **images** | **`summarize-slide-images-to-note`** |
| An **outline** synthesized from a long source (transcript, PDF, repo) before building | **`source-to-presentation-synthesis`** (hands back via `deck_activation`) |

The spoken-talk path spans skills: `speaker-script` (draft the talk) → the `keynote-deck-builder` skill (slides) **or** `visual-script` / `visual-blueprint` (rundown / storyboard).

## Anti-Patterns

- **Do not** inline shared reference content into mode files — always link to the shared files
- **Do not** bypass the router by loading mode files directly — the router ensures consistent dispatch
- **Do not** use agent-specific tool names — describe capabilities generically (read, write, search, run-command)
