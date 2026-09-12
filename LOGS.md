# LOGS.md — Work Trail (only place for logs & summaries)

> Every gate records here: checks run, diagnose findings, errors + fixes,
> and the sign-off. `AGENTS.md` must stay free of this content.

## Gate 0 — Scaffold & load

_Status: in-progress (branch `gate-0-scaffold`)._

- Build: `package.json` (exports `./tui` + `.`, dep `@opencode/plugin@2.0.2`),
  `src/index.ts` (server stub), `src/tui.ts` (`Plugin.define`, setup toast).
- Check (machine): `node --check` pass on both TS files; `package.json` and
  global `cli.json` parse as valid JSON; plugin registered by absolute local
  path in `cli.json` `plugins`.
- Check (pending user): open TUI → expect no `Invalid V2 TUI plugin module`
  error + toast `stt-opencode2 / Voice plugin loaded (Gate 0 scaffold)`.
- Note: `opencode plugin check` reports `No package plugins found` — expected,
  ours is a local-path plugin, not an npm package.
- Diagnose: none yet; scaffold follows the exact V2 shape from
  `@opencode/plugin@2.0.2` docs + typings (unlike `opencode-voice@0.1.4`
  which imports `@opencode-ai/plugin`).
- Diagnose 2 (not loaded in TUI, `/plugins` empty, no toast, no error):
  entry not resolved at all (no UI error surfaced, unlike the V1-module
  rejection which DID surface). Suspect: forward-slash absolute Windows
  path `C:/...` not resolved by the CLI loader. Fix attempt: switch to
  backslash-escaped `C:\\...` form. Awaiting user TUI retest.

## Gate 1 — Hotkey & commands

_Status: open._

## Gate 2 — Recorder

_Status: open._

## Gate 3 — Groq transcription

_Status: open._

## Gate 4 — Output UX

_Status: open._

## Gate 5 — Language persistence

_Status: open._

## Gate 6 — E2E & Alpha release

_Status: open._
