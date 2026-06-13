---
name: convert-pptx-to-handout
description: "Converts PowerPoint (.pptx) files to DOCX handouts or Markdown notes with speaker notes extracted. Useful for creating readable documentation from presentations, extracting notes for review, or generating vault-ready Markdown files."
---

# Convert PPTX to Handout / Markdown

## Purpose
Converts PowerPoint (.pptx) files to DOCX handouts or Markdown notes with speaker notes extracted. Use when you need to create readable documentation from presentations, extract notes for review, generate handout materials for distribution, or convert presentations to text-based formats for direct integration into your Obsidian vault.

This skill helps agents convert PowerPoint presentations into Word documents or Markdown files that include slide titles, content, and speaker notes in a structured format.

## Systematically Analyze and Transform

### Step 1: Check Environment
1. Verify Python is installed (Python 3.9+)
2. Check if required libraries are installed:
   - For all formats, `python-pptx` is required. Run `pip show python-pptx`
   - For DOCX format, `python-docx` is required. Run `pip show python-docx`
   - If missing, ask permission to run `pip install python-pptx` and/or `pip install python-docx`

### Step 2: Locate Input File
1. Ask user for the PowerPoint file path
2. Verify the file exists and has `.pptx` extension
3. Confirm the desired output location and format (defaults to same directory with `_handout.docx` suffix, or `.md` suffix if Markdown is requested)

### Step 3: Execute Conversion
1. Run the conversion script: `python .agent/skills/convert-pptx-to-handout/scripts/pptx_to_docx_handout.py "path/to/file.pptx" ["path/to/output.docx" or "path/to/output.md"]`
2. The script will:
   - Auto-detect format by output extension (`.md` or `.docx`)
   - Extract slide titles and content
   - Extract speaker notes from each slide
   - Format everything into a structured DOCX document or a vault-ready Markdown note with proper YAML frontmatter and Obsidian WikiLinks
   - Clean text to handle special characters

### Step 4: Confirm Output
1. Report the output file location
2. Mention total slides processed
3. Suggest next steps (e.g., move to appropriate project folder, link in index files)

## Input Validation
- Verify file path exists and is accessible
- Confirm file has `.pptx` extension
- Check write permissions for output directory
- Validate Python and required libraries are available for the target format
- Handle special characters and control characters in slide content

## Script Location
The conversion script is located at: `.agent/skills/convert-pptx-to-handout/scripts/pptx_to_docx_handout.py`

## Usage Examples

### Markdown Conversion (Direct to Obsidian Vault)
```bash
python .agent/skills/convert-pptx-to-handout/scripts/pptx_to_docx_handout.py "Inbox/presentation.pptx" "01_Projects/Quarterly-Review/references/presentation.md"
```

### DOCX Conversion (Standard Handout)
```bash
python .agent/skills/convert-pptx-to-handout/scripts/pptx_to_docx_handout.py "Inbox/presentation.pptx" "Inbox/presentation_handout.docx"
```

## Example Triggers Based on User Intent
- "Convert this PowerPoint to a handout"
- "Extract notes from my presentation"
- "Turn my PPTX into a Markdown note"
- "Create handouts from presentation.pptx"
- "Export PowerPoint with notes to DOCX or Markdown"

## Output Format
- **Markdown (`.md`)**:
  - YAML Frontmatter block (`title`, `type: presentation-transcript`, `status: processed`, `tags`, `links`)
  - H1 Document Title
  - H2 Slide number heading
  - Bold Slide title (if present)
  - Bulleted list of slide text content
  - Blockquoted (`>`) Speaker notes section
- **DOCX**:
  - Document Title: "Presentation Handout"
  - Slide number heading (H1)
  - Slide title (bold)
  - Slide content (bulleted list)
  - Speaker notes section (H2)
  - Page break (between slides)

> **Extraction limits:** Only top-level shape text and speaker notes are captured. Table cells and text inside **grouped shapes** are not extracted, and images/embedded objects are omitted (text-only handout). The script refuses to overwrite an existing output file unless `--force` is passed.

## Related Skills
- **presentation-studio** (pptx mode): Create PowerPoint presentations
- **presentation-studio** (research-deck mode): Design and structure presentations
- **Loop-back:** the Markdown output can be re-ingested as a *source* by `presentation-studio` → research-deck (e.g. to redesign an old deck into a fresh one) or compared in visual-synthesis.
