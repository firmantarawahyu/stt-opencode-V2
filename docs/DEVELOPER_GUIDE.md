# Developer Guide

## Development Setup

### Prerequisites

- Windows (win32), OpenCode v2.x.
- SoX (`sox`) with a working mic; ffmpeg as fallback.
- `GROQ_API_KEY` in the environment for live transcription tests
  (persistent User var via `setx`, then a fresh terminal).

### Clone & Open

```powershell
git clone <repo-url>
cd STT-Opencode-Plugins
opencode   # cwd MUST be the workspace: the plugin loads per-location
```

There is no `package.json` and no build step by design — the host
loads `.opencode/plugins/stt-opencode2/` sources directly
(`index.ts` server stub, `tui.ts` + `lib/`).

### Project Structure

```
.opencode/plugins/stt-opencode2/
├── index.ts          # server stub (import-free plain object)
├── tui.ts            # toggle state machine, keymap, dialogs, toasts
└── lib/
    ├── recorder.ts   # SoX primary + ffmpeg fallback + 120s timer
    ├── transcribe.ts # Groq upload, locked model, error map
    └── clipboard.ts  # clip.exe primary + powershell fallback
SPECS.md               # locked scope (changes need user confirmation)
TODO.md                # gate checklist
LOGS.md                # work trail (only place for logs/summaries)
```

## Development Workflow

Gates run strictly in order (0 → 6): spec exit criteria → build →
check + diagnose by execution → pass → sign off in `LOGS.md` → merge
the gate branch into `master`. One branch per gate (`gate-N-…`).
`master` stays green; local commits only, no push unless the user
explicitly says so.

## Testing

### Static checks

```powershell
node --check .opencode/plugins/stt-opencode2/tui.ts
node --check .opencode/plugins/stt-opencode2/index.ts
node --check .opencode/plugins/stt-opencode2/lib/recorder.ts
node --check .opencode/plugins/stt-opencode2/lib/transcribe.ts
node --check .opencode/plugins/stt-opencode2/lib/clipboard.ts
```

### Transcription error map (mocked, no key needed)

```powershell
node --experimental-strip-types -e "import('./.opencode/plugins/stt-opencode2/lib/transcribe.ts').then(async (m) => { /* stub global fetch per status, assert toHumanError */ })"
```

Cover: missing-key, 401, 429, 413, generic failure, ok-path.

### Clipboard round-trip

```powershell
node --experimental-strip-types -e "import('./.opencode/plugins/stt-opencode2/lib/clipboard.ts').then(async (m) => { await m.copyToClipboard('probe 123'); })"
powershell -NoProfile -Command '$c = Get-Clipboard -Raw; if ($c -eq "probe 123") { "MATCH" } else { "MISMATCH" }'
```

### Live TUI tests (need mic + key)

- Record/stop: `<leader>v`, speak ~5s, `<leader>v` → dialog text
  equals pasted clipboard content, closes cleanly, success toast.
- Language: `/voice-lang` → pick → toast → restart TUI →
  previous choice pre-selected (persistence proof).
- Server check: log shows `loading plugin … stt-opencode2` with no
  failure; `opencode api get '/api/plugin?location[directory]=<workspace>'`
  lists it `active` (location-scoped query required).

## Debugging

- **Server/plugin load**: `C:\Users\wahyu\.local\share\opencode\log\opencode.log`
  (`loading plugin`, `failed to load plugin`). TUI render crashes do
  NOT reach this log — they print in the terminal instead.
- **`Keymap.Provider is missing`**: `keymap.layer` must run inside a
  component — register from the `app` slot render, never at `setup`
  top level.
- **Stop failed / empty WAV**: SoX needs explicit `-t waveaudio 0`
  here; bare `-d` has no default device on this machine.
- **Slot claims**: return real elements or `null` — a raw string
  return crashed host render (Gate 5 lesson, reverted).

## Resources

- [Architecture](ARCHITECTURE.md) · [Contributing](CONTRIBUTING.md)
- [User docs](../README.md) · [Scope](../SPECS.md) · [Changelog](../CHANGELOG.md)
