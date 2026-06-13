# Shared Reference: Presentation Frameworks

> **Scope:** This file is the single source of truth for framework definitions, selection matrices, failure modes, and adaptation patterns used across multiple [Presentation Studio](../../SKILL.md) modes (research-deck, framework-selection).
>
> Mode reference files should WikiLink here instead of duplicating framework content.

---

## Supported Frameworks

### SCIPAB (Default for High-Stakes)

**Structure:** Situation → Complication → Implication → Position → Action → Benefit

**Best for:** Mixed audiences, steering committees, funding asks, policy briefings

**When to Use:**
- Multiple stakeholders with different expertise levels
- Decision requires buy-in from diverse groups
- High stakes (career-defining, large budget, external visibility)
- Need to build case from current state to recommended action

| Attribute | Value |
|-----------|-------|
| **Primary Purpose** | Align stakeholders around *why*, *what to do*, and *what improves* |
| **Best-Fit Audience** | Mixed (technical + leadership + policy) |
| **Strengths** | Bridges technical logic and decision logic; Forces "so-what" and impact articulation; Familiar causal reasoning for engineers |
| **Weaknesses** | Can feel long if not synthesized; Requires discipline to avoid detail creep |
| **Works Best** | R&D project updates, Steering committee reviews, Funding and policy briefings |
| **Fails When** | Pure technical deep-dives, Highly time-constrained lightning talks |

**Element Definitions:**
- **Situation:** Current state, established facts, common ground
- **Complication:** The problem, tension, or gap that disrupts the situation
- **Implication:** Stakes — what happens if the complication isn't addressed
- **Position:** Your thesis, recommended stance, or proposed solution
- **Action:** Concrete first step (achievable in 90 days)
- **Benefit:** Positive outcome if action is taken

**Variants:**
- **Executive** — for leadership / steering committees
- **Academic** — for research presentations / papers
- **Technical** — for technical project presentations

**Variant Auto-Selection:**
- IF the audience is leadership or decision-makers → Executive
- ELIF the context is research or academic → Academic
- ELIF it is a technical project → Technical
- ELSE → Executive (default)

---

### SCQA (Narrative Urgency)

**Structure:** Situation → Complication → Question → Answer

**Best for:** Keynotes, vision talks, executive buy-in, policy panels

**When to Use:**
- Need to build narrative urgency
- Audience needs to "feel" the problem before accepting solution
- Persuasion is primary objective
- Story-driven presentation style preferred

| Attribute | Value |
|-----------|-------|
| **Primary Purpose** | Persuade through narrative tension and urgency |
| **Best-Fit Audience** | Executive, public, policy audiences |
| **Strengths** | Strong narrative pull; Highlights urgency and relevance; Easy to follow live |
| **Weaknesses** | Weak on execution detail; Can oversimplify complex R&D |
| **Works Best** | Keynotes, Policy panels, Vision-setting talks |
| **Fails When** | Technical design reviews, Architecture discussions |

**Element Definitions:**
- **Situation:** Set the scene, establish normalcy
- **Complication:** Disruptive event or emerging problem
- **Question:** The burning question that arises from the complication
- **Answer:** Your response to the question (thesis + supporting arguments)

---

### PSI (Demos and Pilots)

**Structure:** Problem → Solution → Impact

**Best for:** Product demos, pilot summaries, case studies, partner presentations

**When to Use:**
- Demonstrating tangible capability
- Showcasing pilot results or proof-of-concept
- Audience is skeptical and needs proof
- Time-limited (15-20 min presentations)

| Attribute | Value |
|-----------|-------|
| **Primary Purpose** | Explain applied or pilot work clearly |
| **Best-Fit Audience** | Partners, implementers |
| **Strengths** | Simple and practical; Effective for demos and pilots |
| **Weaknesses** | Often glosses over constraints and risks; Can sound promotional |
| **Works Best** | Pilot demos, Industry showcases, Use-case briefings |
| **Fails When** | Policy discussions, Complex multi-year R&D programs |

**Element Definitions:**
- **Problem:** The pain point or challenge (customer-centric)
- **Solution:** Your approach, product, or capability (demo-focused)
- **Impact:** Measurable results, outcomes, or value delivered
- **Constraints (Optional):** Honest limitations for credibility with skeptical audiences

