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
  confidence: number;
  team?: string | null;
};

export type VideoAnalysis = {
  playerBoxes: PlayerBox[];
  heatmap: number[][];
  distanceCoveredM: number | null;
  possession: { home: number; away: number } | null;
  model: string;
  streamQuality: string | null;
  extractedAt: string;
};

export function isPendingStatus(s: AnalysisStatus | string | null | undefined) {
  return s === "queued" || s === "running";
}
