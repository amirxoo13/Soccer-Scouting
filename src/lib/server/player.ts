import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { mapProfile, mapVideo } from "./mappers";
import type { ClubStint, PlayingLevel, PreferredFoot, PlayerProfile } from "@/lib/types";

export type ProfilePayload = {
  firstName: string;
  lastName: string;
  dob?: string | null;
  nationality?: string | null;
  country?: string | null;
  city?: string | null;
  heightCm?: number | null;
  weightKg?: number | null;
  preferredFoot?: PreferredFoot | null;
  primaryPosition?: string | null;
  secondaryPositions?: string | null;
  jerseyNumber?: number | null;
  currentClub?: string | null;
  clubHistory?: ClubStint[];
  playingLevel?: PlayingLevel | null;
  achievements?: string | null;
  injuryStatus?: string | null;
  languages?: string | null;
  education?: string | null;
  bio?: string | null;
  instagram?: string | null;
  photoUrl?: string | null;
  fullBodyUrl?: string | null;
  videos?: { youtubeUrl: string; title?: string; description?: string; category?: string }[];
};

async function requirePlayer(userId: string) {
  const sql = await getSql();
  const [user] = await sql<{ role: string }>`select role from platform_users where user_id = ${userId}`;
  if (!user || user.role !== "player") throw new Error("Player account required");
  return sql;
}

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<PlayerProfile | null> => {
    const sql = await requirePlayer(context.userId);
    const [row] = await sql<Record<string, unknown>>`
      select * from player_profiles where user_id = ${context.userId}
    `;
    if (!row) return null;
    const videos = await sql<Record<string, unknown>>`
      select * from player_videos where profile_id = ${row.id} order by sort_order, id
    `;
    return mapProfile(row, videos.map(mapVideo));
  });

export const saveMyProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: ProfilePayload) => input)
  .handler(async ({ context, data }) => {
    const sql = await requirePlayer(context.userId);
    const [row] = await sql<{ id: number; status: string }>`
      select id, status from player_profiles where user_id = ${context.userId}
    `;
    if (row && row.status === "pending") throw new Error("Profile is locked during review");

    const first = data.firstName.trim();
    const last = data.lastName.trim();
    if (!first || !last) throw new Error("Name is required");

    const history = JSON.stringify(data.clubHistory ?? []);
    const nextStatus = row?.status === "approved" ? "pending" : row?.status === "needs_revision" || row?.status === "rejected" ? "draft" : (row?.status ?? "draft");

    if (!row) {
      const [created] = await sql<{ id: number }>`
        insert into player_profiles (
          user_id, first_name, last_name, dob, nationality, country, city,
          height_cm, weight_kg, preferred_foot, primary_position, secondary_positions,
          jersey_number, current_club, club_history, playing_level, achievements,
          injury_status, languages, education, bio, instagram, photo_url, full_body_url, status, updated_at
        ) values (
          ${context.userId}, ${first}, ${last}, ${data.dob || null}, ${data.nationality || null},
          ${data.country || null}, ${data.city || null}, ${data.heightCm ?? null}, ${data.weightKg ?? null},
          ${data.preferredFoot || null}, ${data.primaryPosition || null}, ${data.secondaryPositions || null},
          ${data.jerseyNumber ?? null}, ${data.currentClub || null}, ${history}::jsonb,
          ${data.playingLevel || null}, ${data.achievements || null}, ${data.injuryStatus || null},
          ${data.languages || null}, ${data.education || null}, ${data.bio || null}, ${data.instagram || null},
          ${data.photoUrl || null}, ${data.fullBodyUrl || null}, 'draft', now()
        ) returning id
      `;
      await replaceVideos(sql, created.id, data.videos ?? []);
    } else {
      await sql`
        update player_profiles set
          first_name = ${first},
          last_name = ${last},
          dob = ${data.dob || null},
          nationality = ${data.nationality || null},
          country = ${data.country || null},
          city = ${data.city || null},
          height_cm = ${data.heightCm ?? null},
          weight_kg = ${data.weightKg ?? null},
          preferred_foot = ${data.preferredFoot || null},
          primary_position = ${data.primaryPosition || null},
          secondary_positions = ${data.secondaryPositions || null},
          jersey_number = ${data.jerseyNumber ?? null},
          current_club = ${data.currentClub || null},
          club_history = ${history}::jsonb,
          playing_level = ${data.playingLevel || null},
          achievements = ${data.achievements || null},
          injury_status = ${data.injuryStatus || null},
          languages = ${data.languages || null},
          education = ${data.education || null},
          bio = ${data.bio || null},
          instagram = ${data.instagram || null},
          photo_url = ${data.photoUrl || null},
          full_body_url = ${data.fullBodyUrl || null},
          status = ${nextStatus},
          updated_at = now()
        where user_id = ${context.userId}
      `;
      await replaceVideos(sql, row.id, data.videos ?? []);
    }
    return { ok: true as const };
  });

