import { useState, useRef } from "react";
import { apiRequest } from "@/lib/queryClient";
import type { AnalyzeVideoResponse } from "@shared/schema";

interface AnalyzeOptions {
  thumbnailOnly?: boolean;
}

export function useAnalyzeVideo() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeVideoResponse | null>(null);
  const [lastUrl, setLastUrl] = useState<string | null>(null);
  const lastOptionsRef = useRef<AnalyzeOptions>({});

  const analyze = async (videoUrl: string, options: AnalyzeOptions = {}) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setLastUrl(videoUrl);
    lastOptionsRef.current = options;

    try {
      const response = await apiRequest(
        "POST",
        "/api/analyze",
        { videoUrl, thumbnailOnly: options.thumbnailOnly ?? true }
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
      analyze(lastUrl, lastOptionsRef.current);
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
