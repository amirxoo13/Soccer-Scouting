import type {
  ClubStint,
  PlayerCard,
  PlayerProfile,
  PlayerVideo,
  PlatformUser,
  PlayingLevel,
  PreferredFoot,
  ProfileStatus,
  ScoutStatus,
  UserRole,
} from "@/lib/types";

function str(v: unknown): string | null {
  if (v == null) return null;
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return String(v);
}

function num(v: unknown): number | null {
  if (v == null || v === "") return null;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

function bool(v: unknown): boolean {
  return v === true || v === "t" || v === "true" || v === 1;
}

function history(v: unknown): ClubStint[] {
  if (!v) return [];
  if (Array.isArray(v)) return v as ClubStint[];
  if (typeof v === "string") {
    try {
      const parsed = JSON.parse(v) as ClubStint[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

export function mapUser(row: Record<string, unknown>): PlatformUser {
  return {
    userId: String(row.user_id),
    role: row.role as UserRole,
    displayName: str(row.display_name),
    orgName: str(row.org_name),
    orgRole: str(row.org_role),
    scoutStatus: (row.scout_status as ScoutStatus) ?? "pending",
    isAdmin: bool(row.is_admin),
    locale: String(row.locale ?? "fa"),
    createdAt: str(row.created_at) ?? "",
  };
}

export function mapCard(row: Record<string, unknown>): PlayerCard {
  return {
    id: Number(row.id),
    firstName: String(row.first_name),
    lastName: String(row.last_name),
    dob: str(row.dob),
    nationality: str(row.nationality),
    country: str(row.country),
    city: str(row.city),
    heightCm: num(row.height_cm),
    weightKg: num(row.weight_kg),
    preferredFoot: (row.preferred_foot as PreferredFoot) ?? null,
    primaryPosition: str(row.primary_position),
    secondaryPositions: str(row.secondary_positions),
    currentClub: str(row.current_club),
    playingLevel: (row.playing_level as PlayingLevel) ?? null,
    photoUrl: str(row.photo_url),
    status: (row.status as ProfileStatus) ?? "draft",
    views: num(row.views) ?? 0,
    featured: bool(row.featured),
  };
}

export function mapVideo(row: Record<string, unknown>): PlayerVideo {
  return {
    id: Number(row.id),
    youtubeUrl: String(row.youtube_url),
    title: str(row.title),
    description: str(row.description),
    category: str(row.category),
    sortOrder: num(row.sort_order) ?? 0,
    playCount: num(row.play_count) ?? 0,
  };
}

export function mapProfile(
  row: Record<string, unknown>,
  videos: PlayerVideo[],
): PlayerProfile {
  return {
    ...mapCard(row),
    userId: String(row.user_id),
    jerseyNumber: num(row.jersey_number),
    clubHistory: history(row.club_history),
    achievements: str(row.achievements),
    injuryStatus: str(row.injury_status),
    languages: str(row.languages),
    education: str(row.education),
    bio: str(row.bio),
    instagram: str(row.instagram),
    fullBodyUrl: str(row.full_body_url),
    reviewNote: str(row.review_note),
    submittedAt: str(row.submitted_at),
    reviewedAt: str(row.reviewed_at),
    updatedAt: str(row.updated_at) ?? "",
    videos,
  };
}
