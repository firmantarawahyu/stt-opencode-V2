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

_Status: in-progress (branch `gate-1-hotkey`)._

- Build: `keymap.layer` (global, priority 10) with `stt-voice.toggle`
  (`bind: "<leader>v"`, palette, slash `/voice` + alias) and
  `stt-voice.lang` (palette, slash `/voice-lang`); both run stub toasts.
  `node --check` pass. Hot-reload expected (server watches workspace).
- Risk flagged: `<leader>v` chord format follows the keybind-config
  `<leader>` token convention but is unverified for plugin `bind`.
  Fallback ready: `ctrl+shift+v`.
- Diagnose (TUI error `Keymap.Provider is missing`): `keymap.layer`
  consumes a Solid context provider, so it cannot run at `setup` top
  level. Fix: register the layer from the always-mounted `app` slot
  render; new imports are type-only (erased at runtime). If the error
  persists, next suspect is the `bind` format itself.
_Status: PASS (2026-09-13). Sign-off: no provider error after app-slot
fix; `<leader>v` fires toggle stub; `/voice` + `/voice-lang` stub toasts
work; palette lists both, no conflicts. Merged to `master`._

## Gate 2 — Recorder

_Status: PASS (2026-09-13). Sign-off: manual stop + valid WAV + auto-stop
all proven by execution; ffmpeg fallback code-reviewed only. Merged to
`master`._

- Build: `lib/recorder.ts` (SoX primary `sox -d`, ffmpeg DirectShow
  fallback with device enumeration, graceful stop, 120s auto-stop timer)
  + toggle state machine in `tui.ts`. `node --check` pass on all files.
- ffmpeg device enumeration verified live: 2 audio devices present.
- Check (pending user): `<leader>v` → recording toast; speak ~5s →
  `<leader>v` → success toast with path + size; machine then validates
  the WAV via `sox --i` from the shell.
