import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware, optionalAuthMiddleware } from "@/lib/auth/middleware";
import { ageFromDob } from "@/lib/utils";
import { PLANS, playerPlanForAge, planById, type PlanId } from "@/lib/plans";
import type { ClubPublic } from "@/lib/clubs";
import type { AccessState, WalletState, YouthStatus } from "@/lib/types";

function trc20Address(userId: string): string {
  const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  const seed = `kavosh-usdt-trc20-${userId}`;
  let h = 2166136261;
  const chars: string[] = ["T"];
  for (let i = 0; i < 33; i++) {
    h ^= seed.charCodeAt(i % seed.length) + i * 13;
    h = Math.imul(h, 16777619);
    chars.push(alphabet[(h >>> 0) % alphabet.length]);
  }
  return chars.join("");
}

function money(v: unknown): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}

function asBool(v: unknown): boolean {
  return v === true || v === "t" || v === "true" || v === 1;
}

async function ensureWallet(sql: Awaited<ReturnType<typeof getSql>>, userId: string) {
  const [row] = await sql<{ address: string; balance_usdt: string | number }>`
    select address, balance_usdt from wallets where user_id = ${userId}
  `;
  if (row) return { address: row.address, balance: money(row.balance_usdt) };
  const address = trc20Address(userId);
  await sql`
    insert into wallets (user_id, address, network, asset, balance_usdt)
    values (${userId}, ${address}, 'TRC20', 'USDT', 0)
    on conflict (user_id) do nothing
  `;
  return { address, balance: 0 };
}

export async function loadAccess(sql: Awaited<ReturnType<typeof getSql>>, userId: string): Promise<AccessState> {
  const wallet = await ensureWallet(sql, userId);
  const [user] = await sql<{ role: string; is_admin: unknown }>`
    select role, is_admin from platform_users where user_id = ${userId}
  `;
  const [sub] = await sql<{ plan: PlanId; status: string; ends_at: string }>`
    select plan, status, ends_at from subscriptions
    where user_id = ${userId} and status = 'active' and ends_at > now()
  `;
  const [youth] = await sql<{ status: YouthStatus }>`
    select status from youth_verifications where user_id = ${userId}
  `;
  const [profile] = await sql<{ dob: string | null }>`
    select dob from player_profiles where user_id = ${userId}
  `;
  const isAdmin = asBool(user?.is_admin);
  const role = (user?.role as AccessState["role"]) ?? null;
  const age = ageFromDob(profile?.dob ?? null);
  const needed = playerPlanForAge(age);
  const plan = sub?.plan ?? null;
  const youthStatus: YouthStatus = youth?.status ?? "none";
  const canViewTalent = isAdmin || plan === "desk";
  let canPublish = isAdmin;
  let publishBlock: AccessState["publishBlock"] = null;
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
    neededPlan: needed,
  };
}

export const getAccess = createServerFn({ method: "GET" })
  .middleware([optionalAuthMiddleware])
  .handler(async ({ context }): Promise<AccessState> => {
    if (!context.userId) {
      return {
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
        neededPlan: null,
      };
    }
    const sql = await getSql();
    return loadAccess(sql, context.userId);
  });

export const getWallet = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<WalletState> => {
    const sql = await getSql();
    const access = await loadAccess(sql, context.userId);
    const txs = await sql<{
      id: number;
      kind: string;
      amount_usdt: string | number;
      plan: string | null;
      memo: string | null;
      created_at: string;
    }>`
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
        kind: t.kind as WalletState["txs"][number]["kind"],
        amount: money(t.amount_usdt),
        plan: t.plan,
        memo: t.memo,
        createdAt: String(t.created_at),
      })),
    };
  });

async function activatePlan(
  sql: Awaited<ReturnType<typeof getSql>>,
  userId: string,
  plan: PlanId,
) {
  const spec = planById(plan);
  if (!spec) throw new Error("Unknown plan");
  const cost = spec.usd;
  const [wallet] = await sql<{ balance_usdt: string | number }>`
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

export const confirmDeposit = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { amount: number; plan?: PlanId | null; channel?: string }) => input)
  .handler(async ({ context, data }) => {
    const amount = Math.round(Number(data.amount));
    if (!Number.isFinite(amount) || amount < 1 || amount > 20000) {
      throw new Error("Invalid amount");
    }
    const sql = await getSql();
    await ensureWallet(sql, context.userId);
    await sql`
      update wallets set balance_usdt = balance_usdt + ${amount} where user_id = ${context.userId}
    `;
    const memo =
      data.channel === "card"
        ? "Card payment confirmed"
        : data.channel === "paypal"
          ? "PayPal confirmed"
          : data.channel === "btc"
            ? "Bitcoin confirmed"
            : data.channel === "eth"
              ? "Ethereum confirmed"
              : "TRC20 USDT confirmed";
    await sql`
      insert into wallet_tx (user_id, kind, amount_usdt, plan, memo)
      values (${context.userId}, 'deposit', ${amount}, ${data.plan ?? null}, ${memo})
    `;
    if (data.plan) {
      const spec = planById(data.plan);
      if (spec && spec.usd > 0) {
        const [w] = await sql<{ balance_usdt: string | number }>`
          select balance_usdt from wallets where user_id = ${context.userId}
        `;
        if (money(w?.balance_usdt) >= spec.usd) {
          await activatePlan(sql, context.userId, data.plan);
        }
      }
    }
    return loadAccess(sql, context.userId);
  });

