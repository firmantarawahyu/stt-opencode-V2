# stt-opencode2 (Alpha)

Speech-to-text for the OpenCode V2 TUI on Windows.

One hotkey starts recording, the same hotkey stops it. The transcript
pops in a dialog and lands in the clipboard. Paste it into the
composer from there. Alpha sends nothing on its own.

Three languages ship in the menu: `auto`, Indonesian (`id`), English
(`en`). Tuning targets those two. Anything else falls back to `auto`,
and Whisper detects plenty on its own.

## Install

A mic, SoX, ffmpeg as backup, OpenCode v2.x, and a Groq key cover the
requirements. Two needs exist. Daily use pulls the plugin folder
alone. Code changes need the full repo.

Repo:

```text
https://github.com/firmantarawahyu/stt-opencode-V2.git
```

Plugin folder inside the repo:

```text
.opencode/plugins/stt-opencode2
```

### Use only, no contribute

Sparse checkout fetches that folder and skips the rest.

```powershell
git clone --filter=blob:none --sparse https://github.com/firmantarawahyu/stt-opencode-V2.git stt-tmp
cd stt-tmp
git sparse-checkout set .opencode/plugins/stt-opencode2
```

The plugin is live after one copy.

For every folder (global):

```powershell
Copy-Item -Recurse .opencode/plugins/stt-opencode2 $HOME/.config/opencode/plugins/stt-opencode2 -Force
```

For one repo (workspace): copy that folder into
`<repo>/.opencode/plugins/stt-opencode2`, then open the TUI from the
repo root.

Restart the TUI. The `Voice plugin loaded` toast confirms. Delete the
target folder and restart to undo.

Symlinks never load. The scanner skips them. Copy files.

### Contribute

Full clone keeps docs, specs, and logs beside the code.

```powershell
git clone https://github.com/firmantarawahyu/stt-opencode-V2.git
cd stt-opencode-V2
opencode
```

### Ask an agent

Paste the block below to an agent. It fetches the plugin folder
alone and copies the files. No manual steps.

```text
Install stt-opencode2 globally on this Windows machine.

Repo: https://github.com/firmantarawahyu/stt-opencode-V2.git
Plugin folder in repo: .opencode/plugins/stt-opencode2
Target: $HOME/.config/opencode/plugins/stt-opencode2

Steps:
1. Check sox, ffmpeg, opencode with Get-Command. List what is missing. Stop when SoX is missing.
2. Sparse-clone the repo to a temp dir, fetching the plugin folder only.
3. When the target folder exists, back it up with a timestamp suffix.
4. Copy the plugin folder to the target. Copy files, no symlinks.
5. Confirm 5 files exist: index.ts, tui.ts, lib/recorder.ts, lib/transcribe.ts, lib/clipboard.ts.
6. Report done. Ask for a TUI restart plus the "Voice plugin loaded" toast check.

Rules: put no API key in any file. Push and publish nothing.
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
