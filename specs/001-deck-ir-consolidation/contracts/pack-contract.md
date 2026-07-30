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
  "themes": ["navy", "black", "light"],
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
| `themes` | yes | At least one. |
| `default_theme` | yes | MUST appear in `themes`. |
| `attribution_styles` | no | Omitted means the vocabulary carries no attributions. |
| `rules` | no | Path to declared verification rules. |

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
  "supported_types": "*",
  "derives_from": "presentation-file",
  "requires": ["office-converter"]
}
```

| Field | Required | Notes |
|---|---|---|
| `id` | yes | MUST equal the directory name. |
| `kind` | yes | `target`. |
| `produces` | yes | `presentation-file` \| `web` \| `document` \| `text`. |
| `supported_types` | yes | Array of slide type names, or `"*"`. Drives FR-011. |
| `requires` | no | External toolchain ids. Unmet → reported unavailable (FR-031, R6). |
| `derives_from` | no | Another format id. Mutually exclusive with implementing `render`. |
| `entry` | conditional | Renderer entry point. Required unless `derives_from` is set. |

### Renderer entry point

```
render({ plan, vocabulary, theme, outDir, capabilities }) → RenderResult
```

`RenderResult`: `{ ok, artifacts: [path], warnings: [string] }`.

Contract obligations:

- MUST NOT mutate `plan`.
- MUST NOT read the source material — the plan is the only input (Principle I).
- MUST NOT write outside `outDir`.
- MUST fail rather than silently omit a slide it cannot render.
- A pack declaring `derives_from` MUST NOT implement `render`; it receives the upstream
  format's artifacts and converts them. This is what stops the document format becoming
  a third renderer (R4).

---

## Isolation test

The mechanical check that Principle IV holds — this is a test, not a review habit (R9):

1. Record the file-level state of the repository.
2. Add a throwaway pack directory with a minimal valid manifest.
3. Run discovery, validate a plan, render.
4. Assert the only files added or modified are inside the new pack's directory.

If that assertion fails, the abstraction has leaked and the schema is fixed first,
per Principle IV and User Story 2 scenario 3.
