# ROADMAP.md — Full Planning (human-readable)

> NOTE: executing agents do not need to read this file.
> Their sources are `SPECS.md` + `TODO.md` (+ rules in `AGENTS.md`).

## Where this started

The stock OpenCode STT plugin (`opencode-voice` 0.1.4) cannot load on
OpenCode V2: it is built on the V1 API (`@opencode-ai/plugin`) while V2
requires `Plugin.define({ id, setup })` from `@opencode/plugin/tui`.
Two popular alternatives (`@hxnnxs/opencode-voice`, `@renjfk/opencode-voice`)
use the same V1 shape. So we build our own minimal V2 plugin.

A free Groq API key is enough — no paid key needed (Groq free tier resets
daily; Deepgram's $200 credit is a later option, not Alpha scope).

## Alpha — minimal voice-to-prompt (current phase)

Record with a hotkey, transcribe with Groq Whisper, show the text in a
dialog and copy it to the clipboard for manual paste. Six gated checkpoints
(see `TODO.md`): scaffold → hotkey → recorder → transcription → output →
persistence → end-to-end + tag.

## Beta — direct insert + device control

Depends on one research spike: finding a publish path for the
`tui.prompt.append` protocol event. If found, transcription lands directly
in the composer (review-before-send fully achieved). Either way Beta adds a
microphone picker and basic diagnostics.

## V0.x.x — stable & broader

Deepgram as an optional second provider (live preview), full README +
Windows troubleshooting, code cleanup, and numeric versioning from here on.
