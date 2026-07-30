# Contract: Command Surface and Verifier Boundary

**Consumers**: the agent operating the skill, and a human at a terminal.

---

## Command surface

All commands read the plan; none of them accept deck *content* as arguments. Content
lives only in the plan (Principle I).

| Command | Purpose |
|---|---|
| `packs` | List discovered packs, their kind, and whether their toolchains are available. |
| `validate <plan>` | Validate envelope + content + declared rules. Renders nothing. |
| `render <plan> --target <id>…` | Render to one or more delivery formats. |
| `verify <artifact> --plan <plan>` | Run the gates against a built artifact. |
| `build <plan> --target <id>…` | `validate` → `render` → `verify`, refusing delivery unless gates pass. |
| `scrub` | Publish-safety check over tracked files. |

### Exit codes

Uniform across commands, so any of them can gate a hook or a pipeline step:

| Code | Meaning |
|---|---|
| 0 | Success. For `verify`/`build`, every gate passed. |
| 1 | Validation or gate failure. Findings printed. |
| 2 | Usage error — unknown pack, bad arguments. |
| 3 | **Incomplete** — a gate could not run. Never conflated with success (FR-019, R6). |
| 4 | Fail-closed — a required input for a safety check was missing (FR-023). |

Exit code 3 is the one that matters most. A missing render toolchain must not exit 0,
because a caller that treats 0 as "verified" would then ship an unverified deck.

### `build` behaviour with several targets

Renders every requested target, then reports per target (FR-020). Partial success is
reported as such and exits non-zero — never presented as full success.

```text
✓ presentation-file   deck.pptx          gates: structural PASS · visual PASS
✓ web                 index.html         gates: structural PASS · visual PASS
✗ document            —                  unavailable: office-converter not found
✓ spoken-script       script.md          gates: structural PASS · visual N/A

3 of 4 targets delivered. Exit 3 (incomplete).
```

---

## Verifier boundary

The presentation-file verifier stays Python and is invoked as a subprocess (R3). The
boundary is JSON on stdout; anything on stderr is diagnostic only.

**Invocation**

```
verify_deck.py --artifact <path> --plan <plan.json> --rules <resolved-rules.json>
```

The caller resolves the vocabulary's declared rules and passes them in. The verifier
therefore has **no knowledge of packs** — it enforces rule kinds, not vocabularies
(FR-010).

**Response**

```jsonc
{
  "deck": "out/deck.pptx",
  "overall": "failed",
  "gates": [
    {
      "name": "structural",
      "status": "failed",
      "findings": [
        { "slide_id": "closing", "code": "notes_missing",
          "severity": "error", "message": "slide has no speaker notes" },
        { "slide_id": "figure-3", "code": "plan_content_absent",
          "severity": "error",
          "message": "plan text 'baseline throughput' not found on rendered slide" }
      ]
    },
    {
      "name": "visual",
      "status": "not_run",
      "reason": "image toolchain not available"
    }
  ]
}
```

**Status semantics**

- `passed` — ran, found nothing at `error` severity.
- `failed` — ran, found at least one `error`.
- `not_run` — could not execute. Carries `reason`.

`overall` is `passed` only if every gate is `passed`; any `not_run` yields `incomplete`.
There is no combination that yields `passed` while a gate did not run.

**Hard-fail codes** (FR-016): `notes_missing`, `slide_count_mismatch`,
`plan_content_absent`, `render_artifact` (icon-font remnants and similar tells of a
broken build).

---

## Scrub check

```
scrub [--denylist <path>]
```

Default denylist path is the repository-local untracked list. Behaviour:

1. **Denylist missing or unreadable → exit 4.** Never exit 0. This is the whole point
   (FR-023): a deleted denylist must not read as "nothing to find".
2. Scan **tracked files only**. Untracked working artifacts legitimately contain denied
   terms and are excluded by ignore pattern (FR-025).
3. Apply each entry in its declared mode — case-sensitive whole word, case-insensitive
   word-with-suffix, or raw regex (FR-024).
4. Any hit → exit 1, reporting file, line, matched term, and mode.

```text
✗ presentation-studio/references/mode-pptx.md:88   matched 'REDACTED' (cs-word)
1 violation across 71 tracked files. Exit 1.
```

The mode system is not decoration. Single-mode substring matching was measured against
the current corpus during specification and produced four false positives — three
ordinary English words containing an acronym as a substring, and one where a currency
code collides with a programming language name. A check with a known false-positive rate
gets bypassed, and a bypassed check protects nothing (R7).
