import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { mapCard } from "./mappers";
import type { ShortlistItem, ShortlistStatus } from "@/lib/types";

function isAdminFlag(v: unknown) {
  return v === true || v === "t" || v === "true";
}

async function requireScout(userId: string) {
  const sql = await getSql();
  const [user] = await sql<{ role: string; scout_status: string; is_admin: unknown }>`
    select role, scout_status, is_admin from platform_users where user_id = ${userId}
  `;
  const admin = isAdminFlag(user?.is_admin);
  if (!user || (user.role !== "scout" && !admin)) throw new Error("Scout account required");
  return { sql, user: { role: user.role, scout_status: user.scout_status, is_admin: admin } };
}

async function defaultList(sql: Awaited<ReturnType<typeof getSql>>, userId: string) {
  const [row] = await sql<{ id: number }>`select id from shortlists where user_id = ${userId} order by id limit 1`;
  if (row) return row.id;
  const [created] = await sql<{ id: number }>`
    insert into shortlists (user_id, name) values (${userId}, 'Watchlist') returning id
  `;
  return created.id;
}

export const listWatchlist = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { sql } = await requireScout(context.userId);
    const listId = await defaultList(sql, context.userId);
    const rows = await sql<Record<string, unknown>>`
      select si.id as item_id, si.notes, si.status as item_status, si.created_at::text as item_created,
             pp.*
      from shortlist_items si
      join player_profiles pp on pp.id = si.profile_id
      where si.shortlist_id = ${listId}
      order by si.created_at desc
    `;
    return rows.map((r) => ({
      id: Number(r.item_id),
      profileId: Number(r.id),
      notes: r.notes == null ? null : String(r.notes),
      status: r.item_status as ShortlistStatus,
      createdAt: String(r.item_created),
      player: mapCard(r),
    })) as ShortlistItem[];
  });

export const watchlistIds = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<{ profile_id: number }>`
      select si.profile_id from shortlist_items si
      join shortlists s on s.id = si.shortlist_id
      where s.user_id = ${context.userId}
    `;
    return rows.map((r) => Number(r.profile_id));
  });

export const toggleWatchlist = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((profileId: number) => profileId)
  .handler(async ({ context, data: profileId }) => {
    const { sql } = await requireScout(context.userId);
    const listId = await defaultList(sql, context.userId);
    const [existing] = await sql<{ id: number }>`
      select id from shortlist_items where shortlist_id = ${listId} and profile_id = ${profileId}
    `;
    if (existing) {
      await sql`delete from shortlist_items where id = ${existing.id} and shortlist_id = ${listId}`;
      return { on: false as const };
    }
    await sql`
      insert into shortlist_items (shortlist_id, profile_id) values (${listId}, ${profileId})
    `;
    const [player] = await sql<{ user_id: string; first_name: string; last_name: string }>`
      select user_id, first_name, last_name from player_profiles where id = ${profileId}
    `;
    if (player) {
      await sql`
        insert into notifications (user_id, title, body, kind, link)
        values (
          ${player.user_id},
          'Added to a watchlist',
          ${"A scout saved " + player.first_name + " " + player.last_name + "."},
          'watchlist',
          ${"/players/" + profileId}
        )
      `;
    }
    return { on: true as const };
  });

export const updateWatchItem = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number; notes?: string; status?: ShortlistStatus }) => input)
  .handler(async ({ context, data }) => {
    const { sql } = await requireScout(context.userId);
    await sql`
      update shortlist_items si
      set notes = coalesce(${data.notes ?? null}, notes),
          status = coalesce(${data.status ?? null}, status)
      from shortlists s
      where si.id = ${data.id} and si.shortlist_id = s.id and s.user_id = ${context.userId}
    `;
    return { ok: true as const };
  });

export const sendContact = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { profileId: number; message: string }) => input)
  .handler(async ({ context, data }) => {
    const { sql, user } = await requireScout(context.userId);
    if (user.role === "scout" && user.scout_status !== "approved" && !user.is_admin) {
      throw new Error("Scout account pending approval");
    }
    const message = data.message.trim();
    if (!message) throw new Error("Message required");
    await sql`
      insert into contact_requests (from_user_id, profile_id, message)
      values (${context.userId}, ${data.profileId}, ${message})
    `;
    const [player] = await sql<{ user_id: string }>`select user_id from player_profiles where id = ${data.profileId}`;
    if (player) {
      await sql`
        insert into notifications (user_id, title, body, kind, link)
        values (${player.user_id}, 'Contact request', ${message.slice(0, 180)}, 'contact', '/app')
      `;
    }
    return { ok: true as const };
  });

export const listSentRequests = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<Record<string, unknown>>`
      select cr.id, cr.message, cr.status, cr.created_at::text as created_at,
             cr.profile_id, pp.first_name, pp.last_name
      from contact_requests cr
      join player_profiles pp on pp.id = cr.profile_id
      where cr.from_user_id = ${context.userId}
      order by cr.created_at desc
    `;
    return rows.map((r) => ({
      id: Number(r.id),
      fromUserId: context.userId,
      fromName: null,
      fromOrg: null,
      profileId: Number(r.profile_id),
      playerName: `${r.first_name} ${r.last_name}`,
      message: r.message == null ? null : String(r.message),
      status: r.status as "open" | "seen" | "closed",
      createdAt: String(r.created_at),
    }));
  });
