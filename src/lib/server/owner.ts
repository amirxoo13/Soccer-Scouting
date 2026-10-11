import { isOwnerEmail } from "@/lib/owner";
import type { getSql } from "@/lib/db";

type Sql = Awaited<ReturnType<typeof getSql>>;

export async function ensureOwnerPrivileges(sql: Sql, userId: string) {
  const [authUser] = await sql<{ email: string | null }>`
    select email from "user" where id = ${userId}
  `;
  if (!isOwnerEmail(authUser?.email)) return false;

  await sql`
    insert into platform_users (user_id, role, display_name, org_name, org_role, scout_status, is_admin)
    values (${userId}, 'player', 'Amir Sharaf', 'Soccer Scouting', 'Owner', 'approved', true)
    on conflict (user_id) do update set
      is_admin = true,
      scout_status = 'approved',
      display_name = coalesce(platform_users.display_name, 'Amir Sharaf')
  `;

  await sql`
    insert into player_profiles (user_id, first_name, last_name, status, country, primary_position)
    values (${userId}, 'Amir', 'Sharaf', 'approved', 'IR', 'ST')
    on conflict (user_id) do nothing
  `;

  const [list] = await sql<{ id: number }>`select id from shortlists where user_id = ${userId} limit 1`;
  if (!list) {
    await sql`insert into shortlists (user_id, name) values (${userId}, 'Watchlist')`;
  }

  const ends = new Date();
  ends.setUTCFullYear(ends.getUTCFullYear() + 10);
  await sql`
    insert into subscriptions (user_id, plan, status, starts_at, ends_at)
    values (${userId}, 'desk', 'active', now(), ${ends.toISOString()})
    on conflict (user_id) do update set plan = 'desk', status = 'active', ends_at = ${ends.toISOString()}
  `;

  const [wallet] = await sql<{ user_id: string }>`select user_id from wallets where user_id = ${userId}`;
  if (!wallet) {
    const addr = `T${userId.replace(/[^a-zA-Z0-9]/g, "x").padEnd(33, "X").slice(0, 33)}`;
    await sql`
      insert into wallets (user_id, address, network, asset, balance_usdt)
      values (${userId}, ${addr}, 'TRC20', 'USDT', 50000)
      on conflict (user_id) do update set balance_usdt = 50000
    `;
  } else {
    await sql`update wallets set balance_usdt = greatest(balance_usdt, 50000) where user_id = ${userId}`;
  }

  const [youth] = await sql<{ user_id: string }>`select user_id from youth_verifications where user_id = ${userId}`;
  if (!youth) {
    await sql`
      insert into youth_verifications (user_id, id_doc_url, selfie_url, status, reviewed_at)
      values (${userId}, 'owner', 'owner', 'approved', now())
    `;
  } else {
    await sql`update youth_verifications set status = 'approved' where user_id = ${userId}`;
  }

  return true;
}
