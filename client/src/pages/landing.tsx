import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Brain, Scan, FileText, Link2, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Landing() {
  const [url, setUrl] = useState("");
  const [, navigate] = useLocation();

  const isValidYoutubeUrl = (url: string) => {
    const patterns = [
      /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[\w-]+/,
      /^(https?:\/\/)?(www\.)?youtu\.be\/[\w-]+/,
      /^(https?:\/\/)?(www\.)?youtube\.com\/shorts\/[\w-]+/,
    ];
    return patterns.some((pattern) => pattern.test(url));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim() && isValidYoutubeUrl(url)) {
      navigate(`/analysis?url=${encodeURIComponent(url.trim())}`);
    }
  };

  const showValidation = url.length > 0 && !isValidYoutubeUrl(url);
  const features = [
    { icon: Brain, text: "Deep Learning Detection" },
    { icon: Scan, text: "Frame-by-Frame Analysis" },
    { icon: FileText, text: "Explainable Results" },
  ];

  return (
    <div className="premium-bg noise-overlay text-foreground" data-testid="page-landing">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/20 backdrop-blur-md border-b border-border/30" data-testid="container-header">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <span className="text-sm font-medium text-foreground/80" data-testid="text-logo">
            AI Video Detector
          </span>
          <ThemeToggle />
        </div>
      </header>

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 pt-14">
        <div className="w-full max-w-xl space-y-12">
          <motion.div
            className="text-center space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            data-testid="container-hero"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight" data-testid="text-headline">
              <span className="gradient-text">AI가 만든 영상인지,</span>
              <br />
              <span className="text-foreground">한 번에 확인하세요.</span>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-md mx-auto" data-testid="text-subheadline">
              YouTube 링크를 입력하면 딥러닝 기반 탐지 엔진이
              <br className="hidden sm:block" />
              AI 생성 가능성을 분석해 드립니다.
            </p>

            <motion.div
              className="flex flex-wrap items-center justify-center gap-3 pt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              data-testid="list-features"
            >
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary"
                  data-testid={`badge-feature-${index}`}
                >
                  <feature.icon className="h-3.5 w-3.5" />
                  {feature.text}
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="spotlight"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="input-card-glow rounded-2xl p-6 md:p-8" data-testid="card-input">
              <form onSubmit={handleSubmit} className="space-y-5" data-testid="form-analyze">
                <div className="space-y-3">
                  <label
                    htmlFor="youtube-url"
                    className="text-sm font-medium text-muted-foreground"
                    data-testid="label-url"
                  >
                    YouTube 링크를 입력하세요
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
                      data-testid="input-youtube-url"
                    />
                  </div>
                  {showValidation && (
                    <p className="text-sm text-destructive flex items-center gap-1.5" data-testid="text-validation-error">
                      <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                      올바른 YouTube URL을 입력해 주세요
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 text-base font-semibold gradient-primary border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={!url.trim() || showValidation}
                  data-testid="button-analyze"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  분석하기
                </Button>
              </form>
            </div>
          </motion.div>
        </div>

        <footer className="absolute bottom-0 left-0 right-0 py-6 text-center" data-testid="container-footer">
          <p className="text-xs text-muted-foreground/60" data-testid="text-disclaimer">
            This tool is for reference only. Final judgment is at the user's discretion.
          </p>
        </footer>
      </main>
    </div>
  );
}
