import type { CommunityAnalysis, CommentItem } from "@shared/schema";

type CommentClass = "AI" | "REAL" | "NEUTRAL";

interface RawComment {
  author: string;
  text: string;
  likeCount: number;
}

const AI_KEYWORDS = [
  "ai", "인공지능", "딥페이크", "deepfake", "fake", "합성", "generated",
  "ai video", "ai로 만든", "ai네", "ai 영상", "ai가 만든", "소라", "sora",
  "runway", "pika", "midjourney", "미드저니", "달리", "dalle",
  "진짜 같네", "실사인 줄", "실사인줄", "사람이 찍은 줄", "사람이 찍은줄",
  "구분 안 되네", "구분안되네", "리얼하다", "진짜 같아서 무섭",
  "실사급", "cgi", "vfx", "가짜", "합성인가", "합성이네"
];

const REAL_KEYWORDS = [
  "실사", "실제 촬영", "진짜 촬영", "직접 찍은", "사람이 찍은거",
  "ai 아님", "ai아님", "이건 ai 아니", "real footage", "this is real",
  "not ai", "shot on", "filmed with", "촬영장", "현장 촬영",
  "실제로 찍은", "진짜야", "진짜임", "찐이야", "찐임"
];

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function classifyComment(text: string): CommentClass {
  const normalized = normalizeText(text);

  for (const keyword of REAL_KEYWORDS) {
    if (normalized.includes(keyword)) {
      return "REAL";
    }
  }

  for (const keyword of AI_KEYWORDS) {
    if (normalized.includes(keyword)) {
      return "AI";
    }
  }

  return "NEUTRAL";
}

function truncateText(text: string, maxLength: number = 120): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "…";
}

export async function fetchAndAnalyzeComments(videoId: string): Promise<CommunityAnalysis | undefined> {
  const apiKey = process.env.YT_API_KEY;

  if (!apiKey) {
    return undefined;
  }

  try {
    const url = `https://www.googleapis.com/youtube/v3/commentThreads?videoId=${videoId}&part=snippet&order=relevance&maxResults=50&key=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.warn("YouTube Comments API request failed:", response.status);
      return undefined;
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return {
        totalComments: 0,
        aiVotes: 0,
        realVotes: 0,
        neutralVotes: 0,
        topAiComments: [],
        topRealComments: [],
      };
    }

    const comments: RawComment[] = data.items.map((item: any) => {
      const snippet = item.snippet?.topLevelComment?.snippet || {};
      return {
        author: snippet.authorDisplayName || "익명",
        text: snippet.textDisplay || "",
        likeCount: snippet.likeCount || 0,
      };
    });

    const classified = comments.map(comment => ({
      ...comment,
      classification: classifyComment(comment.text),
    }));

    const aiComments = classified.filter(c => c.classification === "AI");
    const realComments = classified.filter(c => c.classification === "REAL");
    const neutralComments = classified.filter(c => c.classification === "NEUTRAL");

    const topAiComments: CommentItem[] = aiComments
      .sort((a, b) => b.likeCount - a.likeCount)
      .slice(0, 3)
      .map(c => ({
        author: c.author,
        text: truncateText(c.text),
        likeCount: c.likeCount,
      }));

    const topRealComments: CommentItem[] = realComments
      .sort((a, b) => b.likeCount - a.likeCount)
      .slice(0, 3)
      .map(c => ({
        author: c.author,
        text: truncateText(c.text),
        likeCount: c.likeCount,
      }));

    return {
      totalComments: classified.length,
      aiVotes: aiComments.length,
      realVotes: realComments.length,
      neutralVotes: neutralComments.length,
      topAiComments,
      topRealComments,
    };
  } catch (error) {
    console.warn("Error fetching YouTube comments:", error);
    return undefined;
  }
}

export function calculateCommunityAdjustment(community: CommunityAnalysis | undefined): { adjustment: number; reason: string | null } {
  if (!community || community.totalComments < 5) {
    return { adjustment: 0, reason: null };
  }

  const { totalComments, aiVotes } = community;
  const aiRatio = aiVotes / totalComments;

  if (totalComments >= 10 && aiRatio >= 0.3) {
    return {
      adjustment: 10,
      reason: "[커뮤니티] 시청자 댓글 중 상당수가 이 영상을 AI 생성 영상으로 추정하고 있습니다.",
    };
  }

  if (totalComments >= 10 && (aiVotes === 0 || aiRatio <= 0.05)) {
    return {
      adjustment: -5,
      reason: "[커뮤니티] 시청자 댓글에서 AI나 합성에 대한 언급이 거의 발견되지 않습니다.",
    };
  }

  return { adjustment: 0, reason: null };
}
