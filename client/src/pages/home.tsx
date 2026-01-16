import { Header } from "@/components/header";
import { UrlInputForm } from "@/components/url-input-form";
import { AnalysisResult } from "@/components/analysis-result";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { EmptyState } from "@/components/empty-state";
import { SectionHeader } from "@/components/ui/section-header";
import { useAnalyzeVideo } from "@/hooks/use-analyze-video";

export default function Home() {
  const { isLoading, error, result, analyze, retry } = useAnalyzeVideo();

  return (
    <div className="min-h-screen flex flex-col" data-testid="page-home">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-10 md:py-16" data-testid="container-main">
        <div className="max-w-4xl mx-auto space-y-10">
          <SectionHeader
            title="AI Video Detection"
            subtitle="Analyze YouTube videos using advanced neural detection algorithms to identify AI-generated content with confidence scores and detailed evidence"
          />

          <UrlInputForm onSubmit={analyze} isLoading={isLoading} />

          {isLoading && <LoadingState />}

          {error && <ErrorState error={error} onRetry={retry} />}

          {result && <AnalysisResult result={result} />}

          {!isLoading && !error && !result && <EmptyState />}
        </div>
      </main>

      <footer className="border-t py-8 mt-auto" data-testid="container-footer">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p data-testid="text-footer-disclaimer">
              This tool is for reference only. Final judgment is at the user's discretion.
            </p>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                API Status: Online
              </span>
              <span className="text-muted-foreground/50">|</span>
              <span>v1.0.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
