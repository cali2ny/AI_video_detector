import type { DetectionLabel, AnalyzeVideoResponse, AnalysisMeta, DebugInfo } from "@shared/schema";

interface CombineScoreParams {
  heuristicScore: number;
  heuristicReasons: string[];
  externalScore: number | null;
  thumbnailUrl: string;
  videoId: string;
  channelTitle?: string;
  durationSeconds?: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function getLabel(score: number): DetectionLabel {
  if (score >= 70) return "LIKELY_AI";
  if (score >= 40) return "UNCLEAR";
  return "LIKELY_HUMAN";
}

function getTips(label: DetectionLabel): string[] {
  switch (label) {
    case "LIKELY_AI":
      return [
        "영상의 세부 묘사가 일관되게 부자연스러운지 확인해보세요",
        "인물의 눈, 손가락, 치아 등 세밀한 부분에 왜곡이 없는지 살펴보세요",
        "배경의 텍스트나 간판이 읽을 수 있는 글자인지 확인하세요",
        "영상 출처와 제작자 정보를 직접 확인해보세요",
      ];
    case "UNCLEAR":
      return [
        "더 많은 정보가 필요합니다. 영상을 직접 시청해보세요",
        "제작자의 다른 콘텐츠와 비교해보세요",
        "영상 설명이나 댓글에서 추가 정보를 찾아보세요",
        "전문가의 의견을 구해보는 것도 좋습니다",
      ];
    case "LIKELY_HUMAN":
      return [
        "분석 결과 자연스러운 영상으로 보입니다",
        "그래도 중요한 정보라면 다른 출처와 교차 확인하세요",
        "제작자의 신뢰도를 함께 고려하세요",
      ];
  }
}

export function combineScores(params: CombineScoreParams): AnalyzeVideoResponse {
  const { heuristicScore, heuristicReasons, externalScore, thumbnailUrl, videoId, channelTitle, durationSeconds } = params;

  let finalScore: number;
  let source: AnalysisMeta["source"];

  if (externalScore !== null) {
    finalScore = heuristicScore * 0.3 + externalScore * 0.7;
    source = "heuristic_plus_external";
  } else {
    finalScore = heuristicScore;
    source = "heuristic_only";
  }

  finalScore = clamp(Math.round(finalScore), 0, 100);

  const label = getLabel(finalScore);
  const tips = getTips(label);

  const reasons = [...heuristicReasons];

  if (externalScore !== null) {
    reasons.push(`딥러닝 기반 탐지 모델이 이 영상을 약 ${externalScore}% 확률로 AI 생성으로 분류했습니다.`);
  }

  const debug: DebugInfo = {
    heuristicScore: Math.round(heuristicScore),
    externalApiScore: externalScore !== null ? Math.round(externalScore) : null,
    finalScore,
  };

  return {
    score: finalScore,
    label,
    reasons,
    tips,
    meta: {
      sourceType: "YOUTUBE_URL",
      source,
      videoId,
      thumbnailUrl,
      channelTitle,
      durationSeconds,
      analyzedAt: new Date().toISOString(),
    },
    debug,
  };
}
