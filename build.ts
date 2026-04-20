import * as esbuild from "esbuild";
import * as fs from "node:fs";

const mainCode = fs.readFileSync("src/main.ts", "utf8");
const bannerMatch = mainCode.match(/\/\*![\s\S]*?\*\//);
const bannerText = bannerMatch ? bannerMatch[0] : "";

const commonOptions: esbuild.BuildOptions = {
    entryPoints: ["src/main.ts"],
    bundle: true,
    platform: "neutral",
    format: "iife",
    target: "es2020",
    legalComments: "none",
    banner: {
        js: bannerText,
    },
};

esbuild.buildSync({
    ...commonOptions,
    outfile: "convert.js",
});

esbuild.buildSync({
    ...commonOptions,
    minify: true,
    outfile: "convert.min.js",
});
