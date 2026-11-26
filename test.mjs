// TDD-lite checks for this entry (kit: program/v1, gate 1-200 chars UTF-8).
// Run: node test.mjs  (expects main.ts to exist and write entry.txt)
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const ENTRY =
  "The client said yes at 9, Finance said yes at 10, and the only person who hasn't said yes is the one who called this meeting to ask if anyone's said yes.";

let failures = 0;
const check = (name, ok, detail = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}: ${name}${detail ? " — " + detail : ""}`);
  if (!ok) failures++;
};

// 1. Character limit: 1-200 chars, not only whitespace.
check("entry is 1-200 chars", ENTRY.length >= 1 && ENTRY.length <= 200, `${ENTRY.length} chars`);
check("entry is not only whitespace", ENTRY.trim().length > 0);

// 2. One sentence, one line: exactly one sentence-ending period, no newline.
check("single line", !ENTRY.includes("\n"));
check("one sentence", (ENTRY.match(/\./g) || []).length === 1);

// 3. Output format + determinism: run main.ts twice into two temp dirs, outputs identical.
const outs = [];
for (let i = 0; i < 2; i++) {
  const dir = mkdtempSync(join(tmpdir(), "meeting-one-line-"));
  const run = spawnSync(process.execPath, ["main.ts"], {
    cwd: new URL(".", import.meta.url).pathname,
    env: { ...process.env, MAKEFUN_OUTPUT_DIR: dir },
    encoding: "utf8",
  });
  check(`run ${i + 1} exits 0`, run.status === 0, run.stderr.trim());
  const text = readFileSync(join(dir, "entry.txt"), "utf8");
  outs.push(text);
  rmSync(dir, { recursive: true, force: true });
}
check("output equals entry text", outs[0] === ENTRY);
check("deterministic across runs", outs[0] === outs[1]);

// 4. Stdlib-only: main.ts imports only node: modules.
const src = readFileSync(new URL("./main.ts", import.meta.url), "utf8");
const imports = [...src.matchAll(/from\s+["']([^"']+)["']/g)].map((m) => m[1]);
check(
  "stdlib-only imports",
  imports.length > 0 && imports.every((m) => m.startsWith("node:")),
  imports.join(", "),
);

if (failures > 0) {
  console.log(`${failures} check(s) failed`);
  process.exit(1);
}
console.log("All checks passed.");
