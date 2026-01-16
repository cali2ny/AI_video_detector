import { motion } from "framer-motion";
import {
  FileSearch,
  Lightbulb,
  Clock,
  Cpu,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScoreGauge } from "./score-gauge";
import type { AnalyzeVideoResponse } from "@shared/schema";

interface AnalysisResultProps {
  result: AnalyzeVideoResponse;
}

export function AnalysisResult({ result }: AnalysisResultProps) {
  const { score, label, reasons, tips, meta } = result;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const getGlow = () => {
    if (score >= 70) return "glow-danger";
    if (score >= 40) return "glow-warning";
    return "glow-success";
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      data-testid="container-analysis-result"
    >
      <motion.div variants={itemVariants}>
        <div className={`glass-card rounded-2xl p-6 md:p-8 ${getGlow()}`} data-testid="card-main-result">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-shrink-0 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-xl opacity-30 blur group-hover:opacity-50 transition-opacity" />
              <img
                src={meta.thumbnailUrl}
                alt="Video thumbnail"
                className="relative w-64 h-36 object-cover rounded-lg border-2 border-card-border"
                data-testid="img-thumbnail"
              />
            </div>
            <div className="flex-1 flex flex-col items-center lg:items-start">
              <ScoreGauge score={score} label={label} />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div variants={itemVariants}>
          <div className="glass-card rounded-2xl p-6 h-full" data-testid="card-reasons">
            <div className="flex items-start gap-3 mb-5">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg gradient-primary flex items-center justify-center text-white">
                <FileSearch className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">분석 근거</h3>
                <p className="text-sm text-muted-foreground">탐지된 주요 지표</p>
              </div>
            </div>
            <ul className="space-y-3" data-testid="list-reasons">
              {reasons.map((reason, index) => (
                <motion.li
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  data-testid={`text-reason-${index}`}
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-full gradient-primary text-white flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    {reason}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className="glass-card rounded-2xl p-6 h-full" data-testid="card-tips">
            <div className="flex items-start gap-3 mb-5">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white">
                <Lightbulb className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">확인 팁</h3>
                <p className="text-sm text-muted-foreground">추천 다음 단계</p>
              </div>
            </div>
            <ul className="space-y-3" data-testid="list-tips">
              {tips.map((tip, index) => (
                <motion.li
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/5 hover:bg-amber-500/10 transition-colors border border-amber-500/10"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  data-testid={`text-tip-${index}`}
                >
                  <ChevronRight className="flex-shrink-0 w-4 h-4 text-amber-500 mt-0.5" />
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    {tip}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <div className="glass-card rounded-2xl p-5" data-testid="card-meta">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">분석 메타데이터</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="flex items-center gap-1.5 px-3 py-1" data-testid="badge-source">
                <div className="w-2 h-2 rounded-full gradient-primary" />
                {meta.source === "heuristic_only"
                  ? "휴리스틱 분석만"
                  : "휴리스틱 + 딥러닝 API"}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1.5 px-3 py-1" data-testid="badge-timestamp">
                <Clock className="h-3 w-3" />
                {new Date(meta.analyzedAt).toLocaleString("ko-KR", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </Badge>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
