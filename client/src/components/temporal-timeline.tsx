import { motion } from "framer-motion";
import { Timer, AlertTriangle, CheckCircle, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { TemporalAnalysis, TemporalSegment, DetectionLabel } from "@shared/schema";

interface TemporalTimelineProps {
  temporal: TemporalAnalysis;
  durationSeconds?: number;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

function getSegmentColor(label: DetectionLabel): string {
  switch (label) {
    case "LIKELY_AI":
      return "bg-rose-500";
    case "UNCLEAR":
      return "bg-amber-500";
    case "LIKELY_HUMAN":
      return "bg-emerald-500";
  }
}

function getSegmentBorderColor(label: DetectionLabel): string {
  switch (label) {
    case "LIKELY_AI":
      return "border-rose-500/50";
    case "UNCLEAR":
      return "border-amber-500/50";
    case "LIKELY_HUMAN":
      return "border-emerald-500/50";
  }
}

function getAssessmentInfo(assessment: TemporalAnalysis["overallAssessment"]) {
  switch (assessment) {
    case "FULL_AI":
      return {
        icon: AlertTriangle,
        text: "전체 AI 생성 의심",
        color: "text-rose-500",
        bgColor: "bg-rose-500/10",
        borderColor: "border-rose-500/30",
      };
    case "PARTIAL_AI":
      return {
        icon: HelpCircle,
        text: "일부 구간 AI 의심",
        color: "text-amber-500",
        bgColor: "bg-amber-500/10",
        borderColor: "border-amber-500/30",
      };
    case "LIKELY_REAL":
      return {
        icon: CheckCircle,
        text: "실제 영상 가능성 높음",
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-500/30",
      };
    default:
      return {
        icon: HelpCircle,
        text: "분석 불가",
        color: "text-muted-foreground",
        bgColor: "bg-muted/10",
        borderColor: "border-muted/30",
      };
  }
}

export function TemporalTimeline({ temporal, durationSeconds }: TemporalTimelineProps) {
  const { segments, overallAssessment, averageScore, aiSegmentPercentage, status, errorReason } = temporal;
  const assessmentInfo = getAssessmentInfo(overallAssessment);
  const AssessmentIcon = assessmentInfo.icon;
  
  const totalDuration = durationSeconds || (segments.length > 0 ? segments[segments.length - 1].endSeconds : 0);

  if (status === "failed" || segments.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-6 hover:shadow-xl transition-shadow" data-testid="card-temporal-failed">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white">
            <Timer className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">시간대별 분석</h3>
            <p className="text-sm text-muted-foreground">영상 구간별 AI 생성 가능성</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border border-muted/50">
          <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">시간대별 분석을 수행할 수 없습니다</p>
            <p className="text-xs text-muted-foreground mt-1">
              {errorReason || "영상 프레임을 추출할 수 없거나 분석에 실패했습니다. 썸네일 기반 분석 결과를 참고해 주세요."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 hover:shadow-xl transition-shadow" data-testid="card-temporal">
      <div className="flex items-start gap-3 mb-5">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white">
          <Timer className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">시간대별 분석</h3>
          <p className="text-sm text-muted-foreground">영상 구간별 AI 생성 가능성</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${assessmentInfo.bgColor} border ${assessmentInfo.borderColor}`}>
          <AssessmentIcon className={`h-4 w-4 ${assessmentInfo.color}`} />
          <span className={`text-xs font-medium ${assessmentInfo.color}`}>
            {assessmentInfo.text}
          </span>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative h-10 rounded-lg overflow-hidden bg-muted/30" data-testid="timeline-bar">
          {segments.map((segment, index) => {
            const startPercent = (segment.startSeconds / totalDuration) * 100;
            const widthPercent = ((segment.endSeconds - segment.startSeconds) / totalDuration) * 100;
            
            return (
              <motion.div
                key={index}
                className={`absolute top-0 h-full ${getSegmentColor(segment.label)} flex items-center justify-center text-[10px] font-bold text-white cursor-pointer hover:opacity-90 transition-opacity`}
                style={{
                  left: `${startPercent}%`,
                  width: `${widthPercent}%`,
                }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.1 * index, duration: 0.3 }}
                title={`${formatTime(segment.startSeconds)} - ${formatTime(segment.endSeconds)}: ${segment.score}%`}
                data-testid={`segment-${index}`}
              >
                {widthPercent > 8 && `${segment.score}%`}
              </motion.div>
            );
          })}
        </div>
        
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>00:00</span>
          <span>{formatTime(totalDuration)}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="p-3 rounded-xl bg-muted/30 text-center">
          <p className="text-2xl font-bold text-foreground">{averageScore}%</p>
          <p className="text-xs text-muted-foreground">평균 AI 점수</p>
        </div>
        <div className="p-3 rounded-xl bg-muted/30 text-center">
          <p className="text-2xl font-bold text-foreground">{aiSegmentPercentage}%</p>
          <p className="text-xs text-muted-foreground">AI 의심 구간 비율</p>
        </div>
      </div>

      <div className="space-y-2" data-testid="segment-list">
        {segments.map((segment, index) => (
          <motion.div
            key={index}
            className={`flex items-center gap-3 p-2.5 rounded-lg bg-muted/20 border ${getSegmentBorderColor(segment.label)} hover:bg-muted/30 transition-colors`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * index }}
            data-testid={`segment-detail-${index}`}
          >
            <div className={`w-3 h-3 rounded-full ${getSegmentColor(segment.label)}`} />
            <span className="text-xs text-muted-foreground font-mono min-w-[90px]">
              {formatTime(segment.startSeconds)} - {formatTime(segment.endSeconds)}
            </span>
            <div className="flex-1">
              <div className="h-1.5 rounded-full bg-muted/50 overflow-hidden">
                <motion.div
                  className={`h-full ${getSegmentColor(segment.label)}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${segment.score}%` }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                />
              </div>
            </div>
            <Badge 
              variant={segment.label === "LIKELY_AI" ? "destructive" : segment.label === "UNCLEAR" ? "secondary" : "default"}
              className="text-[10px] px-2"
            >
              {segment.score}%
            </Badge>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-rose-500" />
          <span>AI 의심 (70%+)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span>불확실 (40-69%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span>실제 의심 (&lt;40%)</span>
        </div>
      </div>
    </div>
  );
}
