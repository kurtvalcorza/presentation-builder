# Mode: PPTX

> Generates native PowerPoint (.pptx) files with advanced layouts using `python-pptx` and an optional brand config. Distinct from Marp-based markdown presentations — produces actual .pptx files compatible with institutional workflows.
>
> **Deterministic vs. flexible:** this mode writes a `python-pptx` script at runtime for branded, layout-flexible decks. For a *guaranteed-deterministic* `.pptx` from a shipped, tested renderer, use the `keynote-deck-builder` skill instead; choose this mode when you need brand-config theming and the Stats / Quote / Grid / Title layouts.

---

## When to Use

- Generating native PowerPoint (.pptx) files with branded layouts
- Creating presentations with complex visual layouts (stats, grids, quotes) that are difficult in markdown converters
- Producing .pptx files for institutional or corporate workflows requiring PowerPoint format
- Building slide decks that need consistent brand colors and fonts (via an optional `brand.json`)
- **Trigger phrases:** "generate pptx", "PowerPoint file", "create .pptx"

---

## Dependencies

### Required Capabilities

- `file-read` — Read the brand config (if any) and source content
- `file-write` — Generate Python scripts and output .pptx files
- `user-interact` — Content planning interrogation (title, audience, outline)
- `command-exec` — Execute `pip show`, `pip install`, and the generated Python script

### Required Inputs

- **Python package:** `python-pptx` must be installed (pre-flight check in Step 1)

### Optional Inputs

- **Brand configuration:** a `brand.json` with your colors and fonts (schema + working defaults in [`brand.example.json`](brand.example.json)). If none is provided, the mode falls back to the neutral defaults in that file — it never blocks on a missing brand config.
- **Audience description** — Influences layout density choices
- **Slide outline** — Pre-defined content structure (skips content planning interrogation)

---

## Workflow Phases

### Step 1: Check Environment

Verify dependencies before proceeding.

1. **Check `python-pptx`:** Use `command-exec` to run `pip show python-pptx`.
   - If installed, proceed.
   - If missing, ask permission via `user-interact` to run `pip install python-pptx`.
2. **Look for a brand config (optional):** Use `file-read` to check for a `brand.json` the user points you to. If present, load its colors/fonts. If absent, use the defaults in [`brand.example.json`](brand.example.json) — **do not block on it.**

> **Pre-flight:** `python-pptx` is the only hard requirement. A brand config is optional; without one, the neutral defaults are used.

---

### Step 2: Content Planning

Establish the "Story Arc" with the user via `user-interact`.

Gather:
- **Title:** Presentation title
- **Audience:** "Who is this for?" (influences layout density — executive audiences get sparser slides, technical audiences get denser content)
- **Slides:** Ask for the outline — a list of slide titles and key points per slide

The goal is a clear content map before any layout decisions are made.

---

### Step 3: Layout Selection

Map each slide's content to the most appropriate visual layout. Avoid defaulting to bullet-point slides — use the layout types below to create visual variety.

#### Layout Types

| Layout | Use Case | Example |
|:---|:---|:---|
| **Stats Slide** | Big numbers, key metrics, impact figures | "85% Accuracy", "3× Faster Processing" |
| **Quote Slide** | Testimonials, impact statements, key quotes | Stakeholder endorsements, user feedback |
| **Grid/Cards** | Comparing 3–4 items side by side | "Option A vs Option B", feature comparisons |
| **Title/Section** | Transitions between major sections | Section dividers, agenda markers |

**Layout selection guidance:**
- Open with a **Title/Section** slide
- Use **Stats** slides for quantitative impact
- Use **Quote** slides for qualitative evidence
- Use **Grid/Cards** for comparisons or feature overviews
- Use **Title/Section** slides to separate major topics
- Mix layouts to maintain visual interest — never use the same layout for consecutive slides

---

### Step 4: Python Generation

Generate a Python script that builds the .pptx file programmatically.

**Brand values:** If a `brand.json` is provided, read hex codes and fonts from it; otherwise use the documented defaults in [`brand.example.json`](brand.example.json). Define brand values once at the top of the script rather than scattering literals throughout.

**Script Structure:**

1. **Imports:**
   ```python
   from pptx import Presentation
   from pptx.util import Inches, Pt
   from pptx.dml.color import RGBColor
   ```

2. **Load Brand:** Read the provided `brand.json` (or the defaults from `brand.example.json`) and extract color palette, font families, and sizing rules.

3. **Helper Functions:** Create reusable functions:
   - `create_slide(layout_name)` — Add a new slide with the specified layout
   - `apply_brand_color(shape, color_key)` — Apply brand colors by key (e.g., `'primary'`, `'accent'`)

4. **Content Construction:** Iterate through the outline from Step 2 and build slides using the layout assignments from Step 3.

5. **Save:** Save the output to a `.pptx` file (default: `presentation_output.pptx`).

---

### Step 5: Execute

1. Use `command-exec` to run the generated Python script.
2. Confirm the output file location to the user.
3. Report any errors encountered during execution and offer to fix the script.
4. **Verify the output** — reuse the QA scripts shipped by the `keynote-deck-builder` skill: `scripts/render_check.sh <out>.pptx <dir>` renders per-slide images for a visual pass, and `scripts/verify_keynote.py --deck <out>.pptx --no-require-notes` checks slide count and flags broken icon-font glyphs.

---

## Output Contract

### Files Generated

| Deliverable | Description |
|:---|:---|
| Python script | Generated `.py` file that builds the presentation |
| .pptx file | Native PowerPoint file (default: `presentation_output.pptx`) |

### Output Guarantees

- Brand-consistent colors and fonts (from a provided `brand.json`, or the neutral defaults)
- Visual layout variety (Stats, Quote, Grid/Cards, Title/Section) — not just bullet points
- Clean, readable Python script with comments for future modification

---

## Integration Points

- **Router:** [Presentation Studio](../SKILL.md) — Dispatches to this mode via trigger phrases
- **Brand config:** Optional `brand.json` — schema and defaults in [`brand.example.json`](brand.example.json)
- **Related mode:** [HTML Slides Mode](mode-html-slides.md) — For zero-dependency web presentations (inverse direction)
- **Related mode:** [Research Deck Mode](mode-research-deck.md) — For Marp-based presentations from research folders
- **Related mode:** [Visual Script Mode](mode-visual-script.md) — For converting generated presentations into production rundowns

---

## Anti-Patterns

- **Do not** skip the environment check — a missing `python-pptx` will cause script failures
- **Do not** scatter brand values through the script — read them from `brand.json` (or the defaults) and define them once at the top
- **Do not** block on a missing brand config — it is optional; fall back to the defaults
- **Do not** default to bullet-point layouts for every slide — use the full range of layout types
- **Do not** use agent-specific tool names — describe capabilities generically (read, write, search, run-command)
