import { Shield, Sparkles } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" data-testid="container-header">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-3" data-testid="container-logo">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Shield className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold tracking-tight" data-testid="text-app-title">
              AI Video Detector
            </h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1" data-testid="text-app-subtitle">
              <Sparkles className="h-3 w-3" />
              YouTube 영상 AI 생성 여부 분석
            </p>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
