import { useState } from "react";
import { Search, Youtube, Loader2, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

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
    <Card data-testid="card-url-input">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4" data-testid="form-analyze">
          <div className="space-y-2">
            <label
              htmlFor="youtube-url"
              className="text-sm font-medium flex items-center gap-2"
              data-testid="label-url"
            >
              <Youtube className="h-4 w-4 text-destructive" />
              YouTube 영상 URL
            </label>
            <div className="relative">
              <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="youtube-url"
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-10 h-12 text-base"
                disabled={isLoading}
                data-testid="input-youtube-url"
              />
            </div>
            {showValidation && (
              <p className="text-sm text-destructive" data-testid="text-validation-error">
                유효한 YouTube URL 형식이 아닙니다
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-base font-medium"
            disabled={isLoading || !url.trim() || showValidation}
            data-testid="button-analyze"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                분석 중...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                분석하기
              </>
            )}
          </Button>
        </form>

        <div className="mt-4 pt-4 border-t">
          <p className="text-xs text-muted-foreground text-center" data-testid="text-form-description">
            YouTube 영상의 썸네일과 프레임을 분석하여 AI 생성 가능성을
            평가합니다
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
