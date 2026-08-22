export const OWNER_EMAILS = [
  "amir.behi2333@gmail.com",
  "amirxo6229@gmail.com",
];

export function isOwnerEmail(email: string | null | undefined) {
  const n = (email || "").trim().toLowerCase();
  return OWNER_EMAILS.includes(n);
}