---

### Pyramid Principle (Executive Decisions)

**Structure:** Answer (BLUF) → Supporting Arguments → Evidence

**Best for:** Decision memos, board presentations, executive summaries

**When to Use:**
- Executive audience with limited time
- Decision needs to be made quickly
- Answer-first communication style preferred
- Audience trusts your expertise (no need to "build the case")

| Attribute | Value |
|-----------|-------|
| **Primary Purpose** | Enable fast executive comprehension and decisions |
| **Best-Fit Audience** | Executives, senior decision-makers |
| **Strengths** | Extremely time-efficient; Optimized for limited attention; Ideal for written briefs |
| **Weaknesses** | Difficult synthesis for technical teams; Less effective as a spoken narrative |
| **Works Best** | Executive summaries, Decision memos, One-pagers |
| **Fails When** | Exploratory R&D updates, Live technical presentations |

**Element Definitions:**
- **BLUF (Bottom Line Up Front):** Your recommendation or answer (slide 1-2)
- **Supporting Arguments:** 2-4 key reasons supporting the BLUF
- **Evidence:** Data, case studies, or proof for each argument
- **Decision/Action:** What needs to be decided or done

---

### Additional Frameworks (Selection Context)

These frameworks are not primary Presentation Studio modes but appear in the selection matrix and may be recommended as supporting structures.

#### IMRAD

| Attribute | Value |
|-----------|-------|
| **Structure** | Introduction → Methods → Results → Discussion |
| **Primary Purpose** | Validate scientific and technical rigor |
| **Best-Fit Audience** | Technical peers, reviewers |
| **Strengths** | Precise and rigorous; Familiar academic structure; Defensible in review settings |
| **Weaknesses** | Loses non-technical audiences early; Implications appear too late |
| **Works Best** | Journal papers, Technical colloquia, Peer review sessions |
| **Fails When** | Leadership briefings, Mixed-audience forums |

#### SCR (Situation–Complication–Resolution)

| Attribute | Value |
|-----------|-------|
| **Structure** | Situation → Complication → Resolution |
| **Primary Purpose** | Frame change and response |
| **Best-Fit Audience** | Internal teams, general audiences |
| **Strengths** | Clear cause-effect logic; Easy to apply consistently |
| **Weaknesses** | Resolution can feel premature; Benefits may be underdeveloped |
| **Works Best** | Program updates, Change communications |
| **Fails When** | High-stakes decision reviews |

#### Technical Stack Walkthrough

| Attribute | Value |
|-----------|-------|
| **Structure** | Data → Infrastructure → Models → Applications |
| **Primary Purpose** | Demonstrate feasibility and system depth |
| **Best-Fit Audience** | Technical stakeholders |
| **Strengths** | Shows depth and capability; Builds engineering credibility |
| **Weaknesses** | Lacks narrative prioritization; High cognitive load |
| **Works Best** | Architecture reviews, Engineering design sessions |
| **Fails When** | Non-technical briefings, Time-boxed meetings |

---

## Framework Selection Matrix

### High Stakes

| Audience | Persuade | Inform | Validate | Escalate Risk | Demonstrate |
|----------|----------|--------|----------|---------------|-------------|
| **Executive** | SCIPAB | Pyramid | SCQA+appendix | Modified SCIPAB | PSI |
| **Technical** | SCQA+evidence | SCR | IMRAD | SCIPAB | Tech Stack |
| **Policy** | SCIPAB | SCQA | SCQA+data | SCIPAB | PSI |
| **Mixed** | SCIPAB | SCR | Layered | SCIPAB | PSI+appendix |
| **External** | PSI | SCR | PSI+evidence | SCQA | PSI |

### Medium/Low Stakes

| Audience | Persuade | Inform | Validate | Demonstrate |
|----------|----------|--------|----------|-------------|
| **Executive** | SCQA | Pyramid | Pyramid+backup | PSI |
| **Technical** | PSI | SCR | IMRAD-lite | Tech Stack |
| **Mixed** | SCQA | SCR | PSI+appendix | PSI |
| **Internal** | SCR | SCR | SCR+data | PSI |

### Quick Selection Guide

