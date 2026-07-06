import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const devVarsPath = path.join(root, ".dev.vars");
const secretsJsonPath = path.join(root, ".wrangler", "secrets.json");

if (!fs.existsSync(devVarsPath)) {
  console.error(`Missing ${devVarsPath}. Create it from .env.example first.`);
  process.exit(1);
}

const vars: Record<string, string> = {};
const lines = fs.readFileSync(devVarsPath, "utf-8").split(/\r?\n/);

for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eq = trimmed.indexOf("=");
  if (eq === -1) continue;
  const key = trimmed.slice(0, eq).trim();
  const value = trimmed.slice(eq + 1).trim();
  if (key) vars[key] = value;
}

fs.mkdirSync(path.dirname(secretsJsonPath), { recursive: true });
fs.writeFileSync(secretsJsonPath, JSON.stringify(vars, null, 2));

console.log("Uploading secrets to Cloudflare Worker...");
const result = spawnSync(
  "npx",
  ["wrangler", "secret", "bulk", secretsJsonPath],
  { cwd: root, stdio: "inherit", shell: true }
);

if (result.status !== 0) {
  console.error("\nFailed to upload secrets. Make sure you are logged in:");
  console.error("  npx wrangler login");
  console.error("Or set CLOUDFLARE_API_TOKEN and try again.");
  process.exit(result.status || 1);
}

console.log("\nCleaning up local secrets file...");
fs.unlinkSync(secretsJsonPath);
console.log("Done. Redeploy with: npm run deploy");
