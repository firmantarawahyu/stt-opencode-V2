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
  },
});
