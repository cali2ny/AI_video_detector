import { motion } from "framer-motion";
import { Loader2, Scan, Cpu, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function LoadingState() {
  const steps = [
    { icon: Scan, text: "썸네일 수집 중", delay: 0 },
    { icon: Cpu, text: "프레임 분석 중", delay: 0.5 },
    { icon: BarChart3, text: "점수 계산 중", delay: 1 },
  ];

  return (
    <Card data-testid="card-loading">
      <CardContent className="py-12">
        <div className="flex flex-col items-center gap-6">
          <motion.div
            className="relative w-20 h-20"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            data-testid="spinner-loading"
          >
            <div className="absolute inset-0 rounded-full border-4 border-muted" />
            <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent" />
          </motion.div>

          <div className="text-center">
            <h3 className="text-lg font-medium mb-2" data-testid="text-loading-title">영상 분석 중...</h3>
            <p className="text-sm text-muted-foreground" data-testid="text-loading-subtitle">
              AI 생성 여부를 확인하고 있습니다
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full max-w-xs" data-testid="list-loading-steps">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-3 p-3 rounded-md bg-muted/50"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: step.delay }}
                data-testid={`item-loading-step-${index}`}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    delay: step.delay + 0.3,
                    duration: 0.5,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                >
                  <step.icon className="h-4 w-4 text-primary" />
                </motion.div>
                <span className="text-sm">{step.text}</span>
                <Loader2 className="ml-auto h-4 w-4 animate-spin text-muted-foreground" />
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
