import { motion } from "framer-motion";
import { Bot, HelpCircle, UserCheck } from "lucide-react";
import type { DetectionLabel } from "@shared/schema";

interface ScoreGaugeProps {
  score: number;
  label: DetectionLabel;
}

export function ScoreGauge({ score, label }: ScoreGaugeProps) {
  const getColor = () => {
    if (score >= 70) return "text-destructive";
    if (score >= 40) return "text-yellow-500";
    return "text-green-500";
  };

  const getBgColor = () => {
    if (score >= 70) return "bg-destructive/10";
    if (score >= 40) return "bg-yellow-500/10";
    return "bg-green-500/10";
  };

  const getLabelText = () => {
    switch (label) {
      case "LIKELY_AI":
        return "AI 생성 가능성 높음";
      case "UNCLEAR":
        return "판단 불확실";
      case "LIKELY_HUMAN":
        return "실제 영상 가능성 높음";
    }
  };

  const getLabelIcon = () => {
    switch (label) {
      case "LIKELY_AI":
        return <Bot className="h-4 w-4" />;
      case "UNCLEAR":
        return <HelpCircle className="h-4 w-4" />;
      case "LIKELY_HUMAN":
        return <UserCheck className="h-4 w-4" />;
    }
  };

  const rotation = (score / 100) * 180;

  return (
    <div className="flex flex-col items-center gap-4" data-testid="container-score-gauge">
      <div className="relative w-48 h-24 overflow-hidden">
        <div className="absolute inset-0 rounded-t-full score-gauge opacity-20" />
        
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 50"
          preserveAspectRatio="xMidYMax meet"
        >
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(142, 71%, 45%)" />
              <stop offset="50%" stopColor="hsl(38, 92%, 50%)" />
              <stop offset="100%" stopColor="hsl(0, 84%, 60%)" />
            </linearGradient>
          </defs>
          
          <path
            d="M 5 50 A 45 45 0 0 1 95 50"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="8"
            strokeLinecap="round"
          />
          
          <motion.path
            d="M 5 50 A 45 45 0 0 1 95 50"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: score / 100 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>

        <motion.div
          className="absolute bottom-0 left-1/2 origin-bottom"
          style={{ width: 4, height: 40 }}
          initial={{ rotate: -90 }}
          animate={{ rotate: rotation - 90 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="w-1 h-full bg-foreground rounded-full mx-auto" />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-foreground" />
        </motion.div>
      </div>

      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className={`text-5xl font-bold ${getColor()}`} data-testid="text-score-value">
          {score}
          <span className="text-2xl">%</span>
        </div>
        <div
          className={`mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getBgColor()} ${getColor()}`}
          data-testid="badge-score-label"
        >
          {getLabelIcon()}
          {getLabelText()}
        </div>
      </motion.div>
    </div>
  );
}
