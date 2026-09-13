# stt-opencode2 (Alpha)

Speech-to-text TUI plugin for OpenCode V2 (Windows).

Voice input via Groq Whisper: press hotkey to record, press again to
transcribe — result shown in a dialog and auto-copied to clipboard.
Paste manually into the composer (no auto-submit in Alpha, by design).

See `SPECS.md` for scope, `ROADMAP.md` for planning, `TODO.md` for gates.

## Install (workspace-only)

The plugin lives in `.opencode/plugins/stt-opencode2/` of this repo and
loads per-location. Open the TUI with cwd = this workspace:

```
cd C:\Users\wahyu\Downloads\STT-Opencode-Plugins
opencode
```

No global install in Alpha (do not symlink it into
`~/.config/opencode/plugins` — the scanner ignores symlinked dirs).

Requirements: Windows, SoX (`sox`) with a working mic (primary),
ffmpeg as fallback, OpenCode v2.x.

## API key

Groq free tier only. Key comes exclusively from the environment —
never written into any file.

One-time persistent setup (new terminal afterwards):

```
setx GROQ_API_KEY "gsk_..."
```

Check without printing the key:

```
$env:GROQ_API_KEY.Length
[Environment]::GetEnvironmentVariable('GROQ_API_KEY','User').Length
```

The TUI inherits the key from the process that launches it, so start
`opencode` from a terminal that has it.

## Usage

- `<leader>v` (`ctrl+x` then `V`): start/stop recording (auto-stop 120s).
- `/voice`: same toggle via slash command / palette.
- `/voice-lang`: pick transcription language (`auto`/`id`/`en`),
  persisted across TUI restarts. The recording toast shows the active
  one (`[lang id]`).

Flow: record → transcribing toast → dialog with full text (already in
clipboard) → confirm → success toast with char count.

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| `GROQ_API_KEY is not set` | Env missing in the TUI process; `setx` + new terminal, relaunch. |
| `Groq rejected the key (401)` | Wrong/revoked key; check `GROQ_API_KEY`. |
| `rate limit hit (429)` | Groq free-tier limit; wait a minute, retry. |
| `Recording too large (413)` | Keep recordings under 120s (auto-stop handles this). |
| `Cannot record: sox exited early` | Mic/device issue; SoX uses `waveaudio 0`. Check mic in Settings. |
| Transcript dialog shows but prompt stays empty | By design (Alpha): copy/paste manually, no auto-submit. |
| `Copy failed` warning | Clipboard fallback failed; retype from the dialog text. |
