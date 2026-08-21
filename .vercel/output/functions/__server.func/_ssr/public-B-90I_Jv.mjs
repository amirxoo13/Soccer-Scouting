import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { r as getSql } from "./db-dVuulIYt.mjs";
import { n as optionalAuthMiddleware } from "./middleware-CpKbn-Rr.mjs";
import { i as mapVideo, n as mapProfile, t as mapCard } from "./mappers-B6oy2r4n.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/public-B-90I_Jv.js
function asBool(v) {
	return v === true || v === "t" || v === "true" || v === 1;
}
async function canView(userId) {
	if (!userId) return false;
	const sql = await getSql();
	const [admin] = await sql`
    select is_admin from platform_users where user_id = ${userId}
  `;
	if (asBool(admin?.is_admin)) return true;
	const [sub] = await sql`
    select plan from subscriptions
    where user_id = ${userId} and status = 'active' and ends_at > now() and plan = 'desk'
  `;
	return Boolean(sub);
}
function redact(row) {
	return {
		id: Number(row.id),
		primaryPosition: row.primary_position == null ? null : String(row.primary_position),
		photoUrl: row.photo_url == null ? null : String(row.photo_url),
		locked: true
	};
}
var getLandingStats_createServerFn_handler = createServerRpc({
	id: "49ddd62947c4bd21872b4188e5a692caee61fdc621952ee6d10d34b1c3f5cf3c",
	name: "getLandingStats",
	filename: "src/lib/server/public.ts"
}, (opts) => getLandingStats.__executeServer(opts));
var getLandingStats = createServerFn({ method: "GET" }).handler(getLandingStats_createServerFn_handler, async () => {
	return {
		markets: 47,
		positions: 15,
		languages: 7,
		annual: 12
	};
});
var searchPlayers_createServerFn_handler = createServerRpc({
	id: "598d0d6d3d1184c7279e5b711df37cfcdcef75d53d264cc0c6a2e49687728e36",
	name: "searchPlayers",
	filename: "src/lib/server/public.ts"
}, (opts) => searchPlayers.__executeServer(opts));
var searchPlayers = createServerFn({ method: "GET" }).middleware([optionalAuthMiddleware]).validator((input) => input ?? {}).handler(searchPlayers_createServerFn_handler, async ({ data, context }) => {
	const sql = await getSql();
	const params = [];
	const where = ["status = 'approved'"];
	if (data.q?.trim() && await canView(context.userId)) {
		params.push(`%${data.q.trim()}%`);
		const i = params.length;
		where.push(`(first_name ilike $${i} or last_name ilike $${i} or current_club ilike $${i} or city ilike $${i})`);
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
	const rows = await sql.query(text, params);
	if (allowed) return {
		access: true,
		players: rows.map(mapCard)
	};
	return {
		access: false,
		players: rows.map(redact)
	};
});
var getPublicPlayer_createServerFn_handler = createServerRpc({
	id: "82054a2966513d6afc863fc6d13514ca55cc41350a89dab4f65884cbe7ffc6b3",
	name: "getPublicPlayer",
	filename: "src/lib/server/public.ts"
}, (opts) => getPublicPlayer.__executeServer(opts));
var getPublicPlayer = createServerFn({ method: "GET" }).middleware([optionalAuthMiddleware]).validator((id) => id).handler(getPublicPlayer_createServerFn_handler, async ({ data: id, context }) => {
	const sql = await getSql();
	const [row] = await sql`
      select * from player_profiles where id = ${id} and status = 'approved'
    `;
	if (!row) return {
		access: false,
		player: null
	};
	if (!(await canView(context.userId) || context.userId != null && String(row.user_id) === context.userId)) return {
		access: false,
		player: redact(row)
	};
	await sql`update player_profiles set views = views + 1 where id = ${id}`;
	const videos = await sql`
      select * from player_videos where profile_id = ${id} order by sort_order, id
    `;
	return {
		access: true,
		player: mapProfile(row, videos.map(mapVideo))
	};
});
//#endregion
export { getLandingStats_createServerFn_handler, getPublicPlayer_createServerFn_handler, searchPlayers_createServerFn_handler };
