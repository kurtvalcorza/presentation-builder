# Mode: Visual Blueprint

> Produces a production-ready visual blueprint or keynote storyboard from a finalized speech, keynote, or speaker script. This mode creates section-by-section `On Screen | Script` cue tables with visual direction, asset status, timing, and open production issues. Use it when the expected output looks like a storyboard, launch keynote production document, or one-shot visual plan rather than a clean speaker rundown.

---

## When to Use

- Creating a visual blueprint from a speech or keynote script
- Creating a keynote storyboard for a launch, policy speech, or institutional presentation
- Producing an `On Screen | Script` document for slide, video, or AV production teams
- Turning a speech into a production artifact with visual references, asset needs, and source checks
- **Trigger phrases:** "visual blueprint", "visual rundown", "keynote storyboard", "storyboard", "deck production blueprint", "On Screen | Script"

**Do NOT use when:**
- User wants a clean two-column producer rundown with no asset register or storyboard detail; use [Visual Script Mode](mode-visual-script.md)
- User wants actual slides, PPTX, Marp, or HTML output; use [PPTX Mode](mode-pptx.md), [Research Deck Mode](mode-research-deck.md), or [HTML Slides Mode](mode-html-slides.md)
- User wants to compare or merge multiple versions; use [Visual Synthesis Mode](mode-visual-synthesis.md)
- No finalized script exists yet; write or revise the script first

---

## Required Capabilities

- `file-read` - Read the source script, reference materials, existing decks, or asset lists
- `file-write` - Generate the visual blueprint and supporting registers
- `file-edit` - Revise the blueprint after user or production-team feedback
- `file-search` - Locate nearby source assets when the user points to a project folder
- `content-search` - Verify whether claims, project names, or asset references are grounded in provided materials
- `user-interact` - Resolve artifact type, asset policy, and unresolved production decisions

---

## Required Inputs

- A drafted speech, talk, keynote, or speaker-notes script — or a **built deck** (`presentation.md` + speaker notes), from which the blueprint is derived

## Optional Inputs

| Input | Default | Options |
|:---|:---|:---|
| Target talk length | Inferred from script | 5 / 10 / 18 / 30+ minutes |
| Delivery context | Live | Live / Recorded / Hybrid |
| Visual density | Moderate | Sparse / Moderate / Dense |
| Asset policy | Evidence-first | Provided assets only / Evidence-first / User-approved generative placeholders |
| Output format | Markdown | Markdown / DOCX if requested / Source-folder note if requested |
| Speaking order context | None | Who speaks before/after |

---

## Artifact Selection Gate

Before generating, classify the requested artifact:

| User appears to need | Route |
|:---|:---|
| Clean full-text speaker handoff with minimal visual cues | [visual-script](mode-visual-script.md) |
| Section-by-section `On Screen \| Script` tables with visual direction, asset needs, and production status | `visual-blueprint` |
| Actual slide or deck file | [pptx](mode-pptx.md), [research-deck](mode-research-deck.md), or [html-slides](mode-html-slides.md) |

If the user says "visual rundown" but gives an example with `On Screen | Script`, embedded visuals, slide/image ideas, or asset notes, choose `visual-blueprint`.

Ask only when the artifact type cannot be inferred from the request or provided example.

---

## Core Principles

### 1. Script Preservation

The `Script` column contains the complete spoken text for that cue. Do not summarize, paraphrase, or rewrite the speaker unless the user explicitly asks for script editing.

### 2. No Blank Visual Cells

Every non-header row must have an `On Screen` entry. If the same visual continues, write `[HOLD: continue previous visual]` and add any timing or emphasis cue.

### 3. Evidence-First Visuals

Institutional visual choices must be grounded in real assets, real programs, real users, real systems, or clearly labeled placeholders. Do not present speculative scenes as if they exist.

### 4. Asset Status Is Mandatory

Every visual that requires a source asset must be traceable through the Asset Register with one of these statuses:

`AVAILABLE`, `NEEDS SOURCE`, `NEEDS CLEARANCE`, `PLACEHOLDER`, `USER-APPROVED AI`, `DO NOT USE`

### 5. Blueprint, Not Design Spec

Describe what the audience should see and why it supports the line. Do not prescribe fonts, exact colors, layout measurements, camera rigs, or lighting setups unless the user explicitly asks for technical production notes.

---

