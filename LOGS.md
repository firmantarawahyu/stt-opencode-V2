# LOGS.md — Work Trail (only place for logs & summaries)

> Every gate records here: checks run, diagnose findings, errors + fixes,
> and the sign-off. `AGENTS.md` must stay free of this content.

## Gate 0 — Scaffold & load

_Status: PASS (2026-09-13). Sign-off: server `active` + TUI toast visible,
no errors. Merged to `master`._

- Build: canonical source is now ONLY `.opencode/plugins/stt-opencode2/`
  (`index.ts` server stub plain-object, `tui.ts` V2 `Plugin.define` + setup
  toast). Root `src/` + `package.json` + `node_modules` removed to avoid
  drift (commit `f3a2071`).
- Diagnose trail: `cli.json` route silent (wrong route — CLI-only) →
  `file://` config entries silent (no loader traces at all) → global
  discovery symlink silent (scanner ignores symlinked package dir) →
  flat-file probe proved hot-reload + revealed bare files lack
  `node_modules` resolution → server stub rewritten import-free →
  discovery-layout package dir in repo works.
- Check (server, PASS): log shows `loading plugin
  id="...stt-opencode2" entrypoint=.../index.ts` with no failure;
  `opencode api get '/api/plugin?location[directory]=<workspace>'` →
  85 plugins including `('stt-opencode2-server', 'active')`.
  NOTE: location-scoped query required; default location omits it.
- Check (pending user): open TUI with cwd = workspace → expect no module
  error + toast `stt-opencode2 / Voice plugin loaded (Gate 0 scaffold)`.

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
