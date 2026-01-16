import { useEffect, useMemo } from "react";
import { useLocation, useSearch } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink } from "lucide-react";
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

  const truncatedUrl = videoUrl.length > 60 
    ? videoUrl.substring(0, 60) + "..." 
    : videoUrl;

  if (!videoUrl) {
    navigate("/");
    return null;
  }

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
            <span className="text-sm font-medium text-foreground/80 truncate" data-testid="text-logo">
              AI Video Detector
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-8 md:py-12" data-testid="container-main">
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl glass-card"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            data-testid="card-url-info"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <ExternalLink className="h-4 w-4 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">분석 중인 영상</p>
                <p className="text-sm font-medium truncate" title={videoUrl} data-testid="text-analyzed-url">
                  {truncatedUrl}
                </p>
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
    </div>
  );
}
