// Server entrypoint (discovery layout). Plain-object export: no runtime
// imports, so the server loader needs no node_modules resolution.
const plugin = {
  id: "stt-opencode2-server",
  setup() {},
};

export default plugin;