| If your audience is... | And you need... | Use... |
|------------------------|-----------------|--------|
| Mixed | Decision or funding | SCIPAB |
| Executive | Fast comprehension | Pyramid |
| Technical | Validation | IMRAD |
| Public/Policy | Persuasion | SCQA |
| Partners | Demo understanding | PSI |
| Internal | Change update | SCR |

### Decision Tree

1. **Audience:** Who is the primary decision-maker or influencer?
2. **Objective:** What do you need them to do/approve/understand?
3. **Stakes:** What are the consequences of action vs inaction?
4. **Time:** How much time do you have (5 min vs 30 min)?
5. **Style:** Does audience prefer story-driven or answer-first?

**Default Recommendations:**
- **High-stakes with mixed audience** → SCIPAB
- **Executive decision required** → Pyramid
- **Narrative persuasion needed** → SCQA
- **Demo or proof required** → PSI

### Core Principle

> **Framework choice is a strategic decision, not a stylistic preference.**
> Technical rigor is preserved — but only after relevance, impact, and direction are established.

### Default House Rules

Unless explicitly overridden:
1. All R&D project presentations MUST open with SCIPAB (minimum: Situation → Complication → Implication → Position)
2. Technical depth is never the opening move — it is earned, not assumed
3. Executives get Pyramid summaries, not architectures
4. Technical frameworks belong in later sections, appendices, backup slides, or separate technical sessions

---

## Framework Failure Modes

### Failure Mode Categories

| Category | Definition | Susceptible Frameworks |
|----------|-----------|----------------------|
| **Oversimplification** | Structure forces complexity reduction that loses essential nuance | PSI, SCR, abbreviated SCQA, Pyramid (without evidence) |
| **Information Overload** | Framework permits more detail than audience can process | IMRAD, Tech Stack, SCIPAB (detail creep) |
| **Credibility Loss** | Structure undermines trust with evidence-hungry audiences | Pyramid, SCQA, PSI (with skeptical technical audiences) |
| **Risk Under-Signaling** | Optimistic structure obscures genuine uncertainties | PSI, SCR, SCIPAB (Benefit over-emphasis) |
| **Narrative Collapse** | Structure without story; dry, unengaging | Pyramid, IMRAD, Tech Stack |
| **Action Gap** | Emphasizes analysis but fails to translate into clear next steps | IMRAD, SCQA (weak Answer), Tech Stack |

### SCIPAB Failure Modes

| Failure Mode | How It Manifests | Mitigation |
|--------------|------------------|------------|
| Detail creep | Each element expands to 3+ slides; 30-slide deck | Hard rule: 1-2 slides per element max; use appendix |
| Generic Implication | "We'll fall behind competitors" (vague fear) | Force specificity: Who loses what, by when, measured how? |
| Aspirational Action | "Adopt best practices" (not concrete) | 90-day test: Is this achievable in 90 days? If not, break down |
| Benefit over-emphasis | Risks buried or omitted | Add "Caveats" slide; use modified SCIPAB for risk contexts |
| Forced structure | Content doesn't naturally fit 6 elements | Compress to SCB or switch to SCQA |

**Warning:** "⚠️ Watch for detail creep. Keep each element to 1-2 slides max."
**Recovery:** If SCIPAB feels forced, ask: "Is this primarily a persuasion or information context?" Persuasion → full SCIPAB; Information → SCR or Pyramid.

### SCQA Failure Modes

| Failure Mode | How It Manifests | Mitigation |
|--------------|------------------|------------|
| Oversimplification | Complex problem reduced to single Question | Allow multiple Questions; add "Complexity" acknowledgment |
| Weak Complication | No genuine tension or urgency | Challenge: "Would anyone disagree this is a problem?" If yes, it's weak |
| Execution gap | Answer has no "how" | Add implementation slides after Answer; use Pyramid within Answer |
| Dramatic overreach | Complication feels manufactured | Ground in data; use stakeholder quotes to validate |
| Question mismatch | Answer doesn't directly address Question | Re-read Question before drafting Answer; ensure 1:1 mapping |

**Warning:** "⚠️ Ensure Complication is genuinely urgent, not manufactured."
**Recovery:** If SCQA feels thin, embed Pyramid structure within Answer section.

### PSI Failure Modes

