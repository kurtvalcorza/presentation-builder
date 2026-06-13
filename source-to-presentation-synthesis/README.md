# Source-to-Presentation Synthesis

## Overview
This skill transforms long-form source material — video transcripts, Jupyter notebooks, PDF manuals, GitHub repositories, or markdown corpora — into highly structured, executive-grade slide deck outlines. It acts as the bridge between raw, unstructured (or differently-structured) source content and visual, framework-driven presentation design.

## What It Does
* Strips noise (filler speech, boilerplate code, copyright pages, lockfiles) and extracts only the conceptual payload.
* Abstracts content into executive frameworks (Pyramid Principle, SCQA, SCIPAB).
* Translates concepts into visual metaphors (flowcharts, comparative tables, spectrums, pipelines).
* Writes punchy, action-oriented slide copy with declarative titles and bottom-line takeaways.
* Outputs a clean markdown outline next to the source, ready to be ingested by the `presentation-studio` skill.

## Supported Sources
| Type | Examples |
| :--- | :--- |
| Video / audio transcript | webinar `.vtt`, lecture `.srt`, podcast transcript |
| Jupyter notebook | `.ipynb` tutorials, exploratory analyses, training material |
| PDF | user manuals, whitepapers, RFCs, conference papers |
| GitHub repo | local clone or accessed via `gh`; README + docs + code surface |
| Markdown corpus | single file or folder of `.md` notes, including Obsidian vaults |

## When to Use This Skill
* Synthesizing a 60-minute technical webinar into a 10-slide executive summary.
* Converting a Jupyter notebook tutorial into a training deck.
* Distilling a vendor user manual into a 5-slide capability briefing.
* Producing an architecture overview deck from a GitHub repo's source + docs.
* Extracting the core argument from a markdown research notes folder.

## When NOT to Use This Skill (Disambiguation)
* **Plain summary** — for a standard text summary or action-item list, not a presentation deck.
* **Raw audio** — transcribe the audio to text *first*, then pipe the transcript into this skill.
* **Study notes** — for personal, chronological study notes rather than a top-down executive deck.
* **`summarize-slide-images-to-note`** — for the *reverse* direction: extracting notes from existing slide images.
* **Knowledge base** — for building a linked knowledge base from sources, not a presentation.
* **`presentation-studio` (research-deck mode)** — to synthesize a folder of notes/PDFs *directly* into a deck. Use this skill first only when you want a reviewable intermediate outline before committing to slides.

## Output
The skill writes a single markdown file:
* **Default location:** next to the source file, in your working directory.
* **Naming:** `YYYY-MM-DD_<source-stem>_outline.md`.
* **Override:** specify an explicit path and the skill will honor it.

The output includes structured frontmatter (`type`, `source`, `source_type`, `slide_count`, `target_mode`, etc.) so the downstream skill can read it without parsing prose.

## Workflow Integration
1. Provide a path or URL to the source (video transcript, notebook, PDF, repo, or markdown).
2. The skill writes a structured outline next to the source.
3. The skill appends a `deck_activation` YAML block to the outline; pass that to `presentation-studio`, which routes on it to generate the final deck.

## Limitations
* Will not transcribe audio — convert audio to text first, then run this skill.
* Sparse-doc repos require the skill to read source code structure, which costs more tokens than a doc-heavy repo.
* Promotional / marketing sources yield thin decks by design; the skill flags this in `synthesis_notes` rather than fabricating content.
* Panel discussions and multi-POV sources switch the deck structure from SCQA to a perspectives matrix — call this out if you expect a single-narrative deck.