export const submitMyProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await requirePlayer(context.userId);
    const [row] = await sql<{ id: number; first_name: string; last_name: string; primary_position: string | null }>`
      select id, first_name, last_name, primary_position from player_profiles where user_id = ${context.userId}
    `;
    if (!row) throw new Error("Save a draft first");
    if (!row.primary_position) throw new Error("Position is required to submit");
    const { loadAccess } = await import("./billing");
    const access = await loadAccess(sql, context.userId);
    if (!access.canPublish) {
      if (access.publishBlock === "youth") throw new Error("Youth documents must be approved first");
      if (access.publishBlock === "pay_u24") throw new Error("Annual $200 seat required to publish");
      if (access.publishBlock === "pay_senior") throw new Error("Annual $400 seat required to publish");
      if (access.publishBlock === "age") throw new Error("Players must be 16 or older");
      throw new Error("Date of birth is required before publishing");
    }
    await sql`
      update player_profiles
      set status = 'pending', submitted_at = now(), updated_at = now()
      where user_id = ${context.userId} and status in ('draft','needs_revision','rejected','approved')
    `;
    await sql`
      insert into notifications (user_id, title, body, kind, link)
      values (${context.userId}, 'Profile submitted', 'Your profile is in the review queue.', 'profile', '/app/profile')
    `;
    return { ok: true as const };
  });

async function replaceVideos(
  sql: Awaited<ReturnType<typeof getSql>>,
  profileId: number,
  videos: { youtubeUrl: string; title?: string; description?: string; category?: string }[],
) {
  await sql`delete from player_videos where profile_id = ${profileId}`;
  let order = 0;
  for (const v of videos) {
    const url = v.youtubeUrl?.trim();
    if (!url) continue;
    await sql`
      insert into player_videos (profile_id, youtube_url, title, description, category, sort_order)
      values (${profileId}, ${url}, ${v.title || null}, ${v.description || null}, ${v.category || null}, ${order})
    `;
    order += 1;
    if (order >= 6) break;
  }
}

export const listMyInbox = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<Record<string, unknown>>`
      select cr.id, cr.from_user_id, cr.message, cr.status, cr.created_at::text as created_at,
             pu.display_name, pu.org_name,
             pp.first_name, pp.last_name, cr.profile_id
      from contact_requests cr
      join player_profiles pp on pp.id = cr.profile_id
      left join platform_users pu on pu.user_id = cr.from_user_id
      where pp.user_id = ${context.userId}
      order by cr.created_at desc
    `;
    return rows.map((r) => ({
      id: Number(r.id),
      fromUserId: String(r.from_user_id),
      fromName: r.display_name == null ? null : String(r.display_name),
      fromOrg: r.org_name == null ? null : String(r.org_name),
      profileId: Number(r.profile_id),
      playerName: `${r.first_name} ${r.last_name}`,
      message: r.message == null ? null : String(r.message),
      status: r.status as "open" | "seen" | "closed",
      createdAt: String(r.created_at),
    }));
  });