## Workflow Phases

### Phase 1: Source Read

1. Read the full script without interruption.
2. Identify sections, speaker transitions, and natural cue breaks.
3. Extract claims that require data/source grounding.
4. Inventory any provided or discoverable assets.

### Phase 2: Visual Mapping

1. Map each section to a small set of production cues.
2. Prefer holds and reused visuals over unnecessary visual churn.
3. Mark missing, uncertain, or risky visuals immediately in the cue and Asset Register.
4. Use real project/program names exactly as provided in source materials.

### Phase 3: Cue Table Construction

Each section uses exactly two columns:

```markdown
## SECTION NAME

| On Screen | Script |
|---|---|
| Title card: **"Section Name"**. 2s hold. [ASSET: title-card; STATUS: PLACEHOLDER] | *---* |
| [Visual direction + production cue + asset/status reference] | Full spoken text for this cue. |
| [HOLD: continue previous visual; bring in overlay **"Exact text"** as speaker lands on phrase.] | Full spoken text for this cue. |
```

**On Screen column:**
- Describe the visible audience-facing moment.
- Include hold/transition/emphasis cues inline.
- Include exact on-screen text in bold.
- Include asset IDs or status tags where useful.
- Use `[HOLD: continue previous visual]` instead of leaving the cell blank.
- Use `[VERIFY SOURCE: claim/source]` when a data point or visual source needs checking.

**Script column:**
- Preserve complete spoken text.
- Use `*---*` only for silent title cards or deliberate visual holds.
- Keep quotation marks and institutional phrasing from the source unless asked to revise.

### Phase 4: Supporting Registers

Generate these sections after the cue tables:

1. **Timing Table** - section durations and cumulative runtime.
2. **Asset Register** - all required visuals, images, logos, screenshots, charts, diagrams, and footage.
3. **Open Issues** - missing sources, unclear claims, unavailable assets, policy-sensitive visuals, and decisions needed from the user.

---

## Output Contract

The output must include these sections in order:

1. **Title Block** - event/title, speaker, venue/date if known.
2. **Visual Strategy** - 3-5 bullets describing visual density, pacing, and evidence posture.
3. **Cue Tables** - one `On Screen | Script` table per section.
4. **Timing Table** - approximate duration per section and cumulative runtime.
5. **Asset Register** - all visuals with source/status.
6. **Open Issues** - unresolved production or evidence questions.

### Asset Register Format

```markdown
| Asset ID | Cue/Section | Description | Source/Owner | Status | Notes |
|---|---|---|---|---|---|
| A01 | Opening | Headquarters exterior | Client media archive | NEEDS SOURCE | Replace generic exterior if no official footage is available. |
```

### Output Guarantees

- Uses `On Screen | Script`, not `On Screen | Speaker Says`.
- Preserves full script text cue by cue.
- Contains no blank `On Screen` cells.
- Marks every needed asset with a status.
- Flags unsupported claims or visuals instead of inventing sources.
- Provides a production team with enough detail to build slides or storyboard assets without confusing the blueprint for a finished deck.

---

## Validation Checklist

Before finalizing:

- [ ] Every cue table has exactly two columns: `On Screen` and `Script`.
- [ ] No non-header `On Screen` cell is blank.
- [ ] Every data visual or metric has a source, or an explicit `[VERIFY SOURCE]` note.
- [ ] Every required image, logo, chart, diagram, screenshot, or footage item appears in the Asset Register.
- [ ] No generative or speculative visual is included unless marked `USER-APPROVED AI`.
- [ ] Timing Table, Asset Register, and Open Issues sections are present.
- [ ] The output does not claim to be an actual slide deck unless the user requested deck generation.

---

## Integration Points

- **Router:** [Presentation Studio](../SKILL.md) dispatches here for visual blueprint, visual rundown, keynote storyboard, and `On Screen | Script` requests.
- **Related mode:** [Visual Script Mode](mode-visual-script.md) for clean producer rundowns without storyboard/asset-register detail.
- **Related mode:** [PPTX Mode](mode-pptx.md) for converting an approved blueprint into a PowerPoint file.
- **Related mode:** [HTML Slides Mode](mode-html-slides.md) for converting an approved blueprint into a web presentation.
- **Related mode:** [Visual Synthesis Mode](mode-visual-synthesis.md) for comparing multiple blueprint or rundown versions.
