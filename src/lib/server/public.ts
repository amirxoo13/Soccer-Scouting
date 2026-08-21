import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { optionalAuthMiddleware } from "@/lib/auth/middleware";
import { mapCard, mapProfile, mapVideo } from "./mappers";
import type { PlayerCard, PlayerProfile, RedactedCard, TalentSearchResult, PublicPlayerResult } from "@/lib/types";

function asBool(v: unknown): boolean {
  return v === true || v === "t" || v === "true" || v === 1;
}

async function canView(userId: string | null): Promise<boolean> {
  if (!userId) return false;
  const sql = await getSql();
  const [admin] = await sql<{ is_admin: unknown }>`
    select is_admin from platform_users where user_id = ${userId}
  `;
  if (asBool(admin?.is_admin)) return true;
  const [sub] = await sql<{ plan: string }>`
    select plan from subscriptions
    where user_id = ${userId} and status = 'active' and ends_at > now() and plan = 'desk'
  `;
  return Boolean(sub);
}

function redact(row: Record<string, unknown>): RedactedCard {
  return {
    id: Number(row.id),
    primaryPosition: row.primary_position == null ? null : String(row.primary_position),
    photoUrl: row.photo_url == null ? null : String(row.photo_url),
    locked: true,
  };
}

export const getLandingStats = createServerFn({ method: "GET" }).handler(async () => {
  return {
    markets: 47,
    positions: 15,
    languages: 7,
    annual: 12,
  };
});

export type SearchInput = {
  q?: string;
  country?: string;
  position?: string;
  foot?: string;
  level?: string;
  ageMin?: number;
  ageMax?: number;
  sort?: "newest" | "views";
};

export const searchPlayers = createServerFn({ method: "GET" })
  .middleware([optionalAuthMiddleware])
  .validator((input: SearchInput) => input ?? {})
  .handler(async ({ data, context }): Promise<TalentSearchResult> => {
    const sql = await getSql();
    const params: unknown[] = [];
    const where: string[] = ["status = 'approved'"];

    if (data.q?.trim() && (await canView(context.userId))) {
      params.push(`%${data.q.trim()}%`);
      const i = params.length;
      where.push(
        `(first_name ilike $${i} or last_name ilike $${i} or current_club ilike $${i} or city ilike $${i})`,
      );
    }
    if (data.country) {
      params.push(data.country);
      where.push(`country = $${params.length}`);
    }
    if (data.position) {
      params.push(data.position);
      const i = params.length;
      where.push(`(primary_position = $${i} or coalesce(secondary_positions,'') ilike '%' || $${i} || '%')`);
    }
    if (data.foot) {
      params.push(data.foot);
      where.push(`preferred_foot = $${params.length}`);
    }
    if (data.level) {
      params.push(data.level);
      where.push(`playing_level = $${params.length}`);
    }
    if (data.ageMin != null) {
      params.push(data.ageMin);
      where.push(`dob is not null and extract(year from age(current_date, dob)) >= $${params.length}`);
    }
    if (data.ageMax != null) {
      params.push(data.ageMax);
      where.push(`dob is not null and extract(year from age(current_date, dob)) <= $${params.length}`);
    }

    const allowed = await canView(context.userId);
    const order = allowed && data.sort === "views" ? "views desc, id desc" : "updated_at desc, id desc";
    const text = `select * from player_profiles where ${where.join(" and ")} order by ${order} limit 48`;
    const rows = await sql.query<Record<string, unknown>>(text, params);
    if (allowed) return { access: true, players: rows.map(mapCard) as PlayerCard[] };
    return { access: false, players: rows.map(redact) };
  });

export const getPublicPlayer = createServerFn({ method: "GET" })
  .middleware([optionalAuthMiddleware])
  .validator((id: number) => id)
  .handler(async ({ data: id, context }): Promise<PublicPlayerResult> => {
    const sql = await getSql();
    const [row] = await sql<Record<string, unknown>>`
      select * from player_profiles where id = ${id} and status = 'approved'
    `;
    if (!row) return { access: false, player: null };
    const allowed =
      (await canView(context.userId)) || (context.userId != null && String(row.user_id) === context.userId);
    if (!allowed) return { access: false, player: redact(row) };
    await sql`update player_profiles set views = views + 1 where id = ${id}`;
    const videos = await sql<Record<string, unknown>>`
      select * from player_videos where profile_id = ${id} order by sort_order, id
    `;
    return { access: true, player: mapProfile(row, videos.map(mapVideo)) as PlayerProfile };
  });
