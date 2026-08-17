# Contract: Pack Manifest

**Owner**: the pipeline defines the contract; each pack owns its own manifest.
**Discovery**: by directory scan. There is no registry file to edit (R2).

A pack is a directory under `packs/` containing `pack.json`. Adding a pack MUST touch
**zero files outside that directory** — this is the mechanical test for Constitution
Principle IV and for SC-002 / SC-003.

```text
packs/
├── research/                 ← vocabulary pack
│   ├── pack.json
│   ├── types/                ← one content schema per slide type
│   ├── themes/
│   └── rules.json
├── keynote/                  ← vocabulary pack
│   └── …
├── presentation-file/        ← delivery format pack
│   ├── pack.json
│   └── render.mjs
├── web/
├── document/                 ← derives from presentation-file
├── spoken-script/
├── rundown/
└── storyboard/
```

---

## Vocabulary pack manifest

```jsonc
{
  "id": "keynote",
  "kind": "vocabulary",
  "slide_types": {
    "STATEMENT": { "schema": "types/statement.schema.json" },
    "QUESTION":  { "schema": "types/question.schema.json" }
  },
  "compiler": "compile.mjs",
  "themes": { "navy": "themes/navy.json", "black": "themes/black.json" },
  "default_theme": "navy",
  "attribution_styles": ["none"],
  "rules": "rules.json"
}
```

| Field | Required | Notes |
|---|---|---|
| `id` | yes | MUST equal the directory name. Discovery relies on it. |
| `kind` | yes | `vocabulary`. |
| `slide_types` | yes | Type name → path to its content schema, relative to the pack. |
| `compiler` | yes | Entry point translating slide content into layout primitives. |
| `themes` | yes | Theme name → token file. At least one. |
| `default_theme` | yes | MUST appear in `themes`. |
| `attribution_styles` | no | Omitted means the vocabulary carries no attributions. |
| `rules` | no | Path to declared verification rules. |

### Compiler entry point

```
compile({ slide, theme_tokens }) → { primitives: [LayoutPrimitive], notes, attributions }
```

Contract obligations:

- MUST emit only primitive kinds from the pipeline's closed set (see `render-ir.md`).
- MUST NOT reference any delivery format id. A compiler containing the string
  `presentation-file` or `web` is a defect, and SC-013 is checked by exactly that search.
- MUST NOT branch on output format in any form — no "if rendering to web" logic.
- MUST preserve the slide `id` onto the unit it produces.

A vocabulary needing a primitive that does not exist raises it against the **pipeline's
primitive set** (FR-036). It does not invent one locally, and it never asks a delivery
format to special-case it.

### Declared rules

Rules are **data, not code**. The shared verifier interprets them generically and MUST
NOT branch on pack id (FR-010).

```jsonc
{
  "rules": [
    { "id": "notes-word-band", "kind": "notes_word_count",
      "min": 6, "max": 80, "severity": "warn",
      "exempt_types": ["TITLE", "CLOSE"] },

    { "id": "content-slide-cited", "kind": "attribution_required",
      "severity": "warn", "exempt_types": ["TITLE", "CLOSE"] },

    { "id": "no-adjacent-repeat", "kind": "no_adjacent_same_type",
      "severity": "warn" },

    { "id": "opens-and-closes", "kind": "required_boundary_types",
      "first": "TITLE", "last": "CLOSE", "severity": "error" }
  ]
}
```

`kind` MUST be one the verifier implements. A rule the verifier cannot express is a gap
in the rule vocabulary, closed by extending the verifier's rule kinds — never by
special-casing a pack. `severity` is `error` (hard-fails the gate) or `warn` (reported,
does not block).

---

## Delivery format pack manifest

```jsonc
{
  "id": "document",
  "kind": "target",
  "produces": "document",
  "supported_primitives": "*",
  "carries": {
    "unit_identity": true,
    "content": true,
    "notes": true,
    "attributions": true,
    "surfaces": ["visual"]
  },
  "verification_adapter": "extract.mjs",
  "derives_from": "presentation-file",
  "requires": ["office-converter"]
}
```

| Field | Required | Notes |
|---|---|---|
| `id` | yes | MUST equal the directory name. |
| `kind` | yes | `target`. |
| `produces` | yes | `presentation-file` \| `web` \| `document` \| `text`. |
| `supported_primitives` | yes | Array of **primitive kinds**, or `"*"`. Drives FR-011. |
| `carries` | yes | Field and surface capabilities. See below. |
| `verification_adapter` | yes | Extraction entry point (FR-037). |

### `carries` — declared field capability

