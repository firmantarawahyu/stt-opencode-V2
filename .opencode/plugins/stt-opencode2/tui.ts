import fs from "node:fs";
import { Plugin } from "@opencode/plugin/tui";
import type { Context, KeymapLayer } from "@opencode/plugin/tui";
import type { JSX } from "@opentui/solid";
import { AUTO_STOP_MS, newOutFile, startRecording, type ActiveRecording } from "./lib/recorder.js";
import { copyToClipboard } from "./lib/clipboard.js";
import { transcribe, toHumanError, type VoiceLang } from "./lib/transcribe.js";

interface VoiceState {
  active: ActiveRecording | null;
  timer: ReturnType<typeof setTimeout> | null;
  getLang: () => VoiceLang;
  setLang: (lang: VoiceLang) => Promise<void>;
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
      const text = await transcribe(rec.file, state.getLang());
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
        title: "Voice: language",
        description: "Switch transcription language (auto/id/en), persisted.",
        group: "Voice",
        palette: true,
        slash: { name: "voice-lang" },
        run: async () => {
          const current = state.getLang();
          const picked = await context.ui.dialog.select({
            title: "Voice language",
            options: [
              { title: "auto (detect)", value: "auto" as VoiceLang },
              { title: "id — Indonesian", value: "id" as VoiceLang },
              { title: "en — English", value: "en" as VoiceLang },
            ],
            current,
          });
          if (picked === undefined) {
            context.ui.toast.show({
              title: "stt-opencode2",
              message: `Language unchanged: ${current}.`,
              variant: "info",
            });
            return;
          }
          await state.setLang(picked);
          context.ui.toast.show({
            title: "stt-opencode2",
            message: `Language: ${picked}.`,
            variant: "success",
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
    const [langStore, updateLang] = context.storage.store("voice-lang", {
      initial: { lang: "auto" as VoiceLang },
    });
    const state: VoiceState = {
      active: null,
      timer: null,
      getLang: () => langStore.lang,
      setLang: (lang) =>
        updateLang((draft) => {
          draft.lang = lang;
        }),
    };
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

    // Persistent language indicator: sidebar footer shows the active
    // transcription language. Reads the store in render so it updates
    // live when /voice-lang changes it.
    context.ui.slot({
      append: "sidebar.footer",
      render: () => `voice: ${state.getLang()}` as unknown as JSX.Element,
    });
  },
});
