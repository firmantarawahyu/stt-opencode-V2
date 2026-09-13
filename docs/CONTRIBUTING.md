# Contributing to stt-opencode2

## Scope lock

`SPECS.md` holds the scope. You change it only with maintainer
approval, and you get that approval before you write code. Alpha
excludes TTS and voice reply, auto-submit, Deepgram, local whisper
models, a full settings screen, a mic picker, and a diagnostics
screen. Propose any of these and you wait for a yes first.

Three rules stand through Alpha:

- You keep API keys in environment variables. No key lands in a file.
- You review before you send. Auto-submit stays out.
- You keep Windows working: paths, shells, clipboard on win32.

## Bugs

1. Search existing issues first.
2. File a new one with a clear title, steps to reproduce, expected
   against actual behavior, your environment (OS, OpenCode version,
   SoX and ffmpeg presence), plus the toast text or `opencode.log`
   lines you saw.

## Features

Open an issue with your use case and the behavior you propose. You
touch the excluded list above, you wait for maintainer sign-off.

## Code

1. Fork, clone, branch per change. Gated work uses `gate-N-…`,
   other work uses `feature/…`.
2. Read the [Developer Guide](DEVELOPER_GUIDE.md) and run its checks
   plus the live-test protocol. You verify by running things
   (`node --check` and the TUI), not by assuming.
3. Update the docs your change touches: user behavior changes
   `README.md`, design changes `ARCHITECTURE.md`. You log checks and
   diagnoses in `LOGS.md`.
4. Commit with a clear prefix: `gate-N: …`, `fix: …`, `docs: …`.

## Pull requests

Your PR merges when it meets all of these:

- ✅ `node --check` passes on all plugin files you touched.
- ✅ You describe the live TUI test you ran, with record, stop,
  dialog, and paste where they apply.
- ✅ No secret sits in any file. Grep `gsk_` before you push.
- ✅ Docs updated, `LOGS.md` entry written for gated work.
- ✅ The maintainer approved.

## Releases

Maintainers merge gates to `master` on pass alone. Tags run `Alpha`,
then `Beta`, then `V0.x.x`. You push each tag yourself, and you update
`CHANGELOG.md` with each one.

## License

You contribute under MIT. Your contributions carry the terms in
`LICENSE`.
