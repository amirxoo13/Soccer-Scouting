import type { PlanId } from "./plans";

export type UserRole = "player" | "scout" | "admin";
export type ScoutStatus = "pending" | "approved" | "rejected";
export type ProfileStatus = "draft" | "pending" | "approved" | "needs_revision" | "rejected";
export type PlayingLevel = "amateur" | "semi_pro" | "professional";
export type PreferredFoot = "right" | "left" | "both";
export type ShortlistStatus = "watching" | "reviewing" | "contacted" | "passed";
export type YouthStatus = "none" | "pending" | "approved" | "rejected";

export type ClubStint = {
  club: string;
  from: number;
  to: number | null;
  competition?: string;
  appearances?: number;
  goals?: number;
  assists?: number;
  minutes?: number;
  yellow?: number;
  red?: number;
};


export type PlatformUser = {
  userId: string;
  role: UserRole;
  displayName: string | null;
  orgName: string | null;
  orgRole: string | null;
  scoutStatus: ScoutStatus;
  isAdmin: boolean;
  locale: string;
  createdAt: string;
};

export type PlayerCard = {
  id: number;
  firstName: string;
  lastName: string;
  dob: string | null;
  nationality: string | null;
  country: string | null;
  city: string | null;
  heightCm: number | null;
  weightKg: number | null;
  preferredFoot: PreferredFoot | null;
  primaryPosition: string | null;
  secondaryPositions: string | null;
  currentClub: string | null;
  playingLevel: PlayingLevel | null;
  photoUrl: string | null;
  status: ProfileStatus;
  views: number;
  featured: boolean;
};

export type RedactedCard = {
  id: number;
  primaryPosition: string | null;
  photoUrl: string | null;
  locked: true;
};

export type PlayerVideo = {
  id: number;
  youtubeUrl: string;
  title: string | null;
  description: string | null;
  category: string | null;
  sortOrder: number;
  playCount: number;
  analysisStatus: string;
  analysis: import("./video-analysis").VideoAnalysis | null;
  analysisError: string | null;
  analyzedAt: string | null;
};

export type PlayerProfile = PlayerCard & {
  userId: string;
  jerseyNumber: number | null;
  clubHistory: ClubStint[];
  achievements: string | null;
  injuryStatus: string | null;
  languages: string | null;
  education: string | null;
  bio: string | null;
  instagram: string | null;
  fullBodyUrl: string | null;
  reviewNote: string | null;
  submittedAt: string | null;
  reviewedAt: string | null;
  updatedAt: string;
  videos: PlayerVideo[];
};

export type ShortlistItem = {
  id: number;
  profileId: number;
  notes: string | null;
  status: ShortlistStatus;
  createdAt: string;
  player: PlayerCard;
};

export type ContactRequest = {
  id: number;
  fromUserId: string;
  fromName: string | null;
  fromOrg: string | null;
  profileId: number;
  playerName: string;
  message: string | null;
  status: "open" | "seen" | "closed";
  createdAt: string;
};

export type NotificationItem = {
  id: number;
  title: string;
  body: string | null;
  kind: string;
  read: boolean;
  link: string | null;
  createdAt: string;
};

export type AccessState = {
  loggedIn: boolean;
  userId: string | null;
  role: UserRole | null;
  isAdmin: boolean;
  canViewTalent: boolean;
  canPublish: boolean;
  publishBlock: "login" | "youth" | "pay_u24" | "pay_senior" | "age" | "dob" | null;
  plan: PlanId | null;
  planEnds: string | null;
  walletBalance: number;
  walletAddress: string | null;
  youthStatus: YouthStatus;
  age: number | null;
  neededPlan: PlanId | null;
};

export type WalletState = {
  address: string;
  network: string;
  asset: string;
  balance: number;
  plan: PlanId | null;
  planEnds: string | null;
  txs: {
    id: number;
    kind: "deposit" | "subscribe" | "refund";
    amount: number;
    plan: string | null;
    memo: string | null;
    createdAt: string;
  }[];
};

export type TalentSearchResult =
  | { access: true; players: PlayerCard[] }
  | { access: false; players: RedactedCard[] };

export type PublicPlayerResult =
  | { access: true; player: PlayerProfile }
  | { access: false; player: RedactedCard | null };

export type MeState = {
  user: PlatformUser | null;
  profile: PlayerProfile | null;
  adminCount: number;
  unread: number;
  access: AccessState;
};
