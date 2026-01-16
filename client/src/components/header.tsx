import { Shield, Zap } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header
      className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60"
      data-testid="container-header"
    >
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-3" data-testid="container-logo">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary shadow-md">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <h1
              className="text-lg font-bold tracking-tight"
              data-testid="text-app-title"
            >
              <span className="gradient-text">AI Video Detector</span>
            </h1>
            <p
              className="text-xs text-muted-foreground flex items-center gap-1"
              data-testid="text-app-subtitle"
            >
              <Zap className="h-3 w-3 text-primary" />
              Neural-powered video authenticity analysis
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            System Online
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
