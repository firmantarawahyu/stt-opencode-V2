# Developer Guide

## Setup

### What you need

Windows, OpenCode v2.x, SoX with a working mic, ffmpeg as backup. For
live transcription tests you also need `GROQ_API_KEY` in your
environment. Set the persistent User var with `setx`, then open a
fresh terminal.

### Clone and open

```powershell
git clone <repo-url>
cd STT-Opencode-Plugins
opencode
```

Open the TUI from the workspace root. The plugin loads per folder, so
another cwd leaves it unloaded.

No `package.json` exists here, and no build runs. The host loads
`.opencode/plugins/stt-opencode2/` sources as they sit: `index.ts`
for the server stub, `tui.ts` plus `lib/` for the TUI.

### Layout

```
.opencode/plugins/stt-opencode2/
├── index.ts          # server stub, an import-free plain object
├── tui.ts            # toggle state machine, keymap, dialogs, toasts
└── lib/
    ├── recorder.ts   # SoX first, ffmpeg fallback, 120s timer
    ├── transcribe.ts # Groq upload, locked model, error map
    └── clipboard.ts  # clip.exe first, powershell fallback
SPECS.md               # locked scope, you change it only with user approval
TODO.md                # gate checklist
LOGS.md                # work trail, the one place for logs and summaries
```

## Workflow

Gates run in order, 0 to 6. For each gate you state the exit
criteria, build, check by running things, diagnose what breaks, and
pass only when all criteria hold. You record the sign-off in
`LOGS.md` and merge the gate branch into `master`. One branch per
gate (`gate-N-…`). `master` stays green. You commit locally and push
only when the user says so.

## Testing

### Static checks

```powershell
node --check .opencode/plugins/stt-opencode2/tui.ts
node --check .opencode/plugins/stt-opencode2/index.ts
node --check .opencode/plugins/stt-opencode2/lib/recorder.ts
node --check .opencode/plugins/stt-opencode2/lib/transcribe.ts
node --check .opencode/plugins/stt-opencode2/lib/clipboard.ts
```

### Error map without a key

Stub the global fetch per status with
`node --experimental-strip-types`, import `lib/transcribe.ts`, and
assert `toHumanError` for each path: missing key, 401, 429, 413,
generic failure, and the ok path.

### Clipboard round-trip

```powershell
node --experimental-strip-types -e "import('./.opencode/plugins/stt-opencode2/lib/clipboard.ts').then(async (m) => { await m.copyToClipboard('probe 123'); })"
powershell -NoProfile -Command '$c = Get-Clipboard -Raw; if ($c -eq "probe 123") { "MATCH" } else { "MISMATCH" }'
```

You ship only on `MATCH`. Exact bytes, no trailing newline.

### Live TUI tests

You need a mic and a key for these.

- Record and stop: press `<leader>v`, speak five seconds, press
  `<leader>v` again. The dialog text matches your paste, the dialog
  closes without errors, the success toast follows.
- Language: run `/voice-lang`, pick a language, read the toast.
  Restart the TUI, run `/voice-lang` again. Your earlier pick comes
  pre-selected. That proves persistence.
- Server: the log shows `loading plugin … stt-opencode2` with no
  failure. Query
  `opencode api get '/api/plugin?location[directory]=<workspace>'`
  and find it `active`. Scope the query to your folder or the entry
  stays hidden.

## Debugging

- Plugin load trouble lives in
  `C:\Users\wahyu\.local\share\opencode\log\opencode.log`. Look for
  `loading plugin` and `failed to load plugin`. Renderer crashes skip
  this file. You read those in your terminal.
- `Keymap.Provider is missing` means you called `keymap.layer` at
  `setup` top level. Register it from the `app` slot render instead.
- Dead stop or empty WAV means SoX found no device. Name it:
  `-t waveaudio 0`. Bare `-d` owns no default device on this machine.
- Slot claims return real elements or `null`. A raw string crashed
  host render in Gate 5 and the team reverted it the same hour.

## Pointers

[Architecture](ARCHITECTURE.md) covers design. [Contributing](CONTRIBUTING.md)
covers the rules. [User docs](../README.md) cover daily use.
[SPECS](../SPECS.md) locks scope. [Changelog](../CHANGELOG.md) tracks
tags.
