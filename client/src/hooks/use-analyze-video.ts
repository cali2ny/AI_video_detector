import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import type { AnalyzeVideoResponse } from "@shared/schema";

export function useAnalyzeVideo() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeVideoResponse | null>(null);
  const [lastUrl, setLastUrl] = useState<string | null>(null);

  const analyze = async (videoUrl: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setLastUrl(videoUrl);

    try {
      const response = await apiRequest(
        "POST",
        "/api/analyze",
        { videoUrl }
      );
      const data: AnalyzeVideoResponse = await response.json();
      setResult(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "분석 중 오류가 발생했습니다";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const retry = () => {
    if (lastUrl) {
      analyze(lastUrl);
    }
  };

  const reset = () => {
    setIsLoading(false);
    setError(null);
    setResult(null);
    setLastUrl(null);
  };

  return {
    isLoading,
    error,
    result,
    analyze,
    retry,
    reset,
  };
}
