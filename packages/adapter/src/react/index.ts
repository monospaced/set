import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import type { SetComponentSpec } from "@measured/set-core";
import * as core from "@measured/set-core";
import prettier from "prettier";

import { emitIndexSource, emitWrapperSource } from "./emit.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const REACT_SRC_DIR = resolve(__dirname, "../../../react/src");
const REACT_COMPONENTS_DIR = resolve(REACT_SRC_DIR, "components");

function isSpec(value: unknown): value is SetComponentSpec {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    "output" in value &&
    "content" in value &&
    "rules" in value
  );
}

const TARGETS: ReadonlyArray<SetComponentSpec> = Object.entries(core)
  .filter(([key]) => key.startsWith("SET_") && key.endsWith("_SPEC"))
  .map(([, value]) => value)
  .filter(isSpec)
  .sort((a, b) => a.name.localeCompare(b.name));

async function emit(spec: SetComponentSpec): Promise<void> {
  const raw = emitWrapperSource(spec);
  const formatted = await prettier.format(raw, { parser: "typescript" });
  const outDir = resolve(REACT_COMPONENTS_DIR, spec.name);
  const outPath = resolve(outDir, `${spec.name}.tsx`);
  await mkdir(outDir, { recursive: true });
  await writeFile(outPath, formatted);
  console.log(`  wrote ${outPath}`);
}

async function emitIndex(): Promise<void> {
  const raw = emitIndexSource(TARGETS);
  const formatted = await prettier.format(raw, { parser: "typescript" });
  const outPath = resolve(REACT_SRC_DIR, "index.ts");
  await writeFile(outPath, formatted);
  console.log(`  wrote ${outPath}`);
}

async function main(): Promise<void> {
  console.log(`generating ${TARGETS.length} React wrapper(s)`);
  for (const spec of TARGETS) {
    await emit(spec);
  }
  await emitIndex();
  console.log("done");
}

await main();
