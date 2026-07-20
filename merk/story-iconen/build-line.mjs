// Story-highlight-iconen v2 — ÉÉN lijnsysteem (Phosphor-grade), op basis van de
// taste-analyse van maartenkookt.nl: crème lijn, één uniforme lijndikte, ronde
// uiteinden, op een gevulde bordeaux cirkel (= format van het MK-merkicoon).
import { writeFileSync, mkdirSync, rmSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = dirname(fileURLToPath(import.meta.url));
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BORDEAUX = "#7B0D1E", CREME = "#F4EDE4";
const SW = 6; // uniforme lijndikte over ALLE iconen — de kern van de cohesie

// Elk icoon = alleen lijnwerk (fill:none) met dezelfde stroke-width.
// `cx` helper voor gevulde punten (oog).
const dot = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${CREME}" stroke="none"/>`;

const ICONS = {
  kokmuts: `
    <path d="M36 82 L36 64 C27 63 24 52 33 48 C29 40 40 35 47 40 C51 33 63 34 65 42 C74 44 73 56 65 60 L64 64 L64 82"/>
    <path d="M36 82 L64 82"/>
    <path d="M36 64 L64 64"/>`,

  mesje: `
    <path d="M17 54 L57 47 L57 57 Q37 59 17 54 Z"/>
    <path d="M59 49 L83 49 Q87 49 87 53 L87 55 Q87 59 83 59 L59 59 Z"/>`,

  wijnglas: `
    <path d="M35 22 C31 35 38 53 50 53 C62 53 69 35 65 22"/>
    <path d="M50 53 L50 77"/>
    <path d="M39 80 L61 80"/>`,

  druiven: `
    <circle cx="38" cy="53" r="8"/>
    <circle cx="54" cy="53" r="8"/>
    <circle cx="46" cy="65" r="8"/>
    <circle cx="62" cy="65" r="8"/>
    <circle cx="54" cy="77" r="8"/>
    <path d="M54 45 L57 33"/>
    <path d="M57 33 C64 27 74 29 74 29 C74 29 70 40 59 37"/>`,

  vlees: `
    <path d="M45 33 C57 27 70 34 68 47 C67 56 58 60 51 56 L38 67 C34 70 29 66 32 62 L47 50 C44 45 42 38 45 33 Z"/>
    <circle cx="30" cy="64" r="3.6"/>`,

  vis: `
    <path d="M22 50 C30 36 50 34 66 46 C50 66 30 64 22 50 Z"/>
    <path d="M66 46 L80 37 Q76 50 80 63 L66 54"/>
    <path d="M40 37 Q36 50 40 63"/>`,
};
const EYE = { vis: dot(33, 47, 3) };

const LABELS = { kokmuts: "Kokmuts", mesje: "Mesje", wijnglas: "Wijnglas", druiven: "Druiven", vlees: "Vlees", vis: "Vis" };
const keys = Object.keys(ICONS);

const S = 1080, BOX = 620, off = (S - BOX) / 2;

function coverSVG(k, { bg = BORDEAUX, stroke = CREME } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
    <rect width="${S}" height="${S}" fill="${bg}"/>
    <g transform="translate(${off} ${off}) scale(${BOX / 100})"
       fill="none" stroke="${stroke}" stroke-width="${SW}" stroke-linecap="round" stroke-linejoin="round">
      ${ICONS[k]}${EYE[k] || ""}
    </g>
  </svg>`;
}

function shoot(html, png, w, h) {
  const hp = png.replace(/\.png$/, ".html");
  writeFileSync(hp, `<!doctype html><html><head><meta charset=utf-8><style>*{margin:0}html,body{width:${w}px;height:${h}px;overflow:hidden}svg,img{display:block;width:${w}px;height:${h}px}</style></head><body>${html}</body></html>`);
  execFileSync(CHROME, ["--headless", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1", `--screenshot=${png}`, `--window-size=${w},${h}`, `file://${hp}`], { stdio: "ignore" });
  rmSync(hp);
}

const OUT = join(DIR, "out-line");
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

for (const k of keys) shoot(coverSVG(k), join(OUT, `${k}.png`), S, S);

// contact sheet
let cells = "";
for (const k of keys) cells += `<div style="text-align:center"><div style="width:210px;height:210px;border-radius:50%;overflow:hidden"><img src="out-line/${k}.png"></div><div style="font:500 13px system-ui;color:#E5D9C6;margin-top:7px">${LABELS[k]}</div></div>`;
shoot(`<div style="background:#0f0708;padding:26px;display:flex;gap:16px">${cells}</div>`, join(DIR, "contact-line.png"), 1420, 300);

// ---- Artifact-galerij (inline SVG, taste-onderbouwd) ----
const lilita = readFileSync(join(DIR, "../fonts/LilitaOne.ttf")).toString("base64");
const disc = (k) => `<svg viewBox="0 0 100 100" width="100%" height="100%" style="display:block;background:${BORDEAUX}">
  <g transform="translate(19 19) scale(0.62)" fill="none" stroke="${CREME}" stroke-width="${SW}" stroke-linecap="round" stroke-linejoin="round">${ICONS[k]}${EYE[k] || ""}</g></svg>`;
const recRow = keys.map((k) => `<div class="cell"><div class="d">${disc(k)}</div><div class="cap">${LABELS[k]}</div></div>`).join("");
const g = `<style>
  @font-face{font-family:"Lilita One";font-weight:400;font-display:swap;src:url(data:font/ttf;base64,${lilita}) format("truetype")}
  .wrap{max-width:1000px;margin:0 auto;padding:44px 22px 72px;color:#F4EDE4;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif}
  h1,h2{font-family:"Lilita One",system-ui,sans-serif;text-transform:uppercase;font-weight:400;letter-spacing:.02em}
  .kick{font-size:.78rem;letter-spacing:.34em;text-transform:uppercase;color:#CDB998;margin:0 0 10px}
  h1{font-size:clamp(2.2rem,5.5vw,3.4rem);line-height:1.02;margin:0 0 14px}
  .lead{color:#E5D9C6;max-width:62ch;line-height:1.6;margin:0}
  h2{font-size:1.15rem;color:#CDB998;letter-spacing:.06em;margin:48px 0 6px}
  .subline{color:#9c8f7d;font-size:.85rem;margin:0 0 22px;max-width:60ch;line-height:1.5}
  .row{display:grid;grid-template-columns:repeat(6,1fr);gap:16px}
  @media(max-width:720px){.row{grid-template-columns:repeat(3,1fr)}}
  .cell{text-align:center}
  .d{aspect-ratio:1;border-radius:50%;overflow:hidden;box-shadow:0 8px 22px rgba(0,0,0,.4)}
  .cap{font-size:.82rem;color:#E5D9C6;margin-top:9px}
  .why{margin:30px 0 0;padding:20px 22px;background:rgba(244,237,228,.04);border:1px solid rgba(244,237,228,.12);border-radius:20px;color:#E5D9C6;font-size:.9rem;line-height:1.65}
  .why b{color:#F4EDE4}
  .footer{margin-top:34px;color:#CDB998;font-size:.9rem;line-height:1.65;border-top:1px solid rgba(244,237,228,.12);padding-top:22px}
  .footer b{color:#F4EDE4}
</style>
<div class="wrap">
  <p class="kick">Maarten kookt · Instagram</p>
  <h1>Story-iconen — één lijnsysteem</h1>
  <p class="lead">Opnieuw opgezet na een taste-analyse van je eigen site. Zes iconen met exact dezelfde lijndikte en ronde uiteinden, crème op een bordeaux cirkel — hetzelfde format als je MK-merkicoon.</p>
  <div class="why">
    <b>Waarom deze en niet de vorige:</b> je merk gebruikt overal één icoontaal — nette Phosphor-lijniconen (design.md: "Iconen: Phosphor regular. Nooit emoji"), plus de MK in een gevulde cirkel. De eerdere AI-iconen waren massieve plaatjes met elk nét een andere stijl; die braken dat systeem. Deze set is één familie, past bij Lilita One en bij het logo.
  </div>
  <h2>De set</h2>
  <p class="subline">Bewaar ze in deze volgorde als highlight-covers; ze lezen als één rij.</p>
  <div class="row">${recRow}</div>
  <p class="footer">
    <b>Plaatsen:</b> Instagram → je profiel → highlight vasthouden → Omslag bewerken → de PNG kiezen. Klaar op 1080×1080; ook als schaalbare SVG geleverd.<br><br>
    <b>Laat weten:</b> is dit de goede richting? Dan lever ik de losse bestanden. Fijn­afstelling kan nog per icoon (bv. wijnglas-kelk iets ronder, mes iets voller). Extra icoon (brood, kaas, koffie, vuur, peper) in exact deze stijl is zo bijgemaakt.
  </p>
</div>`;
writeFileSync(join(DIR, "gallery-artifact.html"), g);
console.log("line-set + contact-line.png + gallery-artifact.html klaar");
