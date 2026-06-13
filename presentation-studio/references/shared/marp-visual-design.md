# Shared Reference: Marp Visual Design

> **Scope:** This file defines the CSS class system and visual cue definitions for Marp-based presentations across [Presentation Studio](../../SKILL.md) modes. Primarily used by the research-deck mode during Phase 3 (Drafting) and Phase 4 (Production).
>
> Mode reference files should link here instead of duplicating visual design content.

---

## Overview

Presentation Studio uses **Marp CSS classes** to apply framework-specific visual themes to slides. Each framework element (e.g., SCIPAB's Complication, PSI's Solution) has distinct visual styling to guide audience attention and reinforce narrative structure.

> **About the examples below:** every worked example uses one **fictional** scenario — *"Atlas," an in-house LLM platform a company builds to replace fragmented third-party AI API spend* — purely to show how each framework element is styled. Swap in your own content.

### Design Principles

- **Framework-driven:** Visual cues map directly to framework elements — each element has a distinct color/style
- **Audience-aware:** High-contrast themes for urgency (Complication, Implication), calming themes for resolution (Benefit, Answer)
- **Consistent grammar:** Same color families carry the same meaning across frameworks (green = action/positive, red/dark = tension/problem)

---

## CSS Class System

### Base Classes (All Frameworks)

```css
/* Default slide styling */
section {
  background: #ffffff;
  color: #2c3e50;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 1.5em;
  padding: 2em;
}

/* Title slide */
section.title {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  text-align: center;
  font-size: 2em;
}

/* Next steps / conclusion */
section.next-steps {
  background: #f8f9fa;
  border-left: 8px solid #28a745;
}
```

---

## SCIPAB Visual Cues

### Situation (Neutral, Blue Accent)

```css
section.situation {
  background: #f8f9fa;
  border-left: 8px solid #3498db;
  padding-left: 2em;
}
```

**Usage:**
```markdown
<!-- _class: situation -->
# Current State: AI Tooling Across the Org

- 8 business units, each rolling its own
- 6 different commercial API providers
- $1.2M annual spend on third-party APIs
```

**Purpose:** Establish common ground with neutral, factual tone.

---

### Complication (Tension/Problem, Red/Dark Theme)

```css
section.complication {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: #ff6b6b;
  font-size: 1.6em;
}
```

**Usage:**
```markdown
<!-- _class: complication -->
# The Problem: Fragmented & Expensive

- No in-house AI capability building
- Vendor lock-in with external providers
- Data-control concerns for sensitive workloads
```

**Purpose:** Create visual tension to emphasize the problem.

---

### Implication (Stakes/Urgency, Bold)

```css
section.implication {
  background: #2c3e50;
  color: #ecf0f1;
  font-size: 1.8em;
  font-weight: bold;
  text-align: center;
}
```

**Usage:**
```markdown
<!-- _class: implication -->
# If We Don't Act

**Engineers leave for competitors with better tooling**

**Core capabilities stay locked to external vendors**
```

**Purpose:** Maximize urgency with large, bold text and dark background.

---

### Position (Thesis, Blue Accent Border)

```css
section.position {
  background: #ffffff;
  border-left: 8px solid #3498db;
  padding-left: 2em;
}
```

**Usage:**
```markdown
<!-- _class: position -->
# Our Position: Bring AI Infrastructure In-House

**Atlas provides:**
1. Self-hosted LLM deployment capability
2. Cost reduction ($1.2M → $320K annually)
3. Data control for sensitive workloads
```

**Purpose:** Clear visual emphasis on your thesis with blue accent.

---

### Action (Green, Call-to-Action)

```css
section.action {
  background: #27ae60;
  color: #ffffff;
  font-size: 1.6em;
  text-align: center;
}
```

**Usage:**
```markdown
<!-- _class: action -->
# Action: 90-Day Pilot

**Pilot Atlas in the Support org**
- 10 developers trained
- 3 use cases deployed
- Cost/performance metrics collected
```

**Purpose:** Green for "go", emphasizes concrete next step.

---

### Benefit (Positive Outcome, Bright Theme)

```css
section.benefit {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  font-size: 1.5em;
}
```

**Usage:**
```markdown
<!-- _class: benefit -->
# Expected Benefits

✓ $880K annual savings (Year 1)
✓ 50+ engineers trained in LLM deployment
✓ Foundation for lasting in-house AI capability
```

**Purpose:** Bright gradient conveys positive future state.

---

## SCQA Visual Cues

### Situation (Neutral, Blue Accent)

```css
section.scqa-situation {
  background: #f8f9fa;
  border-top: 5px solid #3498db;
  padding-top: 1.5em;
}
```

**Usage:**
```markdown
<!-- _class: scqa-situation -->
# The Scene: Enterprise AI in 2025

AI adoption is accelerating across every department...
```

---

### Complication (Red/Tension)

```css
section.scqa-complication {
  background: linear-gradient(135deg, #c0392b 0%, #8e44ad 100%);
  color: #ffffff;
  font-size: 1.6em;
}
```

