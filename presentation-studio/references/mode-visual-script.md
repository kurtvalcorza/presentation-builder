# Mode: Visual Script

> Transforms speeches, keynotes, and presentation scripts into clean producer rundowns using two-column tables (On Screen | Speaker Says) that guide production teams on what audiences should see, synced with full narration text.

---

## When to Use

- Converting a speech or keynote into a clean producer rundown
- Creating a production script from a finalized presentation script
- Preparing a speaker/producer handoff where the full spoken text remains readable
- Briefing a production team on what audiences should see during a talk without creating a storyboard or asset register
- **Trigger phrases:** "visual script", "producer rundown", "production script"

**Do NOT use when:**
- User wants an `On Screen | Script` visual blueprint, keynote storyboard, image-heavy plan, asset register, or the prior one-shot visual blueprint format (use [Visual Blueprint Mode](mode-visual-blueprint.md))
- User wants actual slide design (use [Research Deck Mode](mode-research-deck.md) or [HTML Slides Mode](mode-html-slides.md))
- User needs presentation framework selection (use [Framework Selection Mode](mode-framework.md))
- User wants to generate PPTX/Marp output directly (use [PPTX Mode](mode-pptx.md) or [Research Deck Mode](mode-research-deck.md))
- No finalized script exists yet — write the script first

---

## Dependencies

### Required Capabilities

- `file-read` — Read the source speech/script and any reference materials
- `file-write` — Generate the producer rundown, timing table, and simple asset checklist
- `user-interact` — Clarify delivery context, visual intensity, and speaking-order context

### Required Inputs

- A drafted **speech, talk, or presentation script** in prose or speaker-notes form — or a **built deck** (`presentation.md` + speaker notes) or a `speaker-script` output, from which the rundown is derived

### Optional Inputs

| Input | Default | Options |
|:---|:---|:---|
| Target talk length | Inferred from script | 5 / 10 / 18 / 30+ minutes |
| Delivery context | Live | Live / Recorded / Hybrid |
| Visual intensity | Moderate | Minimal / Moderate / Cinematic |
| Speaking order context | None | Who speaks before/after |

---

## Core Principles (Non-Negotiable)

These five principles govern every visual script produced by this mode. They are not optional.

### 1. Full-Text Rule
> The Speaker Says column always contains the complete spoken text.

Never reduce narration to cues, summaries, or bullet points. The production team and the speaker must be able to read the full speech directly from the rundown.

### 2. Cues-Inline Rule
> Production cues live in the On Screen column.

Embed hold times, transition triggers, emphasis notes, and animation cues directly in the visual description. Do not create a separate Notes column.

### 3. Show-Don't-Explain Rule
> If narration explains what a visual is doing, the visual is wrong.

Visuals should depict workflows, show real users, and demonstrate decision points — not illustrate what the speaker is already saying.

### 4. Restraint Rule
> Not every sentence needs a visual change. Blank screens and holds are powerful.

Default to minimal visuals unless emphasis demands otherwise.

### 5. Evidence-First Rule
> Every visual should show something that exists now.

For institutional and executive presentations, visuals must answer: Who is using this? Where is it deployed? What decision does it support? No speculative renders or concept art for unbuilt systems.

---

## Artifact Selection Gate

Before generating, classify the requested artifact:

| User appears to need | Route |
|:---|:---|
| Clean full-text speaker handoff with minimal visual cues | `visual-script` |
| Section-by-section `On Screen \| Script` tables with visual direction, asset needs, and production status | [visual-blueprint](mode-visual-blueprint.md) |
| Actual slide or deck file | [pptx](mode-pptx.md), [research-deck](mode-research-deck.md), or [html-slides](mode-html-slides.md) |

If the user says "visual rundown" but provides or references an example with `On Screen | Script`, embedded visuals, slide/image ideas, or an asset register, route to [Visual Blueprint Mode](mode-visual-blueprint.md) instead of this mode.

---

## Workflow Phases

### Phase 1: Script Analysis

1. Read the full script without interruption
2. Identify the narrative arc (setup → evidence → resolution)
3. Mark natural break points (topic shifts, pauses, emphasis)
4. Note emotional beats (quotes, key claims, calls to action)

---

### Phase 2: Segment Mapping

