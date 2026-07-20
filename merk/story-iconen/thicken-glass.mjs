// Verdikt de lijn van wijnglas-slank-3 ZONDER de vorm te veranderen:
// - crème buitenvorm (silhouet) krijgt een crème stroke -> groeit naar buiten
// - bordeaux uitsparingen (kelk-holte + voet-holte) krijgen een crème stroke -> krimpen naar binnen
// Samen wordt de zichtbare lijn dikker, proporties blijven identiek.
import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = dirname(fileURLToPath(import.meta.url));
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const CREME = "rgb(244,237,228)";
const src = readFileSync(join(DIR, "higgsfield/raw/wijnglas-slank-3.svg"), "utf8");

// d-prefixes van de 3 vormen die de lijn bepalen
const SILHOUET = "M 924.103", KELK_HOLTE = "M 923.408", VOET_HOLTE = "M 1024.54";

function thicken(W) {
  return src.replace(/<path d="([^"]+)"([^>]*)>/g, (m, d, rest) => {
    const hit = [SILHOUET, KELK_HOLTE, VOET_HOLTE].some((p) => d.startsWith(p));
    if (!hit) return m;
    return `<path d="${d}"${rest} stroke="${CREME}" stroke-width="${W}" stroke-linejoin="round" stroke-linecap="round">`;
  });
}

function cover(svg, name) {
  const b64 = Buffer.from(svg).toString("base64");
  const hp = join(DIR, `_t.html`);
  writeFileSync(hp, `<!doctype html><html><head><meta charset=utf-8><style>*{margin:0}html,body{width:1080px;height:1080px;overflow:hidden}img{width:1080px;height:1080px;display:block}</style></head><body><img src="data:image/svg+xml;base64,${b64}"></body></html>`);
  execFileSync(CHROME, ["--headless", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1", `--screenshot=${join(DIR, name)}`, "--window-size=1080,1080", `file://${hp}`], { stdio: "ignore" });
}

const widths = [0, 12, 20, 30];
for (const W of widths) {
  const svg = W === 0 ? src : thicken(W);
  if (W !== 0) writeFileSync(join(DIR, `higgsfield/raw/wijnglas-slank-3-dik${W}.svg`), svg);
  cover(svg, `_glas-W${W}.png`);
}

// vergelijkingsstrip
const cells = widths.map((W) => {
  const b = readFileSync(join(DIR, `_glas-W${W}.png`)).toString("base64");
  const label = W === 0 ? "origineel" : `+${W}`;
  return `<div style="text-align:center"><div style="width:240px;height:240px;border-radius:50%;overflow:hidden"><img src="data:image/png;base64,${b}" style="width:100%;height:100%;display:block"></div><div style="color:#E5D9C6;font:500 14px system-ui;margin-top:8px">${label}</div></div>`;
}).join("");
const hp = join(DIR, "_cmp.html");
writeFileSync(hp, `<!doctype html><html><head><meta charset=utf-8></head><body style="margin:0;background:#0f0708;padding:26px;display:flex;gap:18px">${cells}</body></html>`);
execFileSync(CHROME, ["--headless", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=2", `--screenshot=${join(DIR, "glas-diktes.png")}`, "--window-size=1120,320", `file://${hp}`], { stdio: "ignore" });
console.log("glas-diktes.png klaar");
