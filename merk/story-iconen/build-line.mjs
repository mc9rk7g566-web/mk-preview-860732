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
    <path d="M17 52 L58 44 Q62 43.5 62 47.5 L62 56.5 Q62 60.5 58 60 Q38 58 17 52 Z"/>
    <path d="M62 47 L84 47 Q88 47 88 51 L88 53 Q88 57 84 57 L62 57"/>`,

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
    <path d="M40 42 C34 30 50 27 60 30 C74 33 78 47 72 57 C67 68 47 70 40 61 C35 54 45 50 40 42 Z"/>
    <path d="M40 42 L30 34"/>
    <circle cx="26" cy="31" r="4.5"/>
    <circle cx="32" cy="27" r="4.5"/>`,

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
console.log("line-set + contact-line.png klaar");
