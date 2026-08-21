import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { r as getSql } from "./db-dVuulIYt.mjs";
import { n as optionalAuthMiddleware, t as authMiddleware } from "./middleware-CpKbn-Rr.mjs";
import { t as ageFromDob } from "./utils-D6GH5reL.mjs";
import { n as planById, r as playerPlanForAge } from "./plans-C5YhbBM0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/billing-C905K1tW.js
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
var getAccess_createServerFn_handler = createServerRpc({
	id: "6b05bc485172eaf447e46eba9378acb5b6da27d392a0a911338c5b499218107b",
	name: "getAccess",
	filename: "src/lib/server/billing.ts"
}, (opts) => getAccess.__executeServer(opts));
var getAccess = createServerFn({ method: "GET" }).middleware([optionalAuthMiddleware]).handler(getAccess_createServerFn_handler, async ({ context }) => {
	if (!context.userId) return {
		loggedIn: false,
		userId: null,
		role: null,
		isAdmin: false,
		canViewTalent: false,
		canPublish: false,
		publishBlock: "login",
		plan: null,
		planEnds: null,
		walletBalance: 0,
		walletAddress: null,
		youthStatus: "none",
		age: null,
		neededPlan: null
	};
	return loadAccess(await getSql(), context.userId);
});
var getWallet_createServerFn_handler = createServerRpc({
	id: "084d9c7f295e1940d5e21b0b9a9311837991217bea8d34513e1ba259c1d27b6b",
	name: "getWallet",
	filename: "src/lib/server/billing.ts"
}, (opts) => getWallet.__executeServer(opts));
var getWallet = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getWallet_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const access = await loadAccess(sql, context.userId);
	const txs = await sql`
      select id, kind, amount_usdt, plan, memo, created_at
      from wallet_tx where user_id = ${context.userId}
      order by created_at desc, id desc
      limit 20
    `;
	return {
		address: access.walletAddress ?? "",
		network: "TRC20",
		asset: "USDT",
		balance: access.walletBalance,
		plan: access.plan,
		planEnds: access.planEnds,
		txs: txs.map((t) => ({
			id: Number(t.id),
			kind: t.kind,
			amount: money(t.amount_usdt),
			plan: t.plan,
			memo: t.memo,
			createdAt: String(t.created_at)
		}))
	};
});
async function activatePlan(sql, userId, plan) {
	const spec = planById(plan);
	if (!spec) throw new Error("Unknown plan");
	const cost = spec.usd;
	const [wallet] = await sql`
    select balance_usdt from wallets where user_id = ${userId}
  `;
	const balance = money(wallet?.balance_usdt);
	if (cost > 0 && balance < cost) throw new Error("Insufficient USDT");
	if (cost > 0) {
		await sql`
      update wallets set balance_usdt = balance_usdt - ${cost} where user_id = ${userId}
    `;
		await sql`
      insert into wallet_tx (user_id, kind, amount_usdt, plan, memo)
      values (${userId}, 'subscribe', ${-cost}, ${plan}, ${`Annual ${plan}`})
    `;
	}
	await sql`
    insert into subscriptions (user_id, plan, status, starts_at, ends_at)
    values (${userId}, ${plan}, 'active', now(), now() + interval '1 year')
    on conflict (user_id) do update
      set plan = excluded.plan,
          status = 'active',
          starts_at = excluded.starts_at,
          ends_at = excluded.ends_at
  `;
}
var confirmDeposit_createServerFn_handler = createServerRpc({
	id: "e34c59b5cfdb8ecf677ecaaa33ec4838fe801eafc1967c5bebc3e23c51457606",
	name: "confirmDeposit",
	filename: "src/lib/server/billing.ts"
}, (opts) => confirmDeposit.__executeServer(opts));
var confirmDeposit = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(confirmDeposit_createServerFn_handler, async ({ context, data }) => {
	const amount = Math.round(Number(data.amount));
	if (!Number.isFinite(amount) || amount < 1 || amount > 2e4) throw new Error("Invalid amount");
	const sql = await getSql();
	await ensureWallet(sql, context.userId);
	await sql`
      update wallets set balance_usdt = balance_usdt + ${amount} where user_id = ${context.userId}
    `;
	const memo = data.channel === "card" ? "Card payment confirmed" : data.channel === "paypal" ? "PayPal confirmed" : data.channel === "btc" ? "Bitcoin confirmed" : data.channel === "eth" ? "Ethereum confirmed" : "TRC20 USDT confirmed";
	await sql`
      insert into wallet_tx (user_id, kind, amount_usdt, plan, memo)
      values (${context.userId}, 'deposit', ${amount}, ${data.plan ?? null}, ${memo})
    `;
	if (data.plan) {
		const spec = planById(data.plan);
		if (spec && spec.usd > 0) {
			const [w] = await sql`
          select balance_usdt from wallets where user_id = ${context.userId}
        `;
			if (money(w?.balance_usdt) >= spec.usd) await activatePlan(sql, context.userId, data.plan);
		}
	}
	return loadAccess(sql, context.userId);
});
var subscribeFromWallet_createServerFn_handler = createServerRpc({
	id: "45ce68eff31bcb8dd980c2791c8990b413b087112ad428bc999c62071cba658e",
	name: "subscribeFromWallet",
	filename: "src/lib/server/billing.ts"
}, (opts) => subscribeFromWallet.__executeServer(opts));
var subscribeFromWallet = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(subscribeFromWallet_createServerFn_handler, async ({ context, data }) => {
	const spec = planById(data.plan);
	if (!spec) throw new Error("Unknown plan");
	if (spec.id === "youth") throw new Error("Youth lane is verified, not purchased");
	const sql = await getSql();
	await ensureWallet(sql, context.userId);
	await activatePlan(sql, context.userId, data.plan);
	return loadAccess(sql, context.userId);
});
var submitYouthVerification_createServerFn_handler = createServerRpc({
	id: "a43fd39fb4341964becf68f4bd30d38b52bd357ccc5a7abb207e634c75a26722",
	name: "submitYouthVerification",
	filename: "src/lib/server/billing.ts"
}, (opts) => submitYouthVerification.__executeServer(opts));
var submitYouthVerification = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(submitYouthVerification_createServerFn_handler, async ({ context, data }) => {
	const idDoc = data.idDocUrl.trim();
	const selfie = data.selfieUrl.trim();
	if (!idDoc || !selfie) throw new Error("ID document and selfie are required");
	await (await getSql())`
      insert into youth_verifications (user_id, id_doc_url, selfie_url, video_url, status, submitted_at)
      values (${context.userId}, ${idDoc}, ${selfie}, ${data.videoUrl?.trim() || null}, 'pending', now())
      on conflict (user_id) do update
        set id_doc_url = excluded.id_doc_url,
            selfie_url = excluded.selfie_url,
            video_url = excluded.video_url,
            status = 'pending',
            note = null,
            submitted_at = now(),
            reviewed_at = null
    `;
	return { ok: true };
});
var adminYouthQueue_createServerFn_handler = createServerRpc({
	id: "f436159bab7990f2ce8e184c706fec8aa9152e2c614d14b424dfcb2c604dde9b",
	name: "adminYouthQueue",
	filename: "src/lib/server/billing.ts"
}, (opts) => adminYouthQueue.__executeServer(opts));
var adminYouthQueue = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminYouthQueue_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const [admin] = await sql`
      select is_admin from platform_users where user_id = ${context.userId}
    `;
	if (!asBool(admin?.is_admin)) throw new Error("Admin required");
	return sql`
      select v.user_id, v.id_doc_url, v.selfie_url, v.video_url, v.status, v.submitted_at,
             p.first_name, p.last_name, p.dob
      from youth_verifications v
      left join player_profiles p on p.user_id = v.user_id
      where v.status = 'pending'
      order by v.submitted_at asc
    `;
});
var adminReviewYouth_createServerFn_handler = createServerRpc({
	id: "16bdff40a6df1d2f182af41e8d80a5590383e5d05ab3357f4f304fee52296f03",
	name: "adminReviewYouth",
	filename: "src/lib/server/billing.ts"
}, (opts) => adminReviewYouth.__executeServer(opts));
var adminReviewYouth = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(adminReviewYouth_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const [admin] = await sql`
      select is_admin from platform_users where user_id = ${context.userId}
    `;
	if (!asBool(admin?.is_admin)) throw new Error("Admin required");
	await sql`
      update youth_verifications
      set status = ${data.action}, note = ${data.note || null}, reviewed_at = now()
      where user_id = ${data.userId}
    `;
	if (data.action === "approved") await sql`
        insert into subscriptions (user_id, plan, status, starts_at, ends_at)
        values (${data.userId}, 'youth', 'active', now(), now() + interval '1 year')
        on conflict (user_id) do update
          set plan = 'youth', status = 'active', starts_at = now(), ends_at = now() + interval '1 year'
      `;
	await sql`
      insert into notifications (user_id, title, body, kind, link)
      values (
        ${data.userId},
        ${data.action === "approved" ? "Youth lane approved" : "Youth documents declined"},
        ${data.note || (data.action === "approved" ? "You can publish at no charge." : "Please resubmit documents.")},
        'youth',
        '/app/profile'
      )
    `;
	return { ok: true };
});
var listPublicClubs_createServerFn_handler = createServerRpc({
	id: "0469b5b5d27797c5abf8eda5d225b3f5045ae616f7fe8e5b849be89cc49a38b4",
	name: "listPublicClubs",
	filename: "src/lib/server/billing.ts"
}, (opts) => listPublicClubs.__executeServer(opts));
var listPublicClubs = createServerFn({ method: "GET" }).handler(listPublicClubs_createServerFn_handler, async () => {
	return (await (await getSql())`
    select slug, name, short_code, country, city, league, website, color_a, color_b
    from clubs order by country, name
  `).map((r) => ({
		slug: r.slug,
		name: r.name,
		short: r.short_code,
		country: r.country,
		city: r.city,
		league: r.league,
		website: r.website,
		colorA: r.color_a,
		colorB: r.color_b
	}));
});
//#endregion
export { adminReviewYouth_createServerFn_handler, adminYouthQueue_createServerFn_handler, confirmDeposit_createServerFn_handler, getAccess_createServerFn_handler, getWallet_createServerFn_handler, listPublicClubs_createServerFn_handler, submitYouthVerification_createServerFn_handler, subscribeFromWallet_createServerFn_handler };
