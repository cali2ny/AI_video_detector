import { Header } from "@/components/header";
import { UrlInputForm } from "@/components/url-input-form";
import { AnalysisResult } from "@/components/analysis-result";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { EmptyState } from "@/components/empty-state";
import { useAnalyzeVideo } from "@/hooks/use-analyze-video";

export default function Home() {
  const { isLoading, error, result, analyze, retry } = useAnalyzeVideo();

  return (
    <div className="min-h-screen flex flex-col" data-testid="page-home">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8" data-testid="container-main">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight" data-testid="text-page-title">
              AI 생성 영상 탐지
            </h2>
            <p className="text-muted-foreground" data-testid="text-page-description">
              YouTube 영상의 시각적 특성을 분석하여 AI 생성 가능성을 평가합니다
            </p>
          </div>

          <UrlInputForm onSubmit={analyze} isLoading={isLoading} />

          {isLoading && <LoadingState />}

          {error && <ErrorState error={error} onRetry={retry} />}

          {result && <AnalysisResult result={result} />}

          {!isLoading && !error && !result && <EmptyState />}
        </div>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground" data-testid="container-footer">
        <p data-testid="text-footer-disclaimer">
          이 도구는 참고용이며, 최종 판단은 사용자의 몫입니다.
        </p>
      </footer>
    </div>
  );
}
