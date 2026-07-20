// Story-highlight-iconen voor "Maarten kookt".
// Coherente vector-set in Maartens chunky-ronde bordeaux-stijl. Geen AI-raster.
// Output: gallery.html (kiezen) + per cover een 1080x1080 PNG + contact.png (review).
import { writeFileSync, readFileSync, mkdirSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const DIR = dirname(fileURLToPath(import.meta.url));
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

// ---- Palet (uit merk/design.md) ----
const BORDEAUX = "#7B0D1E";
const CREME = "#F4EDE4";
const TAN = "#CDB998";

// Elke icoon-functie tekent op een 100x100 artboard.
// c = hoofdkleur, a = accent (decoratief), bg = achtergrond (voor 'gaten' zoals oog).
const ICONS = {
  kokmuts: (c, a, bg) => `
    <circle cx="50" cy="38" r="20" fill="${c}"/>
    <circle cx="31" cy="47" r="15" fill="${c}"/>
    <circle cx="69" cy="47" r="15" fill="${c}"/>
    <rect x="29" y="46" width="42" height="22" fill="${c}"/>
    <rect x="30" y="62" width="40" height="23" rx="8" fill="${c}"/>
    <rect x="33" y="66" width="34" height="4" rx="2" fill="${a}"/>
    <rect x="41" y="72" width="4.5" height="10" rx="2.25" fill="${a}"/>
    <rect x="55.5" y="72" width="4.5" height="10" rx="2.25" fill="${a}"/>`,

  mesje: (c, a, bg) => `
    <g transform="translate(50 50) rotate(-20) scale(1.18) translate(-50 -50)">
      <path d="M58,43 L23,47 Q11,49 9,52 Q11,55 23,57 L58,61 Z" fill="${c}"/>
      <rect x="55" y="41" width="7" height="22" rx="2.5" fill="${c}"/>
      <rect x="62" y="45" width="29" height="14" rx="7" fill="${c}"/>
      <circle cx="71" cy="52" r="2.4" fill="${a}"/>
      <circle cx="80" cy="52" r="2.4" fill="${a}"/>
    </g>`,

  wijnglas: (c, a, bg) => `
    <path d="M31,20 L69,20 Q66,52 50,55 Q34,52 31,20 Z" fill="${c}"/>
    <path d="M37,36 Q41,49 50,50 Q59,49 63,36 Z" fill="${a}"/>
    <rect x="47.7" y="54" width="4.6" height="21" fill="${c}"/>
    <rect x="34" y="74" width="32" height="7" rx="3.5" fill="${c}"/>`,

  druiventros: (c, a, bg) => `
    <path d="M50,44 Q50,33 56,29" fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round"/>
    <path d="M55,30 Q68,25 73,34 Q64,42 54,33 Z" fill="${a}"/>
    <circle cx="37" cy="47" r="7"  fill="${c}"/>
    <circle cx="50" cy="47" r="7"  fill="${c}"/>
    <circle cx="63" cy="47" r="7"  fill="${c}"/>
    <circle cx="43.5" cy="58" r="7" fill="${c}"/>
    <circle cx="56.5" cy="58" r="7" fill="${c}"/>
    <circle cx="50" cy="69" r="7"  fill="${c}"/>`,

  vlees: (c, a, bg) => `
    <rect x="20" y="30" width="17" height="8" rx="4" transform="rotate(-38 28 34)" fill="${c}"/>
    <circle cx="22" cy="28" r="5.5" fill="${c}"/>
    <circle cx="19" cy="37" r="5.5" fill="${c}"/>
    <path d="M34,42 Q30,30 46,29 Q68,28 73,44 Q77,60 60,66 Q40,71 32,60 Q27,52 34,42 Z" fill="${c}"/>
    <ellipse cx="53" cy="48" rx="11" ry="7" fill="${a}"/>`,

  vis: (c, a, bg) => `
    <path d="M17,50 Q30,32 52,34 Q71,36 75,50 Q71,64 52,66 Q30,68 17,50 Z" fill="${c}"/>
    <path d="M72,50 L91,38 L85,50 L91,62 Z" fill="${c}"/>
    <path d="M40,34 Q49,23 59,34 Z" fill="${a}"/>
    <path d="M34,39 Q30,50 34,61" fill="none" stroke="${a}" stroke-width="3.4" stroke-linecap="round"/>
    <circle cx="30" cy="47" r="3.6" fill="${bg}"/>`,
};

const LABELS = {
  kokmuts: "Kokmuts", mesje: "Mesje", wijnglas: "Wijnglas",
  druiventros: "Druiven", vlees: "Vlees", vis: "Vis",
};

// ---- Varianten (achtergrond + kleuren) ----
const VARIANTS = [
  { id: "A-bordeaux-op-creme", naam: "Bordeaux op crème", bg: CREME,    c: BORDEAUX, a: BORDEAUX, ring: BORDEAUX },
  { id: "B-creme-op-bordeaux", naam: "Crème op bordeaux", bg: BORDEAUX,  c: CREME,    a: CREME,    ring: CREME },
  { id: "C-duotoon-tan",       naam: "Duotoon (tan-accent)", bg: CREME, c: BORDEAUX, a: TAN,      ring: TAN },
];

const S = 1080;                       // cover-formaat
const ICON_BOX = 560;                 // icoon-grootte binnen de cover
const off = (S - ICON_BOX) / 2;

function coverSVG(v, iconKey, { ring = true } = {}) {
  const inner = ICONS[iconKey](v.c, v.a, v.bg);
  const r = ring
    ? `<circle cx="${S/2}" cy="${S/2}" r="500" fill="none" stroke="${v.ring}" stroke-width="6" opacity="0.28"/>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
    <rect width="${S}" height="${S}" fill="${v.bg}"/>
    ${r}
    <g transform="translate(${off} ${off}) scale(${ICON_BOX/100})">${inner}</g>
  </svg>`;
}

function pageHTML(bodyInner, w = S, h = S) {
  return `<!doctype html><html><head><meta charset="utf-8">
  <style>*{margin:0;padding:0;box-sizing:border-box}html,body{width:${w}px;height:${h}px;overflow:hidden}</style>
  </head><body>${bodyInner}</body></html>`;
}

function shoot(htmlPath, pngPath, w, h) {
  execFileSync(CHROME, [
    "--headless", "--disable-gpu", "--hide-scrollbars",
    "--force-device-scale-factor=1",
    `--screenshot=${pngPath}`, `--window-size=${w},${h}`,
    `file://${htmlPath}`,
  ], { stdio: "ignore" });
}

// ---- Bouwen ----
const OUT = join(DIR, "out");
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const keys = Object.keys(ICONS);

// 1) Individuele covers -> PNG
for (const v of VARIANTS) {
  mkdirSync(join(OUT, v.id), { recursive: true });
  for (const k of keys) {
    const html = pageHTML(coverSVG(v, k));
    const hp = join(OUT, v.id, `${k}.html`);
    const pp = join(OUT, v.id, `${k}.png`);
    writeFileSync(hp, html);
    shoot(hp, pp, S, S);
    rmSync(hp);
  }
  console.log("cover-set klaar:", v.id);
}

// 2) Contact-sheet (review): 6 kolommen x 3 rijen, kleine covers
const CELL = 220, GAP = 16, PAD = 28;
const cw = keys.length * CELL + (keys.length - 1) * GAP + PAD * 2;
const ch = VARIANTS.length * (CELL + 34) + (VARIANTS.length - 1) * GAP + PAD * 2;
let cells = "";
for (const v of VARIANTS) {
  cells += `<div style="grid-column:1/-1;font:600 15px system-ui;color:#333;margin:6px 0 -2px">${v.naam}</div>`;
  for (const k of keys) {
    cells += `<div style="text-align:center">
      <div style="width:${CELL}px;height:${CELL}px;border-radius:50%;overflow:hidden;box-shadow:0 4px 14px rgba(0,0,0,.14)">
        <img src="${v.id}/${k}.png" style="width:100%;height:100%">
      </div>
      <div style="font:500 13px system-ui;color:#555;margin-top:6px">${LABELS[k]}</div>
    </div>`;
  }
}
const contactBody = `<div style="padding:${PAD}px;background:#fff;display:grid;grid-template-columns:repeat(${keys.length},${CELL}px);gap:${GAP}px;align-items:start">${cells}</div>`;
const contactHtml = join(OUT, "contact.html");
writeFileSync(contactHtml, pageHTML(contactBody, cw, ch));
shoot(contactHtml, join(DIR, "contact.png"), cw, ch);
console.log("contact.png klaar:", cw, "x", ch);

// 3) Kies-galerij met INLINE svg's (voor Artifact — geen externe bestanden)
function galleryCover(v, k) {
  // zelfde compositie als de cover, maar op 300x300 viewBox voor scherpe weergave
  const inner = ICONS[k](v.c, v.a, v.bg);
  return `<svg viewBox="0 0 100 100" width="100%" height="100%" style="display:block;background:${v.bg}">
    <circle cx="50" cy="50" r="46.3" fill="none" stroke="${v.ring}" stroke-width="0.6" opacity="0.28"/>
    <g transform="translate(24.1 24.1) scale(0.518)">${inner}</g>
  </svg>`;
}
const lilita = readFileSync(join(DIR, "../fonts/LilitaOne.ttf")).toString("base64");
let g = `<style>
  @font-face{font-family:"Lilita One";font-weight:400;font-display:swap;
    src:url(data:font/ttf;base64,${lilita}) format("truetype")}
  .wrap{max-width:1080px;margin:0 auto;padding:44px 22px 72px;color:#F4EDE4;
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif}
  h1,.set h2{font-family:"Lilita One",system-ui,sans-serif;text-transform:uppercase;font-weight:400}
  .kick{font-size:.78rem;letter-spacing:.34em;text-transform:uppercase;color:#CDB998;margin:0 0 10px}
  h1{font-size:clamp(2.2rem,5.5vw,3.4rem);line-height:1.02;margin:0 0 14px;letter-spacing:.01em}
  .lead{color:#E5D9C6;max-width:60ch;line-height:1.6;margin:0 0 8px}
  .sets{display:flex;flex-direction:column;gap:40px;margin-top:44px}
  .set{background:rgba(244,237,228,.04);border:1px solid rgba(244,237,228,.12);border-radius:24px;padding:26px 22px}
  .set h2{font-size:1.3rem;margin:0 0 4px;letter-spacing:.02em}
  .set .sub{color:#CDB998;font-size:.85rem;margin:0 0 20px}
  .row{display:grid;grid-template-columns:repeat(6,1fr);gap:16px}
  @media(max-width:720px){.row{grid-template-columns:repeat(3,1fr);gap:14px}}
  .cell{text-align:center}
  .disc{width:100%;aspect-ratio:1;border-radius:50%;overflow:hidden;
    box-shadow:0 8px 22px rgba(0,0,0,.35)}
  .cap{font-size:.8rem;color:#E5D9C6;margin-top:9px}
  .note{margin-top:40px;color:#CDB998;font-size:.9rem;line-height:1.65;
    border-top:1px solid rgba(244,237,228,.12);padding-top:22px}
  .badge{display:inline-block;background:#B31B2B;color:#F4EDE4;border-radius:999px;
    padding:3px 12px;font-size:.72rem;letter-spacing:.06em;margin-left:8px;vertical-align:middle}
</style>
<div class="wrap">
  <p class="kick">Maarten kookt · Instagram</p>
  <h1>Story-highlight iconen</h1>
  <p class="lead">Zes iconen in je eigen chunky-ronde bordeaux-stijl, als highlight-covers voor je stories. Drie kleurrichtingen — kies er één zodat je rijtje covers als één set leest.</p>
  <div class="sets">`;
for (const v of VARIANTS) {
  g += `<div class="set"><h2>${v.naam}<span class="badge">${v.id.split("-")[0]}</span></h2>
    <p class="sub">Bordeaux ${BORDEAUX} · Crème ${CREME}${v.a === TAN ? " · Tan-accent " + TAN : ""}</p>
    <div class="row">`;
  for (const k of keys) g += `<div class="cell"><div class="disc">${galleryCover(v, k)}</div><div class="cap">${LABELS[k]}</div></div>`;
  g += `</div></div>`;
}
g += `</div>
  <p class="note">
    <strong style="color:#F4EDE4">Hoe je ze plaatst:</strong> Instagram → je profiel → een highlight vasthouden → <em>Highlight bewerken</em> → <em>Omslag bewerken</em> → de bijhorende afbeelding kiezen. De PNG's staan klaar op 1080×1080 (Instagram snijdt ze tot een cirkel).<br><br>
    <strong style="color:#F4EDE4">Zeg welke set</strong> (A, B of C) en welke iconen je wilt; dan lever ik precies die als losse bestanden. Extra icoon nodig (brood, kaas, koffie, vuur)? Zelfde stijl, zo bijgemaakt.
  </p>
</div>`;
writeFileSync(join(DIR, "gallery-artifact.html"), g);
console.log("gallery-artifact.html klaar");
