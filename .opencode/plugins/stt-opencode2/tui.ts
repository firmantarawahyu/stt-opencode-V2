import fs from "node:fs";
import { Plugin } from "@opencode/plugin/tui";
import type { Context, KeymapLayer } from "@opencode/plugin/tui";
import type { JSX } from "@opentui/solid";
import { AUTO_STOP_MS, newOutFile, startRecording, type ActiveRecording } from "./lib/recorder.js";
import { copyToClipboard } from "./lib/clipboard.js";
import { transcribe, toHumanError } from "./lib/transcribe.js";

interface VoiceState {
  active: ActiveRecording | null;
  timer: ReturnType<typeof setTimeout> | null;
}

function fmtKB(bytes: number): string {
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

async function stopActive(
  context: Context,
  state: VoiceState,
  reason: "manual" | "auto",
): Promise<void> {
  const rec = state.active;
  if (state.timer) {
    clearTimeout(state.timer);
    state.timer = null;
  }
  state.active = null;
  if (!rec) return;
  try {
    await rec.stop();
    const stat = fs.statSync(rec.file);
    const secs = Math.round((Date.now() - rec.startedAt) / 1000);
    context.ui.toast.show({
      title: "stt-opencode2",
      message: `Recorded ${fmtKB(stat.size)} (${secs}s). Transcribing via Groq…`,
      variant: "info",
      duration: 5000,
    });
    try {
      const text = await transcribe(rec.file, "auto");
      let copied = true;
      try {
        await copyToClipboard(text);
      } catch {
        copied = false;
      }
      context.ui.dialog.set({ size: "large" });
      await context.ui.dialog.alert({ title: "stt-opencode2", message: text });
      context.ui.toast.show({
        title: "stt-opencode2",
        message:
          reason === "auto"
            ? `Auto-stop 120s. ${copied ? `Copied ${text.length} chars to clipboard.` : "Copy failed — retype from the dialog."}`
            : copied
              ? `Copied ${text.length} chars to clipboard.`
              : "Copy failed — retype from the dialog.",
        variant: copied ? "success" : "warning",
        duration: 8000,
      });
    } catch (err) {
      context.ui.toast.show({
        title: "stt-opencode2",
        message: toHumanError(err),
        variant: "error",
        duration: 10000,
      });
    }
  } catch (err) {
    context.ui.toast.show({
      title: "stt-opencode2",
      message: `Stop failed: ${err instanceof Error ? err.message : String(err)}`,
      variant: "error",
      duration: 8000,
    });
  }
}

async function toggleVoice(context: Context, state: VoiceState): Promise<void> {
  if (state.active) {
    await stopActive(context, state, "manual");
    return;
  }
  const file = newOutFile();
  try {
    const rec = await startRecording(file);
    state.active = rec;
    state.timer = setTimeout(() => {
      void stopActive(context, state, "auto");
    }, AUTO_STOP_MS);
    context.ui.toast.show({
      title: "stt-opencode2",
      message: `Recording via ${rec.tool}… press <leader>v again to stop (auto-stop 120s).`,
      variant: "info",
      duration: 5000,
    });
  } catch (err) {
    context.ui.toast.show({
      title: "stt-opencode2",
      message: `Cannot record: ${err instanceof Error ? err.message : String(err)}`,
      variant: "error",
      duration: 8000,
    });
  }
}

function voiceLayer(context: Context, state: VoiceState): KeymapLayer {
  return {
    mode: "global",
    priority: 10,
    commands: [
      {
        id: "stt-voice.toggle",
        title: "Voice: toggle recording",
        description: "Start/stop voice recording to a WAV file.",
        group: "Voice",
        bind: "<leader>v",
        palette: true,
        slash: { name: "voice", aliases: ["voice-record"] },
        run: () => toggleVoice(context, state),
      },
      {
        id: "stt-voice.lang",
        title: "Voice: language (stub)",
        description: "Switch transcription language. Wired to storage in Gate 5.",
        group: "Voice",
        palette: true,
        slash: { name: "voice-lang" },
        run: async () => {
          context.ui.toast.show({
            title: "stt-opencode2",
            message: "Language stub: auto (switchable in Gate 5).",
            variant: "info",
          });
        },
      },
    ],
    bindings: ["stt-voice.toggle"],
  };
}

export default Plugin.define({
  id: "stt-opencode2",
  setup(context) {
    const state: VoiceState = { active: null, timer: null };
    context.ui.toast.show({
      title: "stt-opencode2",
      message: "Voice plugin loaded (Gate 0 scaffold).",
      variant: "success",
      duration: 8000,
    });

    // keymap.layer must run inside a component context (it consumes
    // Keymap.Provider), so register it from the always-mounted app slot.
    // Type-only imports are erased at runtime; nothing new to resolve.
    context.ui.slot({
      append: "app",
      render: () => {
        context.keymap.layer(() => voiceLayer(context, state));
        return null as unknown as JSX.Element;
      },
    });
  },
});