1. Divide script into segments (typically matching the script's own structure)
2. For each segment, identify 4–12 visual moments
3. Determine which moments need text overlays vs. imagery vs. holds

---

### Phase 3: Table Construction

For each segment, build the two-column table:

1. Start with title card row
2. Map each narration block to a visual
3. Embed production cues in the visual column
4. End with closing beat row

#### Two-Column Table Format

Each segment is rendered as a markdown table with exactly two columns:

```markdown
## SEGMENT NAME — Subtitle (≈duration)

| On Screen (Visual) | Speaker Says |
|---|---|
| Title card: **"Segment Name"** 2s hold. | *—* |
| [Visual description + production cues] | "[Full narration text]" |
| ... | ... |
```

**On Screen (Visual) column:**
- Describes what the audience sees at each moment
- Includes production cues inline: hold times, transition types, animation triggers
- Includes text overlay content in bold: **"Exact text shown on screen"**
- Notes partner logos, source attributions, or emphasis points
- For silent moments: describe the visual + note hold duration

**Speaker Says column:**
- Contains the speaker's **full spoken text** — not summaries, not cues
- Use *—* when the visual plays without narration (title cards, holds)
- Quoted text within narration uses single quotes

**Why two columns, not three:** Production cues belong in the On Screen column, not in a separate Notes column. This keeps the rundown clean and scannable. The production team reads left-to-right: what they see, what they hear.

#### Standard Segment Visual Flow

Each segment should follow this progression:

1. **Title Card** — segment name, 2s hold, no narration (mandatory)
2. **Context** — environment, location, or problem framing
3. **System/Tool** — interface screenshot or demo visual
4. **Human-in-the-Loop** — user, operator, or decision-maker
5. **Key Claim** — text overlay for the segment's strongest line
6. **Closing Beat** — visual pause tying to the presentation's thesis (mandatory)

Not every segment needs all six — but Title Card and Closing Beat are mandatory.

---

### Phase 4: Supporting Artifacts

1. **Production Notes** — visual style, pacing guidance, key camera moments
2. **Timing Table** — segment durations and cumulative runtime
3. **Soundbites** — media-ready quotable lines extracted from narration (when applicable)
4. **Simple Asset Checklist** — visuals, screenshots, logos, charts, or diagrams needed, without storyboard-level status tracking

---

## Visual Intensity Modes

| Mode | Characteristics | Use When |
|:---|:---|:---|
| **Minimal** | Few visual changes, heavy use of blank screens, text-only when needed | Intimate talks, philosophical content, speaker-centric delivery |
| **Moderate** | Balanced visual support, key moments emphasized, breathing room preserved | Most keynotes, conference talks, executive presentations |
| **Cinematic** | Rich visual storytelling, frequent transitions, emotional imagery | Product launches, institutional launches, high-production events |

---

## Visual Language Rules

### Allowed

- Real environments (farms, offices, labs, field sites)
- Real users (operators, researchers, citizens)
- Screen captures of working systems (sanitized)
- Geographic specificity (province, city, municipality)
- Text overlays for key claims, quotes, and anchoring phrases
- Partner logos (briefly visible, not dominant)
- Animated diagrams for architecture/relationships
- Data visualizations with source attribution

### Prohibited

- Speculative renders or concept art for unbuilt systems
- Future-state diagrams presented as current
- Performance claims without sources
- "AI magic" or gratuitous tech effects
- Fonts, colors, or layout specifications (that's the designer's job)

### Text Overlay Policy

On-screen text is allowed and encouraged for:

| Allowed | Example |
|:---|:---|
| Key claims | **"First live AI-based weather forecasting system in Southeast Asia"** |
| Anchor phrases | **"Not a plan. Evidence."** |
| Quotes with attribution | **"The most important thing the platform did was let us act in time." — the project lead** |
| Segment titles | **"Disaster Resilience"** |
| System introductions | "Atlas — the in-house compute platform" |
| Data points synced with narration | Numbers appear as speaker says them |

Prohibited: explanatory paragraphs (competes with narration), unattributed claims (not defensible), strategic language duplicating narration (redundant).

---

## Speaking-Order Awareness

When the speaker follows other speakers (e.g., President → Secretary → Director):

- Opening must acknowledge prior speakers without repeating their content
- Strategic framing covered by earlier speakers is deferred
- The speaker's role shifts to evidence delivery or execution proof
- Note deferred topics in the production document for team awareness

---

## Output Contract

### Files Generated

| Deliverable | Description |
|:---|:---|
| Producer Rundown | Two-column tables (On Screen \| Speaker Says) for every segment |
| Production Notes | Visual style, pacing guidance, key camera moments |
| Timing Table | Segment durations and cumulative runtime |
| Soundbites | Media-ready quotable lines extracted from narration (when applicable) |
| Simple Asset Checklist | Visuals, screenshots, logos, charts, diagrams needed |

### Output Guarantees

- Full narration text preserved — readable as a complete speech
- Production cues embedded inline — no separate notes column
- No blank On Screen cells; use `[HOLD: continue previous visual]` when the same visual remains on screen
- A production team can work independently from the rundown
- Visual restraint preserved throughout

---

## Integration Points

- **Router:** [Presentation Studio](../SKILL.md) — Dispatches to this mode via trigger phrases
- **Related mode:** [Visual Blueprint Mode](mode-visual-blueprint.md) — When the expected output is `On Screen | Script` with storyboard detail, asset statuses, and production-readiness checks
- **Related mode:** [Research Deck Mode](mode-research-deck.md) — When a Visual Script needs to become actual Marp slides
- **Related mode:** [HTML Slides Mode](mode-html-slides.md) — For converting visual scripts into web presentations
- **Related mode:** [Visual Synthesis Mode](mode-visual-synthesis.md) — For comparing multiple visual rundown versions

---

## Anti-Patterns

- **Do not** reduce narration to cues or summaries in the Speaker Says column — always preserve full text
- **Do not** add a third "Notes" column — embed production cues in the On Screen column instead
- **Do not** generate an `On Screen | Script` visual blueprint in this mode — route to [Visual Blueprint Mode](mode-visual-blueprint.md)
- **Do not** prescribe specific design elements (fonts, colors, layouts) — that's the designer's job
- **Do not** create a row for every sentence — group related lines into coherent visual moments
- **Do not** ignore the power of blank screens and holds — restraint is a feature
- **Do not** rewrite the speaker's words — preserve their voice exactly
- **Do not** include technical AV instructions (camera angles, lighting rigs) — this is a producer rundown, not a technical rider
- **Do not** use agent-specific tool names — describe capabilities generically (read, write, search, run-command)
