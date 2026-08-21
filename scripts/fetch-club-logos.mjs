import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = "/workspace/public";
const UA = "SoccerScouting/1.0 (https://soccerscouting.app; talent-platform)";

const CLUBS = [
  { slug: "al-hilal", wiki: "Al_Hilal_SFC", q: "Al Hilal" },
  { slug: "al-nassr", wiki: "Al_Nassr_FC", q: "Al Nassr" },
  { slug: "al-ittihad", wiki: "Al-Ittihad_Club_(Jeddah)", q: "Al Ittihad Jeddah" },
  { slug: "al-ahli-jeddah", wiki: "Al-Ahli_Saudi_FC", q: "Al Ahli Saudi" },
  { slug: "al-sadd", wiki: "Al_Sadd_SC", q: "Al Sadd" },
  { slug: "al-duhail", wiki: "Al-Duhail_SC", q: "Al Duhail" },
  { slug: "al-rayyan", wiki: "Al-Rayyan_SC", q: "Al Rayyan" },
  { slug: "al-wasl", wiki: "Al_Wasl_F.C.", q: "Al Wasl" },
  { slug: "al-ain", wiki: "Al_Ain_FC", q: "Al Ain" },
  { slug: "shabab-al-ahli", wiki: "Shabab_Al_Ahli_Club", q: "Shabab Al Ahli" },
  { slug: "persepolis", wiki: "Persepolis_F.C.", q: "Persepolis" },
  { slug: "esteghlal", wiki: "Esteghlal_F.C.", q: "Esteghlal" },
  { slug: "tractor", wiki: "Tractor_S.C.", q: "Tractor Tabriz" },
  { slug: "sepahan", wiki: "Sepahan_S.C.", q: "Sepahan" },
  { slug: "foolad", wiki: "Foolad_F.C.", q: "Foolad" },
  { slug: "urawa-reds", wiki: "Urawa_Red_Diamonds", q: "Urawa Red Diamonds" },
  { slug: "kashima", wiki: "Kashima_Antlers", q: "Kashima Antlers" },
  { slug: "kawasaki", wiki: "Kawasaki_Frontale", q: "Kawasaki Frontale" },
  { slug: "gamba-osaka", wiki: "Gamba_Osaka", q: "Gamba Osaka" },
  { slug: "vissel-kobe", wiki: "Vissel_Kobe", q: "Vissel Kobe" },
  { slug: "yokohama", wiki: "Yokohama_F._Marinos", q: "Yokohama F. Marinos" },
  { slug: "jeonbuk", wiki: "Jeonbuk_Hyundai_Motors_FC", q: "Jeonbuk Hyundai" },
  { slug: "ulsan", wiki: "Ulsan_HD_FC", q: "Ulsan HD" },
  { slug: "fc-seoul", wiki: "FC_Seoul", q: "FC Seoul" },
  { slug: "pohang", wiki: "Pohang_Steelers", q: "Pohang Steelers" },
  { slug: "shanghai-port", wiki: "Shanghai_Port_F.C.", q: "Shanghai Port" },
  { slug: "shandong", wiki: "Shandong_Taishan_F.C.", q: "Shandong Taishan" },
  { slug: "beijing-guoan", wiki: "Beijing_Guoan_F.C.", q: "Beijing Guoan" },
  { slug: "pakhtakor", wiki: "Pakhtakor_Tashkent_FK", q: "Pakhtakor" },
  { slug: "nasaf", wiki: "Nasaf", q: "Nasaf" },
  { slug: "buriram-united", wiki: "Buriram_United_F.C.", q: "Buriram United" },
  { slug: "bg-pathum", wiki: "BG_Pathum_United_F.C.", q: "BG Pathum United" },
  { slug: "johor-dt", wiki: "Johor_Darul_Ta'zim_F.C.", q: "Johor Darul Ta'zim" },
  { slug: "lion-city", wiki: "Lion_City_Sailors_FC", q: "Lion City Sailors" },
  { slug: "melbourne-victory", wiki: "Melbourne_Victory_FC", q: "Melbourne Victory" },
  { slug: "sydney-fc", wiki: "Sydney_FC", q: "Sydney FC" },
  { slug: "mumbai-city", wiki: "Mumbai_City_FC", q: "Mumbai City" },
  { slug: "persija", wiki: "Persija_Jakarta", q: "Persija Jakarta" },
  { slug: "persib", wiki: "Persib_Bandung", q: "Persib Bandung" },
  { slug: "al-shorta", wiki: "Al-Shorta_SC", q: "Al Shorta" },
  { slug: "al-zawraa", wiki: "Al-Zawraa_SC", q: "Al Zawraa" },
  { slug: "al-quwa", wiki: "Al-Quwa_Al-Jawiya", q: "Al Quwa Al Jawiya" },
  { slug: "al-wehdat", wiki: "Al-Wehdat_SC", q: "Al Wehdat" },
  { slug: "al-faisaly", wiki: "Al-Faisaly_SC_(Amman)", q: "Al Faisaly Amman" },
  { slug: "kuwait-sc", wiki: "Kuwait_SC", q: "Kuwait SC" },
  { slug: "qadsia", wiki: "Qadsia_SC", q: "Qadsia" },
];

async function getJson(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

async function wikiThumb(title) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&piprop=thumbnail&pithumbsize=256&redirects=1&titles=${encodeURIComponent(title)}`;
  const data = await getJson(url);
  const pages = data?.query?.pages ?? {};
  const page = Object.values(pages)[0];
  return page?.thumbnail?.source ?? null;
}

async function sportsDbBadge(q) {
  const url = `https://www.thesportsdb.com/api/v1/json/123/searchteams.php?t=${encodeURIComponent(q)}`;
  const data = await getJson(url);
  const team = data?.teams?.[0];
  return team?.strBadge || team?.strTeamBadge || null;
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`download ${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 400) throw new Error("too small");
  await writeFile(dest, buf);
  return buf.length;
}

async function grab(slug, fns, dest) {
  if (existsSync(dest)) return "exists";
  for (const fn of fns) {
    try {
      const url = await fn();
      if (!url) continue;
      const n = await download(url, dest);
      return `ok ${n}`;
    } catch (e) {
      /* try next */
    }
  }
  return "fail";
}

await mkdir(path.join(ROOT, "clubs"), { recursive: true });
await mkdir(path.join(ROOT, "partners"), { recursive: true });

const results = [];
for (const c of CLUBS) {
  const dest = path.join(ROOT, "clubs", `${c.slug}.png`);
  const status = await grab(c.slug, [() => wikiThumb(c.wiki), () => sportsDbBadge(c.q)], dest);
  results.push(`${c.slug}: ${status}`);
}

const afcDest = path.join(ROOT, "partners", "afc.png");
const afc = await grab(
  "afc",
  [
    () => wikiThumb("Asian Football Confederation"),
    async () => "https://upload.wikimedia.org/wikipedia/en/thumb/8/8b/AFC_logo.svg/240px-AFC_logo.svg.png",
    async () => "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/AFC_logo.svg/240px-AFC_logo.svg.png",
  ],
  afcDest,
);
results.push(`afc: ${afc}`);

console.log(results.join("\n"));
const ok = results.filter((r) => r.includes("ok") || r.includes("exists")).length;
console.log(`\n${ok}/${results.length} saved`);
