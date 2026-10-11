import type { PlanId } from "./plans";

export const NEXT_KEY = "ss-next";

export type AppDestination =
  | { to: "/app/wallet"; search: { plan: "player_u24" | "player_senior" | "desk" } }
  | { to: "/discover" }
  | { to: "/app/profile" }
  | { to: "/app" }
  | { to: "/players/$id"; params: { id: string } };

function safeNext(next?: string | null): string | null {
  if (!next) return null;
  if (!next.startsWith("/") || next.startsWith("//")) return null;
  return next;
}

export function rememberNext(next?: string | null) {
  if (typeof window === "undefined") return;
  const v = safeNext(next);
  if (v) sessionStorage.setItem(NEXT_KEY, v);
}

export function consumeNext(): string | null {
  if (typeof window === "undefined") return null;
  const v = sessionStorage.getItem(NEXT_KEY);
  if (v) sessionStorage.removeItem(NEXT_KEY);
  return safeNext(v);
}

export function destinationFromNext(next?: string | null): AppDestination {
  const v = safeNext(next);
  if (!v) return { to: "/app" };
  const [path, qs] = v.split("?");
  const params = new URLSearchParams(qs || "");
  if (path === "/app/wallet") {
    const plan = params.get("plan");
    const p: PlanId | string | null = plan;
    const allowed = p === "player_u24" || p === "player_senior" || p === "desk" ? p : "desk";
    return { to: "/app/wallet", search: { plan: allowed } };
  }
  if (path === "/discover") return { to: "/discover" };
  if (path === "/app/profile") return { to: "/app/profile" };
  const player = path.match(/^\/players\/([^/]+)$/);
  if (player) return { to: "/players/$id", params: { id: player[1] } };
  if (path === "/app" || path.startsWith("/app/")) return { to: "/app" };
  return { to: "/app" };
}
