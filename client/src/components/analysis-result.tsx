import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  FileText,
  Image,
  Clock,
  Cpu,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
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
        <Card data-testid="card-main-result">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <img
                  src={meta.thumbnailUrl}
                  alt="Video thumbnail"
                  className="w-64 h-36 object-cover rounded-md border"
                  data-testid="img-thumbnail"
                />
              </div>
              <div className="flex-1 flex flex-col items-center lg:items-start">
                <ScoreGauge score={score} label={label} />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div variants={itemVariants}>
          <Card className="h-full" data-testid="card-reasons">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4 text-primary" />
                분석 근거
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2" data-testid="list-reasons">
                {reasons.map((reason, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                    data-testid={`text-reason-${index}`}
                  >
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </span>
                    {reason}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full" data-testid="card-tips">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                확인 팁
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2" data-testid="list-tips">
                {tips.map((tip, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                    data-testid={`text-tip-${index}`}
                  >
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-500/10 text-yellow-500 flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <Card data-testid="card-meta">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Cpu className="h-4 w-4 text-muted-foreground" />
              분석 정보
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="flex items-center gap-1.5" data-testid="badge-source">
                <Image className="h-3 w-3" />
                분석 방식:{" "}
                {meta.source === "heuristic_only"
                  ? "휴리스틱 분석"
                  : "휴리스틱 + 딥러닝 API"}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1.5" data-testid="badge-timestamp">
                <Clock className="h-3 w-3" />
                분석 시간: {new Date(meta.analyzedAt).toLocaleString("ko-KR")}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
