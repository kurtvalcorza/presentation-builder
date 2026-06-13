---
name: keynote-deck-builder
description: >
  Turns a talk script (or an existing dense deck) into a minimalist, presenter-driven
  keynote deck: one idea per slide, big auto-sized type, heavy negative space, a dark or
  light theme, optional abstract vector motifs (never stock photos), and ready-to-read
  speaker notes baked into every slide. Use this whenever someone wants conference-stage /
  keynote / "TED-style" talk visuals, wants to strip a wordy slide deck down to one idea per
  slide, asks to "explode" a deck into a presenter-driven sequence, wants big-type minimalist
  slides, or needs speaker-paced visuals built from a spoken script — even if they don't name
  this skill. Boundary: for information-dense, cited research/training decks (matrices, stat
  callouts, citations) use research-deck-builder instead; this skill is for spoken talks where
  the speaker carries the detail and the slide is a single beat.
---

# Keynote Deck Builder

Converts a talk script into a finished, presenter-driven deck (`.pptx`) in the keynote /
conference-stage idiom: **one idea per slide**, large type, lots of negative space, the
speaker carrying the detail. A sibling to `research-deck-builder` — same JSON-as-source-of-
truth philosophy, a different visual language (minimal type + abstract motifs instead of
dense cards).

**Naming note:** this produces "TED-style" visuals, but TED® is a trademark of TED
Conferences, LLC — keep "TED" out of file names, the skill name, and anything shipped to a
client. Describe the output as keynote / conference-stage / talk visuals.

## Core principle

The slide is **punctuation behind the spoken line**, not a document. If a sentence belongs in
the speaker's mouth, it goes in the notes, not on the slide. A slide earns its place by giving
the room one thing to feel at a glance: a claim, a contrast, a question, a name, a number-free
beat. Everything below serves that.

## Environment

Phases 1–2 need Node (`pptxgenjs`). Phase 3's visual render needs LibreOffice (`soffice`) and
poppler (`pdftoppm`); these are usually preinstalled in a POSIX sandbox. Install once in the
working dir:

```bash
npm install pptxgenjs
```

Always work on a copy in a scratch/working dir; deliver finals to the user's folder.

---

## Golden rules (learned building these)

- **One idea per slide.** When in doubt, split. A four-step pattern becomes four `STEP`
  slides; three aims becomes one `TRIAD`. The exception: a sequence you want kept whole is one
  `PIPELINE` slide. Treat a tight parallel triad as a single idea, not three.
- **The JSON outline is the source of truth.** Author content there; the renderer is
  deterministic. Re-theming or re-ordering is a JSON/flag change, never a per-slide redraw.
- **Detail lives in the notes.** Every slide gets `notes` carrying the spoken line(s) for that
  beat. Distribute the script across slides so the talk still runs end to end. `verify_keynote.py`
  hard-fails any slide with no notes.
- **Keep on-slide text short.** Type auto-sizes to length, so a long line just shrinks — which
  is the tell that it should have been split or moved to the notes. Aim for ≤ ~8 words a line.
- **Motifs are meaning, not decoration, and never photos.** Pick a motif that matches the
  idea (network=`nodes`, method=`road`, coordination=`converge`); keep them quiet and edge-
  weighted so they never fight the text. Vector only — fonts/photos break or look generic.
- **Color carries memory.** Give a recurring theme its own accent and reuse it every time, so
  the audience learns the color.
- **Honor the source's discipline.** If the script withholds numbers, named products, or
  finished-product claims (common in in-development work), do not reintroduce them on slides.

---

## Pipeline

### Phase 0 — Intake & explode (the content plan)

Goal: a reviewed `outline.json` (see `references/outline_template.json`) — the authoritative,
one-idea-per-slide plan.

1. **Read the source in full** — the talk script (preferred), talking points, or an existing
   dense deck to convert. Note the spine (the ordered beats of the argument) and any content
   discipline (no numbers / no product shots / tense rules).
