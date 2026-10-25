import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

function printUsage() {
  console.log("Usage: npm --prefix src/frontend/web run screenshot -- <url> [label]");
  console.log("Required env var: BRAVE_EXECUTABLE_PATH=<put your path here>");
  console.log("Example:");
  console.log(
    '  $env:BRAVE_EXECUTABLE_PATH="C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe"'
  );
  console.log("  npm --prefix src/frontend/web run screenshot -- http://localhost:5173");
}

const [, , urlArg, labelArg] = process.argv;
if (!urlArg || urlArg === "--help" || urlArg === "-h") {
  printUsage();
  process.exit(0);
}

const executablePath = process.env.BRAVE_EXECUTABLE_PATH;
if (!executablePath) {
  console.error("Missing BRAVE_EXECUTABLE_PATH.");
  printUsage();
  process.exit(1);
}

const targetUrl = urlArg;
let parsedUrl;
try {
  parsedUrl = new URL(targetUrl);
} catch {
  console.error(`Invalid URL: ${targetUrl}`);
  process.exit(1);
}

if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
  console.error("Only http/https URLs are supported for screenshots.");
  process.exit(1);
}

const screenshotsDir = path.resolve("src/frontend/web/temporary-screenshots");
fs.mkdirSync(screenshotsDir, { recursive: true });

const existing = fs
  .readdirSync(screenshotsDir, { withFileTypes: true })
  .filter((entry) => entry.isFile() && /^screenshot-(\d+)(-.+)?\.png$/i.test(entry.name))
  .map((entry) => {
    const match = entry.name.match(/^screenshot-(\d+)/i);
    return match ? Number.parseInt(match[1], 10) : 0;
  });
const nextNumber = (existing.length > 0 ? Math.max(...existing) : 0) + 1;
const safeLabel = labelArg
  ? `-${labelArg.replace(/[^a-z0-9-_]+/gi, "-").replace(/^-+|-+$/g, "")}`
  : "";
const fileName = `screenshot-${nextNumber}${safeLabel}.png`;
const outputPath = path.join(screenshotsDir, fileName);

const browser = await puppeteer.launch({
  executablePath,
  headless: true,
  defaultViewport: {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
  },
});

try {
  const page = await browser.newPage();
  await page.goto(targetUrl, { waitUntil: "networkidle2", timeout: 30_000 });
  await page.screenshot({ path: outputPath, fullPage: true });
  console.log(`Saved screenshot: ${outputPath}`);
} finally {
  await browser.close();
}