- Residual risk: ffmpeg fallback path is code-reviewed only (SoX healthy,
  so fallback won't trigger live); WAV header finalization after kill
  is covered by the `sox --i` validation step.
- Diagnose (stop failed ENOENT, file never created): reproduced live —
  `sox -d` fails with "no default audio device configured" on this
  machine. Probing `waveaudio` indices: 0 and 1 record fine (WAV validated
  via `sox --i`), 2 absent. Fix: explicit `-t waveaudio 0` (mic picker
  deferred to Beta per spec) + early-exit detection surfacing recorder
  stderr instead of a bare ENOENT at stat time.

## Gate 3 — Groq transcription

_Status: in-progress (branch `gate-3-transcribe`)._

- Build: `lib/transcribe.ts` (endpoint + locked `whisper-large-v3-turbo`,
  key from `GROQ_API_KEY` env only, `language` param ready default `auto`,
  FormData upload, error map 401/429/413 + missing-key + generic) wired
  into `tui.ts` stop flow (recording → transcribing toast → transcript
  preview toast or human-readable error toast).
- Check (machine, PASS): `node --check` on all 3 files; mocked-fetch run
  via `node --experimental-strip-types` verified all 6 paths:
  missing-key, 401→auth, 429→rate-limit, 413→too-large, 500→request,
  ok→`halo dunia`. Probe file removed after.
- Check (pending user, needs real key): record ID + EN samples, confirm
  transcript toasts correct. `language` storage wiring stays in Gate 5.
_Status: PASS (2026-09-13). Sign-off: user-confirmed live ID + EN
transcription toasts correct, no errors. Merged to `master`._

## Gate 4 — Output UX

_Status: in-progress (branch `gate-4-output`)._

- Build: `lib/clipboard.ts` (clip.exe primary exact-bytes, powershell
  Set-Clipboard fallback) + `tui.ts` stop flow now copy → `dialog.alert`
  (large) → success/warning toast, replacing transcript-preview toast.
  V2 API from `@opencode/plugin@2.0.2` typings: `ui.dialog.alert/set`,
  `ui.toast.show`; no clipboard in TUI API so Node-side copy.
- Check (machine, PASS): `node --check` on all 4 files; clipboard
  round-trip via strip-types import: copy probe 30 chars → Get-Clipboard
  `MATCH` exact, no trailing newline.
- Check (pending user): record short sample → dialog shows full text →
  paste clipboard equals dialog text → confirm closes + success toast.
_Status: PASS (2026-09-13). Sign-off: user-confirmed dialog text correct,
paste equals dialog, closes cleanly + success toast. Merged to `master`._

## Gate 5 — Language persistence

_Status: in-progress (branch `gate-5-lang`)._

- Build: `context.storage.store("voice-lang", { initial: { lang: "auto" } })`
  (durable JSON per V2 typings) + getter/setter on `VoiceState`;
  `transcribe` now uses stored lang; `/voice-lang` opens
  `dialog.select` (auto/id/en, current pre-selected) → persist → toast;
  cancel → "unchanged" toast; recording toast shows `[lang X]`.
- Check (machine, PASS): `node --check` on `tui.ts` + `transcribe.ts`.
  Storage/dialog host APIs are code-reviewed against
  `@opencode/plugin@2.0.2` typings (no local host to mock).
- Check (pending user): pick lang → toast → restart TUI → `/voice-lang`
  pre-selects previous choice (persistence proof).
_Status: PASS (2026-09-13). Sign-off: user-confirmed select+toast,
restart pre-selects `id`, recording toast shows `[lang id]` on keypress
after instant-toast fix. Merged to `master`._
- Diagnose (TUI crash on open/session start): sidebar.footer slot claim
  returning a raw string crashed host render. Reverted immediately
  (`573580e`); recording toast restored to proven Gate 2 text. Sidebar
  indicator deferred — needs a safe render pattern, not a bare string.
- Log check: `opencode.log` shows no server-side error at crash time —
  plugin loads clean, only repeated `cli starting` (user relaunching)
  during the sidebar window, then a clean session start after the
  revert. Crash was renderer-side only (never reaches server log).
- Diagnose (recording toast "missing"): not missing, delayed —
  `toggleVoice` awaited SoX spawn before the toast. Fix (`fde6c90`):
  instant `Starting recording [lang X]…` toast on keypress, existing
  `Recording via <tool>` toast confirms after spawn.

## Fix — setup toast (post-Alpha)

- Follow-up: label changed to plain `ctrl+x v` per user request
  (`f021090`, fused `e93ae49`); global copy refreshed and verified
  (earlier miss was regex `+` in the probe, not the copy).

- User spotted the stale Gate 0 label in the load toast. New text:
  `Voice plugin loaded [lang X]. <leader>v toggles recording.`
  (`b06572f`, fused `e412922`).
- Global copy refreshed (`tui.ts` only) and verified by content
  (equal length + new string present; note: `Get-FileHash` is
  unavailable in this shell, and its absence yields a false
  `IN-SYNC` — always verify by content instead).

## Global install trial (post-Alpha, workspace stays canonical)

- Action: physical copy (NOT symlink — scanner skips those) of the 5
  plugin files to `C:\Users\wahyu\.config\opencode\plugins\stt-opencode2\`
  (`index.ts`, `tui.ts`, `lib/clipboard.ts`, `lib/recorder.ts`,
  `lib/transcribe.ts`). Target dir was absent before, so no backup
  was needed. Repo untouched.
- Machine: server has NOT discovered it yet — default-location
  `/api/plugin` from home lists 84 entries, zero `*stt*`; no
  `loading plugin` line for the global path in `opencode.log`.
  Discovery needs a service/TUI restart.
- Revert (if the trial errors): run
  `Remove-Item -Recurse C:\Users\wahyu\.config\opencode\plugins\stt-opencode2`
  then restart the TUI. That restores the exact pre-trial state.
- Check (pending user): open TUI from another directory (e.g. home),
  expect `Voice plugin loaded` toast + working `/voice` there.

## Gate 6 — E2E & Alpha release

_Status: in-progress (branch `gate-6-release`, workspace-only)._

- Machine (PASS): `node --check` on all 5 plugin files; server
  `opencode.log` has zero ERROR entries since 08:26 UTC (only hits are
  the grep probes themselves).
- Build: `README.md` expanded (install, key, usage, troubleshooting).
- Check (pending user): full flow 1× Indonesian + 1× mixed EN.
_Status: PASS (2026-09-13). Sign-off: user-confirmed ID-only, EN-only,
and auto mixed ID-EN all correct end-to-end (dialog+clipboard+toast).
Tagged `Alpha`, merged to `master`._