| Failure Mode | How It Manifests | Mitigation |
|--------------|------------------|------------|
| Risk glossing | No acknowledgment of limitations | Add Constraints section between Solution and Impact |
| Vague Impact | "Improves efficiency" (unquantified) | Every Impact claim needs a number or specific before/after |
| Promotional tone | Sounds like sales pitch | Include limitations, use measured language, cite independent sources |
| Problem trivialization | Problem not compelling | Use specific examples, user quotes, quantified pain |
| Solution assumption | Leaps to solution without Problem buy-in | Spend more time on Problem; don't rush |

**Warning:** "⚠️ Add Constraints section for skeptical audiences."
**Recovery:** For skeptical audiences, extend Problem section and add independent validation in Solution section.

### Pyramid Failure Modes

| Failure Mode | How It Manifests | Mitigation |
|--------------|------------------|------------|
| Credibility loss | Technical peers reject answer-first as "sales pitch" | Add "How we reached this conclusion" bridge slide; offer evidence appendix |
| Synthesis difficulty | Can't distill to single headline | You may not have a clear recommendation yet; do more analysis |
| Narrative flatness | Audience receives but doesn't engage | Add SCQA opening (1 slide) to create narrative hook |
| MECE failure | Arguments overlap or gaps exist | Stress-test: Do arguments together fully support conclusion? |
| Evidence mismatch | Evidence doesn't directly support argument | Each evidence slide must reference its argument explicitly |

**Warning:** "⚠️ Technical peers may need evidence before accepting BLUF."
**Recovery:** For technical audiences, consider "inverted Pyramid" — show key evidence first, then reveal conclusion.

### IMRAD Failure Modes

| Failure Mode | How It Manifests | Mitigation |
|--------------|------------------|------------|
| Late implications | Non-experts tune out in Methods | Lead with Discussion summary (inverted IMRAD); use executive summary slide |
| Length trap | Completeness valued over efficiency | Time-box each section; use "Details on request" approach |
| Jargon density | Methods alienates non-technical | Separate technical appendix; use analogies in main deck |
| Results without meaning | Data presented without interpretation | Every Results slide needs "What this means" callout |
| Discussion drift | Discussion doesn't connect back to Introduction | Explicitly answer the research question stated in Introduction |

### SCR Failure Modes

| Failure Mode | How It Manifests | Mitigation |
|--------------|------------------|------------|
| Premature resolution | Resolution stated before audience buys Complication | Extend Complication; use data/quotes to build urgency |
| Benefit gap | No clear "what do we gain?" | Add Benefit element (SCR → SCRB) |
| Evidence weakness | Resolution asserted without proof | Add evidence slide after Resolution |
| Low stakes feel | Doesn't convey importance | Emphasize Complication consequences; add Implication element |

### Tech Stack Walkthrough Failure Modes

| Failure Mode | How It Manifests | Mitigation |
|--------------|------------------|------------|
| No narrative | Information dump without story | Add SCQA opening (1 slide) before stack |
| High cognitive load | Non-experts lost immediately | Abstract to 3 layers max for mixed audiences; use analogies |
| "So what?" void | No connection to business value | Each layer needs "Why this matters" callout |

---

## Framework Susceptibility Summary

| Framework | Primary Failure Risk | Mitigation Strategy |
|-----------|---------------------|---------------------|
| **SCIPAB** | Detail creep, Benefit over-emphasis | Compress to SCB for short talks; Add caveats for risk |
| **SCQA** | Oversimplification | Add evidence layers; Use as opener only |
| **Pyramid** | Credibility loss with technical audiences | Add evidence appendix; Consider IMRAD elements |
| **PSI** | Glosses over risks/constraints | Add "Constraints" section; Quantify Impact specifically |
| **SCR** | Resolution feels premature | Expand benefits; Add evidence for skeptical audiences |
| **IMRAD** | Information overload for non-experts | Add executive summary; Lead with Discussion for policy |
| **Tech Stack** | No narrative, high cognitive load | Add SCQA opening; Reserve for appendix |

---

## Hybrid Adaptation Patterns

### Pattern 1: SCQA Opening + Pyramid Body
- **Use when:** Executive audience needs narrative hook AND structured arguments
- **Structure:** Open with Situation → Complication → Question; Answer uses Pyramid core (BLUF + arguments + evidence)
- **Total:** 10-12 slides

