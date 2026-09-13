# stt-opencode2 (Alpha)

Speech-to-text for the OpenCode TUI on Windows.

One hotkey starts recording, the same hotkey stops it. The transcript
pops in a dialog and lands in the clipboard. Paste it into the
composer from there. Alpha sends nothing on its own.

Three languages ship in the menu: `auto`, Indonesian (`id`), English
(`en`). Tuning targets those two. Anything else falls back to `auto`,
and Whisper detects plenty on its own.

## Install

A mic, SoX, ffmpeg as backup, OpenCode v2.x, and a Groq key cover the
requirements. Three routes below.

### Route A: workspace

Best for single-repo use. Clone the repo, open the TUI from its root.

1. Clone and enter the repo:

   ```powershell
   git clone <repo-url>
   cd STT-Opencode-Plugins
   ```

2. Launch the TUI:

   ```powershell
   opencode
   ```

3. The `Voice plugin loaded` toast means the plugin is live. `/voice`
   answers, the hotkey works.

Open the TUI from another folder and the plugin stays quiet.

### Route B: global, every folder

One copy serves every folder.

1. Copy `.opencode/plugins/stt-opencode2` from the repo into
   `~/.config/opencode/plugins/stt-opencode2`. Move the files, not a
   link. Symlinks never load. The scanner skips them.
2. Restart the TUI so the service picks up the new folder.
3. Open the TUI anywhere. The loaded toast confirms.

Delete that folder and restart to undo. Nothing else changes.

### Route C: ask an agent

Hand the block below to an agent. It checks the tools and copies the
files. No manual steps.

```text
Install the stt-opencode2 voice plugin globally on this Windows machine:
1. Verify sox, ffmpeg, and opencode exist (Get-Command). Report what is
   missing. Stop when SoX is absent.
2. Clone <repo-url> to a temp dir, or ask where the repo sits.
3. Back up ~/.config/opencode/plugins/stt-opencode2 first when it exists.
   Then copy .opencode/plugins/stt-opencode2 from the repo there.
   Copy files, no symlinks.
4. Confirm these 5 files landed: index.ts, tui.ts, lib/recorder.ts,
   lib/transcribe.ts, lib/clipboard.ts.
5. Tell the user to restart the TUI, open it from any folder, and look
   for the "Voice plugin loaded" toast.
Put no API key in any file. Push and publish nothing.
```

## API key

Groq handles transcription. Its free tier wants a key, and that key
belongs in the environment. Files never hold it.

1. Sign up at https://console.groq.com/keys and create a key. Copy
   the `gsk_...` value.
2. Save it to the account once:

   ```powershell
   setx GROQ_API_KEY "gsk_..."
   ```

3. Close that terminal, open a new one. `setx` leaves the current
   shell untouched.
4. Launch `opencode` from the new shell.
5. Confirm without printing the key:

   ```powershell
   $env:GROQ_API_KEY.Length
   ```

   A positive number means the key is set. Empty output points back
   to step 2 or 3.

A shell without the key gets a missing-key toast instead of a
transcript.

## Usage

- `ctrl+x v` (`ctrl+x`, then `V`) starts recording. Press again to
  stop. Recording stops by itself at 120 seconds.
- `/voice` toggles the same way through the slash menu or palette.
- `/voice-lang` picks `auto`, `id`, or `en`. The choice survives TUI
  restarts. The recording toast names the active one (`[lang id]`).

Every run follows one path. The transcribing toast appears, the full
text pops in a dialog, confirmation brings a success toast with the
char count. The clipboard holds the text, ready to paste.

### Other languages

Forcing a specific third language means adding its ISO code to
`VoiceLang` plus the dialog options in `tui.ts`. That extension waits
for Beta. Until then, `auto` covers the gap.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `GROQ_API_KEY is not set` | The TUI shell lacks the key. Run `setx`, open a fresh terminal, relaunch. |
| `Groq rejected the key (401)` | Wrong or revoked key. Generate a new one. |
| `rate limit hit (429)` | Free-tier limit hit. Wait a minute, retry. |
| `Recording too large (413)` | Keep takes under 120s. Auto-stop guards this. |
| `Cannot record: sox exited early` | SoX finds no mic. SoX here uses `waveaudio 0`. Check the mic in Windows Settings. |
| Dialog shows text, prompt stays empty | Alpha works this way. Paste it over by hand. |
| `Copy failed` warning | The clipboard fallback failed too. Retype from the dialog text. |

## Documentation

- `docs/ARCHITECTURE.md`: design, components, locked decisions.
- `docs/DEVELOPER_GUIDE.md`: setup, checks, live-test protocol.
- `docs/CONTRIBUTING.md`: scope lock, PR requirements.
- `SPECS.md`: locked scope. `CHANGELOG.md`: notes per tag.

## License

MIT. Read `LICENSE`.
