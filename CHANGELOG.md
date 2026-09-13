# CHANGELOG.md

> Consumer-facing release notes, per tag.

## Unreleased

- _Nothing yet._

## Alpha (2026-09-13)

- Toggle recording via `ctrl+x v` + `/voice`; auto-stop 120s (SoX
  primary with explicit waveaudio device, ffmpeg DirectShow fallback).
- Groq transcription (`whisper-large-v3-turbo`, env-only key) with
  human-readable errors (missing key, 401, 429, 413).
- Result dialog + auto-copy clipboard + success toast; no auto-submit
  (review-before-send).
- `/voice-lang` (`auto`/`id`/`en`) persisted via plugin storage.
