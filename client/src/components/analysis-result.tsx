import { motion } from "framer-motion";
import {
  FileSearch,
  Lightbulb,
  Clock,
  Cpu,
  ChevronRight,
  ExternalLink,
  Play,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScoreGauge } from "./score-gauge";
import { CommunityOpinions } from "./community-opinions";
import type { AnalyzeVideoResponse } from "@shared/schema";

interface AnalysisResultProps {
  result: AnalyzeVideoResponse;
}

const CATEGORY_TAGS: Record<string, string> = {
  "밝기": "밝기 패턴",
  "색상": "색상 패턴",
  "색": "색상 패턴",
  "엣지": "텍스처",
  "텍스처": "텍스처",
  "노이즈": "노이즈",
  "고주파": "주파수 분석",
  "딥러닝": "딥러닝 결과",
  "외부": "딥러닝 결과",
  "커뮤니티": "시청자 의견",
};

function getCategoryTag(reason: string): string {
  for (const [keyword, tag] of Object.entries(CATEGORY_TAGS)) {
    if (reason.includes(keyword)) {
      return tag;
    }
  }
  return "분석 지표";
}

export function AnalysisResult({ result }: AnalysisResultProps) {
  const { score, label, reasons, tips, meta, debug, community } = result;

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

  const getLabelText = () => {
    switch (label) {
      case "LIKELY_AI":
        return "이 영상은 AI가 생성했을 가능성이 높습니다.";
      case "UNCLEAR":
        return "이 영상의 AI 생성 여부를 판단하기 어렵습니다.";
      case "LIKELY_HUMAN":
        return "이 영상은 실제 촬영 영상일 가능성이 높습니다.";
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return null;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const youtubeUrl = `https://www.youtube.com/watch?v=${meta.videoId}`;

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
            <div className="flex-shrink-0 flex flex-col items-center gap-3">
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative group cursor-pointer"
                data-testid="link-youtube"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-xl opacity-30 blur group-hover:opacity-50 transition-opacity" />
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={meta.thumbnailUrl}
                    alt="Video thumbnail"
                    className="w-64 h-36 object-cover border-2 border-card-border transition-transform duration-300 group-hover:scale-105"
                    data-testid="img-thumbnail"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                      <Play className="h-6 w-6 text-black ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-1 px-2 py-1 rounded bg-black/70 text-white text-xs">
                      <ExternalLink className="h-3 w-3" />
                      영상 열기
                    </div>
                  </div>
                </div>
              </a>
              <p className="text-xs text-muted-foreground text-center">
                분석 대상 영상 썸네일
                {meta.durationSeconds && ` · ${formatDuration(meta.durationSeconds)}`}
                {meta.channelTitle && ` · @${meta.channelTitle}`}
              </p>
            </div>
            
            <div className="flex-1 flex flex-col items-center">
              <ScoreGauge score={score} label={label} />
              <p className="text-sm text-muted-foreground mt-4 text-center max-w-sm">
                {getLabelText()}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3">
        <motion.div variants={itemVariants}>
          <div className="glass-card rounded-2xl p-6 h-full hover:shadow-xl transition-shadow" data-testid="card-reasons">
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
              {reasons.map((reason, index) => {
                const tag = getCategoryTag(reason);
                return (
                  <motion.li
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    data-testid={`text-reason-${index}`}
                  >
                    <span className="flex-shrink-0 w-6 h-6 rounded-full gradient-primary text-white flex items-center justify-center text-xs font-bold mt-0.5">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <Badge variant="secondary" className="text-xs mb-1.5">
                        {tag}
                      </Badge>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {reason.replace(/^\[[^\]]+\]\s*/, '')}
                      </p>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <CommunityOpinions community={community} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className="glass-card rounded-2xl p-6 h-full hover:shadow-xl transition-shadow" data-testid="card-tips">
            <div className="flex items-start gap-3 mb-5">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white">
                <Lightbulb className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">확인 팁</h3>
                <p className="text-sm text-muted-foreground">추천 다음 단계</p>
              </div>
            </div>
            <ul className="space-y-2" data-testid="list-tips">
              {tips.map((tip, index) => (
                <motion.li
                  key={index}
                  className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/5 hover:bg-amber-500/10 transition-colors border border-amber-500/10 hover:border-amber-500/20 cursor-default"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  data-testid={`text-tip-${index}`}
                >
                  <ChevronRight className="flex-shrink-0 w-4 h-4 text-amber-500 mt-0.5" />
                  <span className="text-xs text-muted-foreground leading-relaxed">
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
              {debug && (
                <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1" data-testid="badge-debug">
                  휴리스틱: {debug.heuristicScore}%
                  {debug.externalApiScore !== null && ` / 외부 API: ${debug.externalApiScore}%`}
                  {debug.communityAdjustment !== 0 && ` / 커뮤니티: ${debug.communityAdjustment > 0 ? '+' : ''}${debug.communityAdjustment}`}
                </Badge>
              )}
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
