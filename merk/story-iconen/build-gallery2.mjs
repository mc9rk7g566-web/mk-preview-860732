// Bouwt de keuze-galerij (Artifact) voor de HIGGSFIELD icoon-set — crème op bordeaux.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = dirname(fileURLToPath(import.meta.url));
const raw = (name) =>
  "data:image/svg+xml;base64," +
  readFileSync(join(DIR, "higgsfield/raw", name + ".svg")).toString("base64");
const lilita = readFileSync(join(DIR, "../fonts/LilitaOne.ttf")).toString("base64");

const ICONS = [
  { label: "Kokmuts",  rec: "kokmuts-2",  alts: ["kokmuts-1"] },
  { label: "Mesje",    rec: "mesje-1",    alts: [], note: "Variant 2 werd per ongeluk een paddenstoel — weggelaten." },
  { label: "Wijnglas", rec: "wijnglas-dik-4", alts: ["wijnglas-dik-2", "wijnglas-slank-3"], note: "Slanke, chique vorm met een steviger, dikkere lijn zodat hij matcht met de massieve iconen en het bold logo. Dik 4 = aanrader; dik 2 = klassieker; slank-3 = de fijnere lijn." },
  { label: "Druiven",  rec: "druiven-1",  alts: ["druiven-2"] },
  { label: "Vlees",    rec: "vlees-2",    alts: ["vlees-1"], note: "Kwam als drumstick. Liever rood vlees/steak? Zeg het, dan maak ik die." },
  { label: "Vis",      rec: "vis-2",      alts: [], note: "Variant 1 was blobberig — weggelaten." },
];

const disc = (name, big = false) =>
  `<div class="disc${big ? " big" : ""}"><img src="${raw(name)}" alt=""></div>`;

let recRow = ICONS.map((i) => `<div class="cell">${disc(i.rec, true)}<div class="cap">${i.label}</div></div>`).join("");

let rows = ICONS.map((i) => {
  const options = [i.rec, ...i.alts];
  const opts = options
    .map((n, idx) => `<div class="opt">${disc(n)}<div class="tag">${idx === 0 ? "aanbevolen" : "alternatief"}</div></div>`)
    .join("");
  return `<div class="iconrow">
    <div class="rowhead"><h3>${i.label}</h3>${i.note ? `<p class="note">${i.note}</p>` : ""}</div>
    <div class="opts">${opts}</div>
  </div>`;
}).join("");

const GLASSES = [
  { n: "wijnglas-slank-3-dik20", cap: "SVG +20 · exact jouw glas", tag: "mijn methode" },
  { n: "wijnglas-hf-dik-3", cap: "Higgsfield 3 · schone lijn", tag: "aanrader" },
  { n: "wijnglas-hf-dik-1", cap: "Higgsfield 1", tag: "" },
  { n: "wijnglas-hf-dik-2", cap: "Higgsfield 2", tag: "" },
  { n: "wijnglas-hf-dik-4", cap: "Higgsfield 4", tag: "" },
];
const glassRow = GLASSES.map((g) => `<div class="cell"><div class="disc">${disc(g.n)}</div><div class="cap">${g.cap}${g.tag ? `<br><span style="color:#CDB998;font-size:.7rem;letter-spacing:.06em;text-transform:uppercase">${g.tag}</span>` : ""}</div></div>`).join("");

const html = `<style>
  @font-face{font-family:"Lilita One";font-weight:400;font-display:swap;
    src:url(data:font/ttf;base64,${lilita}) format("truetype")}
  .wrap{max-width:1040px;margin:0 auto;padding:44px 22px 72px;color:#F4EDE4;
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif}
  h1,h2,h3{font-family:"Lilita One",system-ui,sans-serif;text-transform:uppercase;font-weight:400;letter-spacing:.02em}
  .kick{font-size:.78rem;letter-spacing:.34em;text-transform:uppercase;color:#CDB998;margin:0 0 10px}
  h1{font-size:clamp(2.2rem,5.5vw,3.4rem);line-height:1.02;margin:0 0 14px}
  .lead{color:#E5D9C6;max-width:60ch;line-height:1.6;margin:0}
  h2{font-size:1.15rem;color:#CDB998;letter-spacing:.06em;margin:52px 0 4px}
  .subline{color:#9c8f7d;font-size:.85rem;margin:0 0 22px}
  .recrow{display:grid;grid-template-columns:repeat(6,1fr);gap:16px}
  .glassrow{display:grid;grid-template-columns:repeat(5,1fr);gap:16px}
  @media(max-width:720px){.recrow,.glassrow{grid-template-columns:repeat(3,1fr)}}
  .cell{text-align:center}
  .disc{aspect-ratio:1;border-radius:50%;overflow:hidden;box-shadow:0 8px 22px rgba(0,0,0,.4)}
  .disc img{width:100%;height:100%;display:block}
  .cap{font-size:.82rem;color:#E5D9C6;margin-top:9px}
  .iconrow{display:flex;gap:26px;align-items:center;padding:20px 0;border-top:1px solid rgba(244,237,228,.1)}
  .rowhead{flex:1;min-width:0}
  .rowhead h3{font-size:1.25rem;margin:0 0 4px}
  .note{color:#CDB998;font-size:.85rem;line-height:1.5;margin:0;max-width:42ch}
  .opts{display:flex;gap:18px}
  .opt{width:112px;text-align:center}
  .opt .disc{width:112px}
  .tag{font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;margin-top:7px;color:#9c8f7d}
  .opt:first-child .tag{color:#F4EDE4}
  .footer{margin-top:44px;color:#CDB998;font-size:.9rem;line-height:1.65;
    border-top:1px solid rgba(244,237,228,.12);padding-top:22px}
</style>
<div class="wrap">
  <p class="kick">Maarten kookt · Instagram</p>
  <h1>Story-highlight iconen</h1>
  <p class="lead">Zes iconen in crème op bordeaux, gemaakt met Higgsfield (Recraft-vector) — haarscherp en in je exacte huisstijlkleuren. Hieronder de aanbevolen set, en per icoon de varianten om uit te kiezen.</p>

  <h2>Wijnglas — welke dikte?</h2>
  <p class="subline">Je vroeg dit glas iets dikker. Eerste = exact jouw glas met een dikkere lijn (mijn methode). De rest is vers met Higgsfield gemaakt. Zeg welke je wilt.</p>
  <div class="glassrow">${glassRow}</div>

  <h2>Aanbevolen set</h2>
  <p class="subline">De sterkste variant per icoon — als één rij highlight-covers.</p>
  <div class="recrow">${recRow}</div>

  <h2>Kies per icoon</h2>
  <p class="subline">Zeg welke variant je per icoon wilt, dan lever ik precies die.</p>
  ${rows}

  <p class="footer">
    <strong style="color:#F4EDE4">Plaatsen:</strong> Instagram → je profiel → een highlight vasthouden → <em>Omslag bewerken</em> → de PNG kiezen. Klaar op 1080×1080 (Instagram snijdt tot een cirkel). Ook als schaalbare SVG geleverd.<br><br>
    <strong style="color:#F4EDE4">Laat weten:</strong> welke varianten je kiest · of je vlees als steak wilt i.p.v. drumstick · of je nog een icoon nodig hebt (brood, kaas, koffie, vuur, peper) in dezelfde stijl.
  </p>
</div>`;

writeFileSync(join(DIR, "gallery-artifact.html"), html);
console.log("gallery-artifact.html (higgsfield) klaar");
