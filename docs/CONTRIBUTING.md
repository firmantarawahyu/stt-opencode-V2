# Contributing to stt-opencode2

A few rules keep this small plugin shippable. Read them before opening
a PR.

## Scope lock

`SPECS.md` holds the scope. Scope changes need maintainer approval
first. Code comes after the yes. Alpha excludes TTS and voice reply,
auto-submit, Deepgram, local whisper models, a full settings screen, a
mic picker, and a diagnostics screen. Proposals in that list wait for
a yes before any code.

Three rules stand through Alpha:

- API keys live in environment variables. Files hold none.
- Review precedes sending. Auto-submit stays out.
- Windows stays working: paths, shells, clipboard on win32.

## Bugs

1. Search existing issues first.
2. File a new one with a clear title, steps to reproduce, expected
   against actual behavior, the environment (OS, OpenCode version,
   SoX and ffmpeg presence), plus the toast text or `opencode.log`
   lines from the run.

## Features

Open an issue with the use case plus the proposed behavior. Proposals
touching the excluded list wait for maintainer sign-off.

## Code

1. Fork, clone, branch per change. Gated work uses `gate-N-…`,
   other work uses `feature/…`.
2. The [Developer Guide](DEVELOPER_GUIDE.md) covers checks and the
   live-test protocol. Verify by running things (`node --check` and
   the TUI), not by assuming.
3. Update the docs each change touches: user behavior changes
   `README.md`, design changes `ARCHITECTURE.md`. Log checks and
   diagnoses in `LOGS.md`.
4. Commits carry a clear prefix: `gate-N: …`, `fix: …`, `docs: …`.

## Pull requests

A PR merges when all of these hold:

- ✅ `node --check` passes on all plugin files in the change.
- ✅ The description tells which live TUI test ran, with record, stop,
  dialog, and paste where they apply.
- ✅ No secret sits in any file. Grep `gsk_` before pushing.
- ✅ Docs ship updated, with a `LOGS.md` entry for gated work.
- ✅ The maintainer approved.

## Releases

Maintainers merge gates to `master` on pass alone. Tags run `Alpha`,
then `Beta`, then `V0.x.x`. Push each tag by hand and update
`CHANGELOG.md` alongside.

## License

Contributions fall under MIT. The terms sit in `LICENSE`.
