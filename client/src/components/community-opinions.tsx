import { motion } from "framer-motion";
import { MessageCircle, ThumbsUp, Bot, UserCheck, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CommunityAnalysis } from "@shared/schema";

interface CommunityOpinionsProps {
  community?: CommunityAnalysis;
}

export function CommunityOpinions({ community }: CommunityOpinionsProps) {
  const hasData = community && community.totalComments > 0;

  const getSummaryText = () => {
    if (!community || community.totalComments === 0) {
      return "이 영상에 대해 'AI다/아니다'를 언급한 댓글을 찾기 어려웠습니다.";
    }

    const { totalComments, aiVotes, realVotes } = community;

    if (aiVotes > realVotes && aiVotes >= totalComments * 0.3) {
      return `시청자 ${totalComments}명 중 ${aiVotes}명이 이 영상을 AI 생성 영상으로 추정합니다.`;
    }

    if (realVotes > aiVotes && realVotes >= totalComments * 0.3) {
      return `시청자 ${totalComments}명 중 ${realVotes}명이 이 영상을 실제 촬영 영상으로 보고 있습니다.`;
    }

    if (aiVotes === 0 && realVotes === 0) {
      return `수집한 댓글 ${totalComments}개 중 AI 관련 언급은 거의 없습니다.`;
    }

    return `수집한 댓글 ${totalComments}개 중 AI로 본 ${aiVotes}개, 실사로 본 ${realVotes}개입니다.`;
  };

  const getPercentages = () => {
    if (!community || community.totalComments === 0) {
      return { ai: 0, neutral: 100, real: 0 };
    }

    const { totalComments, aiVotes, realVotes, neutralVotes } = community;
    return {
      ai: Math.round((aiVotes / totalComments) * 100),
      neutral: Math.round((neutralVotes / totalComments) * 100),
      real: Math.round((realVotes / totalComments) * 100),
    };
  };

  const percentages = getPercentages();

  return (
    <div className="glass-card rounded-2xl p-6 h-full hover:shadow-xl transition-shadow" data-testid="card-community">
      <div className="flex items-start gap-3 mb-5">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white">
          <MessageCircle className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">시청자 의견</h3>
          <p className="text-sm text-muted-foreground">댓글 기반 분석</p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-5" data-testid="text-community-summary">
        {getSummaryText()}
      </p>

      {hasData ? (
        <>
          <div className="mb-6" data-testid="container-vote-bar">
            <div className="flex h-3 rounded-full overflow-hidden bg-muted/30 mb-3">
              {percentages.ai > 0 && (
                <motion.div
                  className="bg-gradient-to-r from-red-500 to-rose-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${percentages.ai}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  data-testid="bar-ai"
                />
              )}
              {percentages.neutral > 0 && (
                <motion.div
                  className="bg-muted"
                  initial={{ width: 0 }}
                  animate={{ width: `${percentages.neutral}%` }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  data-testid="bar-neutral"
                />
              )}
              {percentages.real > 0 && (
                <motion.div
                  className="bg-gradient-to-r from-emerald-400 to-green-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${percentages.real}%` }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  data-testid="bar-real"
                />
              )}
            </div>

            <div className="flex justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                AI로 본 댓글 {percentages.ai}%
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-muted" />
                중립 {percentages.neutral}%
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                실사로 본 댓글 {percentages.real}%
              </span>
            </div>
          </div>

          <div className="space-y-3" data-testid="list-top-comments">
            {community!.topAiComments.slice(0, 2).map((comment, index) => (
              <CommentCard
                key={`ai-${index}`}
                comment={comment}
                type="ai"
                index={index}
              />
            ))}
            {community!.topRealComments.slice(0, 2).map((comment, index) => (
              <CommentCard
                key={`real-${index}`}
                comment={comment}
                type="real"
                index={index + community!.topAiComments.length}
              />
            ))}
            {community!.topAiComments.length === 0 && community!.topRealComments.length === 0 && (
              <div className="text-center py-4 text-sm text-muted-foreground">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                AI 관련 댓글이 발견되지 않았습니다.
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center" data-testid="container-no-comments">
          <MessageSquare className="h-12 w-12 text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground">
            댓글 데이터를 분석할 수 없습니다.
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            YouTube API 키가 필요하거나 댓글이 비활성화된 영상입니다.
          </p>
        </div>
      )}
    </div>
  );
}

interface CommentCardProps {
  comment: { author: string; text: string; likeCount: number };
  type: "ai" | "real";
  index: number;
}

function CommentCard({ comment, type, index }: CommentCardProps) {
  const isAi = type === "ai";

  return (
    <motion.div
      className={`p-3 rounded-xl border transition-all cursor-default ${
        isAi
          ? "bg-red-500/5 border-red-500/10 hover:bg-red-500/10 hover:border-red-500/20"
          : "bg-emerald-500/5 border-emerald-500/10 hover:bg-emerald-500/10 hover:border-emerald-500/20"
      } hover:shadow-md`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.1 }}
      data-testid={`card-comment-${type}-${index}`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className={`text-xs ${
              isAi
                ? "bg-red-500/20 text-red-500 border-red-500/30"
                : "bg-emerald-500/20 text-emerald-500 border-emerald-500/30"
            }`}
          >
            {isAi ? <Bot className="h-3 w-3 mr-1" /> : <UserCheck className="h-3 w-3 mr-1" />}
            {isAi ? "AI 의심" : "실사로 봄"}
          </Badge>
          <span className="text-xs text-muted-foreground truncate max-w-[100px]">
            {comment.author}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <ThumbsUp className="h-3 w-3" />
          {comment.likeCount}
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
        {comment.text}
      </p>
    </motion.div>
  );
}
