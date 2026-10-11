export type PlanId = "youth" | "player_u24" | "player_senior" | "desk";

export type Plan = {
  id: PlanId;
  usd: number;
  audience: "player" | "desk";
  ageMin?: number;
  ageMax?: number;
};

export const PLANS: Plan[] = [
  { id: "youth", usd: 0, audience: "player", ageMin: 16, ageMax: 19 },
  { id: "player_u24", usd: 200, audience: "player", ageMin: 20, ageMax: 24 },
  { id: "player_senior", usd: 400, audience: "player", ageMin: 25 },
  { id: "desk", usd: 1000, audience: "desk" },
];

export function planById(id: string | null | undefined): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}

export function playerPlanForAge(age: number | null): PlanId | null {
  if (age == null) return null;
  if (age >= 16 && age <= 19) return "youth";
  if (age >= 20 && age <= 24) return "player_u24";
  if (age >= 25) return "player_senior";
  return null;
}
