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
| `compile <plan>` | Compile to Render IR and run the FR-011 primitive-support check. Renders nothing. |
| `render <plan> --target <id>…` | Render into **staging**. Never writes to the delivered location. |
| `verify --build <record>` | Run the gates against a staged build. |
| `verify <artifact>` | Re-verify a pre-existing artifact. Reports provenance as **unestablished** (see below). |
| `promote --build <record>` | Atomically move staged artifacts to their delivered location. Refuses unless gates passed. |
| `build <plan> --target <id>…` | `validate` → `compile` → `render` → `verify` → `promote`. The normal path. |
| `scrub [--staged]` | Publish-safety check over tracked **and candidate** files. |

### On `verify <artifact>` without a build record

This form exists because re-verifying a delivered deck is a legitimate need. It is
**not** a way to launder a hand-edited artifact into a verified one: with no build record,
the system cannot establish that the artifact is the output of any particular plan, and it
says so. The two claims are reported differently and MUST NOT be conflated:

- *"This is the verified output of plan X, build Y."* — requires a build record.
- *"These checks passed against this file; provenance not established."* — everything else.

`promote` accepts only the first.

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
✓ presentation-file   deck.pptx     structural PASS   visual PASS (12 slides, automated)
✓ web                 index.html    structural PASS   visual PASS (12 sections, automated)
✗ document            —             unavailable: office-converter not found
✓ spoken-script       script.md     structural PASS   visual N/A (no visual surface)

3 of 4 targets promoted. Exit 3 (incomplete).
```

Every `structural PASS` above is backed by that format's own verification adapter
(FR-037). A format with no adapter cannot report a structural result at all — the earlier
draft of this contract printed passing structural gates for formats that had no verifier,
which is the defect FR-016 and SC-014 now close.

`visual N/A` is distinct from `visual not_run`: a plain-text artifact has no visual
surface, so there is nothing to inspect; a missing toolchain means there *is* something to
inspect and nobody looked. Only the latter forces `incomplete`.

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
2. Scan **tracked files and candidate files** — anything staged, or newly present in the
   working tree and not excluded by ignore pattern (FR-022). Ignored paths are skipped
   deliberately: legitimate working artifacts do contain denied terms, and the ignore
   rules are what keep them unpublished, so the check agrees with them rather than
   fighting them.

   > A tracked-only scan has a hole exactly where it matters most. The absorption step
   > runs this check immediately after copying external material in — at which point that
   > material is untracked, and a tracked-only scan inspects none of it (R15).
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

## Commit-time enforcement

The check runs from a repository hook on every commit, scanning staged content, and a
non-zero exit blocks the commit (FR-040).

Documenting it as "the required pre-commit check" — which the earlier draft did — is a
habit, not a control. Principle VI requires publish safety to be verified on every commit,
and a step someone has to remember is not verification. Installing the hook is part of
project setup, and its absence is itself reported by `packs`.

