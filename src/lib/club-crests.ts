export type ClubCrest = {
  slug: string;
  name: string;
  country: string;
};

export const CLUB_CRESTS: ClubCrest[] = [
  { slug: "al-hilal", name: "Al Hilal", country: "SA" },
  { slug: "al-nassr", name: "Al Nassr", country: "SA" },
  { slug: "al-ahli-jeddah", name: "Al Ahli", country: "SA" },
  { slug: "al-sadd", name: "Al Sadd", country: "QA" },
  { slug: "al-duhail", name: "Al Duhail", country: "QA" },
  { slug: "al-rayyan", name: "Al Rayyan", country: "QA" },
  { slug: "al-wasl", name: "Al Wasl", country: "AE" },
  { slug: "al-ain", name: "Al Ain", country: "AE" },
  { slug: "shabab-al-ahli", name: "Shabab Al Ahli", country: "AE" },
  { slug: "persepolis", name: "Persepolis", country: "IR" },
  { slug: "esteghlal", name: "Esteghlal", country: "IR" },
  { slug: "sepahan", name: "Sepahan", country: "IR" },
  { slug: "foolad", name: "Foolad", country: "IR" },
  { slug: "urawa-reds", name: "Urawa Reds", country: "JP" },
  { slug: "kashima", name: "Kashima Antlers", country: "JP" },
  { slug: "kawasaki", name: "Kawasaki Frontale", country: "JP" },
  { slug: "gamba-osaka", name: "Gamba Osaka", country: "JP" },
  { slug: "vissel-kobe", name: "Vissel Kobe", country: "JP" },
  { slug: "yokohama", name: "Yokohama F. Marinos", country: "JP" },
  { slug: "jeonbuk", name: "Jeonbuk Hyundai", country: "KR" },
  { slug: "ulsan", name: "Ulsan HD", country: "KR" },
  { slug: "fc-seoul", name: "FC Seoul", country: "KR" },
  { slug: "pohang", name: "Pohang Steelers", country: "KR" },
  { slug: "shanghai-port", name: "Shanghai Port", country: "CN" },
  { slug: "shandong", name: "Shandong Taishan", country: "CN" },
  { slug: "beijing-guoan", name: "Beijing Guoan", country: "CN" },
  { slug: "pakhtakor", name: "Pakhtakor", country: "UZ" },
  { slug: "nasaf", name: "Nasaf", country: "UZ" },
  { slug: "buriram-united", name: "Buriram United", country: "TH" },
  { slug: "bg-pathum", name: "BG Pathum United", country: "TH" },
  { slug: "johor-dt", name: "Johor DT", country: "MY" },
  { slug: "lion-city", name: "Lion City Sailors", country: "SG" },
  { slug: "melbourne-victory", name: "Melbourne Victory", country: "AU" },
  { slug: "sydney-fc", name: "Sydney FC", country: "AU" },
  { slug: "mumbai-city", name: "Mumbai City", country: "IN" },
  { slug: "persija", name: "Persija Jakarta", country: "ID" },
  { slug: "kuwait-sc", name: "Kuwait SC", country: "KW" },
];

export function clubCrestSrc(slug: string) {
  return `/clubs/${slug}.png`;
}
