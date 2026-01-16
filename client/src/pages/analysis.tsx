import { useEffect, useMemo } from "react";
import { useLocation, useSearch } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Youtube, Clock, User, Image, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { AnalysisResult } from "@/components/analysis-result";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { useAnalyzeVideo } from "@/hooks/use-analyze-video";

export default function Analysis() {
  const [, navigate] = useLocation();
  const searchString = useSearch();
  
  const videoUrl = useMemo(() => {
    const params = new URLSearchParams(searchString);
    return params.get("url") || "";
  }, [searchString]);

  const { isLoading, error, result, analyze, retry, reset } = useAnalyzeVideo();

  useEffect(() => {
    if (videoUrl && !result && !isLoading && !error) {
      analyze(videoUrl);
    }
  }, [videoUrl]);

  const handleBack = () => {
    reset();
    navigate("/");
  };

  const truncatedUrl = videoUrl.length > 50 
    ? videoUrl.substring(0, 50) + "..." 
    : videoUrl;

  if (!videoUrl) {
    navigate("/");
    return null;
  }

  const formatDuration = (seconds?: number) => {
    if (!seconds) return null;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="premium-bg noise-overlay text-foreground min-h-screen" data-testid="page-analysis">
      <header className="sticky top-0 z-50 bg-background/30 backdrop-blur-md border-b border-border/30" data-testid="container-header">
        <div className="container mx-auto flex h-14 items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-3 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="flex-shrink-0"
              data-testid="button-back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-semibold text-foreground/90" data-testid="text-logo">
              AI Video Inspector
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="fixed top-14 left-0 right-0 z-40 bg-primary/10 border-b border-primary/20" data-testid="banner-beta">
        <div className="container mx-auto px-4 py-2 flex items-center justify-center gap-2 text-xs text-primary">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>Beta · 분석 결과는 확률적 추정이며 100% 정확하지 않을 수 있습니다.</span>
        </div>
      </div>

      <main className="relative z-10 container mx-auto px-4 py-8 md:py-12 pt-24" data-testid="container-main">
        <div className="max-w-4xl mx-auto space-y-6">
          <motion.div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl glass-card"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            data-testid="card-url-info"
          >
            <div className="flex items-start gap-4 min-w-0">
              <div className="flex-shrink-0 w-16 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                <Youtube className="h-6 w-6 text-red-500" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground mb-1">분석 대상 영상</p>
                <p className="text-sm font-medium truncate" title={videoUrl} data-testid="text-analyzed-url">
                  {truncatedUrl}
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                  {result?.meta.channelTitle && (
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      @{result.meta.channelTitle}
                    </span>
                  )}
                  {result?.meta.durationSeconds && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDuration(result.meta.durationSeconds)}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Image className="h-3 w-3" />
                    분석 기준: 썸네일 1장
                  </span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              className="flex-shrink-0"
              data-testid="button-new-analysis"
            >
              다른 영상 분석하기
            </Button>
          </motion.div>

          {isLoading && <LoadingState />}

          {error && <ErrorState error={error} onRetry={retry} />}

          {result && <AnalysisResult result={result} />}
        </div>
      </main>

      <footer className="py-8 text-center" data-testid="container-footer">
        <p className="text-xs text-muted-foreground/60 max-w-2xl mx-auto px-4">
          이 분석 결과는 통계적 추정치이며, 100% 정확하지 않을 수 있습니다. 중요한 판단에는 다른 정보와 출처를 함께 참고해 주세요.
        </p>
      </footer>
    </div>
  );
}
