export type AnalysisStatus =
  | "idle"
  | "queued"
  | "running"
  | "awaiting_mark"
  | "analyzed"
  | "extraction_failed"
  | "failed";

export type PlayerBox = {
  id: number;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  pitchX?: number;
  pitchY?: number;
  confidence: number;
  team?: string | null;
  role?: string | null;
  kit?: string | null;
};

export type RadarScores = {
  technical: number;
  tactical: number;
  physical: number;
  mental: number;
  attacking: number;
  defending: number;
};

export type PlayerAttributes = {
  firstTouch: number;
  weakerFoot: number;
  scanning: number;
  acceleration: number;
  agility: number;
  passing: number;
  dribble: number;
  finishing: number;
  positioning: number;
  decisionMaking: number;
};

export type PlayerMatchStats = {
  distanceM: number;
  sprints: number;
  maxSpeedKmh: number;
  intensity: number;
  passesCompleted: number;
  passesAttempted: number;
  keyPasses: number;
  passAccuracy: number;
  positioning: number;
  tacklesWon: number;
  tacklesLost: number;
  shots: number;
  shotsOnTarget: number;
  xg: number;
  defending: number;
  interceptions: number;
  chancesCreated: number;
  chancesWasted: number;
  duels: number;
  recoveries: number;
  touches: number;
};

export type PlayerDossier = {
  id: number;
  team: "home" | "away";
  position: string;
  role: string;
  stats: PlayerMatchStats;
  radar: RadarScores;
  attributes: PlayerAttributes;
  strengths: string[];
  weaknesses: string[];
  notes: string;
  recommendation: string;
};

export type TeamIssue = {
  team: "home" | "away" | "both";
  zone: string;
  severity: "low" | "medium" | "high";
  problem: string;
};

export type VideoAnalysis = {
  playerBoxes: PlayerBox[];
  heatmap: number[][];
  distanceCoveredM: number | null;
  possession: { home: number; away: number } | null;
  model: string;
  streamQuality: string | null;
  extractedAt: string;
  stage?: "mark" | "complete";
  frameUrl?: string | null;
  frameWidth?: number;
  frameHeight?: number;
  markedPlayerId?: number | null;
  position?: string | null;
  role?: string | null;
  level?: string | null;
  framesAnalyzed?: number;
  playersOnPitch?: number;
  ballDetected?: boolean;
  formation?: string | null;
  formationAway?: string | null;
  phase?: string | null;
  compactness?: number | null;
  width?: number | null;
  intensity?: number | null;
  radar?: RadarScores | null;
  attributes?: PlayerAttributes | null;
  strengths?: string[];
  weaknesses?: string[];
  notes?: string | null;
  recommendation?: string | null;
  stats?: {
    sprints: number | null;
    duels: number | null;
    progressiveRuns: number | null;
    recoveries: number | null;
    touches: number | null;
    maxSpeedKmh: number | null;
  };
  dossiers?: PlayerDossier[];
  teamIssues?: TeamIssue[];
  kickoffDetected?: boolean;
  pitchDetected?: boolean;
  refereeId?: number | null;
  homeKit?: string | null;
  awayKit?: string | null;
};

export function isPendingStatus(s: AnalysisStatus | string | null | undefined) {
  return s === "queued" || s === "running";
}

export function isUselessIssue(problem: string, zone?: string) {
  return (
    zone === "frame" ||
    problem === "tightHint" ||
    /too tight|wide match clip|pitch can be read/i.test(problem)
  );
}

export function isBlockedAnalysis(a: VideoAnalysis | null | undefined) {
  if (!a) return false;
  const issues = a.teamIssues ?? [];
  const blocked = issues.some((i) => isUselessIssue(i.problem || "", i.zone));
  return blocked && !(a.dossiers && a.dossiers.length);
}
