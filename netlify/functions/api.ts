import express from "express";
import serverless from "serverless-http";
import { z } from "zod";
import { extractVideoId, getBestThumbnail, getVideoMetadata } from "../../server/utils/youtube";
import { analyzeImage } from "../../server/utils/image-analysis";
import { callExternalDetectionApi } from "../../server/utils/external-api";
import { combineScores } from "../../server/utils/score-combiner";
import { fetchAndAnalyzeComments, calculateCommunityAdjustment } from "../../server/utils/comments";

const app = express();

app.use(express.json());

const analyzeRequestSchema = z.object({
  videoUrl: z.string().min(1, "YouTube URL을 입력해주세요"),
  thumbnailOnly: z.boolean().optional().default(true),
});

app.post("/api/analyze", async (req, res) => {
  try {
    const validation = analyzeRequestSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        error: validation.error.errors[0]?.message || "잘못된 요청입니다",
      });
    }

    const { videoUrl, thumbnailOnly } = validation.data;

    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      return res.status(400).json({
        error: "유효한 YouTube URL이 아닙니다",
      });
    }

    console.log(`[Analyze] Starting analysis for ${videoId}, thumbnailOnly: ${thumbnailOnly}`);

    const [thumbnailUrl, metadata, community] = await Promise.all([
      getBestThumbnail(videoId),
      getVideoMetadata(videoId),
      fetchAndAnalyzeComments(videoId),
    ]);

    const getTemporalAnalysis = async () => {
      console.log("[Temporal] Netlify serverless environment - temporal analysis not available");
      return {
        segments: [],
        overallAssessment: "SKIPPED" as const,
        notes: [],
        averageScore: 0,
        aiSegmentPercentage: 0,
        status: "skipped" as const,
        errorReason: "서버리스 환경에서는 시간대별 분석을 지원하지 않습니다. 썸네일 분석 결과를 참고해 주세요.",
      };
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

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export const handler = serverless(app);
