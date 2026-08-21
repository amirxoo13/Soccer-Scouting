import { c as __exportAll, r as createServerFn } from "./ssr.mjs";
import { n as optionalAuthMiddleware, t as authMiddleware } from "./middleware-CpKbn-Rr.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { t as ageFromDob } from "./utils-D6GH5reL.mjs";
import { r as playerPlanForAge } from "./plans-C5YhbBM0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/billing-CF5MKqf_.js
var billing_exports = /* @__PURE__ */ __exportAll({
	adminReviewYouth: () => adminReviewYouth,
	adminYouthQueue: () => adminYouthQueue,
	confirmDeposit: () => confirmDeposit,
	getAccess: () => getAccess,
	getWallet: () => getWallet,
	loadAccess: () => loadAccess,
	queueClubAlerts: () => queueClubAlerts,
	submitYouthVerification: () => submitYouthVerification,
	subscribeFromWallet: () => subscribeFromWallet
});
function trc20Address(userId) {
	const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
	const seed = `kavosh-usdt-trc20-${userId}`;
	let h = 2166136261;
	const chars = ["T"];
	for (let i = 0; i < 33; i++) {
		h ^= seed.charCodeAt(i % seed.length) + i * 13;
		h = Math.imul(h, 16777619);
		chars.push(alphabet[(h >>> 0) % 58]);
	}
	return chars.join("");
}
function money(v) {
	const n = typeof v === "number" ? v : Number(v);
	return Number.isFinite(n) ? n : 0;
}
function asBool(v) {
	return v === true || v === "t" || v === "true" || v === 1;
}
async function ensureWallet(sql, userId) {
	const [row] = await sql`
    select address, balance_usdt from wallets where user_id = ${userId}
  `;
	if (row) return {
		address: row.address,
		balance: money(row.balance_usdt)
	};
	const address = trc20Address(userId);
	await sql`
    insert into wallets (user_id, address, network, asset, balance_usdt)
    values (${userId}, ${address}, 'TRC20', 'USDT', 0)
    on conflict (user_id) do nothing
  `;
	return {
		address,
		balance: 0
	};
}
async function loadAccess(sql, userId) {
	const wallet = await ensureWallet(sql, userId);
	const [user] = await sql`
    select role, is_admin from platform_users where user_id = ${userId}
  `;
	const [sub] = await sql`
    select plan, status, ends_at from subscriptions
    where user_id = ${userId} and status = 'active' and ends_at > now()
  `;
	const [youth] = await sql`
    select status from youth_verifications where user_id = ${userId}
  `;
	const [profile] = await sql`
    select dob from player_profiles where user_id = ${userId}
  `;
	const isAdmin = asBool(user?.is_admin);
	const role = user?.role ?? null;
	const age = ageFromDob(profile?.dob ?? null);
	const needed = playerPlanForAge(age);
	const plan = sub?.plan ?? null;
	const youthStatus = youth?.status ?? "none";
	const canViewTalent = isAdmin || plan === "desk";
	let canPublish = isAdmin;
	let publishBlock = null;
	if (role === "player" && !isAdmin) {
		if (!needed) {
			canPublish = false;
			publishBlock = age != null && age < 16 ? "age" : "dob";
		} else if (needed === "youth") {
			canPublish = youthStatus === "approved";
			publishBlock = canPublish ? null : "youth";
		} else if (needed === "player_u24") {
			canPublish = plan === "player_u24" || plan === "player_senior" || plan === "desk";
			publishBlock = canPublish ? null : "pay_u24";
		} else {
			canPublish = plan === "player_senior" || plan === "desk";
			publishBlock = canPublish ? null : "pay_senior";
		}
	}
	return {
		loggedIn: true,
		userId,
		role,
		isAdmin,
		canViewTalent,
		canPublish,
		publishBlock,
		plan,
		planEnds: sub?.ends_at ?? null,
		walletBalance: wallet.balance,
		walletAddress: wallet.address,
		youthStatus,
		age,
		neededPlan: needed
	};
}
var getAccess = createServerFn({ method: "GET" }).middleware([optionalAuthMiddleware]).handler(createSsrRpc("6b05bc485172eaf447e46eba9378acb5b6da27d392a0a911338c5b499218107b"));
var getWallet = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("084d9c7f295e1940d5e21b0b9a9311837991217bea8d34513e1ba259c1d27b6b"));
var confirmDeposit = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("e34c59b5cfdb8ecf677ecaaa33ec4838fe801eafc1967c5bebc3e23c51457606"));
var subscribeFromWallet = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("45ce68eff31bcb8dd980c2791c8990b413b087112ad428bc999c62071cba658e"));
var submitYouthVerification = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("a43fd39fb4341964becf68f4bd30d38b52bd357ccc5a7abb207e634c75a26722"));
var adminYouthQueue = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("f436159bab7990f2ce8e184c706fec8aa9152e2c614d14b424dfcb2c604dde9b"));
var adminReviewYouth = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("16bdff40a6df1d2f182af41e8d80a5590383e5d05ab3357f4f304fee52296f03"));
createServerFn({ method: "GET" }).handler(createSsrRpc("0469b5b5d27797c5abf8eda5d225b3f5045ae616f7fe8e5b849be89cc49a38b4"));
var queueClubAlerts = async (sql, profileId, country) => {
	const clubs = await sql`
    select id, email from clubs where email is not null
  `;
	for (const c of clubs) {
		if (!c.email) continue;
		await sql`
      insert into club_alerts (club_id, profile_id, email, status)
      values (${c.id}, ${profileId}, ${c.email}, 'queued')
    `;
	}
};
//#endregion
export { getAccess as a, subscribeFromWallet as c, confirmDeposit as i, adminYouthQueue as n, getWallet as o, billing_exports as r, submitYouthVerification as s, adminReviewYouth as t };