2. **Explode the spine into beats.** Walk the script and break each move into the smallest
   honest unit: a setup line, a question, a turn, a name, a step. A ~12-minute talk usually
   lands at **~25–40 slides** in this idiom (slides advance fast; that's the point).
3. **Assign a `type` to each beat** from `SLIDE_TYPES.md` (TITLE / STATEMENT / WORD / QUESTION
   / STEP / PIPELINE / TRIAD / CLOSE). Open with TITLE, close with CLOSE. Vary types so the
   cadence never flatlines; reserve PIPELINE/TRIAD for genuinely structural beats.
4. **Assign `accent` and `motif`** per slide (see `SLIDE_TYPES.md` Parts B/C). Use color to
   tag recurring themes; pick motifs that mean something; default to `none` when the words
   should stand alone.
5. **Write `notes` per slide** — the spoken line(s) for that beat, in the speaker's voice.
   Together they should read as the whole talk.
6. **Checkpoint: present the slide list** (n · type · the on-slide line · accent/motif) and get
   approval before building. Outline changes are cheap; re-reading a 40-slide deck is not.

### Phase 1 — Pick the theme

| Theme | Look | Reach for it when |
|---|---|---|
| `navy` (default) | dark blue, motifs on | brand-continuous, atmospheric, dim hall |
| `black` | near-pure black, motifs off | maximum drama, pure typography |
| `light` | white, near-black ink, motifs off | bright room / weak projector / LED wall |

Motifs are on by default for `navy`, off for `black`/`light`; override with `MOTIFS=on|off`.
True black + bright white can shimmer ("halate") on LED walls — drop the ink to a soft white
or use `light` there.

### Phase 2 — Build

```bash
THEME=navy node scripts/build_keynote.js outline.json out.pptx
# or with an external notes file: node scripts/build_keynote.js outline.json script.json out.pptx
```

`outline.json` is source of truth; `notes` can live inline per slide (preferred) or in a
separate `{"1":"...","2":"..."}` script file. Notes are baked into PowerPoint speaker notes.

### Phase 3 — QA (required)

Two gates, then look at every slide.

1. **Structural gate** — `verify_keynote.py`:

   ```bash
   python3 scripts/verify_keynote.py --deck out.pptx --expect <N>
   ```

   HARD-fails (non-zero exit, so it gates the build): a slide with no notes; slide count ≠
   `--expect`; leftover icon-font text. The notes word-band (default 6–80) is a SOFT check —
   short beats are fine, so a band warning just flags a slide whose notes look too thin or too
   heavy to be one spoken beat. Don't pass `--strict` here unless you want soft warnings to
   fail the run.
2. **Visual render** — `render_check.sh out.pptx <fresh-dir>` writes per-slide JPGs. Inspect
   EVERY slide for: text overflow/wrap, a line that auto-shrank too small (split it), motif
   colliding with text, low contrast, uneven spacing. Fix in the JSON, rebuild, re-render only
   what changed. Stop after one fix-and-verify cycle unless a new defect appears.

Then present the deck with a short summary and note any deliberate departures (e.g. numbers
withheld by the source's discipline).

---

## Repair / convert an existing dense deck

To convert a wordy deck into this idiom: treat the old deck + its script as Phase 0 inputs,
extract the spine, and author a fresh `outline.json` — do not try to thin slides in place. The
whole value is re-deciding what each beat is. Then Phases 1–3 as above.

## Naming & deliverables

- Source: a talk script (`.md`/`.txt`) or an existing `.pptx`.
- Plan: `outline.json` (one per talk; keep in a scratch/working dir).
- Final: `Talk_Name_KEYNOTE.pptx` (or `_KEYNOTE_BLACK` / `_KEYNOTE_LIGHT` per theme).

## Companion files

- `SLIDE_TYPES.md` — the slide-type vocabulary + accent + motif catalog. **Read during Phase 0.**
- `scripts/build_keynote.js` — the renderer. `THEME=navy|black|light`, `MOTIFS=on|off`;
  args `outline.json [script.json] out.pptx`.
- `scripts/verify_keynote.py` — structural gate (notes present, slide count, no icon fonts).
- `scripts/render_check.sh` — render per-slide JPGs for the visual pass (fresh dir each run).
- `references/outline_template.json` — annotated schema with every slide type.
- `references/sample_outline.json` — a short worked example (`THEME=navy node scripts/build_keynote.js references/sample_outline.json sample.pptx`).
