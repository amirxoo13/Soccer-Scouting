import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import type { ClubStint, PreferredFoot } from "@/lib/types";

const TM = "https://transfermarkt-api.fly.dev";
const SDB = "https://www.thesportsdb.com/api/v1/json/3";

export type TmSearchHit = {
  id: string;
  name: string;
  club: string | null;
  position: string | null;
  nationality: string | null;
  age: string | null;
  source: "transfermarkt" | "sportsdb";
};

export type TmImport = {
  firstName: string;
  lastName: string;
  dob: string | null;
  city: string | null;
  nationality: string | null;
  country: string | null;
  heightCm: number | null;
  preferredFoot: PreferredFoot | null;
  primaryPosition: string | null;
  currentClub: string | null;
  playingLevel: "professional";
  clubHistory: ClubStint[];
  source: string;
};

async function getJson(url: string, ms = 8000): Promise<unknown> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: { accept: "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

function splitName(name: string): { firstName: string; lastName: string } {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: parts[0] };
  return { firstName: parts.slice(0, -1).join(" "), lastName: parts.at(-1) ?? name };
}

function mapPosition(raw?: string | null): string | null {
  if (!raw) return null;
  const s = raw.toLowerCase();
  if (s.includes("goal")) return "GK";
  if (s.includes("centre-back") || s.includes("center-back") || s.includes("centre back")) return "CB";
  if (s.includes("left-back") || s.includes("left back")) return "LB";
  if (s.includes("right-back") || s.includes("right back")) return "RB";
  if (s.includes("left wing-back") || s.includes("left wing back")) return "LWB";
  if (s.includes("right wing-back") || s.includes("right wing back")) return "RWB";
  if (s.includes("defensive mid")) return "CDM";
  if (s.includes("attacking mid")) return "CAM";
  if (s.includes("central mid") || s.includes("midfield")) return "CM";
  if (s.includes("left mid")) return "LM";
  if (s.includes("right mid")) return "RM";
  if (s.includes("left wing")) return "LW";
  if (s.includes("right wing")) return "RW";
  if (s.includes("centre-forward") || s.includes("center-forward") || s.includes("second striker")) return "CF";
  if (s.includes("striker") || s.includes("forward") || s.includes("centre forward")) return "ST";
  return null;
}

function mapFoot(raw?: string | null): PreferredFoot | null {
  if (!raw) return null;
  const s = raw.toLowerCase();
  if (s.includes("both") || s.includes("either")) return "both";
  if (s.includes("left")) return "left";
  if (s.includes("right")) return "right";
  return null;
}

function parseHeight(raw?: string | number | null): number | null {
  if (raw == null) return null;
  if (typeof raw === "number") return raw > 50 ? Math.round(raw) : Math.round(raw * 100);
  const m = String(raw).match(/(\d)[.,](\d{2})/);
  if (m) return Number(m[1]) * 100 + Number(m[2]);
  const cm = String(raw).match(/(\d{3})/);
  return cm ? Number(cm[1]) : null;
}

function isoDate(raw?: string | null): string | null {
  if (!raw) return null;
  const m = raw.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  const d = Date.parse(raw);
  if (Number.isNaN(d)) return null;
  return new Date(d).toISOString().slice(0, 10);
}

function asHits(data: unknown): TmSearchHit[] {
  if (!data || typeof data !== "object") return [];
  const root = data as Record<string, unknown>;
  const list = (root.results ?? root.players ?? data) as unknown;
  if (!Array.isArray(list)) return [];
  return list.slice(0, 8).map((item) => {
    const p = item as Record<string, unknown>;
    const club = p.club;
    const clubName =
      typeof club === "string"
        ? club
        : club && typeof club === "object"
          ? String((club as Record<string, unknown>).name ?? "")
          : "";
    return {
      id: String(p.id ?? p.playerId ?? ""),
      name: String(p.name ?? p.fullName ?? "Player"),
      club: clubName || null,
      position: p.position == null ? null : String(p.position),
      nationality: p.nationality == null ? null : String(p.nationality),
      age: p.age == null ? null : String(p.age),
      source: "transfermarkt" as const,
    };
  }).filter((h) => h.id && h.name);
}