**Usage:**
```markdown
<!-- _class: scqa-complication -->
# But Then: Dependency Crisis

Teams hit third-party API rate limits during critical operations...
```

---

### Question (Purple/Pivot, Centered)

```css
section.question-slide {
  background: #8e44ad;
  color: #ffffff;
  text-align: center;
  font-size: 2em;
  font-weight: bold;
}
```

**Usage:**
```markdown
<!-- _class: question-slide -->
# How do we build in-house AI capability without sacrificing service quality?
```

**Purpose:** Purple pivot slide creates dramatic pause before Answer.

---

### Answer (Green/Resolution)

```css
section.scqa-answer {
  background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
  color: #ffffff;
}
```

**Usage:**
```markdown
<!-- _class: scqa-answer -->
# The Answer: Atlas

A self-hosted LLM platform that...
```

---

## PSI Visual Cues

### Problem (Dark/Pain)

```css
section.psi-problem {
  background: #34495e;
  color: #ecf0f1;
  font-size: 1.6em;
}
```

**Usage:**
```markdown
<!-- _class: psi-problem -->
# Problem: Expensive & Fragmented AI

Agencies spend millions on redundant API subscriptions...
```

---

### Solution (Blue/Capability)

```css
section.psi-solution {
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: #ffffff;
}
```

**Usage:**
```markdown
<!-- _class: psi-solution -->
# Solution: The Atlas Platform

**Demo:** Deploy Llama 3.1 70B in 15 minutes...
```

---

### Constraints (Amber/Honest, Optional)

```css
section.psi-constraints {
  background: #f39c12;
  color: #2c3e50;
  border: 3px solid #e67e22;
}
```

**Usage:**
```markdown
<!-- _class: psi-constraints -->
# Constraints (Honest Assessment)

- Requires 4x A100 GPUs (capital cost)
- 3-month onboarding for developers
- Not suitable for <1000 requests/day workloads
```

**Purpose:** Amber/orange conveys caution, builds credibility with skeptical audiences.

---

### Impact (Green/Value)

```css
section.psi-impact {
  background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
  color: #ffffff;
  font-size: 1.5em;
}
```

**Usage:**
```markdown
<!-- _class: psi-impact -->
# Impact: Measured Results

📊 73% cost reduction ($1.2M → $320K/year)
📈 5x faster inference for domain-specific NLP
🎓 50 developers trained in LLM ops
```

---

## Pyramid Visual Cues

### BLUF/Recommendation (Blue, Bold)

```css
section.bluf {
  background: #3498db;
  color: #ffffff;
  text-align: center;
  font-size: 2em;
  font-weight: bold;
}
```

**Usage:**
```markdown
<!-- _class: bluf -->
# RECOMMENDATION

**Approve Atlas deployment for the Support org**

**Budget: $650K | Timeline: Q1–Q2**
```

**Purpose:** Blue for authority, large text for immediate clarity.

---

### Supporting Argument (Light, Structured)

```css
section.pyramid-argument {
  background: #ecf0f1;
  border-left: 6px solid #34495e;
  padding-left: 2em;
}
```

**Usage:**
```markdown
<!-- _class: pyramid-argument -->
# Argument 1: Cost Efficiency

Atlas reduces API costs by 73%...
```

---

### Evidence (Green Accent)

```css
section.pyramid-evidence {
  background: #ffffff;
  border-top: 4px solid #27ae60;
}
```

**Usage:**
```markdown
<!-- _class: pyramid-evidence -->
# Evidence: Pilot Data

| Metric | Before | After | Δ |
|--------|--------|-------|---|
| Cost/1M tokens | $12.00 | $3.20 | -73% |
```

---

### Decision/Action (Green, Call-to-Action)

```css
section.pyramid-decision {
  background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
  color: #ffffff;
  font-size: 1.6em;
  text-align: center;
}
```

**Usage:**
```markdown
<!-- _class: pyramid-decision -->
# Decision Required

**Approve $650K budget for Atlas deployment**

**Expected board vote: end of Q1**
```

---

## CSS Class Quick Reference

### All Classes by Framework

| Framework | CSS Classes |
|-----------|------------|
| **Base** | `title`, `next-steps` |
| **SCIPAB** | `situation`, `complication`, `implication`, `position`, `action`, `benefit` |
| **SCQA** | `scqa-situation`, `scqa-complication`, `question-slide`, `scqa-answer` |
| **PSI** | `psi-problem`, `psi-solution`, `psi-constraints`, `psi-impact` |
| **Pyramid** | `bluf`, `pyramid-argument`, `pyramid-evidence`, `pyramid-decision` |

### Color Language

