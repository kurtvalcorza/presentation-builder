# Presentation Builder

A suite of composable, agent-ready skills for turning source material into finished presentations — research decks, keynote talks, native PowerPoint, HTML slides, producer rundowns, and more. Each skill is self-contained and follows the [Agent Skills](https://agentskills.io) open standard (a `SKILL.md` with YAML frontmatter plus supporting references and scripts).

## Skills in this suite

| Skill | What it does |
|---|---|
| [presentation-studio](presentation-studio/) | Unified, mode-routed hub: synthesize research into Marp decks, generate `.pptx`, build HTML slides, draft a spoken talk script, turn speeches into producer rundowns / storyboards, compare-and-merge versions, or pick a framework. Eight modes behind one entry point. |
| [keynote-deck-builder](keynote-deck-builder/) | Turn a talk script into a minimalist, presenter-driven keynote deck — one idea per slide, big auto-sized type, abstract vector motifs, speaker notes baked in. |
| [source-to-presentation-synthesis](source-to-presentation-synthesis/) | Distill any long-form source (transcript, notebook, PDF, repo, markdown corpus) into an executive-grade slide-deck outline, ready to hand off to `presentation-studio`. |
| [summarize-slide-images-to-note](summarize-slide-images-to-note/) | Read a folder of exported slide images with vision and write one structured note summarizing the deck. |
| [convert-pptx-to-handout](convert-pptx-to-handout/) | Convert a `.pptx` into a DOCX handout or a Markdown note, with speaker notes extracted. |

A sibling project, [research-deck-builder](https://github.com/kurtvalcorza/research-deck-builder), builds dense, citation-grade research/training decks and is maintained in its own repository.

## How they fit together

```
source / notes ─▶ source-to-presentation-synthesis ─▶ outline ─┐
                                                               ├─▶ research-deck / pptx / html-slides ─▶ deck (Marp / PPTX / HTML)
                                                               └─▶ speaker-script ─▶ talk script ─┬─▶ keynote-deck-builder ─▶ keynote .pptx
                                                                                                  └─▶ visual-script / visual-blueprint ─▶ rundown / storyboard

existing .pptx ─▶ convert-pptx-to-handout ─▶ handout (.docx / .md) ┐
slide images   ─▶ summarize-slide-images-to-note ─▶ note (.md)     ┴─▶ can re-ingest as source for research-deck / visual-synthesis
```

Each skill also works entirely on its own.

## Choosing a skill

| You have… and want… | Start here |
|:---|:---|
| Research / notes / a long source → a slide deck | `presentation-studio` → research-deck (or `source-to-presentation-synthesis` first for a reviewable outline) |
| A native PowerPoint file | `presentation-studio` → pptx |
| Web / HTML slides | `presentation-studio` → html-slides |
| Research / notes → a spoken talk script | `presentation-studio` → speaker-script |
| A finished talk script → keynote slides | `keynote-deck-builder` |
| A speech → producer rundown / storyboard | `presentation-studio` → visual-script / visual-blueprint |
| Two or more versions → one merged deck | `presentation-studio` → visual-synthesis |
| An existing `.pptx` → a handout / notes | `convert-pptx-to-handout` |
| A folder of slide images → a summary note | `summarize-slide-images-to-note` |
| Not sure which structure fits | `presentation-studio` → framework-selection |

## Brand & theming

Theming is per-skill today; the canonical color/font tokens live in [`presentation-studio/references/brand.example.json`](presentation-studio/references/brand.example.json) and can be mirrored across the suite:

- **pptx mode** reads a `brand.json` directly (and falls back to those defaults).
- **keynote-deck-builder** uses `THEME=navy|black|light` presets — map your brand palette onto a theme.
- **html-slides** uses the 12 CSS style presets.
- **research-deck** (Marp) uses the CSS in `marp-visual-design.md`.

For a consistent look across outputs, start from `brand.example.json` and carry its palette into whichever path you use.

## Using these skills

These are tool-agnostic Agent Skills. Drop a skill's folder into your agent's skills directory (e.g. `.agent/skills/`, or a tool-specific equivalent such as `.claude/skills/`), and the agent picks it up from the `SKILL.md` frontmatter. Skills that ship scripts note their runtime (Node or Python) and dependencies in their own README.

## License

[MIT](LICENSE) © 2026 Kurt Valcorza. Each skill is provided as-is.

> **Attribution note:** the HTML style presets in `presentation-studio` are adapted from [zarazhangrui/frontend-slides](https://github.com/zarazhangrui/frontend-slides) (MIT © 2025 Zara Zhang), which builds on [zarazhangrui/beautiful-html-templates](https://github.com/zarazhangrui/beautiful-html-templates) (MIT © 2026 Zara Zhang); see [THIRD-PARTY-NOTICES](THIRD-PARTY-NOTICES.md).
