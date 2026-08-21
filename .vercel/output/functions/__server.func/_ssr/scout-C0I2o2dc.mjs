import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { r as getSql } from "./db-dVuulIYt.mjs";
import { t as authMiddleware } from "./middleware-CpKbn-Rr.mjs";
import { t as mapCard } from "./mappers-B6oy2r4n.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/scout-C0I2o2dc.js
function isAdminFlag(v) {
	return v === true || v === "t" || v === "true";
}
async function requireScout(userId) {
	const sql = await getSql();
	const [user] = await sql`
    select role, scout_status, is_admin from platform_users where user_id = ${userId}
  `;
	const admin = isAdminFlag(user?.is_admin);
	if (!user || user.role !== "scout" && !admin) throw new Error("Scout account required");
	return {
		sql,
		user: {
			role: user.role,
			scout_status: user.scout_status,
			is_admin: admin
		}
	};
}
async function defaultList(sql, userId) {
	const [row] = await sql`select id from shortlists where user_id = ${userId} order by id limit 1`;
	if (row) return row.id;
	const [created] = await sql`
    insert into shortlists (user_id, name) values (${userId}, 'Watchlist') returning id
  `;
	return created.id;
}
var listWatchlist_createServerFn_handler = createServerRpc({
	id: "32535b832e9e53a8dece1be169b8adbc4735c7a612bfc349342bdd000c1ce30e",
	name: "listWatchlist",
	filename: "src/lib/server/scout.ts"
}, (opts) => listWatchlist.__executeServer(opts));
var listWatchlist = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listWatchlist_createServerFn_handler, async ({ context }) => {
	const { sql } = await requireScout(context.userId);
	return (await sql`
      select si.id as item_id, si.notes, si.status as item_status, si.created_at::text as item_created,
             pp.*
      from shortlist_items si
      join player_profiles pp on pp.id = si.profile_id
      where si.shortlist_id = ${await defaultList(sql, context.userId)}
      order by si.created_at desc
    `).map((r) => ({
		id: Number(r.item_id),
		profileId: Number(r.id),
		notes: r.notes == null ? null : String(r.notes),
		status: r.item_status,
		createdAt: String(r.item_created),
		player: mapCard(r)
	}));
});
var watchlistIds_createServerFn_handler = createServerRpc({
	id: "9dfbad5ccfb044aa466337d010235a12f99c7c7c096a85c10e7849b075de19c4",
	name: "watchlistIds",
	filename: "src/lib/server/scout.ts"
}, (opts) => watchlistIds.__executeServer(opts));
var watchlistIds = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(watchlistIds_createServerFn_handler, async ({ context }) => {
	return (await (await getSql())`
      select si.profile_id from shortlist_items si
      join shortlists s on s.id = si.shortlist_id
      where s.user_id = ${context.userId}
    `).map((r) => Number(r.profile_id));
});
var toggleWatchlist_createServerFn_handler = createServerRpc({
	id: "c09c55275b23465866010bdf872f105766efc1144b00413603c618a9433e7a49",
	name: "toggleWatchlist",
	filename: "src/lib/server/scout.ts"
}, (opts) => toggleWatchlist.__executeServer(opts));
var toggleWatchlist = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((profileId) => profileId).handler(toggleWatchlist_createServerFn_handler, async ({ context, data: profileId }) => {
	const { sql } = await requireScout(context.userId);
	const listId = await defaultList(sql, context.userId);
	const [existing] = await sql`
      select id from shortlist_items where shortlist_id = ${listId} and profile_id = ${profileId}
    `;
	if (existing) {
		await sql`delete from shortlist_items where id = ${existing.id} and shortlist_id = ${listId}`;
		return { on: false };
	}
	await sql`
      insert into shortlist_items (shortlist_id, profile_id) values (${listId}, ${profileId})
    `;
	const [player] = await sql`
      select user_id, first_name, last_name from player_profiles where id = ${profileId}
    `;
	if (player) await sql`
        insert into notifications (user_id, title, body, kind, link)
        values (
          ${player.user_id},
          'Added to a watchlist',
          ${"A scout saved " + player.first_name + " " + player.last_name + "."},
          'watchlist',
          ${"/players/" + profileId}
        )
      `;
	return { on: true };
});
var updateWatchItem_createServerFn_handler = createServerRpc({
	id: "72452753eb9ac767e4705ee9b0c431a4f034cf0221cb71247db7c333ea7630b1",
	name: "updateWatchItem",
	filename: "src/lib/server/scout.ts"
}, (opts) => updateWatchItem.__executeServer(opts));
var updateWatchItem = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(updateWatchItem_createServerFn_handler, async ({ context, data }) => {
	const { sql } = await requireScout(context.userId);
	await sql`
      update shortlist_items si
      set notes = coalesce(${data.notes ?? null}, notes),
          status = coalesce(${data.status ?? null}, status)
      from shortlists s
      where si.id = ${data.id} and si.shortlist_id = s.id and s.user_id = ${context.userId}
    `;
	return { ok: true };
});
var sendContact_createServerFn_handler = createServerRpc({
	id: "86d628ff2af005d29e2c5221e5fda5624fd0f77dee4e2938adb254b09f7093da",
	name: "sendContact",
	filename: "src/lib/server/scout.ts"
}, (opts) => sendContact.__executeServer(opts));
var sendContact = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(sendContact_createServerFn_handler, async ({ context, data }) => {
	const { sql, user } = await requireScout(context.userId);
	if (user.role === "scout" && user.scout_status !== "approved" && !user.is_admin) throw new Error("Scout account pending approval");
	const message = data.message.trim();
	if (!message) throw new Error("Message required");
	await sql`
      insert into contact_requests (from_user_id, profile_id, message)
      values (${context.userId}, ${data.profileId}, ${message})
    `;
	const [player] = await sql`select user_id from player_profiles where id = ${data.profileId}`;
	if (player) await sql`
        insert into notifications (user_id, title, body, kind, link)
        values (${player.user_id}, 'Contact request', ${message.slice(0, 180)}, 'contact', '/app')
      `;
	return { ok: true };
});
var listSentRequests_createServerFn_handler = createServerRpc({
	id: "01c48254c094290fe4b53975700301503911b04e72bc50733e2eb5ba244056ba",
	name: "listSentRequests",
	filename: "src/lib/server/scout.ts"
}, (opts) => listSentRequests.__executeServer(opts));
var listSentRequests = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listSentRequests_createServerFn_handler, async ({ context }) => {
	return (await (await getSql())`
      select cr.id, cr.message, cr.status, cr.created_at::text as created_at,
             cr.profile_id, pp.first_name, pp.last_name
      from contact_requests cr
      join player_profiles pp on pp.id = cr.profile_id
      where cr.from_user_id = ${context.userId}
      order by cr.created_at desc
    `).map((r) => ({
		id: Number(r.id),
		fromUserId: context.userId,
		fromName: null,
		fromOrg: null,
		profileId: Number(r.profile_id),
		playerName: `${r.first_name} ${r.last_name}`,
		message: r.message == null ? null : String(r.message),
		status: r.status,
		createdAt: String(r.created_at)
	}));
});
//#endregion
export { listSentRequests_createServerFn_handler, listWatchlist_createServerFn_handler, sendContact_createServerFn_handler, toggleWatchlist_createServerFn_handler, updateWatchItem_createServerFn_handler, watchlistIds_createServerFn_handler };