| Color Family | Meaning | Used In |
|-------------|---------|---------|
| **Blue accent** | Authority, neutral facts, thesis | `situation`, `position`, `bluf`, `psi-solution` |
| **Red/Dark** | Tension, problem, urgency | `complication`, `scqa-complication`, `psi-problem` |
| **Green** | Action, resolution, positive outcome | `action`, `benefit`, `scqa-answer`, `psi-impact`, `pyramid-decision` |
| **Purple** | Pivot, dramatic pause | `question-slide` |
| **Amber** | Caution, honest constraints | `psi-constraints` |
| **Dark + bold** | Stakes, urgency | `implication` |

---

## Framework-Specific Preview Structures

### SCIPAB Preview
```
- Title (1 slide)
- Situation (2 slides) ← Blue accent
- Complication (1 slide) ← Red theme
- Implication (1 slide) ← Bold/urgent
- Position (3 slides) ← Blue border
- Action (1 slide) ← Green
- Benefit (1 slide) ← Bright gradient

Total: 10 slides
```

### SCQA Preview
```
- Title (1 slide)
- Situation (1-2 slides) ← Blue accent
- Complication (1-2 slides) ← Red gradient
- Question (1 slide) ← Purple/pivot
- Answer (3-4 slides) ← Green gradient
- Next Steps (1 slide)

Total: 8-10 slides
```

### PSI Preview
```
- Title (1 slide)
- Problem (2-3 slides) ← Dark theme
- Solution (2-3 slides) ← Blue gradient
- Constraints (1-2 slides) ← Amber [optional]
- Impact (2-3 slides) ← Green gradient
- What's Next (1 slide)

Total: 8-12 slides
```

### Pyramid Preview
```
- Title (1 slide)
- BLUF/Recommendation (1-2 slides) ← Blue/bold
- Argument 1 + Evidence (2-3 slides)
- Argument 2 + Evidence (2-3 slides)
- Argument 3 + Evidence (2-3 slides)
- Decision/Action (1-2 slides) ← Green

Total: 10-14 slides
```

---

## Marp Header Template

Include this at the top of all `presentation.md` files:

```markdown
---
marp: true
theme: default
paginate: true
backgroundColor: #fff
style: |
  section.complication {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    color: #ff6b6b;
  }
  section.implication {
    background: #2c3e50;
    color: #ecf0f1;
    font-size: 1.4em;
    font-weight: bold;
  }
  section.benefit {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #ffffff;
  }
  section.position {
    border-left: 8px solid #3498db;
    padding-left: 2em;
  }
  section.action {
    background: #27ae60;
    color: #ffffff;
    font-size: 1.6em;
    text-align: center;
  }
  /* Add framework-specific classes as needed */
---
```

> **Note:** The header template above shows SCIPAB classes. For other frameworks, substitute the appropriate CSS classes from the sections above.

---

## Recording Mode Visual Enhancements

When generating HTML presentations in recording mode, additional visual components are available. These use CSS-based diagrams injected from `visual-elements.json` data extracted during Phase 1.5 (Visual Extraction).

### CSS Diagram Components

| Component | CSS Class | When to Use |
|-----------|-----------|-------------|
| **Big Number** | `.big-number`, `.big-number-label` | Single statistic highlight |
| **Stats Grid** | `.stats-grid.col-N` (N = 1–5), `.stat-item`, `.stat-number`, `.stat-label` | Multiple statistics side-by-side |
| **Before/After Comparison** | `.comparison-container`, `.comparison-item`, `.vs-divider` | Contrasting old vs. new states |
| **Flow Diagram** | `.flow-container`, `.flow-item`, `.flow-box`, `.flow-arrow` | Sequential process steps |
| **Reason Cards** | `.reasons-container`, `.reason-card`, `.reason-number`, `.reason-title`, `.reason-desc` | Numbered argument cards |

### Chapter Navigation (Recording Mode)

Recording mode HTML exports include chapter navigation for video-friendly playback:

| Component | CSS Class | Purpose |
|-----------|-----------|---------|
| **Chapter Nav** | `.chapter-nav`, `.chapter-nav-title`, `.chapter-list` | Sidebar chapter list |
| **Chapter Item** | `.chapter-item`, `.chapter-number` | Individual chapter entry |
| **Slide Counter** | `.slide-counter`, `.current` | Current/total slide indicator |
| **Keyboard Hints** | `.keyboard-hint`, `.key` | Navigation key indicators |

### Visual Element → CSS Template Mapping

| Visual Element Type | Recommended CSS Template |
|---------------------|--------------------------|
| Numbers (1) | `big-number` variant |
| Numbers (2–5) | `stats-grid` with appropriate column count |
| Before/After comparisons | `comparison-before-after` |
| Sequential processes | `flow-diagram` |
| Numbered arguments | `reason-cards` |

---

## Integration Points

- **Framework definitions:** See [Frameworks](frameworks.md) for when to use each visual style
- **Quality gates:** See [Quality Gates](quality-gates.md) for Phase 3 → 4 validation of CSS class application
- **Research-deck mode:** Primary consumer — applies these classes during Phase 3 (Drafting)

---

_CSS classes and visual cue definitions for Marp framework theming._
