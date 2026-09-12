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
- Diagnose 3 (still silent after backslash form): probe experiment — point
  entry at a guaranteed-nonexistent path. If a loader error surfaces, the
  loader reads `cli.json` and the issue is path resolution. If still
  silent, the TUI is not picking up `cli.json` at all.
- Diagnose 4 (probe silent; dual TUI processes found and cleaned): root
  cause found in V2 docs (`/v2/docs/cli/plugins`) — plugins exposing a TUI
  component load AUTOMATICALLY from server config (`opencode.json(c)`), and
  `cli.json` is only for CLI-only plugins. Our entry was on the wrong
  route. Fix: `cli.json` plugins emptied; global `config.json` gets
  `plugins: ["file:///C:/Users/wahyu/Downloads/STT-Opencode-Plugins"]`;
  service restarted. `SPECS.md` corrected to the server-config route.
- Diagnose 5 (server `/api/plugin` lists builtins only; log shows NO
  `loading plugin` line for our `file://` entry — vs npm entries and the
  global discovery dir, both proven in this machine's log history):
  `file://` config entries are silently ignored here. Fix: use the proven
  route — symlink workspace into global discovery dir
  (`~/.config/opencode/plugins/stt-opencode2 -> workspace`);
  `file://` entries removed from `config.json`; `opencode.json` (created
  earlier as a probe) deleted to keep a single route. `SPECS.md` corrected.

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
