import fs from "node:fs";

const target = process.argv[2]; // chrome | firefox
if (!["chrome", "firefox"].includes(target)) {
  console.error("Usage: node scripts/manifest.mjs <chrome|firefox>");
  process.exit(1);
}

const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));

const base = read("manifest/base.json");
const patch = read(`manifest/${target}.json`);

// merge (patch overrides base)
const out = { ...base, ...patch };

// ensure dist exists
fs.mkdirSync("dist", { recursive: true });
fs.writeFileSync("dist/manifest.json", JSON.stringify(out, null, 2));

console.log(`Wrote dist/manifest.json for ${target}`);
