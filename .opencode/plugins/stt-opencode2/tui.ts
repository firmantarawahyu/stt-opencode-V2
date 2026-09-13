import { Plugin } from "@opencode/plugin/tui";

export default Plugin.define({
  id: "stt-opencode2",
  setup(context) {
    context.ui.toast.show({
      title: "stt-opencode2",
      message: "Voice plugin loaded (Gate 0 scaffold).",
      variant: "success",
      duration: 8000,
    });

    context.keymap.layer(() => ({
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
    }));
  },
});
