export const OWNER_EMAIL = "amir.behi2333@gmail.com";

export function isOwnerEmail(email: string | null | undefined) {
  return (email || "").trim().toLowerCase() === OWNER_EMAIL;
}
