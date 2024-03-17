const esbuild = require("esbuild");
const esbuildPluginTsc = require("esbuild-plugin-tsc");

function createBuildSettings(options) {
  return {
    entryPoints: ["src/index.ts"],
    outfile: "dist/index.js",
    bundle: true,
    platform: "node",
    plugins: [
      esbuildPluginTsc({
        force: true,
      }),
    ],
    // drop: ["console", "debugger"],
    minify: true,
    ...options,
  };
}

esbuild.build(createBuildSettings()).catch(() => process.exit(1));
