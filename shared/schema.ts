import { z } from "zod";

export const analyzeVideoRequestSchema = z.object({
  videoUrl: z.string().min(1, "YouTube URL을 입력해주세요"),
});

export type AnalyzeVideoRequest = z.infer<typeof analyzeVideoRequestSchema>;

export type DetectionLabel = "LIKELY_AI" | "UNCLEAR" | "LIKELY_HUMAN";

export interface AnalysisMeta {
  source: "heuristic_only" | "heuristic_plus_external";
  thumbnailUrl: string;
  analyzedAt: string;
}

export interface AnalyzeVideoResponse {
  score: number;
  label: DetectionLabel;
  reasons: string[];
  tips: string[];
  meta: AnalysisMeta;
}

export interface HeuristicResult {
  score: number;
  reasons: string[];
  details: {
    brightnessUniformity: number;
    colorDistribution: number;
    edgeDensity: number;
    noiseLevel: number;
    highFrequencyRatio: number;
  };
}

export interface ExternalApiResult {
  score: number | null;
  available: boolean;
}
