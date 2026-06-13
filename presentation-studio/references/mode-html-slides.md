# Mode: HTML Slides

> Creates zero-dependency, animation-rich HTML presentations with visual style discovery. Helps non-designers discover their aesthetic through visual exploration rather than abstract choices.

---

## When to Use

- Creating zero-dependency, animation-rich HTML presentations that run entirely in the browser
- Converting PowerPoint files (.ppt, .pptx) to web-based HTML presentations
- Enhancing existing HTML presentations with improved styling and animations
- Building distinctive web slide decks with guided visual style discovery
- **Trigger phrases:** "HTML presentation", "web slides", "convert PPT to web"

---

## Dependencies

### Required Capabilities

- `file-read` — Read source content, existing presentations, and PowerPoint extraction output
- `file-write` — Generate HTML presentation files, style preview files, and asset directories
- `file-edit` — Iterative refinement of generated presentations
- `file-search` — Discover source files and assets in target directories
- `user-interact` — Content discovery questions, style mood selection, preview feedback, and customization requests
- `command-exec` — Python `python-pptx` for PPT extraction; Python `Pillow` for image processing (circular crop, resize, padding)

### Required Inputs

- **Mode selection:** New Presentation | PPT Conversion | Existing Presentation Enhancement
- **Content:** Either user-provided content (text, bullet points, images) or a PowerPoint file for conversion

### Optional Inputs

- **Style preset name** — Direct selection bypasses guided discovery (e.g., "Use Bold Signal")
- **Mood preferences** — Up to 2 mood selections for guided style discovery
- **Slide count preference** — Short (5–10), Medium (10–20), Long (20+)
- **Customization requests** — Post-generation tweaks to specific slides

---

## Core Philosophy

1. **Zero Dependencies** — Single HTML files with inline CSS/JS. No npm, no build tools.
2. **Show, Don't Tell** — People don't know what they want until they see it. Generate visual previews, not abstract choices.
3. **Distinctive Design** — Avoid generic "AI slop" aesthetics. Every presentation should feel custom-crafted.
4. **Production Quality** — Code should be well-commented, accessible, and performant.
5. **Viewport Fitting (NON-NEGOTIABLE)** — Every slide MUST fit exactly within the viewport. No scrolling within slides, ever.

---

## Workflow Phases

### Phase 1: Detect Mode

Determine the user's intent and route to the appropriate sub-workflow:

