import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { mapProfile, mapUser, mapVideo } from "./mappers";
import type { MeState, NotificationItem, UserRole } from "@/lib/types";

export const getMe = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<MeState> => {
    const sql = await getSql();
    const { ensureOwnerPrivileges } = await import("./owner");
    await ensureOwnerPrivileges(sql, context.userId);
    const [userRow] = await sql<Record<string, unknown>>`
      select * from platform_users where user_id = ${context.userId}
    `;
    const [countRow] = await sql<{ n: number }>`select count(*)::int as n from platform_users where is_admin = true`;
    const [unreadRow] = await sql<{ n: number }>`
      select count(*)::int as n from notifications where user_id = ${context.userId} and read = false
    `;
    const { loadAccess } = await import("./billing");
    if (!userRow) {
      return {
        user: null,
        profile: null,
        adminCount: countRow?.n ?? 0,
        unread: 0,
        access: await loadAccess(sql, context.userId),
      };
    }
    const user = mapUser(userRow);
    let profile = null;
    if (user.role === "player") {
      const [row] = await sql<Record<string, unknown>>`
        select * from player_profiles where user_id = ${context.userId}
      `;
      if (row) {
        const videos = await sql<Record<string, unknown>>`
          select * from player_videos where profile_id = ${row.id} order by sort_order, id
        `;
        profile = mapProfile(row, videos.map(mapVideo));
      }
    }
    return {
      user,
      profile,
      adminCount: countRow?.n ?? 0,
      unread: unreadRow?.n ?? 0,
      access: await loadAccess(sql, context.userId),
    };
  });

export const completeOnboarding = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { role: UserRole; displayName?: string; orgName?: string; orgRole?: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const { ensureOwnerPrivileges } = await import("./owner");
    await ensureOwnerPrivileges(sql, context.userId);
    const [existing] = await sql<{ user_id: string }>`
      select user_id from platform_users where user_id = ${context.userId}
    `;
    if (existing) return { ok: true as const };

    const [adminRow] = await sql<{ n: number }>`select count(*)::int as n from platform_users where is_admin = true`;
    const noAdmin = (adminRow?.n ?? 0) === 0;
    const scoutStatus = data.role === "scout" && noAdmin ? "approved" : data.role === "scout" ? "pending" : "approved";

    await sql`
      insert into platform_users (user_id, role, display_name, org_name, org_role, scout_status, is_admin)
      values (
        ${context.userId},
        ${data.role},
        ${data.displayName ?? null},
        ${data.orgName ?? null},
        ${data.orgRole ?? null},
        ${scoutStatus},
        false
      )
    `;

    if (data.role === "player") {
      await sql`
        insert into player_profiles (user_id, first_name, last_name, status)
        values (${context.userId}, ${data.displayName?.split(" ")[0] || "Player"}, ${data.displayName?.split(" ").slice(1).join(" ") || "—"}, 'draft')
        on conflict (user_id) do nothing
      `;
    }
    if (data.role === "scout") {
      await sql`
        insert into shortlists (user_id, name) values (${context.userId}, 'Watchlist')
      `;
    }
    return { ok: true as const };
  });

export const claimAdmin = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const [adminRow] = await sql<{ n: number }>`select count(*)::int as n from platform_users where is_admin = true`;
    if ((adminRow?.n ?? 0) > 0) return { ok: false as const, reason: "exists" };
    await sql`
      insert into platform_users (user_id, role, display_name, scout_status, is_admin)
      values (${context.userId}, 'admin', 'Admin', 'approved', true)
      on conflict (user_id) do update set is_admin = true, role = 'admin', scout_status = 'approved'
    `;
    return { ok: true as const };
  });

export const listNotifications = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<Record<string, unknown>>`
      select * from notifications where user_id = ${context.userId} order by created_at desc limit 40
    `;
    return rows.map((r) => ({
      id: Number(r.id),
      title: String(r.title),
      body: r.body == null ? null : String(r.body),
      kind: String(r.kind),
      read: r.read === true || r.read === "t",
      link: r.link == null ? null : String(r.link),
      createdAt: String(r.created_at),
    })) as NotificationItem[];
  });

export const markNotificationsRead = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await sql`update notifications set read = true where user_id = ${context.userId}`;
    return { ok: true as const };
  });
