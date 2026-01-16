import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      data-testid="container-error"
    >
      <div className="glass-card rounded-2xl border-2 border-destructive/20 glow-danger p-8" data-testid="card-error">
        <div className="flex flex-col items-center gap-6 text-center">
          <motion.div
            className="w-16 h-16 rounded-2xl gradient-danger flex items-center justify-center shadow-lg"
            animate={{ 
              rotate: [0, -5, 5, -5, 0],
            }}
            transition={{ duration: 0.5, delay: 0.2 }}
            data-testid="icon-error"
          >
            <AlertTriangle className="h-8 w-8 text-white" />
          </motion.div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold" data-testid="text-error-title">
              분석에 실패했습니다
            </h3>
            <p className="text-muted-foreground max-w-md" data-testid="text-error-message">
              {error}
            </p>
          </div>

          <Button
            variant="outline"
            onClick={onRetry}
            className="gap-2"
            data-testid="button-retry"
          >
            <RefreshCw className="h-4 w-4" />
            다시 시도
          </Button>

          <p className="text-xs text-muted-foreground">
            문제가 계속되면 URL을 확인하고 다시 시도해 주세요
          </p>
        </div>
      </div>
    </motion.div>
  );
}
