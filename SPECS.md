# SPECS.md — Locked Scope for `stt-opencode2` (Alpha)

> Single source of truth for scope. Changes require user confirmation.

## Identity & loading

- Plugin ID: `stt-opencode2`.
- Local package in this workspace, exposed via directory symlink
  `~/.config/opencode/plugins/stt-opencode2` (global discovery dir — the
  only route proven working on this machine; `file://` config entries
  produced zero loader traces). Per V2 docs, the CLI loads the TUI
  component automatically from active plugins; `cli.json` is only for
  CLI-only plugins.
- V2 module shape: `Plugin.define({ id, setup })` from `@opencode/plugin/tui`.
- `package.json` exports `./tui`; dependency `@opencode/plugin` (V2 line).

## Core function (the only one)

- Toggle recording via leader-chord `<leader>v`, plus `/voice` slash command
  and command-palette entry.
- First press: start recording. Second press: stop → transcribe → show result
  in a dialog + auto-copy to clipboard.

## Provider & language

- Groq only. Endpoint `POST https://api.groq.com/openai/v1/audio/transcriptions`.
- Model locked: `whisper-large-v3-turbo`. No model option exposed.
- API key read from `GROQ_API_KEY` env var exclusively.
- `language` option, default `auto`. `/voice-lang` switches between
  `auto` / `id` / `en`, persisted via plugin `storage`.

## Recording (Windows)

- Primary: SoX (`sox -d`, default mic). Fallback: ffmpeg.
- WAV 16kHz mono, written to the approved temp dir
  (`%LOCALAPPDATA%\Temp\opencode`).
- Auto-stop at 120 seconds.

## UX & errors

- Toasts for: recording, transcribing, success, and errors.
- Errors must be human-readable: missing key, no mic / recorder failure,
  401 invalid key, 429 rate limit, 413 file too large.
- No auto-submit in Alpha. Text never leaves the dialog except via clipboard.

## Non-goals (deferred, not in Alpha)

TTS / voice reply, auto-submit, Deepgram provider, local whisper models,
full settings screen, microphone picker, diagnostics screen.
