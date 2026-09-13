# stt-opencode2 (Alpha)

Speech-to-text for the OpenCode TUI on Windows.

Press a hotkey to record, press it again to transcribe. The text
lands in a dialog and in your clipboard. Paste it into the
composer yourself and send everything yourself.

The menu ships three languages: `auto`, Indonesian (`id`), English
(`en`). The plugin tunes for those two specifically. You speak
another language, pick `auto`. Whisper detects many languages on its
own, so `auto` follows you without setup.

## Install

What you need is a mic, SoX, ffmpeg as backup, and OpenCode v2.x.
The plugin ships inside this repo, so you clone it and open the TUI
from the repo root.

1. Clone and enter the repo:

   ```powershell
   git clone <repo-url>
   cd STT-Opencode-Plugins
   ```

2. Launch the TUI:

   ```powershell
   opencode
   ```

3. Look for the `Voice plugin loaded` toast. You see it, the plugin
   is live. You run `/voice` and get an answer, your hotkey works.

The plugin loads per folder. You open the TUI from another folder and
it stays unloaded. Alpha stays workspace-only on purpose. Do not
symlink it into `~/.config/opencode/plugins`. The scanner skips
symlinked folders, so a symlink buys you nothing.

## API key

Groq transcribes your audio. Its free tier needs a key. Keep that
key in your environment, in no file, ever.

1. Sign up at https://console.groq.com/keys and create a key. Copy
   the `gsk_...` value.
2. Save it to your account once:

   ```powershell
   setx GROQ_API_KEY "gsk_..."
   ```

3. Close that terminal and open a new one. `setx` skips the shell you
   run it in, so the old window misses the new value.
4. Launch `opencode` from the new terminal.
5. Confirm without printing the key:

   ```powershell
   $env:GROQ_API_KEY.Length
   ```

   A positive number means you set it. Empty output means you missed
   step 2 or 3.

Launch the TUI from a shell that holds the key. You launch from a
shell without it, transcription fails with a missing-key toast.

## Usage

- `<leader>v` (`ctrl+x`, then `V`): start recording. Press again to
  stop. Recording stops on its own at 120 seconds.
- `/voice`: the same toggle through the slash menu or palette.
- `/voice-lang`: pick `auto`, `id`, or `en`. Your choice survives TUI
  restarts. The recording toast names the active one (`[lang id]`).

Each run follows one path: you record, you see a transcribing toast,
the full text pops in a dialog (sitting in your clipboard),
you confirm, you get a success toast with the char count. You then
paste where you want it.

### Other languages

You force a specific third language, you add its ISO code to
`VoiceLang` and the dialog options in `tui.ts`. That extension waits
for Beta. Until then, `auto` covers you.

## Troubleshooting

| What you see | What you do |
|---|---|
| `GROQ_API_KEY is not set` | Your TUI shell lacks the key. Run `setx`, open a fresh terminal, relaunch. |
| `Groq rejected the key (401)` | Your key is wrong or revoked. Generate a new one. |
| `rate limit hit (429)` | You hit the free-tier limit. Wait a minute, retry. |
| `Recording too large (413)` | Keep takes under 120s. Auto-stop guards this for you. |
| `Cannot record: sox exited early` | SoX finds no mic. SoX here uses `waveaudio 0`. Check your mic in Windows Settings. |
| Dialog shows text, prompt stays empty | Alpha works this way. Paste it yourself. |
| `Copy failed` warning | The clipboard fallback failed too. Retype from the dialog text. |

## Documentation

- `docs/ARCHITECTURE.md`: design, components, locked decisions.
- `docs/DEVELOPER_GUIDE.md`: setup, checks, live-test protocol.
- `docs/CONTRIBUTING.md`: scope lock, PR requirements.
- `SPECS.md`: locked scope. `CHANGELOG.md`: notes per tag.

## License

MIT. Read `LICENSE`.
