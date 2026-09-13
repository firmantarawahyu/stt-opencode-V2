import { Plugin } from "@opencode/plugin/tui";
import type { Context, KeymapLayer } from "@opencode/plugin/tui";
import type { JSX } from "@opentui/solid";

function voiceLayer(context: Context): KeymapLayer {
  return {
    mode: "global",
    priority: 10,
    commands: [
      {
        id: "stt-voice.toggle",
        title: "Voice: toggle recording (stub)",
        description: "Start/stop voice recording. Full behavior lands in Gate 2+.",
        group: "Voice",
        bind: "<leader>v",
        palette: true,
        slash: { name: "voice", aliases: ["voice-record"] },
        run: async () => {
          context.ui.toast.show({
            title: "stt-opencode2",
            message: "Toggle stub: recording starts in Gate 2.",
            variant: "info",
          });
        },
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
        context.keymap.layer(() => voiceLayer(context));
        return null as unknown as JSX.Element;
      },
    });
  },
});
