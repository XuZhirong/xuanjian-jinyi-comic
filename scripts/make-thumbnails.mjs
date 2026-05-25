import { spawn } from "node:child_process";
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const pagesDir = path.join(root, "assets/pages");
const thumbsDir = path.join(root, "assets/thumbs");

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd: root, stdio: "inherit" });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} exited with code ${code}`));
    });
    child.on("error", reject);
  });
}

await mkdir(thumbsDir, { recursive: true });

const files = (await readdir(pagesDir)).filter((file) => file.endsWith(".png")).sort();

for (const file of files) {
  await run("sips", ["-Z", "180", path.join(pagesDir, file), "--out", path.join(thumbsDir, file)]);
}

console.log(`Created ${files.length} thumbnail image(s).`);
