# Presentation Studio

> Unified skill for presentation workflows — one entry point, eight modes.

## Purpose

Presentation Studio is a single skill with mode-based routing for presentation workflows. Instead of remembering which tool handles Marp decks vs. PowerPoint vs. HTML slides vs. producer rundowns, you invoke `presentation-studio` and the router detects the right mode from your request — or lets you pick one.

## Available Modes

| Mode | What It Does | Trigger Phrases |
|:---|:---|:---|
| `research-deck` | Synthesize folders of notes/PDFs into framework-appropriate Marp presentations | "build a deck", "create slides from research", "synthesize into presentation" |
| `speaker-script` | Draft a read-ready spoken talk script from research/outline (on-ramp to keynote-deck-builder and the rundown modes) | "write a talk", "draft a speech", "speaker script", "keynote script" |
| `html-slides` | Create zero-dependency, animation-rich HTML presentations with style discovery | "HTML presentation", "web slides", "convert PPT to web" |
| `pptx` | Generate native PowerPoint files with branded layouts using python-pptx | "generate pptx", "PowerPoint file", "create .pptx" |
| `visual-script` | Transform speeches/keynotes into clean producer rundowns | "visual script", "producer rundown", "production script" |
| `visual-blueprint` | Transform speeches/keynotes into `On Screen \| Script` visual blueprints and keynote storyboards | "visual blueprint", "visual rundown", "keynote storyboard", "storyboard" |
| `visual-synthesis` | Compare multiple presentation versions and synthesize the best elements | "compare presentations", "synthesize approaches", "combine versions" |
| `framework-selection` | Guided interrogation to choose the right presentation framework | "which framework", "help me choose", "what structure" |

You can also pass a `deck_activation` YAML block and the router dispatches directly based on the `mode` field.

## Quick-Start Examples

### Research Deck

> "Build a deck from my notes in `research/my-project/`"

The router activates `research-deck` mode, which walks through Discovery → Synthesis → Visual Extraction → Interrogation → Drafting → Production. Supports SCIPAB, SCQA, PSI, and Pyramid frameworks with Strategic, Quick, and Recording sub-modes.

### Speaker Script

> "Turn these notes into a 10-minute talk"

The router activates `speaker-script` mode, drafting a read-ready spoken script you can then hand to the `keynote-deck-builder` skill (→ slides) or to `visual-script` / `visual-blueprint` (→ rundown / storyboard).

### HTML Slides

> "Create an HTML presentation for my product launch"

The router activates `html-slides` mode with 12 style presets and a guided discovery workflow. Also supports PPT-to-HTML conversion ("convert my PPT to web slides").

### PowerPoint (PPTX)

> "Generate a PowerPoint file for the quarterly review"

The router activates `pptx` mode, which uses `python-pptx` and your `brand.json` configuration. Supports Stats, Quote, Grid/Cards, and Title/Section layout types.

### Visual Script

> "Turn my keynote speech into a producer rundown"

The router activates `visual-script` mode, producing a clean two-column table (On Screen | Speaker Says) with Minimal, Moderate, or Cinematic visual intensity.

### Visual Blueprint

> "Turn my keynote speech into a visual blueprint"

The router activates `visual-blueprint` mode, producing section-by-section `On Screen | Script` cue tables with visual direction, timing, asset status, and open production issues. Use this for keynote storyboards and the one-shot visual rundown format.

### Visual Synthesis

> "Compare these two presentation versions and combine the best parts"

The router activates `visual-synthesis` mode. Provide 2+ presentation files (markdown, HTML, visual blueprint, or producer rundown) and it produces a comparative analysis plus a synthesized output with explicit attribution and a numbered cue sheet.

### Framework Selection

> "I need to present to executives but I'm not sure which framework to use"

The router activates `framework-selection` mode, which asks four questions (audience, objective, time, technical depth) and recommends a framework. After selection, it offers to hand off directly to the appropriate generation mode.

## Integration Patterns

### Framework Selection → Generation

The `framework-selection` mode acts as a front door when you're unsure which framework fits. After the 4-question interrogation, it recommends a framework and offers to hand off to the appropriate generation mode (`research-deck`, `pptx`, `html-slides`, or `speaker-script` for a spoken talk).

### Sibling skills (beyond the studio)

The studio routes presentation *generation*. For adjacent jobs, reach for a sibling skill directly:

- **`keynote-deck-builder`** — finished minimalist keynote **slides** (`.pptx`) from a script.
- **`convert-pptx-to-handout`** — a **handout / notes** (DOCX or Markdown) from an existing `.pptx`.
- **`summarize-slide-images-to-note`** — a **summary note** from a folder of slide **images**.
- **`source-to-presentation-synthesis`** — an **outline** synthesized from a long source, handed back via `deck_activation`.

### Shared References

All modes share cross-cutting resources via relative links to avoid content duplication:

- [frameworks](references/shared/frameworks.md) — Framework definitions, selection matrices, failure modes
- [quality-gates](references/shared/quality-gates.md) — Phase-transition validation criteria
- [marp-visual-design](references/shared/marp-visual-design.md) — CSS classes and visual cue definitions for Marp
- [speaker-script-style](references/shared/speaker-script-style.md) — Spoken style standard for read-ready speaker scripts and slide notes

## File Structure

```
presentation-studio/
├── SKILL.md                              # Router
├── README.md                             # This file
└── references/
    ├── mode-research-deck.md             # Synthesize notes/PDFs into Marp decks
    ├── mode-speaker-script.md            # Draft a spoken talk script (on-ramp to keynote/rundowns)
    ├── mode-html-slides.md               # Animation-rich HTML presentations
    ├── mode-pptx.md                      # Native PowerPoint via python-pptx
    ├── mode-visual-script.md             # Producer rundowns from speeches
    ├── mode-visual-blueprint.md          # On Screen | Script storyboards
    ├── mode-visual-synthesis.md          # Compare & merge presentation versions
    ├── mode-framework.md                 # Framework selection interrogation
    └── shared/
        ├── frameworks.md                 # Cross-mode framework definitions
        ├── quality-gates.md              # Phase-transition criteria
        ├── marp-visual-design.md         # Marp CSS and visual cues
        ├── speaker-script-style.md       # Spoken style standard
        └── style-presets-html.md         # HTML style presets
```
