import { motion } from "framer-motion";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
      <Card className="border-destructive/50" data-testid="card-error">
        <CardContent className="py-12">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center" data-testid="icon-error">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2" data-testid="text-error-title">분석에 실패했습니다</h3>
              <p className="text-sm text-muted-foreground max-w-md" data-testid="text-error-message">{error}</p>
            </div>
            <Button variant="outline" onClick={onRetry} className="mt-2" data-testid="button-retry">
              <RefreshCw className="mr-2 h-4 w-4" />
              다시 시도
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
