# Mode: Speaker Script

> Drafts a read-ready spoken talk script from research notes, a synthesized outline, or a built deck. This is the **on-ramp to the spoken-talk skills**: hand the script to `keynote-deck-builder` (→ keynote slides), or to `visual-script` / `visual-blueprint` (→ producer rundown / storyboard).

---

## When to Use

- Turning research, notes, or a slide outline into an actual spoken talk
- Producing the script that `keynote-deck-builder` or the rundown modes consume (they all expect a finished script as input)
- **Trigger phrases:** "write a talk", "draft a speech", "speaker script", "turn my notes into a talk", "keynote script"

## Do NOT use when

- A finished script already exists and the user wants **slides** → use the `keynote-deck-builder` skill; or a **rundown/storyboard** → use `visual-script` / `visual-blueprint`
- The user wants **slides directly** from research (no spoken script) → use `research-deck`

---

## Dependencies

### Required Capabilities

- `file-read` — Read the source notes / outline / deck
- `file-write` — Write the script
- `user-interact` — Confirm audience, length, and angle

### Required Inputs

- Source material: research notes, a synthesized outline (e.g. from `source-to-presentation-synthesis`), or a built deck (`presentation.md` + speaker notes)

### Optional Inputs

| Input | Default | Options |
|:---|:---|:---|
| Talk length | 10 min | 5 / 10 / 18 / 30+ minutes |
| Audience | Inferred | one line |
| Framework | SCQA | SCIPAB / SCQA / PSI / Pyramid (see [Frameworks](shared/frameworks.md)) |
| Delivery | Live | Live / Recorded |

---

## Workflow

1. **Establish the spine** — confirm audience, length, and the single idea. Pick a narrative framework from [Frameworks](shared/frameworks.md) (SCQA is the default for talks).
2. **Budget beats to time** — assume ~130–150 spoken words per minute; allocate the beats against the target length.
3. **Draft the script** — write read-ready spoken prose (not bullets), following [Speaker Script Style](shared/speaker-script-style.md): contractions, short sentences, signposting, one idea per paragraph.
4. **Mark structure** — add optional `[section]` / `[beat]` markers so downstream slide and rundown tools can segment the script cleanly.
5. **Review aloud** — check pace against the target runtime; cut anything that doesn't earn its time.

---

## Output

- A single Markdown file: the full spoken script as read-ready prose, with optional section markers and an estimated runtime.

## Handoff (the spoken-talk path)

- **→ `keynote-deck-builder` skill** — turn the script into a minimalist keynote slide deck (`.pptx`).
- **→ [Visual Script Mode](mode-visual-script.md)** — turn it into a two-column producer rundown.
- **→ [Visual Blueprint Mode](mode-visual-blueprint.md)** — turn it into an `On Screen | Script` storyboard.

---

## Integration Points

- **Upstream:** [source-to-presentation-synthesis](../../source-to-presentation-synthesis/SKILL.md) (outline) or `research-deck` output.
- **Style:** [Speaker Script Style](shared/speaker-script-style.md) — the spoken-style standard.
- **Router:** [Presentation Studio](../SKILL.md) — Dispatches to this mode via trigger phrases.

## Anti-Patterns

- **Do not** write slide bullets — this mode produces spoken prose, not slides.
- **Do not** pad to hit a time target — cut instead.
- **Do not** use agent-specific tool names — describe capabilities generically (read, write, search).