export const subscribeFromWallet = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { plan: PlanId }) => input)
  .handler(async ({ context, data }) => {
    const spec = planById(data.plan);
    if (!spec) throw new Error("Unknown plan");
    if (spec.id === "youth") throw new Error("Youth lane is verified, not purchased");
    const sql = await getSql();
    await ensureWallet(sql, context.userId);
    await activatePlan(sql, context.userId, data.plan);
    return loadAccess(sql, context.userId);
  });

export const submitYouthVerification = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { idDocUrl: string; selfieUrl: string; videoUrl?: string | null }) => input)
  .handler(async ({ context, data }) => {
    const idDoc = data.idDocUrl.trim();
    const selfie = data.selfieUrl.trim();
    if (!idDoc || !selfie) throw new Error("ID document and selfie are required");
    const sql = await getSql();
    await sql`
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
    return { ok: true as const };
  });

export const adminYouthQueue = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const [admin] = await sql<{ is_admin: unknown }>`
      select is_admin from platform_users where user_id = ${context.userId}
    `;
    if (!asBool(admin?.is_admin)) throw new Error("Admin required");
    return sql<{
      user_id: string;
      id_doc_url: string;
      selfie_url: string;
      video_url: string | null;
      status: string;
      submitted_at: string;
      first_name: string | null;
      last_name: string | null;
      dob: string | null;
    }>`
      select v.user_id, v.id_doc_url, v.selfie_url, v.video_url, v.status, v.submitted_at,
             p.first_name, p.last_name, p.dob
      from youth_verifications v
      left join player_profiles p on p.user_id = v.user_id
      where v.status = 'pending'
      order by v.submitted_at asc
    `;
  });

export const adminReviewYouth = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { userId: string; action: "approved" | "rejected"; note?: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const [admin] = await sql<{ is_admin: unknown }>`
      select is_admin from platform_users where user_id = ${context.userId}
    `;
    if (!asBool(admin?.is_admin)) throw new Error("Admin required");
    await sql`
      update youth_verifications
      set status = ${data.action}, note = ${data.note || null}, reviewed_at = now()
      where user_id = ${data.userId}
    `;
    if (data.action === "approved") {
      await sql`
        insert into subscriptions (user_id, plan, status, starts_at, ends_at)
        values (${data.userId}, 'youth', 'active', now(), now() + interval '1 year')
        on conflict (user_id) do update
          set plan = 'youth', status = 'active', starts_at = now(), ends_at = now() + interval '1 year'
      `;
    }
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
    return { ok: true as const };
  });

export const listPublicClubs = createServerFn({ method: "GET" }).handler(async (): Promise<ClubPublic[]> => {
  const sql = await getSql();
  const rows = await sql<{
    slug: string;
    name: string;
    short_code: string;
    country: string;
    city: string | null;
    league: string | null;
    website: string | null;
    color_a: string;
    color_b: string;
  }>`
    select slug, name, short_code, country, city, league, website, color_a, color_b
    from clubs order by country, name
  `;
  return rows.map((r) => ({
    slug: r.slug,
    name: r.name,
    short: r.short_code,
    country: r.country,
    city: r.city,
    league: r.league,
    website: r.website,
    colorA: r.color_a,
    colorB: r.color_b,
  }));
});

export const queueClubAlerts = async (
  sql: Awaited<ReturnType<typeof getSql>>,
  profileId: number,
  country: string | null,
) => {
  const clubs = await sql<{ id: number; email: string }>`
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

export { PLANS };
