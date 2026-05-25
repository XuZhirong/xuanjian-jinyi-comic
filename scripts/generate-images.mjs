import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const wrapper = "/Users/bytedance/.agents/skills/baoyu-image-gen/scripts/codex-imagegen/main.ts";
const logFile = path.join(root, "reviews/imagegen.jsonl");
const cacheDir = path.join(root, ".cache/codex-imagegen");
const cleanCharacterRef = path.join(root, "assets/characters/character-sheet-clean.png");
const originalCharacterRef = path.join(root, "assets/characters/character-sheet.png");
const characterRef = existsSync(cleanCharacterRef) ? cleanCharacterRef : originalCharacterRef;
const data = JSON.parse(await readFile(path.join(root, "data/comic.json"), "utf8"));

function promptPath(page) {
  return path.join(root, "prompts", `${String(page.n).padStart(2, "0")}-page-${page.slug}.md`);
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      cwd: root,
      stdio: "inherit",
      env: process.env,
    });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} exited with code ${code}`));
    });
    child.on("error", reject);
  });
}

await mkdir(path.join(root, "assets/pages"), { recursive: true });
await mkdir(path.join(root, "reviews"), { recursive: true });
await mkdir(cacheDir, { recursive: true });

if (!existsSync(characterRef)) {
  throw new Error(`Missing character reference sheet: ${characterRef}`);
}

const requested = process.argv.slice(2).map(Number).filter(Boolean);
const pages = requested.length > 0 ? data.pages.filter((p) => requested.includes(p.n)) : data.pages;

for (const page of pages) {
  const out = path.join(root, page.image);
  if (existsSync(out) && !process.env.FORCE) {
    console.log(`[skip] page ${page.n} exists: ${out}`);
    continue;
  }

  console.log(`[generate] page ${page.n}: ${page.title}`);
  await run("bun", [
    wrapper,
    "--prompt-file",
    promptPath(page),
    "--image",
    out,
    "--aspect",
    page.aspect,
    "--ref",
    characterRef,
    "--timeout",
    "900000",
    "--retries",
    "1",
    "--cache-dir",
    cacheDir,
    "--log-file",
    logFile,
    "-v",
  ]);
}

console.log(`Generated ${pages.length} requested page image(s).`);
