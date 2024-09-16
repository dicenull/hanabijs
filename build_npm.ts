import { build, emptyDir } from "@deno/dnt";

await emptyDir("./npm");

await build({
  entryPoints: ["./mod/main.ts"],
  outDir: "./npm",
  shims: {
    deno: true,
  },
  package: {
    name: "hanabijs",
    version: Deno.args[0],
    description: "Draw fireworks package.",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/dicenull/hanabijs.git",
    },
    bugs: {
      url: "https://github.com/dicenull/hanabijs/issues",
    },
  },
  postBuild() {
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});
