# Convert PPTX to Handout / Markdown

Converts PowerPoint presentations to DOCX handouts or Markdown notes with extracted speaker notes.

## What It Does

Transforms `.pptx` files into structured documents:
- **Markdown (`.md`)**: Direct extraction to Obsidian-friendly notes with custom YAML frontmatter, backlinks, and blockquoted speaker notes.
- **Word Document (`.docx`)**: Formatted handouts with slide contents, titles, and speaker notes separated by page breaks for printing or distribution.

## When to Use

- Creating handout documents from presentations
- Extracting speaker notes for documentation/review
- Converting slides to Markdown for direct Obsidian vault integration
- Preparing presentation content for reports or summaries

## Quick Start

**Trigger**: "Convert [presentation.pptx] to handout" or "Convert [presentation.pptx] to Markdown"

### Prerequisites

Requires Python and `python-pptx` (installed in the environment):
```bash
pip install python-pptx
```

Optional (only for DOCX format):
```bash
pip install python-docx
```

### Usage Examples

#### 1. Direct to Markdown Note (Recommended for Vaults)
Specify an output path ending in `.md`:
```bash
python .agent/skills/convert-pptx-to-handout/scripts/pptx_to_docx_handout.py "input.pptx" "output.md"
```

#### 2. Word Handout
Specify an output path ending in `.docx` (or omit the second argument to default to DOCX):
```bash
python .agent/skills/convert-pptx-to-handout/scripts/pptx_to_docx_handout.py "input.pptx" "output_handout.docx"
```

## Related Skills

- `presentation-studio` - Create presentations from content
- `synthesize-research` - Generate presentation-ready content
