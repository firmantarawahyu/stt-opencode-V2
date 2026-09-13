# Developer Guide

## Setup

### Requirements

Windows, OpenCode v2.x, SoX with a working mic, ffmpeg as backup. Live
transcription tests also want `GROQ_API_KEY` in the environment. Set
the persistent User var with `setx`, then open a fresh terminal.

### Clone and open

```powershell
git clone <repo-url>
cd STT-Opencode-Plugins
opencode
```

Run the TUI from the workspace root. The plugin loads per folder, so
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
SPECS.md               # locked scope, changed only with user approval
TODO.md                # gate checklist
LOGS.md                # work trail, the one place for logs and summaries
```

## Workflow

Gates run in order, 0 to 6. Each gate states its exit criteria, then
build, check by running things, diagnose what breaks. Pass only when
all criteria hold. Record the sign-off in `LOGS.md`, merge the gate
branch into `master`. One branch per gate (`gate-N-…`). `master`
stays green. Commits stay local. Push only on explicit user say-so.

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

Ship only on `MATCH`. Exact bytes, no trailing newline.

### Live TUI tests

These need a mic and a key.

- Record and stop: `<leader>v`, five seconds of speech, `<leader>v`
  again. Dialog text matches the paste, the dialog closes without
  errors, the success toast follows.
- Language: `/voice-lang`, pick a language, read the toast. Restart
  the TUI, run `/voice-lang` again. The earlier pick comes
  pre-selected. That proves persistence.
- Server: the log shows `loading plugin … stt-opencode2` with no
  failure. The query
  `opencode api get '/api/plugin?location[directory]=<workspace>'`
  lists it `active`. Scope the query to the folder, otherwise the
  entry stays hidden.

## Debugging

- Plugin load trouble lives in
  `C:\Users\wahyu\.local\share\opencode\log\opencode.log`. Search
  `loading plugin` and `failed to load plugin`. Renderer crashes skip
  this file. The terminal shows those.
- `Keymap.Provider is missing` means a top-level `keymap.layer` call
  in `setup`. Register from the `app` slot render instead.
- Dead stop or empty WAV means SoX found no device. Name it:
  `-t waveaudio 0`. Bare `-d` owns no default device on this machine.
- Slot claims return real elements or `null`. A raw string crashed
  host render in Gate 5. A revert followed within the hour.

## Pointers

[Architecture](ARCHITECTURE.md) covers design. [Contributing](CONTRIBUTING.md)
covers the rules. [User docs](../README.md) cover daily use.
[SPECS](../SPECS.md) locks scope. [Changelog](../CHANGELOG.md) tracks
tags.
