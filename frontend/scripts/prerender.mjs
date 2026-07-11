import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { preview } from "vite";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "..", "dist");
const PORT = 4173;

// Every static client-side route. Add new routes here as they're added
// to the router so they get prerendered too.
const ROUTES = [
  "/",
  "/shop",
  "/model-advisor",
  "/help-me-choose",
  "/learn",
  "/compare",
  "/request-quote",
  "/requests",
];

function outputPathFor(route) {
  if (route === "/") return path.join(distDir, "index.html");
  return path.join(distDir, route.slice(1), "index.html");
}

async function main() {
  const server = await preview({ preview: { port: PORT, strictPort: true } });
  const baseUrl = `http://localhost:${PORT}`;

  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const route of ROUTES) {
    await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
    // Small settle buffer past networkidle for the final React re-render.
    await page.waitForTimeout(400);

    // page.content() already includes the doctype.
    const html = await page.content();
    const outputPath = outputPathFor(route);

    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, html, "utf-8");
    console.log(`prerendered ${route} -> ${path.relative(distDir, outputPath)}`);
  }

  await browser.close();
  await server.httpServer.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