| Mode | Trigger | Next Phase |
|:---|:---|:---|
| **Mode A: New Presentation** | User wants to create slides from scratch | → Phase 2 (Content Discovery) |
| **Mode B: PPT Conversion** | User has a PowerPoint file (.ppt, .pptx) to convert | → PPT Extraction (see [PPT-to-HTML Conversion](#ppt-to-html-conversion-sub-mode)) |
| **Mode C: Enhancement** | User has an existing HTML presentation to improve | Read existing file, understand structure, then enhance |
| **Mode D: Document-to-Slides** | User provides a complete source document (MD, DOCX, text) | → Phase 2D (Document Outline) |

---

### Phase 2D: Document Outline (Mode D only)

When the user provides a complete source document, skip the Phase 2 interrogation. The content already exists — the job is to translate it into a coherent slide structure.

**Step 2D.1: Read and parse the document**

Use `file-read` to ingest the full source document. Identify:
- Top-level structure (sections, headings, narrative arc)
- Data-dense elements: tables, lists, statistics, timelines
- Natural slide breaks (each major section → one or more slides)

**Step 2D.2: Apply narrative arc check**

Before proposing a slide outline, verify the narrative structure is coherent end-to-end. Most institutional documents follow one of these arcs — map the source content to the correct pattern:

| Arc | Structure | Typical Use |
|:---|:---|:---|
| **SCR** | Situation → Complication → Resolution | Reports, AARs, briefings |
| **SCIPAB** | Situation → Complication → Implication → Position → Action → Benefit | Proposals, strategy decks |
| **Problem → Solution** | Problem → Root Cause → Solution → Evidence | Technical presentations |
| **Linear** | Section 1 → Section 2 → … → Conclusion | Tutorials, overviews |

**Critical:** Complication/Problem slides MUST precede the Resolution/Conclusion/Bottom Line slides. If the source document has the conclusion before the complications (common in prose reports), reorder for the presentation. Flag the reorder to the user in Step 2D.3.

**Step 2D.3: Propose slide outline**

Present a proposed outline via `user-interact`:
- Slide number, title, and content type (stat card, table, bullet list, header, accent quote)
- Flag any reorders from the source document order
- Flag any content that exceeds density limits and propose splits
- Options: "Looks good, proceed to style" / "Adjust outline" / "Revert to source order"

Then proceed to Phase 3 (Style Discovery).

---

### Phase 2: Content Discovery (New Presentations)

Before designing, understand the content through structured interrogation.

**Step 2.1: Presentation Context + Images (Single Form)**

Gather ALL context in a single `user-interact` call to minimize round-trips:

1. **Purpose** — What is this presentation for?
   - Pitch deck (selling an idea/product to investors/clients)
   - Teaching/Tutorial (explaining concepts, how-to guides)
   - Conference talk (speaking at an event, tech talk, keynote)
   - Internal presentation (team updates, strategy meetings)

2. **Slide Count** — Approximately how many slides?
   - Short (5–10) — Quick pitch, lightning talk
   - Medium (10–20) — Standard presentation
   - Long (20+) — Deep dive, comprehensive talk

3. **Content Readiness** — Does the user have content ready?
   - All content ready — Just need to design the presentation
   - Rough notes — Need help organizing into slides
   - Topic only — Need help creating the full outline

4. **Images** — Does the user have images to include?
   - No images — Text-only presentation (use CSS-generated visuals instead)
   - User provides a folder path — Scan and evaluate assets

If user has content, ask them to share it (text, bullet points, images, etc.).

**Step 2.2: Image Evaluation (skip if "No images")**

If user selected "No images" → skip entirely. The presentation will use CSS-generated visuals (gradients, shapes, patterns, typography) for visual interest — this is a first-class path.

If user provides an image folder:

1. **Scan the folder** — List all image files (`.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`, `.webp`)
2. **View each image** — Use multimodal capabilities to see what each image contains
3. **Evaluate each image** — For each, assess:
   - What it shows (screenshot, logo, chart, diagram, photo)
   - **Usability:** Clear, relevant, high enough quality? Mark as `USABLE` or `NOT USABLE` (with reason)
   - **Content signal:** What feature or concept does this image represent?
   - Shape (square, landscape, portrait) and dominant colors (important for style compatibility)
4. **Present evaluation + proposed slide outline** — Show which images are usable and which are not, with reasons. Then show the proposed slide outline with image assignments.

**Co-design principle:** Curated images inform the slide outline *before* style selection (Phase 3) and *before* HTML generation (Phase 4). They are co-equal context in the design process, not post-hoc additions:

- 3 usable product screenshots → plan 3 feature slides, each anchored by one screenshot
- 1 usable logo → title slide and/or closing slide
- 1 usable architecture diagram → dedicated "How It Works" slide
- 1 blurry/irrelevant image → excluded, with explanation to user

5. **Confirm outline** via `user-interact` — Options: "Looks good, proceed" / "Adjust images" / "Adjust outline"

---

### Phase 3: Style Discovery (Visual Exploration)

**This is the "show, don't tell" phase.** Most people can't articulate design preferences in words. Instead of asking abstract questions, generate mini-previews and let them react.

#### Selection Paths

**Option A: Guided Discovery (Default)**
1. User answers mood questions
2. Skill generates 3 preview files based on their answers
3. User views previews in browser and picks their favorite
4. Best for users who don't have a specific style in mind

**Option B: Direct Selection**
- If user already knows what they want, they can request a preset by name
- Example: "Use the Bold Signal style" or "I want something like Dark Botanical"
- Skip directly to Phase 4

#### Style Presets

| Preset | Vibe | Best For |
|:---|:---|:---|
| **Bold Signal** | Confident, high-impact | Pitch decks, keynotes |
| **Electric Studio** | Clean, professional | Agency presentations |
| **Creative Voltage** | Energetic, retro-modern | Creative pitches |
| **Dark Botanical** | Elegant, sophisticated | Premium brands |
| **Notebook Tabs** | Editorial, organized | Reports, reviews |
| **Pastel Geometry** | Friendly, approachable | Product overviews |
| **Split Pastel** | Playful, modern | Creative agencies |
| **Vintage Editorial** | Witty, personality-driven | Personal brands |
| **Neon Cyber** | Futuristic, techy | Tech startups |
| **Terminal Green** | Developer-focused | Dev tools, APIs |
| **Swiss Modern** | Minimal, precise | Corporate, data |
| **Paper & Ink** | Literary, thoughtful | Storytelling |

#### Mood-to-Preset Mapping

| Mood | Suggested Presets |
|:---|:---|
| Impressed/Confident | Bold Signal, Electric Studio, Dark Botanical |
| Excited/Energized | Creative Voltage, Neon Cyber, Split Pastel |
| Calm/Focused | Notebook Tabs, Paper & Ink, Swiss Modern |
| Inspired/Moved | Dark Botanical, Vintage Editorial, Pastel Geometry |

#### Step 3.1: Mood Selection (Guided Discovery)

Ask via `user-interact`:
- What feeling should the audience have when viewing your slides?
  - Impressed/Confident — Professional, trustworthy
  - Excited/Energized — Innovative, bold
  - Calm/Focused — Clear, thoughtful, easy to follow
  - Inspired/Moved — Emotional, storytelling, memorable
- User can choose up to 2 moods

#### Step 3.2: Generate Style Previews

Based on mood selection, generate **3 distinct style previews** as mini HTML files. Each preview is a single title slide showing:
- Typography (font choices, heading/body hierarchy)
- Color palette (background, accent, text colors)
- Animation style (how elements enter)
- Overall aesthetic feel

**Output location:** `.agent/outputs/slide-previews/`
```
.agent/outputs/slide-previews/
├── style-a.html   # First style option
├── style-b.html   # Second style option
├── style-c.html   # Third style option
└── assets/        # Any shared assets
```

Each preview file: self-contained (inline CSS/JS), single title slide, animated, ~50–100 lines.

**Logo in previews:** If the user provided images in Step 2.2 and a logo was identified as `USABLE`, embed it (base64) into each of the 3 style previews. This creates a personalized "wow moment" — the user sees their own brand identity styled three different ways, making the choice feel personal rather than abstract. Apply any necessary processing (e.g., circular crop) per-style so each preview shows the logo as it would actually appear in the final presentation. If no logo was provided, generate previews without one.

**Design guardrails — never use these generic patterns:**
- Purple gradients on white backgrounds
- Inter, Roboto, or system fonts
- Standard blue primary colors
- Predictable hero layouts

**Instead, use distinctive choices:**
- Unique font pairings (Clash Display, Satoshi, Cormorant Garamond, DM Sans, etc.)
- Cohesive color themes with personality
- Atmospheric backgrounds (gradients, subtle patterns, depth)
- Signature animation moments

#### Step 3.3: Present Previews and Collect Feedback

Present previews via `user-interact` and ask:
1. Which style resonates most?
2. What do you like about it?
3. Anything you'd change?

Options: Style A, Style B, Style C, or Mix elements from different styles.

---

### Phase 4: Generate Presentation

Generate the full presentation based on content (Phase 2) and style (Phase 3).

If the user provided images, the slide outline already incorporates them as visual anchors from Step 2.2. If not, proceed with text-only content — CSS-generated visuals provide visual interest.

#### Image Processing Pipeline (skip if no images)

If the user chose "No images" in Step 2.1, skip this section entirely and go straight to generating HTML.

If the user provided images, process them before generating HTML:

**Step 4.1: Process Images with Pillow**

For each curated image (those marked `USABLE` in Step 2.2), determine what processing it needs based on the chosen style and what CSS framing will bridge any color gaps between the image and the style's palette.

**Dependency:** Python `Pillow` library. Install if not available:
```bash
pip install Pillow
```

**Common operations:**

| Situation | Operation |
|:---|:---|
| Square logo on a style with rounded aesthetics | Circular crop (create alpha mask) |
| Image > 1MB (slow to load) | Resize with `thumbnail((1200, 1200), Image.LANCZOS)` |
| Screenshot needs breathing room in layout | Add transparent padding |
| Image has wrong aspect ratio for its slide slot | Manual crop |

**Rules:**
- Never repeat the same image on multiple slides (except logos which may bookend title + closing)
- Always add CSS framing (border, glow, shadow) for images whose colors clash with the style's palette
- Save processed images alongside originals with a `_processed` suffix (e.g., `logo_round.png`). Never overwrite the user's original files.

**Step 4.2: Place Images — File Paths vs Base64**

**Default: Use direct file paths.** Since presentations are viewed locally, reference images with relative paths from the HTML file:

```html
<img src="assets/logo_round.png" alt="Logo" class="slide-image logo">
<img src="assets/screenshot.png" alt="Screenshot" class="slide-image screenshot">
```

This keeps the HTML file small and images easy to swap. Only use base64 encoding if the user explicitly requests a fully self-contained single-file presentation.

**Image CSS classes** (adapt border/glow colors to match the chosen style's accent):

```css
/* Base image constraint — CRITICAL for viewport fitting */
.slide-image {
    max-width: 100%;
    max-height: min(50vh, 400px);
    object-fit: contain;
    border-radius: 8px;
}

/* Screenshots: add framing to bridge color gaps with the style */
.slide-image.screenshot {
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

/* Logos: smaller, no frame */
.slide-image.logo {
    max-height: min(30vh, 200px);
}
```

**Adapt framing to the chosen style's accent color.** Examples:
- Dark Botanical (gold accent): `border: 1px solid rgba(197, 160, 89, 0.2); box-shadow: 0 0 20px rgba(197, 160, 89, 0.08);`
- Creative Voltage (neon yellow): `border: 2px solid rgba(212, 255, 0, 0.25); box-shadow: 0 0 20px rgba(212, 255, 0, 0.08);`

**Placement patterns:**
- **Title slide:** Logo centered above or beside the title
- **Feature slides:** Screenshot on one side, text on the other (two-column layout)
- **Full-bleed:** Image as slide background with text overlay (use with caution)
- **Inline:** Image within content flow, centered, with caption below

#### File Structure

Single presentations:
```
presentation.html    # Self-contained presentation
assets/              # Images, if any
```

Multiple presentations:
```
[presentation-name].html
[presentation-name]-assets/
```

#### SlidePresentation JavaScript Controller

Every presentation includes a `SlidePresentation` class as the main controller:

```javascript
class SlidePresentation {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.currentSlide = 0;
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupKeyboardNav();
        this.setupTouchNav();
    }

    setupIntersectionObserver() {
        // Scroll-triggered animations
        // Add .visible class when slides enter viewport (threshold: 0.5)
        // Triggers CSS .reveal animations efficiently
    }

    setupKeyboardNav() {
        // Arrow keys (← →) and Space for navigation
    }

    setupTouchNav() {
        // Touch/swipe support for mobile devices
    }

    nextSlide() { /* Smooth scroll to next slide */ }
    prevSlide() { /* Smooth scroll to previous slide */ }
}
```

**Required navigation features:**
1. Keyboard navigation (arrows, space)
2. Touch/swipe support
3. Mouse wheel navigation
4. Progress bar updates
5. Navigation dots
6. Intersection Observer for scroll-triggered `.visible` class animations

**Optional enhancements** (based on style):
- Custom cursor with trail
- Particle system background (canvas)
- Parallax effects
- 3D tilt on hover
- Magnetic buttons
- Counter animations

#### Code Quality Requirements

**Comments:** Every section must have clear comments explaining what it does, why it exists, and how to modify it.

**Accessibility:**
- Semantic HTML (`<section>`, `<nav>`, `<main>`)
- Keyboard navigation works
- ARIA labels where needed
- Reduced motion support:
```css
@media (prefers-reduced-motion: reduce) {
    .reveal { transition: opacity 0.3s ease; transform: none; }
}
```

---

### Phase 5: Delivery

#### Step 5.1: Post-Generation Self-Check

Before delivering, run this checklist mentally against the generated HTML:

**Narrative arc check:**
- [ ] Complication/Problem slides appear BEFORE the Resolution/Bottom Line/Conclusion slides
- [ ] Section headers (if used) introduce their sections, not follow them
- [ ] The final slides are Next Steps or Closing — not mid-arc content

**HTML structure check:**
- [ ] Every visible content element is inside `.slide-content` or a correctly positioned overlay (e.g., `.bottom-bar`, `.circle-accent`)
- [ ] No orphan `<p>`, `<div>`, or text nodes between the `.slide-content` closing tag and `.bottom-bar`
- [ ] Every `<section>` has exactly one `.slide-content` and one `.bottom-bar`

**Density check:**
- [ ] No table has more than 7 data rows on a single slide
- [ ] No bullet list has more than 6 items
- [ ] All section header slides contain only a heading (no body content)

If any check fails, fix before proceeding to Step 5.2.

#### Step 5.2: Clean Up

Delete `.agent/outputs/slide-previews/` if it exists (temporary preview files).

#### Step 5.3: Provide Summary

Present to user:
- File path for the generated presentation
- Style name used
- Slide count
- Navigation instructions (arrow keys, scroll/swipe, navigation dots)
- Customization hints (`:root` CSS variables for colors, font links, `.reveal` class for animations)

#### Step 5.4: Iterate

Ask if the user wants any adjustments. Apply tweaks to specific slides as requested.

---

## Viewport Fitting Requirements (NON-NEGOTIABLE)

**The Golden Rule:**
```
Each slide = exactly one viewport height (100vh/100dvh)
Content overflows? → Split into multiple slides or reduce content
Never scroll within a slide.
```

### Content Density Limits

| Slide Type | Maximum Content |
|:---|:---|
| Title slide | 1 heading + 1 subtitle + optional tagline |
| Content slide | 1 heading + 4–6 bullet points OR 1 heading + 2 paragraphs |
| Feature grid | 1 heading + 6 cards maximum (2×3 or 3×2 grid) |
| Table slide | 1 heading + table with **max 6–7 data rows** (+ header row) |
| Code slide | 1 heading + 8–10 lines of code maximum |
| Quote slide | 1 quote (max 3 lines) + attribution |
| Image slide | 1 heading + 1 image (max 60vh height) |
| Section header | Heading only (chapter divider for long decks — see Long Deck Structure below) |

**If content exceeds these limits → Split into multiple slides.**

**Tables specifically:** A table with 8+ rows will overflow on most screens. Options: (1) split into two slides ("Part 1 / Part 2"), (2) use a priority view (show top 5–6 rows, add a note "full list in appendix"), or (3) convert to a stat-card grid if data is categorical.

### Required CSS Architecture

Every presentation MUST include mandatory base styles for viewport fitting:

```css
/* VIEWPORT FITTING: MANDATORY BASE STYLES */

/* 1. Lock html/body to viewport */
html, body { height: 100%; overflow-x: hidden; }
html { scroll-snap-type: y mandatory; scroll-behavior: smooth; }

/* 2. Each slide = exact viewport height */
.slide {
    width: 100vw;
    height: 100vh;
    height: 100dvh; /* Dynamic viewport height for mobile browsers */
    overflow: hidden; /* CRITICAL: Prevent ANY overflow */
    scroll-snap-align: start;
    display: flex;
    flex-direction: column;
    position: relative;
}

/* 3. Content container with flex for centering */
.slide-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-height: 100%;
    overflow: hidden; /* Double-protection against overflow */
    padding: var(--slide-padding);
}

/* 4. ALL typography uses clamp() for responsive scaling */
:root {
    --title-size: clamp(1.5rem, 5vw, 4rem);
    --h2-size: clamp(1.25rem, 3.5vw, 2.5rem);
    --h3-size: clamp(1rem, 2.5vw, 1.75rem);
    --body-size: clamp(0.75rem, 1.5vw, 1.125rem);
    --small-size: clamp(0.65rem, 1vw, 0.875rem);
    --slide-padding: clamp(1rem, 4vw, 4rem);
    --content-gap: clamp(0.5rem, 2vw, 2rem);
    --element-gap: clamp(0.25rem, 1vw, 1rem);
}
```

### Overflow Prevention Checklist

Before generating any presentation, verify:
1. ✅ Every `.slide` has `height: 100vh; height: 100dvh; overflow: hidden;`
2. ✅ All font sizes use `clamp(min, preferred, max)`
3. ✅ All spacing uses `clamp()` or viewport units
4. ✅ Content containers have `max-height` constraints
5. ✅ Images have `max-height: min(50vh, 400px)` or similar
6. ✅ Grids use `auto-fit` with `minmax()` for responsive columns
7. ✅ Breakpoints exist for heights: 700px, 600px, 500px
8. ✅ No fixed pixel heights on content elements
9. ✅ Content per slide respects density limits

### When Content Doesn't Fit

**DO:** Split into multiple slides, reduce bullet points (max 5–6), shorten text (1–2 lines per bullet), use smaller code snippets, create "continued" slides.

**DON'T:** Reduce font size below readable limits, remove padding/spacing entirely, allow any scrolling, cram content to fit.

---

## Long Deck Structure (20+ Slides)

When a presentation has 20 or more slides, use **section header slides** to chunk the deck into navigable chapters. This is especially important for reports, AARs, and multi-section briefings.

### Section Header Slide Pattern

A section header slide contains **only a heading** — no body content. It acts as a visual chapter break and gives the audience a moment to reorient.

**HTML pattern:**
```html
<section class="slide slide-dark grid-bg-dark" id="slide-section-N">
  <div class="slide-content" style="justify-content: center; align-items: flex-start;">
    <p class="tag reveal" style="color: rgba(255,255,255,0.4);">Section Label</p>
    <h2 class="reveal reveal-delay-1" style="font-size: var(--title-size);">Section Title</h2>
    <div class="line-accent h reveal reveal-delay-2" style="position: relative; margin-top: var(--element-gap);"></div>
  </div>
  <div class="bottom-bar"><span>Deck Title</span><span>Section N</span></div>
</section>
```

### When to Insert Section Headers

- Every major narrative segment (e.g., each Specific Objective in a program report, each chapter in a technical brief)
- After every 4–6 content slides if no natural chapter break exists
- Before a shift in slide type density (e.g., transitioning from stat cards to tables)

### Section Header + Content Pairing Rule

A section header ALWAYS introduces content that follows it — never content that precedes it. If the source document concludes a section before declaring the next, the header goes at the top of the new section in the slide outline, not at the bottom of the prior section.

---

## PPT-to-HTML Conversion Sub-Mode

When converting PowerPoint files to HTML presentations:

### Step 1: Extract Content

Use `command-exec` with Python `python-pptx` to extract:
- Slide titles and text content
- Images (saved to assets directory)
- Speaker notes
- Slide order and structure

### Step 2: Confirm Content Structure

Present extracted content summary to user via `user-interact`:
- Slide-by-slide breakdown (title, content summary, image count)
- Confirm accuracy before proceeding

### Step 3: Style Selection

Proceed to Phase 3 (Style Discovery) with the extracted content in mind.

### Step 4: Generate HTML

Convert extracted content into the chosen style, preserving:
- All text content
- All images (referenced from assets folder)
- Slide order
- Speaker notes (as HTML comments or separate file)

---

## Style Reference: Effect → Feeling Mapping

Use this guide to match animations to intended feelings:

| Feeling | Animation Characteristics |
|:---|:---|
| **Dramatic / Cinematic** | Slow fade-ins (1–1.5s), large scale transitions (0.9→1), dark backgrounds with spotlight effects, parallax scrolling, full-bleed images |
| **Techy / Futuristic** | Neon glow effects (box-shadow), particle systems (canvas), grid patterns, monospace font accents, glitch/scramble text effects, cyan/magenta/electric blue palette |
| **Playful / Friendly** | Bouncy easing (spring physics), large rounded corners, pastel/bright colors, floating/bobbing animations, hand-drawn/illustrated elements |
| **Professional / Corporate** | Subtle fast animations (200–300ms), clean sans-serif fonts, navy/slate/charcoal backgrounds, precise spacing, minimal decoration, data visualization focus |
| **Calm / Minimal** | Very slow subtle motion, high whitespace, muted color palette, serif typography, generous padding, content-focused |

---

## Output Contract

### Files Generated

| Deliverable | New Presentation | Document-to-Slides | PPT Conversion | Enhancement |
|:---|:---|:---|:---|:---|
| Self-contained HTML file | ✓ | ✓ | ✓ | ✓ |
| Assets directory (if images) | ✓ | ✓ | ✓ | — |
| Processed images (if Pillow pipeline ran) | ✓ | ✓ | ✓ | — |
| Style preview files (3×) | ✓ (guided discovery) | ✓ (guided discovery) | ✓ (guided discovery) | — |
| Post-generation self-check passed | ✓ | ✓ | ✓ | ✓ |

### HTML Architecture Guarantees

- Single HTML file with inline CSS/JS (zero external dependencies except fonts)
- Viewport-fitted slides (100vh/100dvh, no scrolling)
- SlidePresentation JavaScript controller with keyboard, touch, and scroll navigation
- Intersection Observer for scroll-triggered animations
- Responsive typography using `clamp()` throughout
- Reduced motion media query support
- Semantic HTML with accessibility considerations

---

## Integration Points

- **Router:** [Presentation Studio](../SKILL.md) — Dispatches to this mode via trigger phrases
- **Style presets:** [HTML Style Presets](shared/style-presets-html.md) — Full CSS variable blocks, font pairings, and signature elements for all 12 presets
- **Related mode:** [PPTX Mode](mode-pptx.md) — For native PowerPoint generation (inverse direction)
- **Related mode:** [Research Deck Mode](mode-research-deck.md) — For Marp-based presentations from research folders
- **Related mode:** [Visual Script Mode](mode-visual-script.md) — For converting generated presentations into production rundowns

---

## Anti-Patterns

- **Do not** allow scrolling within slides — viewport fitting is non-negotiable
- **Do not** use generic "AI slop" aesthetics — every presentation must feel custom-crafted
- **Do not** use fixed pixel heights on content elements — use `clamp()`, viewport units, or flex
- **Do not** use Inter, Roboto, or system fonts as primary choices — use distinctive font pairings
- **Do not** use purple gradients on white or standard blue primaries — use cohesive color themes with personality
- **Do not** skip the style preview step in guided discovery — show, don't tell
- **Do not** exceed content density limits per slide — split into multiple slides instead
- **Do not** put tables with 8+ rows on a single slide — split into two slides or use a priority view
- **Do not** place visible content outside `.slide-content` — all body content must be inside `.slide-content` or a correctly positioned overlay
- **Do not** mirror source document order blindly when converting a document — check the narrative arc and reorder if Complication/Problem appears after Resolution/Conclusion
- **Do not** skip the post-generation self-check (Step 5.1) — narrative arc, orphan elements, and density must be verified before delivery
- **Do not** put body content on section header slides — headers contain a heading only
- **Do not** use base64 data URIs for images by default — use relative file paths to keep HTML small; only base64 when user explicitly requests a single self-contained file
- **Do not** repeat the same image on multiple slides — except logos which may bookend title + closing
- **Do not** overwrite user's original image files — save processed versions with `_processed` suffix
- **Do not** use agent-specific tool names — describe capabilities generically (read, write, search, run-command)
