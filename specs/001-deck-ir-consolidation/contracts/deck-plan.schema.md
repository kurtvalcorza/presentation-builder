# Contract: Deck Plan Core Envelope Schema

**Owner**: the pipeline. Vocabulary packs MUST NOT modify this file.
**Consumers**: intake (writes plans), validator, every delivery format pack.

JSON Schema 2020-12. This schema validates the **envelope only**. Each slide's `content`
is dispatched to the schema supplied by the declared vocabulary pack for that slide's
`type` (see `pack-contract.md`).

```jsonc
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "deck-plan/v1",
  "type": "object",
  "required": ["schema_version", "title", "vocabulary", "slides"],
  "additionalProperties": false,
  "properties": {
    "schema_version": { "const": 1 },
    "title":          { "type": "string", "minLength": 1 },
    "vocabulary":     { "type": "string", "pattern": "^[a-z0-9][a-z0-9-]*$" },
    "theme":          { "type": "string", "pattern": "^[a-z0-9][a-z0-9-]*$" },
    "targets": {
      "type": "array",
      "items": { "type": "string", "pattern": "^[a-z0-9][a-z0-9-]*$" },
      "uniqueItems": true
    },
    "attribution_style": { "type": "string" },
    "slides": {
      "type": "array",
      "minItems": 1,
      "items": { "$ref": "#/$defs/slide" }
    }
  },
  "$defs": {
    "slide": {
      "type": "object",
      "required": ["id", "type", "content", "notes"],
      "additionalProperties": false,
      "properties": {
        "id":      { "type": "string", "pattern": "^[a-z0-9][a-z0-9-]*$" },
        "type":    { "type": "string", "minLength": 1 },
        "content": { "type": "object" },
        "notes":   { "type": "string", "minLength": 1 },
        "attribution": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["text"],
            "additionalProperties": false,
            "properties": {
              "text":   { "type": "string", "minLength": 1 },
              "source": { "type": "string" }
            }
          }
        },
        "duration_sec": { "type": "number", "exclusiveMinimum": 0 }
      }
    }
  }
}
```

## Constraints not expressible in the schema

The validator MUST additionally enforce, and report with the same slide/field precision:

| # | Constraint | Requirement |
|---|---|---|
| C1 | `vocabulary` names a discoverable pack | FR-002 |
| C2 | every `targets` entry names a discoverable pack | FR-002 |
| C3 | every `slides[].type` is offered by the declared vocabulary | FR-002 |
| C4 | every `slides[].id` is unique within the plan | data-model |
| C5 | `theme` is offered by the declared vocabulary | FR-002 |
| C6 | `attribution_style` is supported by the declared vocabulary | FR-002 |
| C7 | each `slides[].content` validates against the vocabulary's schema for its `type` | FR-002 |
| C8 | each vocabulary-declared rule holds | FR-010 |

## Error report shape

Every failure — schema or constraint — reports through one structure so FR-003 holds
uniformly:

```jsonc
{
  "valid": false,
  "errors": [
    {
      "slide_id": "opening-claim",      // null for deck-level errors
      "slide_index": 0,                  // null for deck-level errors
      "path": "content.figures[1].value",
      "code": "content_schema",
      "message": "expected string, received number"
    }
  ]
}
```

`code` is one of: `envelope_schema`, `content_schema`, `unknown_vocabulary`,
`unknown_target`, `unknown_type`, `duplicate_id`, `unknown_theme`,
`unknown_attribution_style`, `vocabulary_rule`.

## Design notes

**Why `id` and not an ordinal.** Both superseded plan formats keyed slides by a 1-based
number, which meant every reorder, insertion, or deletion required manually re-keying
the plan and its parallel notes file — and nothing detected notes baked onto the wrong
slide. A stable string id makes FR-006 structural rather than procedural.

**Why `notes` is required.** Both superseded verifiers hard-fail a slide with no speaker
notes, and the spoken-script delivery format cannot render without it. Making it
required at the schema level moves that failure from build time to authoring time.

**Why `content` is an opaque object here.** Any attempt to describe content generically
produces a union of every field every vocabulary might want, all optional — which
validates nothing and makes FR-003 unachievable. Opacity at this layer is what lets the
vocabulary layer be strict.

**Why `additionalProperties: false` throughout.** A permissive envelope would let packs
smuggle in fields the core cannot see, and FR-011 depends on the core knowing everything
a plan asks for.