async function searchSportsDb(name: string): Promise<TmSearchHit[]> {
  const data = (await getJson(`${SDB}/searchplayers.php?p=${encodeURIComponent(name)}`)) as {
    player?: Record<string, string | null>[];
  };
  return (data.player ?? [])
    .filter((p) => (p.strSport ?? "").toLowerCase().includes("soccer") || p.strSport === "Soccer")
    .slice(0, 8)
    .map((p) => ({
      id: `sdb:${p.idPlayer}`,
      name: p.strPlayer ?? "Player",
      club: p.strTeam ?? null,
      position: p.strPosition ?? null,
      nationality: p.strNationality ?? null,
      age: p.dateBorn ?? null,
      source: "sportsdb" as const,
    }));
}

export const searchTransfermarkt = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: { q: string }) => input)
  .handler(async ({ data }): Promise<TmSearchHit[]> => {
    const q = data.q.trim();
    if (q.length < 2) return [];
    try {
      const json = await getJson(`${TM}/players/search/${encodeURIComponent(q)}?page_number=1`);
      const hits = asHits(json);
      if (hits.length) return hits;
    } catch {
      /* fall through */
    }
    try {
      return await searchSportsDb(q);
    } catch {
      return [];
    }
  });

export const importTransfermarkt = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: { id: string; name?: string }) => input)
  .handler(async ({ data }): Promise<TmImport> => {
    if (data.id.startsWith("sdb:")) {
      const id = data.id.slice(4);
      const json = (await getJson(`${SDB}/lookupplayer.php?id=${encodeURIComponent(id)}`)) as {
        players?: Record<string, string | null>[];
      };
      const p = json.players?.[0];
      if (!p) throw new Error("Player not found");
      const names = splitName(p.strPlayer ?? data.name ?? "");
      return {
        ...names,
        dob: isoDate(p.dateBorn),
        city: p.strBirthLocation ?? null,
        nationality: null,
        country: null,
        heightCm: parseHeight(p.strHeight),
        preferredFoot: mapFoot(p.strSide),
        primaryPosition: mapPosition(p.strPosition),
        currentClub: p.strTeam ?? null,
        playingLevel: "professional",
        clubHistory: [],
        source: "TheSportsDB",
      };
    }

    const profile = (await getJson(`${TM}/players/${encodeURIComponent(data.id)}/profile`)) as Record<
      string,
      unknown
    >;
    const name = String(profile.name ?? data.name ?? "");
    const names = splitName(name);
    const club = profile.club as Record<string, unknown> | string | undefined;
    const clubName = typeof club === "string" ? club : club?.name ? String(club.name) : null;
    const citizenship = profile.citizenship;
    const nation = Array.isArray(citizenship)
      ? String(citizenship[0] ?? "")
      : citizenship
        ? String(citizenship)
        : "";
    let history: ClubStint[] = [];
    try {
      const transfers = (await getJson(`${TM}/players/${encodeURIComponent(data.id)}/transfers`)) as {
        transfers?: { clubFrom?: { name?: string }; clubTo?: { name?: string }; date?: string; season?: string }[];
      };
      history = (transfers.transfers ?? []).slice(0, 8).map((tr) => {
        const year = tr.date ? Number(String(tr.date).slice(0, 4)) : tr.season ? Number(String(tr.season).slice(0, 4)) : 0;
        return {
          club: tr.clubTo?.name ?? tr.clubFrom?.name ?? "",
          from: year || 0,
          to: null,
        };
      });
    } catch {
      history = [];
    }
    const place = profile.placeOfBirth as Record<string, unknown> | string | undefined;
    const city = typeof place === "string" ? place : place?.city ? String(place.city) : null;
    return {
      ...names,
      dob: isoDate(profile.dateOfBirth == null ? null : String(profile.dateOfBirth)),
      city,
      nationality: nation || null,
      country: null,
      heightCm: parseHeight((profile.height as string | number | null) ?? null),
      preferredFoot: mapFoot(profile.foot == null ? null : String(profile.foot)),
      primaryPosition: mapPosition(
        typeof profile.position === "string"
          ? profile.position
          : profile.position && typeof profile.position === "object"
            ? String((profile.position as Record<string, unknown>).main ?? "")
            : null,
      ),
      currentClub: clubName,
      playingLevel: "professional",
      clubHistory: history,
      source: "Transfermarkt",
    };
  });
