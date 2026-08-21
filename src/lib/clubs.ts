export type ClubPublic = {
  slug: string;
  name: string;
  short: string;
  country: string;
  city: string | null;
  league: string | null;
  website: string | null;
  colorA: string;
  colorB: string;
};

export type ClubRecord = ClubPublic & {
  id: number;
  email: string | null;
  emailVerified: boolean;
};
