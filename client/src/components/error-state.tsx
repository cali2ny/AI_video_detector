import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PremiumCard } from "@/components/ui/premium-card";

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
      <PremiumCard variant="bordered" glow="danger" data-testid="card-error">
        <div className="flex flex-col items-center gap-6 py-8 text-center">
          <motion.div
            className="w-20 h-20 rounded-2xl gradient-danger flex items-center justify-center shadow-lg"
            animate={{ 
              rotate: [0, -5, 5, -5, 0],
            }}
            transition={{ duration: 0.5, delay: 0.2 }}
            data-testid="icon-error"
          >
            <AlertTriangle className="h-10 w-10 text-white" />
          </motion.div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold" data-testid="text-error-title">
              Analysis Failed
            </h3>
            <p className="text-muted-foreground max-w-md" data-testid="text-error-message">
              {error}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={onRetry}
              className="gap-2"
              data-testid="button-retry"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            If the problem persists, please check the video URL and try again
          </p>
        </div>
      </PremiumCard>
    </motion.div>
  );
}
