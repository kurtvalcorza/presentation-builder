# Keynote Deck Builder

Turn a talk script into a minimalist, presenter-driven slide deck — **one idea per slide**,
big auto-sized type, heavy negative space, a dark or light theme, optional abstract vector
motifs (never stock photos), and speaker notes baked into every slide. Built for
conference-stage / keynote talks where the speaker carries the detail and the slide is a
single beat the room reads at a glance.

A sibling to [research-deck-builder](https://github.com/kurtvalcorza/research-deck-builder) —
same *JSON-is-the-source-of-truth* philosophy, a different visual language (minimal type
instead of dense cards).

> **Naming / trademark note.** This produces what people often call "TED-style" visuals.
> *TED* and *TEDx* are registered trademarks of TED Conferences, LLC; this project is not
> affiliated with, endorsed by, or connected to TED. "TED" is intentionally kept out of the
> project name and outputs — please keep it that way in forks and client work.

---

## What it does

- **Explodes** a talk into one idea per slide (a ~12-minute talk → ~25–40 slides).
- **Eight slide types** — title, statement, one-word, question, step, pipeline, triad, close.
- **Three themes** — `navy` (dark blue, motifs on), `black` (near-black, pure type),
  `light` (white, high-contrast) — switchable with an env var, no re-layout.
- **Conceptual vector motifs** — constellations, ripples, a road, a spark, etc., chosen to
  *mean* something and kept quiet behind the type. No photos, no icon fonts.
- **Speaker notes** baked into the `.pptx` for every slide.
- **QA gates** — a structural check (notes present, slide count, no icon-font artifacts) and a
  render-to-images visual pass.

## Folder contents

```
keynote-deck-builder/
├── SKILL.md                     # full method: explode → theme → build → QA + golden rules
├── README.md                    # this file
├── SLIDE_TYPES.md               # the 8 slide types + accents + motif catalog (read in Phase 0)
├── package.json                 # pptxgenjs dependency
├── requirements.txt             # python-pptx (for the verifier)
├── references/
│   ├── outline_template.json    # annotated schema with every slide type
│   └── sample_outline.json      # a short runnable worked example
└── scripts/
    ├── build_keynote.js         # the renderer — THEME + MOTIFS env vars
    ├── verify_keynote.py        # structural QA gate
    └── render_check.sh          # render per-slide JPGs for the visual pass
```

## Setup

```bash
npm install                      # pptxgenjs (from package.json)
pip install -r requirements.txt  # python-pptx (add --break-system-packages on managed envs)
# The visual render step also needs LibreOffice (soffice) + poppler (pdftoppm).
# On Windows: scoop/choco install, or use WSL — or skip rendering and run verify_keynote.py only.
```

## Quick start

```bash
# Build the included sample in each theme
THEME=navy  node scripts/build_keynote.js references/sample_outline.json sample_navy.pptx
THEME=black node scripts/build_keynote.js references/sample_outline.json sample_black.pptx
THEME=light node scripts/build_keynote.js references/sample_outline.json sample_light.pptx

# QA: structural gate, then render to images and look at every slide
python3 scripts/verify_keynote.py --deck sample_navy.pptx --expect 7
./scripts/render_check.sh sample_navy.pptx ./_review
```

> **Windows (PowerShell):** set the env var on its own line before the command — e.g.
> `$env:THEME='navy'` then the `node …` line — and use `python` if that's your launcher. Or run
> everything under Git Bash / WSL, where the one-line `THEME=navy node …` form works as written.

The renderer takes `outline.json [script.json] out.pptx`. Notes can live inline per slide in
the outline (preferred) or in a separate `{"1":"...","2":"..."}` script file. Environment
vars: `THEME=navy|black|light` (default `navy`), `MOTIFS=on|off` (default on for `navy`, off
for `black`/`light`).

## Workflow (full detail in [SKILL.md](SKILL.md))

1. **Explode** — read the script, break the spine into the smallest honest beats, author
   `outline.json` (one slide object per idea). Get the slide list approved before building.
2. **Theme** — pick `navy` / `black` / `light` for the room and mood.
3. **Build** — run `build_keynote.js`.
4. **QA** — `verify_keynote.py`, then `render_check.sh` and inspect every slide for overflow,
   over-shrunk lines, and motif/text collisions. Fix in the JSON, rebuild.

## Themes

| Theme | Look | Reach for it when |
|---|---|---|
| `navy` | dark blue, motifs on | brand-continuous, atmospheric, dim hall |
| `black` | near-pure black, motifs off | maximum drama, pure typography |
| `light` | white, near-black ink | bright room / weak projector / LED wall |

## Slide types & motifs

Eight types (TITLE, STATEMENT, WORD, QUESTION, STEP, PIPELINE, TRIAD, CLOSE), six accent
colors, and ten motifs — each documented with its intended meaning in
[SLIDE_TYPES.md](SLIDE_TYPES.md). The outline schema for every type is in
[references/outline_template.json](references/outline_template.json).

## When to use something else

This skill is for **spoken talks** where the slide is a single beat. For information-dense,
cited research or training decks — matrices, stat callouts, inline citations — use
[research-deck-builder](https://github.com/kurtvalcorza/research-deck-builder) instead.

## License

[MIT](LICENSE) © 2026 Kurt Valcorza. Provided as-is; not affiliated with or endorsed by TED
Conferences, LLC.
