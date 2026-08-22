export type AnalysisStatus =
  | "idle"
  | "queued"
  | "running"
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
};

export type RadarScores = {
  technical: number;
  tactical: number;
  physical: number;
  mental: number;
  attacking: number;
  defending: number;
};

export type VideoAnalysis = {
  playerBoxes: PlayerBox[];
  heatmap: number[][];
  distanceCoveredM: number | null;
  possession: { home: number; away: number } | null;
  model: string;
  streamQuality: string | null;
  extractedAt: string;
  framesAnalyzed?: number;
  playersOnPitch?: number;
  ballDetected?: boolean;
  formation?: string | null;
  phase?: string | null;
  compactness?: number | null;
  width?: number | null;
  intensity?: number | null;
  radar?: RadarScores | null;
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
};

export function isPendingStatus(s: AnalysisStatus | string | null | undefined) {
  return s === "queued" || s === "running";
}
