---
name: summarize-slide-images-to-note
description: Summarize slide decks exported as PNG (or other image) files into a structured Obsidian note. Use when the user has a folder of slide images (e.g. Slide1.PNG–SlideN.PNG), wants a presentation summary note, or says "summarize the images in this directory" and gives a target .md path.
---

# Summarize Slide Images to Note

Takes a **directory of slide images** (e.g. `Slide1.PNG` … `SlideN.PNG`), reads each image with vision, infers the deck’s structure and key messages, and writes a **structured Obsidian note** at a given path.

> **Capabilities:** `file-search` (glob images), `file-read` (vision on each image), `file-write` (the note).

## When to use

- User points to a folder of slide images and asks for a summary note.
- User says "summarize the images in this directory" and gives a target `.md` path.
- User gives explicit paths (e.g. `Slide1.PNG` up to `Slide13.PNG`) and a target note path.

## Inputs

- **Source**: Directory path containing slide images (e.g. `01_Projects/Quarterly-Review/slides`).
- **Target**: Full path for the output note (e.g. `01_Projects/Quarterly-Review/summary.md`).
- **Slide range** (if not whole folder): User may specify e.g. `Slide1.PNG` up to `Slide31.PNG`.

## Workflow

1. **Resolve slide list**
   - Prefer user-provided explicit paths (e.g. `Slide1.PNG` … `SlideN.PNG`) when given.
   - Otherwise glob for images in the source directory. Try both `*.PNG` and `*.png` (Windows may be case-sensitive in glob). If glob returns nothing, ask for explicit paths or use paths the user supplied.
2. **Read slides**
   - Read each slide image in order (batch with parallel reads where practical). Use vision to extract text, layout, and visuals.
3. **Infer structure**
   - Identify sections, objectives, accomplishments, financials, timelines, and next steps from the deck.
4. **Write the note**
   - If the target `.md` already exists, do **not** silently overwrite: confirm with the user, and **preserve any existing YAML frontmatter**.
   - Create the target `.md` file with:
     - **YAML frontmatter** — at minimum `tags`, `status`, and a creation date, consistent with the target PARA folder (e.g. a `01_Projects/` note gets project tags/status). Never write a bare note without frontmatter.
     - Clear headings (e.g. context, objectives, accomplishments, 6Ps/7Ps, financials, next steps).
     - For **project-level** decks: emphasize **Actual Accomplishments** and **Next Steps**; do not add a separate "Risks / Gaps" section unless the user asks.
     - **3–5 `[[WikiLinks]]`** to the parent project, related decks, and people/initiatives named in the deck (vault Zettelkasten standard), plus backlinks where natural.
   - Use Obsidian-friendly markdown (headings, lists, WikiLinks, tags). Use `/` in paths in the skill text.

## Output

- One structured Markdown note at the requested path, suitable for Obsidian.
- Brief confirmation: slides processed, note path, and main sections included.
- **Loop-back:** the note can be re-ingested as a *source* by `presentation-studio` → research-deck or `source-to-presentation-synthesis` (e.g. to rebuild an old slide deck into a fresh one).

## Notes

- Extension case (`.PNG` vs `.png`) does not matter when using **explicit file paths**; it can matter for **glob** on some systems.
- For long decks (e.g. 30+ slides), read in batches to stay within context limits, then synthesize once.
- If no target path is given, derive one from the source folder (e.g. `<source-folder>.md` in the same PARA location) and confirm before writing.
- Skip unreadable/corrupt images and note them in the output rather than failing the whole run; collapse blank or section-divider slides instead of emitting empty sections.
