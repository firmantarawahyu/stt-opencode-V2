# Contributing to stt-opencode2

Thank you for your interest in contributing! A few rules keep this
small plugin shippable — please read them before opening a PR.

## Scope lock

`SPECS.md` is the single source of truth. Changes to it need maintainer
confirmation **before** code is written. Currently out of scope for
Alpha (need explicit approval): TTS / voice reply, auto-submit,
Deepgram provider, local whisper models, full settings screen,
microphone picker, diagnostics screen.

Hard constraints (non-negotiable in Alpha):

- API keys from environment variables only — never in any file.
- No auto-submit; review-before-send is inviolable.
- Windows-first: paths, shells, and clipboard must work on win32.

## How to contribute

### Reporting bugs

1. Check existing issues first.
2. New issue with: clear title, steps to reproduce, expected vs
   actual behavior, environment (OS, OpenCode version, SoX/ffmpeg
   presence), and the relevant toast text or `opencode.log` lines.

### Suggesting features

Open an issue with the use case and proposed behavior. Anything
touching the non-goals list above needs maintainer sign-off first.

### Code contributions

1. Fork & clone, then create a branch per change
   (`gate-N-…` convention for gated work, `feature/…` otherwise).
2. Follow the [Developer Guide](DEVELOPER_GUIDE.md) for checks and
   live-test protocol — every change must be verified by execution
   (`node --check` + TUI live test), never by assumption.
3. Update docs: user-facing changes → `README.md`; architecture
   changes → `ARCHITECTURE.md`; record checks/diagnoses in `LOGS.md`.
4. Commit with a clear prefix (`gate-N: …`, `fix: …`, `docs: …`).

## Pull request requirements

- ✅ `node --check` passes on all touched plugin files.
- ✅ Live TUI test described (record/stop/dialog/paste where relevant).
- ✅ No secrets in any file (grep `gsk_` before pushing).
- ✅ Docs updated; `LOGS.md` entry for gated work.
- ✅ Approved by the maintainer.

## Release process (maintainers)

Gates merge to `master` only on pass; version tags go
`Alpha` → `Beta` → `V0.x.x` (local tags, pushed explicitly).
`CHANGELOG.md` is updated per tag.

## License

By contributing, you agree that your contributions will be licensed
under the MIT License (see `LICENSE`).
