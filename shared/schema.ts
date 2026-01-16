import { z } from "zod";

export const analyzeVideoRequestSchema = z.object({
  videoUrl: z.string().min(1, "YouTube URL을 입력해주세요"),
});

export type AnalyzeVideoRequest = z.infer<typeof analyzeVideoRequestSchema>;

export type DetectionLabel = "LIKELY_AI" | "UNCLEAR" | "LIKELY_HUMAN";

export interface CommentItem {
  author: string;
  text: string;
  likeCount: number;
}

export interface CommunityAnalysis {
  totalComments: number;
  aiVotes: number;
  realVotes: number;
  neutralVotes: number;
  topAiComments: CommentItem[];
  topRealComments: CommentItem[];
}

export interface AnalysisMeta {
  sourceType: "YOUTUBE_URL";
  source: "heuristic_only" | "heuristic_plus_external";
  videoId: string;
  thumbnailUrl: string;
  durationSeconds?: number;
  channelTitle?: string;
  analyzedAt: string;
}

export interface DebugInfo {
  heuristicScore: number;
  externalApiScore: number | null;
  communityAdjustment: number;
  finalScore: number;
}

export interface AnalyzeVideoResponse {
  score: number;
  label: DetectionLabel;
  reasons: string[];
  tips: string[];
  meta: AnalysisMeta;
  debug: DebugInfo;
  community?: CommunityAnalysis;
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
