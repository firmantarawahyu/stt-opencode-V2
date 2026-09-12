// Plain-object export: no runtime imports, so the server loader needs no
// node_modules resolution for the server entrypoint. Must satisfy the V2
// schema: default definition with an id and a setup function.
const plugin = {
  id: "stt-opencode2-server",
  setup() {},
};

export default plugin;
