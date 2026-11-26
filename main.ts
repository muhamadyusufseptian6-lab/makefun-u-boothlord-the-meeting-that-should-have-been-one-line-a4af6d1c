// The Meeting That Should Have Been One Line.
// Writes the single sentence that could have replaced an entire pointless
// meeting to $MAKEFUN_OUTPUT_DIR/entry.txt. Deterministic, stdlib-only.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// The entry: one sentence, 153 characters. Invented for this competition.
// The client said yes at 9, Finance said yes at 10 — and the only holdout
// is the person who called the meeting to ask if anyone has said yes.
// After this line, the meeting has no reason left to exist.
const ENTRY =
  "The client said yes at 9, Finance said yes at 10, and the only person who hasn't said yes is the one who called this meeting to ask if anyone's said yes.";

// Resolve paths from this script's location, never from process.cwd().
const repoDir = dirname(fileURLToPath(import.meta.url));
void repoDir;

const outputDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";

mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "entry.txt"), ENTRY, "utf8");
