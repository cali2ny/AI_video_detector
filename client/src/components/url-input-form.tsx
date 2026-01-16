import { useState } from "react";
import { Search, Youtube, Loader2, Link2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PremiumCard } from "@/components/ui/premium-card";

interface UrlInputFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export function UrlInputForm({ onSubmit, isLoading }: UrlInputFormProps) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  };

  const isValidYoutubeUrl = (url: string) => {
    const patterns = [
      /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[\w-]+/,
      /^(https?:\/\/)?(www\.)?youtu\.be\/[\w-]+/,
      /^(https?:\/\/)?(www\.)?youtube\.com\/shorts\/[\w-]+/,
    ];
    return patterns.some((pattern) => pattern.test(url));
  };

  const showValidation = url.length > 0 && !isValidYoutubeUrl(url);

  return (
    <PremiumCard variant="glass" data-testid="card-url-input">
      <form onSubmit={handleSubmit} className="space-y-5" data-testid="form-analyze">
        <div className="space-y-3">
          <label
            htmlFor="youtube-url"
            className="text-sm font-semibold flex items-center gap-2"
            data-testid="label-url"
          >
            <div className="w-6 h-6 rounded-md bg-destructive/10 flex items-center justify-center">
              <Youtube className="h-3.5 w-3.5 text-destructive" />
            </div>
            Enter YouTube Video URL
          </label>
          <div className="relative">
            <Link2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="youtube-url"
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="pl-11 h-14 text-base bg-background/50 border-2 border-input focus:border-primary transition-colors"
              disabled={isLoading}
              data-testid="input-youtube-url"
            />
          </div>
          {showValidation && (
            <p className="text-sm text-destructive flex items-center gap-1.5" data-testid="text-validation-error">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
              Please enter a valid YouTube URL
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-14 text-base font-semibold gradient-primary border-0 shadow-lg hover:shadow-xl transition-all duration-300"
          disabled={isLoading || !url.trim() || showValidation}
          data-testid="button-analyze"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Analyzing with Neural Detectors...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Analyze Video
            </>
          )}
        </Button>

        <div className="flex items-center justify-center gap-6 pt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Heuristic Analysis
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            Deep Learning API
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
            Score Fusion
          </div>
        </div>
      </form>
    </PremiumCard>
  );
}
