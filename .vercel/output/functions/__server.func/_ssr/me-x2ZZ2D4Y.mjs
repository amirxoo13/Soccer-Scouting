import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { r as getSql } from "./db-dVuulIYt.mjs";
import { t as authMiddleware } from "./middleware-CpKbn-Rr.mjs";
import { i as mapVideo, n as mapProfile, r as mapUser } from "./mappers-B6oy2r4n.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/me-x2ZZ2D4Y.js
var getMe_createServerFn_handler = createServerRpc({
	id: "9bd8037c200ab7b640b046e87c2b79fbaa6387f31dd76fb43dde046bee313019",
	name: "getMe",
	filename: "src/lib/server/me.ts"
}, (opts) => getMe.__executeServer(opts));
var getMe = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMe_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const [userRow] = await sql`
      select * from platform_users where user_id = ${context.userId}
    `;
	const [countRow] = await sql`select count(*)::int as n from platform_users where is_admin = true`;
	const [unreadRow] = await sql`
      select count(*)::int as n from notifications where user_id = ${context.userId} and read = false
    `;
	const { loadAccess } = await import("./billing-CF5MKqf_.mjs").then((n) => n.r);
	if (!userRow) return {
		user: null,
		profile: null,
		adminCount: countRow?.n ?? 0,
		unread: 0,
		access: await loadAccess(sql, context.userId)
	};
	const user = mapUser(userRow);
	let profile = null;
	if (user.role === "player") {
		const [row] = await sql`
        select * from player_profiles where user_id = ${context.userId}
      `;
		if (row) {
			const videos = await sql`
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
		access: await loadAccess(sql, context.userId)
	};
});
var completeOnboarding_createServerFn_handler = createServerRpc({
	id: "fb624c1069da20095dbd193ec1823ad302414197f8632215c82cb358b9076b8b",
	name: "completeOnboarding",
	filename: "src/lib/server/me.ts"
}, (opts) => completeOnboarding.__executeServer(opts));
var completeOnboarding = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(completeOnboarding_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const [existing] = await sql`
      select user_id from platform_users where user_id = ${context.userId}
    `;
	if (existing) return { ok: true };
	const [adminRow] = await sql`select count(*)::int as n from platform_users where is_admin = true`;
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
	if (data.role === "player") await sql`
        insert into player_profiles (user_id, first_name, last_name, status)
        values (${context.userId}, ${data.displayName?.split(" ")[0] || "Player"}, ${data.displayName?.split(" ").slice(1).join(" ") || "—"}, 'draft')
        on conflict (user_id) do nothing
      `;
	if (data.role === "scout") await sql`
        insert into shortlists (user_id, name) values (${context.userId}, 'Watchlist')
      `;
	return { ok: true };
});
var claimAdmin_createServerFn_handler = createServerRpc({
	id: "b3dfe91e4dd064ba2c5ded393a73aa5c7552afb04fd10cdabbb7601f5c5720b6",
	name: "claimAdmin",
	filename: "src/lib/server/me.ts"
}, (opts) => claimAdmin.__executeServer(opts));
var claimAdmin = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(claimAdmin_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const [adminRow] = await sql`select count(*)::int as n from platform_users where is_admin = true`;
	if ((adminRow?.n ?? 0) > 0) return {
		ok: false,
		reason: "exists"
	};
	await sql`
      insert into platform_users (user_id, role, display_name, scout_status, is_admin)
      values (${context.userId}, 'admin', 'Admin', 'approved', true)
      on conflict (user_id) do update set is_admin = true, role = 'admin', scout_status = 'approved'
    `;
	return { ok: true };
});
var listNotifications_createServerFn_handler = createServerRpc({
	id: "ebb1b342bcad2b0b500b3203f63788ba3dba9c1b5350acc0b40122697280ebe9",
	name: "listNotifications",
	filename: "src/lib/server/me.ts"
}, (opts) => listNotifications.__executeServer(opts));
var listNotifications = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listNotifications_createServerFn_handler, async ({ context }) => {
	return (await (await getSql())`
      select * from notifications where user_id = ${context.userId} order by created_at desc limit 40
    `).map((r) => ({
		id: Number(r.id),
		title: String(r.title),
		body: r.body == null ? null : String(r.body),
		kind: String(r.kind),
		read: r.read === true || r.read === "t",
		link: r.link == null ? null : String(r.link),
		createdAt: String(r.created_at)
	}));
});
var markNotificationsRead_createServerFn_handler = createServerRpc({
	id: "1d312f7e61baffd918c3bf6aabd99eee581d60168eb454a1dc3227bc51330a60",
	name: "markNotificationsRead",
	filename: "src/lib/server/me.ts"
}, (opts) => markNotificationsRead.__executeServer(opts));
var markNotificationsRead = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(markNotificationsRead_createServerFn_handler, async ({ context }) => {
	await (await getSql())`update notifications set read = true where user_id = ${context.userId}`;
	return { ok: true };
});
//#endregion
export { claimAdmin_createServerFn_handler, completeOnboarding_createServerFn_handler, getMe_createServerFn_handler, listNotifications_createServerFn_handler, markNotificationsRead_createServerFn_handler };