| Key | Meaning |
|---|---|
| `unit_identity` | Artifact preserves slide `id`. When false the verifier compares positionally and says so. |
| `content` | Artifact carries visible unit text. Always true in practice; declared for completeness. |
| `notes` | Artifact has a speaker-notes channel. |
| `attributions` | Artifact can render attributions distinguishably from body content. |
| `surfaces` | Which gate surfaces exist — `visual`, or empty for text-only artifacts. |

**Why this must be declared rather than inferred.** The verifier has to distinguish a
format that *has no notes channel* from a format that *lost the notes*. The first is
correct behaviour; the second is exactly the defect FR-016 exists to catch. Without a
declaration those two are indistinguishable, and the verifier must either fail every
text-only format or excuse every dropped note.

**Interaction with FR-016.** The `notes_missing` hard failure applies only where
`carries.notes` is true, and `attributions_missing` only where `carries.attributions` is
true. This is not a weakening of FR-016 — a format that declares `notes: true` or
`attributions: true` and then drops them still hard-fails. It scopes each check to the
formats where the requirement is meaningful.

**Not self-certification.** A gate reports `not_applicable` only where `carries.surfaces`
lacks that surface, and an adapter's `absent_fields` must agree with `carries`. A format
cannot dodge a check by claiming at runtime that it never carried the field — disagreement
between the two is a packaging defect and is reported as one.
| `requires` | no | External toolchain ids. Unmet → reported unavailable (FR-031, R6). |
| `derives_from` | no | Another format id. Mutually exclusive with implementing `render`. |
| `entry` | conditional | Renderer entry point. Required unless `derives_from` is set. |

**`supported_primitives`, never `supported_types`.** A target listing slide type names
would be coupled to the vocabularies that define them — the exact defect R11 removes. The
field name is deliberately not the obvious one, so that writing the coupled version
requires inventing a field the manifest validator will reject.

### Renderer entry point

```
render({ renderIR, stagingDir, capabilities }) → RenderResult
```

`RenderResult`: `{ ok, artifacts: [path], warnings: [string] }`.

Contract obligations:

- Receives the **Render IR**, not the deck plan. It has no access to slide types, the
  vocabulary id, or the plan (FR-034).
- MUST NOT mutate `renderIR`.
- MUST NOT read source material (Principle I).
- MUST write only inside `stagingDir`. Writing to a delivered location is forbidden —
  promotion is the pipeline's job, after gates pass (FR-038, R14).
- MUST fail rather than silently omit a unit it cannot render.
- A pack declaring `derives_from` MUST NOT implement `render`; it receives the upstream
  format's staged artifacts and converts them (R4).

### Verification adapter entry point

```
extract({ artifactPath }) → { units: [{ id, content, notes, attributions }], count }
```

Contract obligations:

- **Extracts only. Never judges.** The shared verifier does all comparison against the
  plan, so verification rules live in one place and pack knowledge stays out of the
  verifier (R13).
- Reports a field as absent when the format genuinely cannot carry it — a plain-text
  artifact has no notes channel — rather than fabricating a value.
- MUST NOT read the plan or the Render IR. It reads the artifact and nothing else;
  otherwise it could "extract" what it already knows should be there, which would make
  structural verification vacuous.

---

## Isolation tests — both directions

The mechanical check that Principle IV holds. This is a test, not a review habit (R9).

**It must run in both directions.** The original single-direction version would not have
caught the defect an external review found, because that defect edited a *sibling pack*
rather than the core — and a test that only watches the core cannot see it.

**Direction A — add a vocabulary:**

1. Record the file-level state of the repository.
2. Add a throwaway vocabulary pack with a minimal manifest, content schema, and compiler.
3. Run discovery, validate a plan, compile, render to an *existing* delivery format.
4. Assert every changed file is inside the new pack's directory. **In particular, assert
   no delivery format pack changed.**

**Direction B — add a delivery format:**

1. Record the file-level state.
2. Add a throwaway target pack with a minimal manifest, renderer, and extraction adapter.
3. Render an *existing* vocabulary's plan to it.
4. Assert every changed file is inside the new pack's directory. **In particular, assert
   no vocabulary pack changed.**

**Direction C — the reference check (SC-013):** search every vocabulary pack for any
delivery format id, and every delivery format pack for any vocabulary id or slide type
name. Both must return nothing. This catches coupling that a diff would miss because it
was written that way from the start rather than introduced as an edit.

If any of the three fails, the shared layer is at fault and is fixed there — a missing
primitive is added to the pipeline's set, not worked around in a pack (FR-036, User Story 2
scenario 3).
