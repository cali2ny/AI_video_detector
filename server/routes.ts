import type { Express } from "express";
import type { Server } from "http";
import { z } from "zod";
import { extractVideoId, getBestThumbnail, getVideoMetadata } from "./utils/youtube";
import { analyzeImage } from "./utils/image-analysis";
import { callExternalDetectionApi } from "./utils/external-api";
import { combineScores } from "./utils/score-combiner";
import { fetchAndAnalyzeComments, calculateCommunityAdjustment } from "./utils/comments";
import { performTemporalAnalysis } from "./utils/temporal-analysis";

const analyzeRequestSchema = z.object({
  videoUrl: z.string().min(1, "YouTube URL을 입력해주세요"),
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/analyze", async (req, res) => {
    try {
      const validation = analyzeRequestSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          error: validation.error.errors[0]?.message || "잘못된 요청입니다",
        });
      }

      const { videoUrl } = validation.data;

      const videoId = extractVideoId(videoUrl);
      if (!videoId) {
        return res.status(400).json({
          error: "유효한 YouTube URL이 아닙니다",
        });
      }

      const [thumbnailUrl, metadata, community] = await Promise.all([
        getBestThumbnail(videoId),
        getVideoMetadata(videoId),
        fetchAndAnalyzeComments(videoId),
      ]);

      const getTemporalAnalysis = async () => {
        if (!metadata.durationSeconds) {
          console.log("[Temporal] No duration available, returning failed status");
          return {
            segments: [],
            overallAssessment: "UNAVAILABLE" as const,
            notes: [],
            averageScore: 0,
            aiSegmentPercentage: 0,
            status: "failed" as const,
            errorReason: "영상 길이 정보를 가져올 수 없습니다",
          };
        }
        if (metadata.durationSeconds < 4) {
          console.log("[Temporal] Video too short, returning failed status");
          return {
            segments: [],
            overallAssessment: "UNAVAILABLE" as const,
            notes: [],
            averageScore: 0,
            aiSegmentPercentage: 0,
            status: "failed" as const,
            errorReason: "영상이 너무 짧아 시간대별 분석이 불가능합니다 (최소 4초 이상)",
          };
        }
        return performTemporalAnalysis(videoId, metadata.durationSeconds);
      };

      const [heuristicResult, externalResult, temporal] = await Promise.all([
        analyzeImage(thumbnailUrl),
        callExternalDetectionApi([thumbnailUrl]),
        getTemporalAnalysis(),
      ]);

      const { adjustment: communityAdjustment, reason: communityReason } = calculateCommunityAdjustment(community);

      const response = combineScores({
        heuristicScore: heuristicResult.score,
        heuristicReasons: heuristicResult.reasons,
        externalScore: externalResult.score,
        thumbnailUrl,
        videoId,
        channelTitle: metadata.channelTitle,
        durationSeconds: metadata.durationSeconds,
        community,
        communityAdjustment,
        communityReason,
        temporal,
      });

      return res.json(response);
    } catch (error) {
      console.error("Analysis error:", error);
      return res.status(500).json({
        error: "분석 중 오류가 발생했습니다. 다시 시도해주세요.",
      });
    }
  });

  return httpServer;
}
