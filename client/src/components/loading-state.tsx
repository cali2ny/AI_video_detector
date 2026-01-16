import { motion } from "framer-motion";
import { Scan, Cpu, BarChart3, Brain } from "lucide-react";
import { SkeletonCard } from "@/components/ui/skeleton-card";

export function LoadingState() {
  const steps = [
    { icon: Scan, text: "영상 썸네일 가져오는 중", delay: 0 },
    { icon: Cpu, text: "휴리스틱 분석 실행 중", delay: 0.4 },
    { icon: Brain, text: "딥러닝 탐지 처리 중", delay: 0.8 },
    { icon: BarChart3, text: "신뢰도 점수 계산 중", delay: 1.2 },
  ];

  return (
    <div className="space-y-6" data-testid="container-loading">
      <div className="glass-card rounded-2xl p-8 overflow-hidden" data-testid="card-loading">
        <div className="flex flex-col items-center gap-6">
          <motion.div
            className="relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="w-20 h-20 rounded-full border-4 border-muted"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent" />
            </motion.div>
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Brain className="w-8 h-8 text-primary" />
            </motion.div>
          </motion.div>

          <div className="text-center space-y-2">
            <motion.h3
              className="text-xl font-semibold gradient-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              data-testid="text-loading-title"
            >
              딥러닝 탐지기로 분석 중...
            </motion.h3>
            <motion.p
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              data-testid="text-loading-subtitle"
            >
              보통 5~10초 정도 소요됩니다
            </motion.p>
          </div>

          <div className="w-full max-w-sm space-y-3" data-testid="list-loading-steps">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-4 p-3 rounded-lg bg-muted/30"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: step.delay }}
                data-testid={`item-loading-step-${index}`}
              >
                <motion.div
                  className="flex-shrink-0 w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    delay: step.delay,
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                >
                  <step.icon className="h-4 w-4" />
                </motion.div>
                <div className="flex-1">
                  <span className="text-sm font-medium">{step.text}</span>
                  <motion.div
                    className="h-1 mt-2 rounded-full bg-muted overflow-hidden"
                  >
                    <motion.div
                      className="h-full gradient-primary"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ 
                        delay: step.delay,
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}
