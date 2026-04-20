import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const rootDir = process.cwd();
const packageJsonPath = path.join(rootDir, "package.json");
const packageLockPath = path.join(rootDir, "package-lock.json");

const rawTag = process.env.TAG_NAME ?? process.env.GITHUB_REF_NAME ?? "";

if (!rawTag) {
    console.log("[version:sync-tag] TAG_NAME / GITHUB_REF_NAME 未提供，跳过版本同步。");
    process.exit(0);
}

const version = rawTag.startsWith("v") ? rawTag.slice(1) : rawTag;
const semverPattern = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;

if (!semverPattern.test(version)) {
    console.error(`[version:sync-tag] 非法版本号：${rawTag}`);
    process.exit(1);
}

function writeJson(filePath, updater) {
    const json = JSON.parse(fs.readFileSync(filePath, "utf8"));
    updater(json);
    fs.writeFileSync(filePath, `${JSON.stringify(json, null, 2)}\n`, "utf8");
}

writeJson(packageJsonPath, (json) => {
    json.version = version;
});

if (fs.existsSync(packageLockPath)) {
    writeJson(packageLockPath, (json) => {
        json.version = version;
        if (json.packages && json.packages[""]) {
            json.packages[""].version = version;
        }
    });
}

console.log(`[version:sync-tag] 已同步版本到 ${version}`);