### Pattern 2: PSI Core + Constraints Layer
- **Use when:** Product demos to skeptical or risk-aware audiences
- **Structure:** Problem → Solution → **Constraints** → Impact → What's Next
- **Key addition:** Constraints section between Solution and Impact builds trust

### Pattern 3: SCIPAB Spine + Technical Validation Appendix
- **Use when:** R&D project reviews with mixed technical/leadership audiences
- **Structure:** Full SCIPAB main deck (10-12 slides) + IMRAD Summary appendix (3-4 slides) + Tech Stack appendix (4-6 slides)

### Pattern 4: Inverted IMRAD for Policy Audiences
- **Use when:** Academic content for policy/executive audiences who need credibility but not methods depth
- **Structure:** Executive Summary → Discussion → Key Results → Methods Summary → Call to Action (+ full IMRAD appendix)

### Pattern 5: SCR + Pyramid Backup
- **Use when:** Status updates that may prompt detailed questions
- **Structure:** SCR main deck (3-5 slides) + Pyramid backup slides per topic (2-3 slides each)

### Pattern 6: Layered Structure for Diverse Audiences
- **Use when:** All-hands meetings, steering committees, multi-stakeholder forums
- **Structure:** Layer 1 (Executive BLUF, 1 slide) → Layer 2 (Management SCIPAB, 6-8 slides) → Layer 3 (Technical IMRAD/Stack, appendix)

---

## Compression Patterns

### SCIPAB Compression

| Time Available | Compression | What's Kept |
|----------------|-------------|-------------|
| 15+ minutes | Full SCIPAB | All 6 elements |
| 10-15 minutes | SCIP + Action | Drop Benefit (implied) |
| 5-10 minutes | SCI + Position | Situation, Complication, Implication, Position |
| 3-5 minutes | **SCB** | Situation, Complication, Benefit |
| <3 minutes | **CB** | Complication, Benefit only |

### SCQA Compression

| Time Available | Compression | What's Kept |
|----------------|-------------|-------------|
| 10+ minutes | Full SCQA | All 4 elements with supporting points |
| 5-10 minutes | SC + Answer | Fold Question into Answer |
| <5 minutes | **C+A** | Complication, Answer only |

### Pyramid Compression

| Time Available | Compression | What's Kept |
|----------------|-------------|-------------|
| 15+ minutes | Full Pyramid | Answer + 3 arguments + evidence for each |
| 10-15 minutes | Answer + 3 arguments | Evidence on request |
| 5-10 minutes | Answer + 1 argument | Strongest reason only |
| <5 minutes | **BLUF only** | Single sentence recommendation |

### PSI Compression

| Time Available | Compression | What's Kept |
|----------------|-------------|-------------|
| 10+ minutes | Full PSI | Problem + Solution + Impact with evidence |
| 5-10 minutes | P + I | Problem, Impact (solution implied) |
| <5 minutes | **P+I headline** | One sentence each |

### General Rule

> If presentation time < 10 minutes, avoid any framework with > 4 elements.

---

## Context-Based Failure Prevention

### When Audience is Time-Constrained
- **High-risk:** IMRAD, SCIPAB, Tech Stack
- **Safe alternatives:** Pyramid (BLUF), PSI (compressed), SCR

### When Audience is Skeptical/Technical
- **High-risk:** Pyramid, PSI, SCQA (without evidence)
- **Safe alternatives:** IMRAD-lite, SCQA + evidence appendix, Inverted Pyramid
- **Rule:** Build to conclusions rather than asserting them. Evidence before answer.

### When Stakes are High (Career/Budget/Safety)
- **High-risk:** PSI, SCR, abbreviated anything
- **Safe alternatives:** Full SCIPAB, Pyramid + Risk analysis, SCQA + Caveats
- **Rule:** Never omit risk acknowledgment in high-stakes presentations.

### When Audience is Mixed (Technical + Executive)
- **High-risk:** Pure IMRAD, Pure Tech Stack, Pure Pyramid
- **Safe alternatives:** SCIPAB, SCQA + appendix, Layered structure
- **Rule:** Primary deck serves least-technical audience; appendix serves most-technical.

---

## Framework Switching Patterns

### Mid-Preparation Switches

