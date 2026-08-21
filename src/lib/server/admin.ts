import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { mapCard, mapUser } from "./mappers";
import type { PlayerCard, PlatformUser } from "@/lib/types";

async function requireAdmin(userId: string) {
  const sql = await getSql();
  const [user] = await sql<{ is_admin: boolean }>`select is_admin from platform_users where user_id = ${userId}`;
  const ok = user && (user.is_admin === true || (user.is_admin as unknown) === "t");
  if (!ok) throw new Error("Admin required");
  return sql;
}

export const adminStats = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await requireAdmin(context.userId);
    const [a] = await sql<{
      players: number;
      approved: number;
      pending: number;
      scouts: number;
      pending_scouts: number;
    }>`
      select
        (select count(*)::int from player_profiles) as players,
        (select count(*)::int from player_profiles where status = 'approved') as approved,
        (select count(*)::int from player_profiles where status = 'pending') as pending,
        (select count(*)::int from platform_users where role = 'scout' and scout_status = 'approved') as scouts,
        (select count(*)::int from platform_users where role = 'scout' and scout_status = 'pending') as pending_scouts
    `;
    const countries = await sql<{ country: string; n: number }>`
      select country, count(*)::int as n
      from player_profiles
      where status = 'approved' and country is not null
      group by country
      order by n desc
      limit 8
    `;
    return { ...(a ?? { players: 0, approved: 0, pending: 0, scouts: 0, pending_scouts: 0 }), countries };
  });

export const adminProfileQueue = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await requireAdmin(context.userId);
    const rows = await sql<Record<string, unknown>>`
      select * from player_profiles
      where status in ('pending', 'needs_revision')
      order by submitted_at desc nulls last, id desc
    `;
    return rows.map(mapCard) as PlayerCard[];
  });

export const adminReviewProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number; action: "approved" | "rejected" | "needs_revision"; note?: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await requireAdmin(context.userId);
    await sql`
      update player_profiles
      set status = ${data.action},
          review_note = ${data.note || null},
          reviewed_at = now(),
          updated_at = now()
      where id = ${data.id}
    `;
    await sql`
      insert into profile_reviews (profile_id, admin_user_id, action, note)
      values (${data.id}, ${context.userId}, ${data.action}, ${data.note || null})
    `;
    const [player] = await sql<{ user_id: string; country: string | null }>`
      select user_id, country from player_profiles where id = ${data.id}
    `;
    if (player) {
      const title =
        data.action === "approved"
          ? "Profile approved"
          : data.action === "needs_revision"
            ? "Revision requested"
            : "Profile declined";
      await sql`
        insert into notifications (user_id, title, body, kind, link)
        values (${player.user_id}, ${title}, ${data.note || null}, 'review', '/app/profile')
      `;
      if (data.action === "approved") {
        const [sub] = await sql<{ plan: string }>`
          select plan from subscriptions
          where user_id = ${player.user_id} and status = 'active' and ends_at > now()
            and plan in ('player_u24', 'player_senior', 'desk')
        `;
        if (sub) {
          const { queueClubAlerts } = await import("./billing");
          await queueClubAlerts(sql, data.id, player.country);
        }
      }
    }
    return { ok: true as const };
  });

export const adminScoutQueue = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await requireAdmin(context.userId);
    const rows = await sql<Record<string, unknown>>`
      select * from platform_users where role = 'scout' order by created_at desc
    `;
    return rows.map(mapUser) as PlatformUser[];
  });

export const adminSetScout = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { userId: string; status: "approved" | "rejected" }) => input)
  .handler(async ({ context, data }) => {
    const sql = await requireAdmin(context.userId);
    await sql`
      update platform_users set scout_status = ${data.status} where user_id = ${data.userId} and role = 'scout'
    `;
    await sql`
      insert into notifications (user_id, title, body, kind, link)
      values (
        ${data.userId},
        ${data.status === "approved" ? "Scout account approved" : "Scout account declined"},
        null,
        'scout',
        '/app'
      )
    `;
    return { ok: true as const };
  });

export const adminUsers = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await requireAdmin(context.userId);
    const rows = await sql<Record<string, unknown>>`
      select * from platform_users order by created_at desc limit 100
    `;
    return rows.map(mapUser) as PlatformUser[];
  });
