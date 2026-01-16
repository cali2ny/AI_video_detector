import { exec } from "child_process";
import { promisify } from "util";
import type { TemporalSegment, TemporalAnalysis, TemporalAssessment, DetectionLabel } from "@shared/schema";
import { analyzeImageBuffer } from "./image-analysis";

const execAsync = promisify(exec);

interface SegmentRange {
  start: number;
  end: number;
}

export function generateSegments(durationSeconds: number): SegmentRange[] {
  if (durationSeconds < 4) {
    return [{ start: 0, end: durationSeconds }];
  }

  let segmentCount: number;
  if (durationSeconds <= 30) {
    segmentCount = 4;
  } else if (durationSeconds <= 120) {
    segmentCount = 8;
  } else if (durationSeconds <= 300) {
    segmentCount = 12;
  } else {
    segmentCount = 16;
  }

  const segmentDuration = durationSeconds / segmentCount;
  const segments: SegmentRange[] = [];

  for (let i = 0; i < segmentCount; i++) {
    const start = Math.floor(i * segmentDuration);
    const end = i === segmentCount - 1 ? durationSeconds : Math.floor((i + 1) * segmentDuration);
    segments.push({ start, end });
  }

  return segments;
}

async function getVideoStreamUrl(videoId: string): Promise<string | null> {
  try {
    const { stdout } = await execAsync(
      `yt-dlp -f "best[height<=720]" -g "https://www.youtube.com/watch?v=${videoId}"`,
      { timeout: 30000 }
    );
    return stdout.trim().split("\n")[0];
  } catch (error) {
    console.error("Failed to get video stream URL:", error);
    return null;
  }
}

async function extractFrameAtTime(streamUrl: string, timeSeconds: number): Promise<Buffer | null> {
  try {
    const { stdout } = await execAsync(
      `ffmpeg -ss ${timeSeconds} -i "${streamUrl}" -frames:v 1 -f image2pipe -vcodec png -`,
      { 
        timeout: 15000,
        encoding: "buffer",
        maxBuffer: 10 * 1024 * 1024
      }
    );
    return stdout as unknown as Buffer;
  } catch (error) {
    console.error(`Failed to extract frame at ${timeSeconds}s:`, error);
    return null;
  }
}

function getLabel(score: number): DetectionLabel {
  if (score >= 70) return "LIKELY_AI";
  if (score >= 40) return "UNCLEAR";
  return "LIKELY_HUMAN";
}

function determineOverallAssessment(
  segments: TemporalSegment[],
  averageScore: number,
  aiPercentage: number
): TemporalAssessment {
  if (segments.length === 0) return "UNAVAILABLE";
  
  if (averageScore >= 70 || aiPercentage >= 70) {
    return "FULL_AI";
  }
  
  const hasAiSegments = segments.some(s => s.label === "LIKELY_AI");
  if (hasAiSegments) {
    return "PARTIAL_AI";
  }
  
  return "LIKELY_REAL";
}

function generateNotes(segments: TemporalSegment[], assessment: TemporalAssessment): string[] {
  const notes: string[] = [];

  if (assessment === "FULL_AI") {
    notes.push("[시간 분석] 전체 영상에서 AI 생성 특성이 일관되게 감지됨");
  } else if (assessment === "PARTIAL_AI") {
    const aiSegments = segments.filter(s => s.label === "LIKELY_AI");
    const timeRanges = aiSegments.map(s => `${formatTime(s.startSeconds)}~${formatTime(s.endSeconds)}`);
    notes.push(`[시간 분석] 특정 구간에서 AI 생성 의심: ${timeRanges.join(", ")}`);
  }

  for (let i = 1; i < segments.length; i++) {
    const prev = segments[i - 1];
    const curr = segments[i];
    const scoreDelta = Math.abs(curr.score - prev.score);
    
    if (scoreDelta >= 25) {
      const direction = curr.score > prev.score ? "증가" : "감소";
      notes.push(
        `[시간 분석] ${formatTime(prev.endSeconds)} 부근에서 AI 점수 급${direction} (${prev.score}% → ${curr.score}%) - 전환 구간 의심`
      );
    }
  }

  return notes;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export async function performTemporalAnalysis(
  videoId: string,
  durationSeconds: number
): Promise<TemporalAnalysis | null> {
  if (durationSeconds < 4) {
    return null;
  }

  const streamUrl = await getVideoStreamUrl(videoId);
  if (!streamUrl) {
    console.log("Could not get video stream URL, skipping temporal analysis");
    return null;
  }

  const segmentRanges = generateSegments(durationSeconds);
  const segments: TemporalSegment[] = [];

  const concurrencyLimit = 3;
  for (let i = 0; i < segmentRanges.length; i += concurrencyLimit) {
    const batch = segmentRanges.slice(i, i + concurrencyLimit);
    const batchPromises = batch.map(async (range) => {
      const midpoint = Math.floor((range.start + range.end) / 2);
      const frameBuffer = await extractFrameAtTime(streamUrl, midpoint);
      
      if (!frameBuffer || frameBuffer.length === 0) {
        return {
          startSeconds: range.start,
          endSeconds: range.end,
          score: 50,
          label: "UNCLEAR" as DetectionLabel,
        };
      }

      try {
        const result = await analyzeImageBuffer(frameBuffer);
        return {
          startSeconds: range.start,
          endSeconds: range.end,
          score: result.score,
          label: getLabel(result.score),
        };
      } catch (error) {
        console.error(`Failed to analyze frame for segment ${range.start}-${range.end}:`, error);
        return {
          startSeconds: range.start,
          endSeconds: range.end,
          score: 50,
          label: "UNCLEAR" as DetectionLabel,
        };
      }
    });

    const batchResults = await Promise.all(batchPromises);
    segments.push(...batchResults);
  }

  const totalScore = segments.reduce((sum, s) => sum + s.score, 0);
  const averageScore = Math.round(totalScore / segments.length);
  
  const aiSegments = segments.filter(s => s.label === "LIKELY_AI").length;
  const aiSegmentPercentage = Math.round((aiSegments / segments.length) * 100);

  const overallAssessment = determineOverallAssessment(segments, averageScore, aiSegmentPercentage);
  const notes = generateNotes(segments, overallAssessment);

  return {
    segments,
    overallAssessment,
    notes,
    averageScore,
    aiSegmentPercentage,
  };
}
