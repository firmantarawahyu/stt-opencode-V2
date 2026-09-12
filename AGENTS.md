# AGENTS.md — Working Rules for `stt-opencode2`

> Rules only. No logs, no history, no summaries here.
> Work trail lives exclusively in `LOGS.md`.

## Sources of truth (read before any task)

1. `SPECS.md` — locked scope. Never exceed it without user confirmation.
2. `TODO.md` — gate checklist and statuses.
3. This file — workflow and conventions.

`ROADMAP.md` is human-readable planning. Executing agents MUST NOT read it;
`SPECS.md` + `TODO.md` are sufficient for any task.

## Workflow: SDD–TDD per gate

- Gates run strictly in order (0 → 6). Never start the next gate until the
  active gate passes.
- Each gate: **Spec (exit criteria) → Build → Check + Diagnose
  (functionality, code, errors) → Gate pass**.
- A gate passes only when ALL its exit criteria in `TODO.md` are verified
  by execution (run code, read output), never by assumption.
- On pass: record the sign-off in `LOGS.md`, merge the gate branch into
  `master`, continue on a new branch.

## Git & branches

- One branch per gate: `gate-0-scaffold` … `gate-6-release`.
- `master` stays green: fuse (merge) only on Gate pass.
- Local commits only. No push, no remote — unless the user explicitly says so.
- Versioning: tag `Alpha` → `Beta` → `V0.x.x`. No numeric versions before Alpha.

## Hard constraints

- API keys from environment variables only. Never write a key into any file.
- Alpha has NO auto-submit. Review-before-send is inviolable in Alpha.
- No scope additions (TTS, Deepgram, local models, full settings UI)
  without user confirmation.
- Windows-first: paths, shells, and clipboard behavior must work on win32.

## Locked Decisions

- Groq-only provider in Alpha — free daily-reset tier, single HTTP endpoint,
  no model option (model locked to `whisper-large-v3-turbo`).
- Output UX is dialog + auto-copy clipboard — V2 has no documented
  composer-insert API (`@opencode/plugin@2.0.2` + `@opencode/client@2.0.2`
  typings verified; `tui.prompt.append` event type exists but has no
  publish path).
- Toggle hotkey is leader-chord `<leader>v` (`ctrl+x` then `V`).
- Auto-stop recordings at 120s (Groq free-tier 25MB file cap).
- Recorder priority: SoX first, ffmpeg fallback (both present on this machine).
- Default language `auto`, switchable at runtime via `/voice-lang`,
  persisted in plugin `storage`.
- Plugin ID: `stt-opencode2` (must not collide with `opencode-voice`).
