import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { r as getSql } from "./db-dVuulIYt.mjs";
import { t as authMiddleware } from "./middleware-CpKbn-Rr.mjs";
import { r as mapUser, t as mapCard } from "./mappers-B6oy2r4n.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-0bL1TH7D.js
async function requireAdmin(userId) {
	const sql = await getSql();
	const [user] = await sql`select is_admin from platform_users where user_id = ${userId}`;
	if (!(user && (user.is_admin === true || user.is_admin === "t"))) throw new Error("Admin required");
	return sql;
}
var adminStats_createServerFn_handler = createServerRpc({
	id: "d859b9f95d5a852ed70c6d34e6ed740a5fdc4ef6c92f86452aea7b323f118f67",
	name: "adminStats",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminStats.__executeServer(opts));
var adminStats = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminStats_createServerFn_handler, async ({ context }) => {
	const sql = await requireAdmin(context.userId);
	const [a] = await sql`
      select
        (select count(*)::int from player_profiles) as players,
        (select count(*)::int from player_profiles where status = 'approved') as approved,
        (select count(*)::int from player_profiles where status = 'pending') as pending,
        (select count(*)::int from platform_users where role = 'scout' and scout_status = 'approved') as scouts,
        (select count(*)::int from platform_users where role = 'scout' and scout_status = 'pending') as pending_scouts
    `;
	const countries = await sql`
      select country, count(*)::int as n
      from player_profiles
      where status = 'approved' and country is not null
      group by country
      order by n desc
      limit 8
    `;
	return {
		...a ?? {
			players: 0,
			approved: 0,
			pending: 0,
			scouts: 0,
			pending_scouts: 0
		},
		countries
	};
});
var adminProfileQueue_createServerFn_handler = createServerRpc({
	id: "f6f34981cff54733fe0ac45d71482fbcad212f25132c61c8894ee8f6c9d2c89e",
	name: "adminProfileQueue",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminProfileQueue.__executeServer(opts));
var adminProfileQueue = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminProfileQueue_createServerFn_handler, async ({ context }) => {
	return (await (await requireAdmin(context.userId))`
      select * from player_profiles
      where status in ('pending', 'needs_revision')
      order by submitted_at desc nulls last, id desc
    `).map(mapCard);
});
var adminReviewProfile_createServerFn_handler = createServerRpc({
	id: "6131b231f1b9162c8a882438ea3a28cc1f572ed6ade2ed82816d5890bba1c3f2",
	name: "adminReviewProfile",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminReviewProfile.__executeServer(opts));
var adminReviewProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(adminReviewProfile_createServerFn_handler, async ({ context, data }) => {
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
	const [player] = await sql`
      select user_id, country from player_profiles where id = ${data.id}
    `;
	if (player) {
		const title = data.action === "approved" ? "Profile approved" : data.action === "needs_revision" ? "Revision requested" : "Profile declined";
		await sql`
        insert into notifications (user_id, title, body, kind, link)
        values (${player.user_id}, ${title}, ${data.note || null}, 'review', '/app/profile')
      `;
		if (data.action === "approved") {
			const [sub] = await sql`
          select plan from subscriptions
          where user_id = ${player.user_id} and status = 'active' and ends_at > now()
            and plan in ('player_u24', 'player_senior', 'desk')
        `;
			if (sub) {
				const { queueClubAlerts } = await import("./billing-CF5MKqf_.mjs").then((n) => n.r);
				await queueClubAlerts(sql, data.id, player.country);
			}
		}
	}
	return { ok: true };
});
var adminScoutQueue_createServerFn_handler = createServerRpc({
	id: "c9fa146df12c316a5842fec5c4b6ddf305519367753706b9370a7ed6fcefc9cc",
	name: "adminScoutQueue",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminScoutQueue.__executeServer(opts));
var adminScoutQueue = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminScoutQueue_createServerFn_handler, async ({ context }) => {
	return (await (await requireAdmin(context.userId))`
      select * from platform_users where role = 'scout' order by created_at desc
    `).map(mapUser);
});
var adminSetScout_createServerFn_handler = createServerRpc({
	id: "3983b2809332459c3f1332d31d0ad7441f7a075f59a2064576bcd5938a8be150",
	name: "adminSetScout",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminSetScout.__executeServer(opts));
var adminSetScout = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(adminSetScout_createServerFn_handler, async ({ context, data }) => {
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
	return { ok: true };
});
var adminUsers_createServerFn_handler = createServerRpc({
	id: "f6eb1a184095a8e2f6bea353dd3ac802bc0334ce121cda8e1370d4d36b815678",
	name: "adminUsers",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminUsers.__executeServer(opts));
var adminUsers = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminUsers_createServerFn_handler, async ({ context }) => {
	return (await (await requireAdmin(context.userId))`
      select * from platform_users order by created_at desc limit 100
    `).map(mapUser);
});
//#endregion
export { adminProfileQueue_createServerFn_handler, adminReviewProfile_createServerFn_handler, adminScoutQueue_createServerFn_handler, adminSetScout_createServerFn_handler, adminStats_createServerFn_handler, adminUsers_createServerFn_handler };
