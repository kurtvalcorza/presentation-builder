# Slide Types & Motifs

The per-slide vocabulary for Keynote Deck Builder. Each slide in `outline.json` names a
`type` (the layout) and optionally an `accent` color and a `motif` (an abstract vector
accent). Read this during Phase 0 when assigning a type to each idea. The renderer that
implements all of this is `scripts/build_keynote.js`.

**Canvas:** 13.333 × 7.5 in (16:9). Type auto-sizes to its length, so keep on-slide text
short — a slide is a beat the room reads at a glance, not a paragraph. Detail lives in the
speaker notes, not on the slide.

---

## Part A — Slide types

Every type takes optional `accent` (default BLUE), `motif`, and `notes`.

### TITLE — open / section divider
Eyebrow (letter-spaced accent), an accent vertical bar, a large title, optional `sub`.
Fields: `eyebrow`, `text`, `sub`. Use for slide 1 and major section turns.

### STATEMENT — the workhorse
One to three centered lines, big and bold, vertically centered with heavy space.
Fields: `text` (string or array of lines), optional `kicker` (small accent label above),
`accentLineIdx` (color one line in the accent), `big` (true → larger cap), `sub`.
Use for a claim, a contrast, a turn. A two-line "not this / but this" is the most common.

### WORD — one hero word
A single huge word or 1–2 short lines. Fields: `text`, optional `kicker`, `sub`.
Use for a hard beat: a name, a sector, a one-word answer ("Logistics.", "Yes.").

### QUESTION — a posed question
A large centered question under a light "?" mark. Field: `text`.
Use to open a loop the talk will close. Pairs well with `converge`.

### STEP — one step of a sequence
A big faint backdrop number with a kicker, a bold step line, and an optional `sub`.
Fields: `num`, `text`, optional `kicker` (default "STEP N"), `sub`.
Full-explode a numbered pattern into one STEP slide per step.

### PIPELINE — a left-to-right sequence on ONE slide
A row of nodes joined by arrows, final node highlighted, optional per-node glosses.
Fields: `nodes` (array), optional `text` (a line above), `kicker`, `subs` (array aligned to nodes).
Use when a sequence is a single idea you don't want to explode (e.g. a 5-phase pipeline).

### TRIAD — three (or more) parallel points
Stacked rows, each with an accent bar. Fields: `items` (array of `{text, accent}`), `kicker`.
Use for three aims / three rules / three audiences. Keep each line to ~one clause.

### CLOSE — the closing beat
A centered closing line with optional kicker and a `sub` (e.g. a thank-you).
Fields: `text`, optional `kicker`, `sub`.

---

## Part B — Accent colors

`BLUE` (primary), `GREEN`, `GOLD`, `PINK`, `VIOLET`, `SOFT` (a soft blue).
Use color to carry meaning across the deck — e.g. give each recurring theme/sector its own
accent and reuse it every time that theme appears, so the room learns the color.

## Part C — Motifs (abstract vector accents, never photos)

Choose a motif that *means* something for the slide; keep it as quiet texture behind the
type. Motifs are on by default for the `navy` theme and off for `black`/`light` (toggle with
the `MOTIFS=on|off` env var).

| Motif | Shape | Use it for |
|---|---|---|
| `orbit` | concentric arcs + dot | a title; "direction", a center of gravity |
| `ripple` | expanding rings | demand growing, reach, a question spreading |
| `nodes` | constellation of linked dots | a network, a backbone, federation, "shared" |
| `road` | converging perspective lines | a method, a path, "the road" |
| `branch` | one point splitting to many | a pattern that repeats, one model → many sectors |
| `spark` | radiating rays from a point | a single problem, an ignition, a named system |
| `converge` | many lines into one point | coordination, focus, a posed question |
| `grid` | dot matrix | infrastructure, structure, "three things" |
| `arc` | a large sweeping arc | a close, an horizon |
| `none` | (nothing) | when the words should stand entirely alone |

**Restraint:** motifs sit at the edges and at low opacity so they never fight the text. If a
slide's line is long, prefer `none` or an edge motif (`orbit`, `grid`, `arc`) over a
center-weighted one (`ripple`, `converge`, `spark`).