| If you started with... | And you realize... | Switch to... |
|------------------------|-------------------|--------------|
| IMRAD | Audience is executive-heavy | Pyramid + IMRAD appendix |
| Pyramid | Audience is skeptical technical | SCQA + evidence layers |
| PSI | Topic has significant risks | PSI + Constraints OR SCIPAB |
| SCIPAB | Time is <10 minutes | SCB or SCQA |
| Tech Stack | Audience includes non-technical | SCQA opening + Stack appendix |

### Mid-Presentation Recovery

| If audience signals... | They probably need... | Pivot to... |
|------------------------|----------------------|-------------|
| "So what?" | Implications | Jump to Implication/Benefit slide |
| "How do you know?" | Evidence | Pull up evidence appendix |
| "What do you want?" | Action clarity | Jump to Action/Decision slide |
| Lost/confused looks | Simpler structure | "Let me summarize..." (BLUF recap) |
| Impatience | Shorter version | Compress to 3-slide summary |

---

## Pre-Flight Checklist

Before any presentation, verify:

- [ ] **Audience match:** Framework suits the least-technical decision-maker in the room
- [ ] **Time match:** Number of elements fits available time (rough guide: 2-3 minutes per element)
- [ ] **Stakes match:** Risk acknowledgment appropriate to decision weight
- [ ] **Evidence match:** Claims supported at level audience requires
- [ ] **Action clarity:** Audience will know exactly what to do after
- [ ] **Backup ready:** Slides available for likely deep-dive questions

---

## Time Allocation Guides

### 30-Minute Presentation (SCIPAB)

| Element | Time | Slides |
|---------|------|--------|
| Situation | 3 min | 2 |
| Complication | 4 min | 2 |
| Implication | 3 min | 2 |
| Position | 6 min | 3 |
| Action | 4 min | 2 |
| Benefit | 3 min | 2 |
| Q&A buffer | 7 min | — |
| **Total** | **30 min** | **~13 slides** |

### 15-Minute Presentation (SCQA)

| Element | Time | Slides |
|---------|------|--------|
| Situation | 2 min | 1 |
| Complication | 3 min | 1-2 |
| Question | 1 min | 1 |
| Answer (Pyramid) | 6 min | 4 |
| Action | 3 min | 1 |
| **Total** | **15 min** | **~8-9 slides** |

### 5-Minute Lightning Talk (PSI)

| Element | Time | Slides |
|---------|------|--------|
| Problem | 1.5 min | 1 |
| Solution | 2 min | 2 |
| Impact | 1.5 min | 1 |
| **Total** | **5 min** | **~4 slides** |

---

## Framework Seeds (for STAGING.md)

Templates used during synthesis (Phase 1) to seed framework content:

### SCIPAB Seed
```markdown
**Situation:** [Current state from sources]
**Complication:** [Problem/tension identified]
**Implication:** [Needs interrogation input — or use default in Quick Mode]
**Position:** [Thesis emerging from arguments]
**Action:** [Needs interrogation input — or use default in Quick Mode]
**Benefit:** [Potential outcome from sources]
```

### SCQA Seed
```markdown
**Situation:** [Set the scene from sources]
**Complication:** [Disruptive event/problem]
**Question:** [Burning question arising from complication]
**Answer:** [Response with supporting points]
```

### PSI Seed
```markdown
**Problem:** [Pain point from sources]
**Solution:** [Approach/capability]
**Impact:** [Measurable results]
**Constraints (optional):** [Honest limitations]
```

### Pyramid Seed
```markdown
**BLUF:** [Bottom line recommendation]
**Argument 1:** [Supporting reason]
**Argument 2:** [Supporting reason]
**Argument 3:** [Supporting reason]
**Evidence:** [Data points for each argument]
```

---

## Interpretive Notes

1. **No framework is "better" in isolation.** Effectiveness depends on audience composition, decision stakes, time constraints, and required level of technical validation.
2. **Most failures come from misapplied defaults.** Common pattern: technical teams default to IMRAD or stack walkthroughs; non-technical stakeholders disengage before implications are clear.
3. **Frameworks are often combined — but never equally.** Effective presentations use one primary framework and supplement with others for validation or depth.

---

_Framework definitions, selection matrices, failure modes, and adaptation patterns._
