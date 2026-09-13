# TODO.md — Gate Checklist (Alpha)

Legend: ⬜ open · 🟡 in-progress · 🟩 pass

## Gate 0 — Scaffold & load 🟩

- [x] Canonical `.opencode/plugins/stt-opencode2/` (`index.ts`, `tui.ts`)
- [x] Server log `loading plugin` clean; API → `('stt-opencode2-server', 'active')`
- [x] TUI opens with no module error; setup toast visible (user-confirmed)

## Gate 1 — Hotkey & commands 🟩

- [x] `<leader>v` toggle stub (toast), `/voice` + `/voice-lang` stubs, palette entries
- [x] No provider error (app-slot fix); user-confirmed, no builtin conflicts

## Gate 2 — Recorder 🟩

- [x] SoX records valid WAV to approved temp dir; manual stop works
- [x] Auto-stop proven live (8s temp proof, reverted to 120s, no trace left)
- [x] ffmpeg fallback path exists (code-reviewed; SoX healthy so untriggered)

## Gate 3 — Groq transcription 🟩

- [x] Multipart upload, locked model, env-only key
- [x] Clean error toasts: missing key, 401, 429, 413 (mock-verified + live)
- [x] Correct ID + EN transcription with valid key (user-confirmed live)

## Gate 4 — Output UX 🟩

- [x] Result dialog renders text; clipboard content equals dialog text
- [x] Success toast; dialog closes cleanly

## Gate 5 — Language persistence 🟩

- [x] `/voice-lang` persists via `storage`; survives TUI restart

## Gate 6 — E2E & Alpha release 🟩

- [x] Full flow 1× Indonesian + 1× mixed EN, no log errors
- [x] README Alpha (install, key, troubleshooting); tag `Alpha`
