# Mode: Framework Selection

> Guides users through structured framework selection and generates a YAML handoff for downstream dispatch to the appropriate generation mode.

---

## When to Use

- Unsure which presentation framework to use (SCIPAB, SCQA, PSI, Pyramid, etc.)
- Need to match a communication structure to a specific audience and context
- Choosing between frameworks for a briefing, talk, or update
- **Trigger phrases:** "which framework", "help me choose", "what structure"
- **Do NOT use when:** User already knows their framework and needs slide generation (dispatch directly to research-deck or html-slides)

---

## Dependencies

### Required Capabilities

- `user-interact` — For the 4-question interrogation workflow and framework confirmation
- `file-read` — To examine source materials if provided

### Required Inputs

None — the interrogation workflow gathers all needed context interactively.

### Optional Inputs

- Source materials (notes, PDFs, memos) for context-aware recommendation
- Pre-existing audience or event constraints

### Integration Points

- **Shared Frameworks:** [Frameworks](shared/frameworks.md) — Full framework definitions, selection matrices, failure modes, hybrid patterns, and compression strategies
- **Downstream (research-deck):** [Research Deck](mode-research-deck.md) — For research-focused presentations using SCIPAB, SCQA, PSI, or Pyramid
- **Downstream (html-slides):** [HTML Slides](mode-html-slides.md) — For web-based presentations
- **Router:** [Presentation Studio](../SKILL.md) — Dispatches to this mode via trigger phrases

---

## Workflow Phases

### Phase 1: Interrogation

Ask the user these four questions in sequence using `user-interact`:

#### Q1: Primary Audience

> "Who is the **dominant audience** for this presentation?"

| Option | Description |
|:---|:---|
| **Mixed** | Technical + leadership + policy stakeholders |
| **Executive / Decision-Maker** | CxO, VP, Director, Steering Committee |
| **Technical Peers** | Engineers, researchers, reviewers |
| **External / Public / Partners** | Industry, media, international bodies |
| **Internal Team** | Program updates, change communications |

#### Q2: Primary Objective

> "What must happen **after** this presentation?"

| Option | Description |
|:---|:---|
| **Shared understanding** | Audience grasps the project/initiative |
| **Approval or decision** | Funding, direction, go/no-go |
| **Validation of technical rigor** | Peer review, technical scrutiny |
| **Buy-in or stakeholder alignment** | Coalition building, consensus |
| **Demonstration of feasibility** | Proof-of-concept, capability showcase |
| **Narrative persuasion** | Advocacy, policy influence |

#### Q3: Time Constraint

> "How much time do you have?"

| Option | Duration |
|:---|:---|
| **Lightning** | < 5 minutes |
| **Short** | 5–15 minutes |
| **Standard** | 15–30 minutes |
| **Long-form** | 30+ minutes |

#### Q4: Technical Depth

> "How much technical validation is expected?"

| Option | Description |
|:---|:---|
| **Light** | Focus on impact and decisions |
| **Moderate** | Some technical grounding needed |
| **Deep** | Full technical scrutiny expected |

---

### Phase 2: Framework Selection

Apply the Framework Selection Matrix from [Frameworks](shared/frameworks.md) to map the interrogation answers to a primary framework.

**Quick Selection Rules:**

| Condition | Primary Framework |
|:---|:---|
| Mixed audience + action or funding implications | **SCIPAB** |
| Executive briefing, memo, or decision review | **Pyramid Principle** |
| Technical validation or peer review | **IMRAD** or **Technical Stack Walkthrough** |
| Vision-setting, keynote, or policy panel | **SCQA** |
| Applied pilot, demo, or use-case showcase | **PSI** |
| Internal change update or program evolution | **SCR** |

**Rule:** Only one framework may lead. Others may support.

For detailed selection matrices (high-stakes vs. medium/low-stakes, audience × objective grids), hybrid adaptation patterns, compression strategies, and failure mode warnings, see [Frameworks](shared/frameworks.md).

---

### Phase 3: Recommendation Output

Present the user with:

1. **Selected Primary Framework** — Name and rationale tied to their interrogation answers
2. **Recommended Structure** — Slide/section outline based on the framework
3. **Supporting Frameworks** — If applicable, secondary frameworks for depth or validation
4. **Red Flags to Avoid** — Framework-specific failure modes relevant to their context (see [Frameworks](shared/frameworks.md) failure modes section)
5. **Time-Adjusted Compression** — If time is constrained, apply the compression pattern for the selected framework (see [Frameworks](shared/frameworks.md) compression patterns)

---

### Phase 4: YAML Handoff Generation

After the user confirms the framework recommendation, generate a YAML handoff block for downstream dispatch:

```yaml
deck_activation:
  mode: <research-deck|pptx|html-slides|speaker-script>
  framework: <SCIPAB|SCQA|PSI|Pyramid|IMRAD|SCR>
  audience: "<from Q1>"
  objective: "<from Q2>"
  speaking_time_min: <estimated from Q3>
  technical_depth: "<from Q4>"
  supporting_frameworks: [<if any>]
```

**Mode Mapping Rules:**

| Framework / Context | Dispatch Mode |
|:---|:---|
| SCIPAB, SCQA, PSI, Pyramid for research/academic contexts | **research-deck** |
| Any framework for web-based delivery | **html-slides** |
| User explicitly requests PowerPoint | **pptx** (via router) |
| A spoken talk / keynote (not slides yet) | **speaker-script** → then the keynote-deck-builder skill or visual-script |

After generating the handoff block, offer to dispatch to the recommended mode:

> "Framework selected: **[Framework Name]**. Would you like me to proceed with generating the presentation using the **[mode-name]** mode?"

If the user confirms, pass the YAML handoff block to the [Presentation Studio](../SKILL.md) router for dispatch.

---

## Output Contract

| Deliverable | Description |
|:---|:---|
| Framework recommendation | Primary framework with rationale |
| Structure outline | Slide/section outline for the selected framework |
| Supporting frameworks | Secondary frameworks if applicable |
| Red flags | Context-specific failure modes to avoid |
| YAML handoff block | Structured dispatch block for downstream mode |

---

## Integration Points

- **Frameworks Reference:** [Frameworks](shared/frameworks.md) — All framework definitions, selection matrices, failure modes, hybrid patterns, compression strategies, and seeds
- **Downstream Modes:** [Research Deck](mode-research-deck.md), [PPTX](mode-pptx.md), [HTML Slides](mode-html-slides.md), [Speaker Script](mode-speaker-script.md) — Receive YAML handoff for generation
- **Router:** [Presentation Studio](../SKILL.md) — Handles dispatch after handoff generation

---

## Anti-Patterns

- **Do not** skip the interrogation and jump to a framework recommendation — the 4-question workflow ensures context-appropriate selection
- **Do not** recommend multiple primary frameworks — one framework leads, others support
- **Do not** inline framework definitions — link to [Frameworks](shared/frameworks.md) for full details
- **Do not** generate slides in this mode — framework selection produces a recommendation and handoff; generation happens in the downstream mode
- **Do not** use agent-specific tool names — describe capabilities generically (read, write, search, run-command)
- **Do not** force SCIPAB as default without running the interrogation — the matrix may recommend a different framework based on context
