import type { ClubStint, PlayerProfile } from "./types";

export type SeasonRow = ClubStint & {
  competition?: string;
  appearances?: number;
  goals?: number;
  assists?: number;
  minutes?: number;
  yellow?: number;
  red?: number;
};

export type Dossier = {
  placeOfBirth: string;
  marketValueEur: number;
  joinedOn: string;
  contractUntil: string | null;
  agentName: string | null;
  outfitter: string | null;
  nationalTeam: string | null;
  nationalCaps: number;
  nationalGoals: number;
  seasons: SeasonRow[];
};

const D: Record<string, Dossier> = {
  "Arman Rahimi": {
    placeOfBirth: "Tehran",
    marketValueEur: 180000,
    joinedOn: "2025-07-01",
    contractUntil: "2027-06-30",
    agentName: null,
    outfitter: "Nike",
    nationalTeam: "Iran U20",
    nationalCaps: 6,
    nationalGoals: 2,
    seasons: [
      { club: "Oghab Tehran", from: 2021, to: 2023, competition: "Tehran Youth League", appearances: 34, goals: 19, assists: 6, minutes: 2610, yellow: 3, red: 0 },
      { club: "Esteghlal U19", from: 2023, to: 2025, competition: "Iran U19 League", appearances: 41, goals: 22, assists: 8, minutes: 3120, yellow: 4, red: 0 },
      { club: "Esteghlal U21", from: 2025, to: null, competition: "Iran U21", appearances: 18, goals: 14, assists: 5, minutes: 1420, yellow: 2, red: 0 },
    ],
  },
  "Yuki Nakamura": {
    placeOfBirth: "Osaka",
    marketValueEur: 350000,
    joinedOn: "2022-02-01",
    contractUntil: "2027-01-31",
    agentName: null,
    outfitter: "Mizuno",
    nationalTeam: "Japan U21",
    nationalCaps: 4,
    nationalGoals: 0,
    seasons: [
      { club: "Gamba Osaka Youth", from: 2018, to: 2022, competition: "J Youth", appearances: 62, goals: 11, assists: 24, minutes: 4980, yellow: 5, red: 0 },
      { club: "Cerezo Osaka U23", from: 2022, to: null, competition: "J3 League", appearances: 37, goals: 6, assists: 12, minutes: 2890, yellow: 3, red: 0 },
    ],
  },
  "Min-jun Park": {
    placeOfBirth: "Busan",
    marketValueEur: 220000,
    joinedOn: "2019-03-01",
    contractUntil: "2027-12-31",
    agentName: null,
    outfitter: "Adidas",
    nationalTeam: "Korea Republic U19",
    nationalCaps: 3,
    nationalGoals: 0,
    seasons: [
      { club: "Busan IPark Academy", from: 2019, to: null, competition: "K League U18", appearances: 58, goals: 4, assists: 2, minutes: 5010, yellow: 8, red: 1 },
    ],
  },
  "Fahad Al-Mutairi": {
    placeOfBirth: "Riyadh",
    marketValueEur: 400000,
    joinedOn: "2024-07-01",
    contractUntil: "2028-06-30",
    agentName: null,
    outfitter: "Puma",
    nationalTeam: "Saudi Arabia U19",
    nationalCaps: 8,
    nationalGoals: 2,
    seasons: [
      { club: "Al-Nassr U17", from: 2022, to: 2024, competition: "Saudi U17", appearances: 29, goals: 9, assists: 14, minutes: 2210, yellow: 2, red: 0 },
      { club: "Al-Nassr U19", from: 2024, to: null, competition: "Saudi U19", appearances: 22, goals: 7, assists: 11, minutes: 1760, yellow: 1, red: 0 },
    ],
  },
  "Javohir Karimov": {
    placeOfBirth: "Tashkent",
    marketValueEur: 450000,
    joinedOn: "2022-01-15",
    contractUntil: "2027-12-31",
    agentName: "Central Asia Sports",
    outfitter: "Adidas",
    nationalTeam: "Uzbekistan",
    nationalCaps: 2,
    nationalGoals: 0,
    seasons: [
      { club: "Bunyodkor U21", from: 2019, to: 2022, competition: "Uzbek U21", appearances: 44, goals: 0, assists: 0, minutes: 3960, yellow: 2, red: 0 },
      { club: "Pakhtakor", from: 2022, to: null, competition: "Super League", appearances: 14, goals: 0, assists: 1, minutes: 1260, yellow: 1, red: 0 },
    ],
  },
  "Putri Andini": {
    placeOfBirth: "Bandung",
    marketValueEur: 90000,
    joinedOn: "2024-01-10",
    contractUntil: "2027-06-30",
    agentName: null,
    outfitter: "Specs",
    nationalTeam: "Indonesia U18",
    nationalCaps: 5,
    nationalGoals: 3,
    seasons: [
      { club: "Persib Academy", from: 2021, to: 2024, competition: "PSSI Youth", appearances: 40, goals: 16, assists: 11, minutes: 3100, yellow: 2, red: 0 },
      { club: "Persib Putri", from: 2024, to: null, competition: "Liga Putri", appearances: 16, goals: 7, assists: 6, minutes: 1288, yellow: 1, red: 0 },
    ],
  },
  "Emre Yildiz": {
    placeOfBirth: "Istanbul",
    marketValueEur: 280000,
    joinedOn: "2022-08-01",
    contractUntil: "2026-06-30",
    agentName: null,
    outfitter: "Nike",
    nationalTeam: "Türkiye U19",
    nationalCaps: 4,
    nationalGoals: 0,
    seasons: [
      { club: "Galatasaray U16", from: 2018, to: 2022, competition: "ELIT U16", appearances: 51, goals: 3, assists: 12, minutes: 4080, yellow: 7, red: 0 },
      { club: "Fatih Karagumruk U19", from: 2022, to: null, competition: "U19 Süper Lig", appearances: 33, goals: 2, assists: 9, minutes: 2750, yellow: 6, red: 0 },
    ],
  },
  "Arjun Mehta": {
    placeOfBirth: "Mumbai",
    marketValueEur: 120000,
    joinedOn: "2023-06-01",
    contractUntil: "2027-05-31",
    agentName: null,
    outfitter: "Nivia",
    nationalTeam: "India U20",
    nationalCaps: 7,
    nationalGoals: 4,
    seasons: [
      { club: "RFYC", from: 2019, to: 2023, competition: "RFYC", appearances: 48, goals: 31, assists: 10, minutes: 3720, yellow: 3, red: 0 },
      { club: "Mumbai City FC Academy", from: 2023, to: null, competition: "RFYC / ISL Academy", appearances: 21, goals: 12, assists: 5, minutes: 1680, yellow: 2, red: 0 },
    ],
  },
  "Niran Chaiyasit": {
    placeOfBirth: "Bangkok",
    marketValueEur: 150000,
    joinedOn: "2023-01-01",
    contractUntil: "2026-12-31",
    agentName: null,
    outfitter: "Warrix",
    nationalTeam: "Thailand U19",
    nationalCaps: 9,
    nationalGoals: 1,
    seasons: [
      { club: "Muangthong U17", from: 2020, to: 2023, competition: "Thai U17", appearances: 36, goals: 8, assists: 11, minutes: 2540, yellow: 4, red: 0 },
      { club: "BG Pathum United U21", from: 2023, to: null, competition: "Thai U21", appearances: 24, goals: 6, assists: 9, minutes: 1890, yellow: 2, red: 0 },
    ],
  },
  "Noor Al-Attiyah": {
    placeOfBirth: "Doha",
    marketValueEur: 900000,
    joinedOn: "2021-07-01",
    contractUntil: "2028-06-30",
    agentName: "Aspire Sports",
    outfitter: "Nike",
    nationalTeam: "Qatar",
    nationalCaps: 5,
    nationalGoals: 0,
    seasons: [
      { club: "Aspire Academy", from: 2014, to: 2021, competition: "Aspire", appearances: 0, goals: 0, assists: 0, minutes: 0, yellow: 0, red: 0 },
      { club: "Al-Sadd", from: 2021, to: null, competition: "Qatar Stars League", appearances: 31, goals: 2, assists: 5, minutes: 2140, yellow: 4, red: 0 },
    ],
  },
  "Hana Kobayashi": {
    placeOfBirth: "Yokohama",
    marketValueEur: 200000,
    joinedOn: "2021-04-01",
    contractUntil: "2027-03-31",
    agentName: null,
    outfitter: "Asics",
    nationalTeam: "Japan U20",
    nationalCaps: 6,
    nationalGoals: 1,
    seasons: [
      { club: "Nippon TV Tokyo Verdy Beleza U18", from: 2021, to: null, competition: "WE League youth", appearances: 39, goals: 11, assists: 14, minutes: 2980, yellow: 1, red: 0 },
    ],
  },
  "Ali Hussein": {
    placeOfBirth: "Baghdad",
    marketValueEur: 160000,
    joinedOn: "2022-09-01",
    contractUntil: "2026-06-30",
    agentName: null,
    outfitter: "Adidas",
    nationalTeam: "Iraq U20",
    nationalCaps: 8,
    nationalGoals: 0,
    seasons: [
      { club: "Al-Zawraa Youth", from: 2018, to: 2022, competition: "Iraq Youth", appearances: 47, goals: 3, assists: 4, minutes: 3890, yellow: 9, red: 0 },
      { club: "Al-Shorta U21", from: 2022, to: null, competition: "Iraq U21", appearances: 28, goals: 1, assists: 3, minutes: 2410, yellow: 6, red: 1 },
    ],
  },
};

export function dossierFor(first: string, last: string): Dossier | null {
  return D[`${first} ${last}`] ?? null;
}

export function enrichHistory(player: PlayerProfile): SeasonRow[] {
  const d = dossierFor(player.firstName, player.lastName);
  if (d?.seasons.length) return d.seasons;
  return player.clubHistory;
}

export function formatEur(n: number) {
  if (n >= 1_000_000) {
    const v = n / 1_000_000;
    return `€${Number.isInteger(v) ? v : v.toFixed(1)}m`;
  }
  if (n >= 1_000) return `€${Math.round(n / 1_000)}k`;
  return `€${n}`;
}

export function formatHeightM(cm: number) {
  return `${(cm / 100).toFixed(2).replace(".", ",")} m`;
}

export function formatDate(iso: string, locale: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const loc = locale === "fa" ? "fa-IR" : locale === "ar" ? "ar" : locale === "tr" ? "tr-TR" : locale === "az" ? "az-AZ" : locale === "ur" ? "ur-PK" : locale === "ku" ? "ckb" : "en-GB";
  try {
    return new Intl.DateTimeFormat(loc, { day: "numeric", month: "short", year: "numeric" }).format(d);
  } catch {
    return iso;
  }
}
