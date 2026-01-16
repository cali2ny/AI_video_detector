import { motion } from "framer-motion";
import { Bot, HelpCircle, UserCheck } from "lucide-react";
import type { DetectionLabel } from "@shared/schema";

interface ScoreGaugeProps {
  score: number;
  label: DetectionLabel;
}

export function ScoreGauge({ score, label }: ScoreGaugeProps) {
  const getGradient = () => {
    if (score >= 70) return "from-red-500 to-rose-600";
    if (score >= 40) return "from-amber-400 to-orange-500";
    return "from-emerald-400 to-green-500";
  };

  const getGlow = () => {
    if (score >= 70) return "glow-danger";
    if (score >= 40) return "glow-warning";
    return "glow-success";
  };

  const getBgColor = () => {
    if (score >= 70) return "bg-red-500/10 text-red-500 border-red-500/20";
    if (score >= 40) return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
  };

  const getLabelText = () => {
    switch (label) {
      case "LIKELY_AI":
        return "High AI Probability";
      case "UNCLEAR":
        return "Uncertain Result";
      case "LIKELY_HUMAN":
        return "Likely Authentic";
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

  const circumference = 2 * Math.PI * 45;
  const progress = (score / 100) * circumference * 0.75;

  return (
    <div className="flex flex-col items-center gap-6" data-testid="container-score-gauge">
      <div className="relative">
        <svg
          className="w-56 h-56 -rotate-[135deg]"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
          />
          
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(142, 71%, 45%)" />
              <stop offset="50%" stopColor="hsl(38, 92%, 50%)" />
              <stop offset="100%" stopColor="hsl(0, 84%, 60%)" />
            </linearGradient>
          </defs>
          
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
            initial={{ strokeDashoffset: circumference * 0.75 }}
            animate={{ strokeDashoffset: circumference * 0.75 - progress }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <span
            className={`text-6xl font-bold bg-gradient-to-r ${getGradient()} bg-clip-text text-transparent`}
            data-testid="text-score-value"
          >
            {score}
          </span>
          <span className="text-lg text-muted-foreground font-medium">percent</span>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-semibold ${getBgColor()} ${getGlow()}`}
        data-testid="badge-score-label"
      >
        {getLabelIcon()}
        {getLabelText()}
      </motion.div>
    </div>
  );
}
