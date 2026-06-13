# Summarize Slide Images to Note

Summarize a slide deck that's exported as images (e.g. PNG) into one structured Obsidian note.

## What this does

- Takes a folder of slide images (e.g. `Slide1.PNG` … `SlideN.PNG`).
- Reads each image with vision (text, layout, visuals).
- Infers the deck's structure and main messages.
- Writes a single Markdown note at a path you choose (context, objectives, accomplishments, financials, next steps).

## When to use

- You have a folder of slide PNGs and want a summary note.
- You say something like: "Summarize the images in this directory … write to `path/to/Project.md`."
- You give explicit slide paths (e.g. `Slide1.PNG` up to `Slide13.PNG`) and a target note path.

## How to trigger

- "Summarize the images in **&lt;folder path&gt;** and write to **&lt;path/to/note.md&gt;**."
- "Slide1.PNG up to SlideN.PNG in **&lt;folder&gt;**; write to **&lt;path/to/note.md&gt;**."

## Compatibility

| Agent | Support | Notes |
|:------|:--------|:------|
| Claude (Code/Desktop) | Full | Native vision tool reads local image files |
| Gemini | Full | Native vision tool reads local image files |
| Kiro | Partial | No tool for programmatic local image reading. Images must be manually dragged into chat, limiting automation for large decks. File listing and note writing work fine. |
