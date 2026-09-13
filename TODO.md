# TODO.md — Gate Checklist (Alpha)

Legend: ⬜ open · 🟡 in-progress · 🟩 pass

## Gate 0 — Scaffold & load 🟩

- [x] Canonical `.opencode/plugins/stt-opencode2/` (`index.ts`, `tui.ts`)
- [x] Server log `loading plugin` clean; API → `('stt-opencode2-server', 'active')`
- [x] TUI opens with no module error; setup toast visible (user-confirmed)

## Gate 1 — Hotkey & commands 🟩

- [x] `<leader>v` toggle stub (toast), `/voice` + `/voice-lang` stubs, palette entries
- [x] No provider error (app-slot fix); user-confirmed, no builtin conflicts

## Gate 2 — Recorder 🟡

- [ ] `<leader>v` toggle stub (toast), `/voice` slash, `/voice-lang` stub,
      palette entries
- [ ] Shortcuts listed, dispatch works, no conflict with built-ins

## Gate 2 — Recorder ⬜

- [ ] SoX records to valid WAV in approved temp dir; manual stop works
- [ ] Auto-stop at 120s; ffmpeg fallback path exists
- [ ] WAV verified playable / correct duration

## Gate 3 — Groq transcription ⬜

- [ ] Multipart upload, locked model, `language` from storage, env-only key
- [ ] Clean error toasts: missing key, 401, 429, 413
- [ ] Correct ID + EN transcription with valid key

## Gate 4 — Output UX ⬜

- [ ] Result dialog renders text; clipboard content equals dialog text
- [ ] Success toast; dialog closes cleanly

## Gate 5 — Language persistence ⬜

- [ ] `/voice-lang` persists via `storage`; survives TUI restart

## Gate 6 — E2E & Alpha release ⬜

- [ ] Full flow 1× Indonesian + 1× mixed EN, no log errors
- [ ] README Alpha (install, key, troubleshooting); tag `Alpha`
