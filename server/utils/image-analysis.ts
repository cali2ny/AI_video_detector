import sharp from "sharp";
import type { HeuristicResult } from "@shared/schema";

interface ImageStats {
  width: number;
  height: number;
  channels: number;
  pixels: Buffer;
}

async function fetchAndDecodeImage(url: string): Promise<ImageStats> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.status}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return decodeImageBuffer(buffer);
}

async function decodeImageBuffer(buffer: Buffer): Promise<ImageStats> {
  const image = sharp(buffer);
  const metadata = await image.metadata();
  const rawPixels = await image.raw().toBuffer();

  return {
    width: metadata.width || 320,
    height: metadata.height || 180,
    channels: metadata.channels || 3,
    pixels: rawPixels,
  };
}

function getPixel(stats: ImageStats, x: number, y: number): { r: number; g: number; b: number } {
  const idx = (y * stats.width + x) * stats.channels;
  return {
    r: stats.pixels[idx] || 0,
    g: stats.pixels[idx + 1] || 0,
    b: stats.pixels[idx + 2] || 0,
  };
}

function calculateBrightnessUniformity(stats: ImageStats): number {
  const sampleCount = Math.min(5000, stats.width * stats.height);
  const step = Math.floor((stats.width * stats.height) / sampleCount);
  
  const brightnesses: number[] = [];
  for (let i = 0; i < stats.width * stats.height; i += step) {
    const x = i % stats.width;
    const y = Math.floor(i / stats.width);
    const p = getPixel(stats, x, y);
    brightnesses.push((p.r + p.g + p.b) / 3);
  }

  const mean = brightnesses.reduce((a, b) => a + b, 0) / brightnesses.length;
  const variance = brightnesses.reduce((sum, b) => sum + Math.pow(b - mean, 2), 0) / brightnesses.length;
  const stdDev = Math.sqrt(variance);

  return Math.max(0, Math.min(1, 1 - stdDev / 80));
}

function calculateColorSaturation(stats: ImageStats): number {
  const sampleCount = Math.min(3000, stats.width * stats.height);
  const step = Math.floor((stats.width * stats.height) / sampleCount);
  
  let totalSaturation = 0;
  let count = 0;

  for (let i = 0; i < stats.width * stats.height; i += step) {
    const x = i % stats.width;
    const y = Math.floor(i / stats.width);
    const p = getPixel(stats, x, y);
    
    const max = Math.max(p.r, p.g, p.b);
    const min = Math.min(p.r, p.g, p.b);
    const saturation = max === 0 ? 0 : (max - min) / max;
    
    totalSaturation += saturation;
    count++;
  }

  return totalSaturation / count;
}

function calculateColorBanding(stats: ImageStats): number {
  const bandingScore = [];
  const sampleRows = Math.min(50, stats.height);
  const rowStep = Math.floor(stats.height / sampleRows);

  for (let row = 0; row < stats.height; row += rowStep) {
    let gradientChanges = 0;
    let prevDiff = 0;

    for (let x = 1; x < stats.width - 1; x++) {
      const p1 = getPixel(stats, x - 1, row);
      const p2 = getPixel(stats, x, row);
      const p3 = getPixel(stats, x + 1, row);

      const diff1 = ((p2.r - p1.r) + (p2.g - p1.g) + (p2.b - p1.b)) / 3;
      const diff2 = ((p3.r - p2.r) + (p3.g - p2.g) + (p3.b - p2.b)) / 3;

      if (Math.abs(diff1) < 3 && Math.abs(diff2) < 3 && Math.abs(diff1 - diff2) < 1) {
        gradientChanges++;
      }
      prevDiff = diff1;
    }

    bandingScore.push(gradientChanges / stats.width);
  }

  return bandingScore.reduce((a, b) => a + b, 0) / bandingScore.length;
}

function calculateTextureRepetition(stats: ImageStats): number {
  const blockSize = 16;
  const blocksX = Math.floor(stats.width / blockSize);
  const blocksY = Math.floor(stats.height / blockSize);
  
  if (blocksX < 3 || blocksY < 3) return 0;

  const blockSignatures: number[][] = [];

  for (let by = 0; by < Math.min(blocksY, 10); by++) {
    for (let bx = 0; bx < Math.min(blocksX, 10); bx++) {
      const signature: number[] = [];
      for (let dy = 0; dy < blockSize; dy += 4) {
        for (let dx = 0; dx < blockSize; dx += 4) {
          const x = bx * blockSize + dx;
          const y = by * blockSize + dy;
          if (x < stats.width && y < stats.height) {
            const p = getPixel(stats, x, y);
            signature.push(Math.floor((p.r + p.g + p.b) / 30));
          }
        }
      }
      blockSignatures.push(signature);
    }
  }

  let similarPairs = 0;
  for (let i = 0; i < blockSignatures.length; i++) {
    for (let j = i + 1; j < blockSignatures.length; j++) {
      const sig1 = blockSignatures[i];
      const sig2 = blockSignatures[j];
      if (sig1.length === sig2.length && sig1.length > 0) {
        let matches = 0;
        for (let k = 0; k < sig1.length; k++) {
          if (Math.abs(sig1[k] - sig2[k]) <= 1) matches++;
        }
        if (matches / sig1.length > 0.8) similarPairs++;
      }
    }
  }

  const totalPairs = (blockSignatures.length * (blockSignatures.length - 1)) / 2;
  return totalPairs > 0 ? similarPairs / totalPairs : 0;
}

function calculateSmoothness(stats: ImageStats): number {
  const sampleSize = Math.min(2000, stats.width * stats.height);
  const step = Math.floor((stats.width * stats.height) / sampleSize);
  
  let smoothPixels = 0;
  let totalChecked = 0;

  for (let i = step; i < stats.width * stats.height - step; i += step) {
    const x = i % stats.width;
    const y = Math.floor(i / stats.width);
    
    if (x > 0 && x < stats.width - 1 && y > 0 && y < stats.height - 1) {
      const center = getPixel(stats, x, y);
      const neighbors = [
        getPixel(stats, x - 1, y),
        getPixel(stats, x + 1, y),
        getPixel(stats, x, y - 1),
        getPixel(stats, x, y + 1),
      ];

      let totalDiff = 0;
      for (const n of neighbors) {
        totalDiff += Math.abs(center.r - n.r) + Math.abs(center.g - n.g) + Math.abs(center.b - n.b);
      }
      
      const avgDiff = totalDiff / (neighbors.length * 3);
      if (avgDiff < 5) smoothPixels++;
      totalChecked++;
    }
  }

  return totalChecked > 0 ? smoothPixels / totalChecked : 0;
}

function calculateEdgeSharpness(stats: ImageStats): number {
  const sampleRows = Math.min(30, stats.height);
  const rowStep = Math.floor(stats.height / sampleRows);
  
  let sharpEdges = 0;
  let totalEdges = 0;

  for (let row = 1; row < stats.height - 1; row += rowStep) {
    for (let x = 1; x < stats.width - 1; x += 3) {
      const center = getPixel(stats, x, row);
      const left = getPixel(stats, x - 1, row);
      const right = getPixel(stats, x + 1, row);

      const diffLeft = Math.abs(center.r - left.r) + Math.abs(center.g - left.g) + Math.abs(center.b - left.b);
      const diffRight = Math.abs(center.r - right.r) + Math.abs(center.g - right.g) + Math.abs(center.b - right.b);

      if (diffLeft > 30 || diffRight > 30) {
        totalEdges++;
        if (diffLeft > 80 || diffRight > 80) {
          sharpEdges++;
        }
      }
    }
  }

  return totalEdges > 0 ? sharpEdges / totalEdges : 0;
}

function calculateNoiseLevel(stats: ImageStats): number {
  const sampleSize = Math.min(1500, stats.width * stats.height);
  const step = Math.floor((stats.width * stats.height) / sampleSize);
  
  let noiseSum = 0;
  let count = 0;

  for (let i = step; i < stats.width * stats.height - step; i += step) {
    const x = i % stats.width;
    const y = Math.floor(i / stats.width);
    
    if (x > 1 && x < stats.width - 2 && y > 1 && y < stats.height - 2) {
      const center = getPixel(stats, x, y);
      const neighbors = [
        getPixel(stats, x - 1, y - 1), getPixel(stats, x, y - 1), getPixel(stats, x + 1, y - 1),
        getPixel(stats, x - 1, y), getPixel(stats, x + 1, y),
        getPixel(stats, x - 1, y + 1), getPixel(stats, x, y + 1), getPixel(stats, x + 1, y + 1),
      ];

      const avgR = neighbors.reduce((s, n) => s + n.r, 0) / 8;
      const avgG = neighbors.reduce((s, n) => s + n.g, 0) / 8;
      const avgB = neighbors.reduce((s, n) => s + n.b, 0) / 8;

      const noise = Math.abs(center.r - avgR) + Math.abs(center.g - avgG) + Math.abs(center.b - avgB);
      noiseSum += noise;
      count++;
    }
  }

  const avgNoise = count > 0 ? noiseSum / count : 0;
  return Math.min(avgNoise / 30, 1);
}

function calculateContrastVariance(stats: ImageStats): number {
  const regions: number[] = [];
  const regionSize = Math.floor(Math.min(stats.width, stats.height) / 4);
  
  for (let ry = 0; ry < 4; ry++) {
    for (let rx = 0; rx < 4; rx++) {
      let min = 255, max = 0;
      const startX = rx * regionSize;
      const startY = ry * regionSize;
      
      for (let dy = 0; dy < regionSize; dy += 4) {
        for (let dx = 0; dx < regionSize; dx += 4) {
          const x = Math.min(startX + dx, stats.width - 1);
          const y = Math.min(startY + dy, stats.height - 1);
          const p = getPixel(stats, x, y);
          const brightness = (p.r + p.g + p.b) / 3;
          min = Math.min(min, brightness);
          max = Math.max(max, brightness);
        }
      }
      
      regions.push(max - min);
    }
  }

  const mean = regions.reduce((a, b) => a + b, 0) / regions.length;
  const variance = regions.reduce((sum, c) => sum + Math.pow(c - mean, 2), 0) / regions.length;
  
  return Math.sqrt(variance) / 128;
}

function calculateColorTemperatureConsistency(stats: ImageStats): number {
  const regions: { warmth: number }[] = [];
  const regionSize = Math.floor(Math.min(stats.width, stats.height) / 3);

  for (let ry = 0; ry < 3; ry++) {
    for (let rx = 0; rx < 3; rx++) {
      let totalR = 0, totalB = 0, count = 0;
      const startX = rx * regionSize;
      const startY = ry * regionSize;

      for (let dy = 0; dy < regionSize; dy += 4) {
        for (let dx = 0; dx < regionSize; dx += 4) {
          const x = Math.min(startX + dx, stats.width - 1);
          const y = Math.min(startY + dy, stats.height - 1);
          const p = getPixel(stats, x, y);
          totalR += p.r;
          totalB += p.b;
          count++;
        }
      }

      const warmth = count > 0 ? (totalR - totalB) / count : 0;
      regions.push({ warmth });
    }
  }

  const meanWarmth = regions.reduce((s, r) => s + r.warmth, 0) / regions.length;
  const variance = regions.reduce((s, r) => s + Math.pow(r.warmth - meanWarmth, 2), 0) / regions.length;

  return 1 - Math.min(Math.sqrt(variance) / 50, 1);
}

async function analyzeStats(stats: ImageStats): Promise<HeuristicResult> {
  const brightnessUniformity = calculateBrightnessUniformity(stats);
  const colorSaturation = calculateColorSaturation(stats);
  const colorBanding = calculateColorBanding(stats);
  const textureRepetition = calculateTextureRepetition(stats);
  const smoothness = calculateSmoothness(stats);
  const edgeSharpness = calculateEdgeSharpness(stats);
  const noiseLevel = calculateNoiseLevel(stats);
  const contrastVariance = calculateContrastVariance(stats);
  const colorTempConsistency = calculateColorTemperatureConsistency(stats);

  const reasons: string[] = [];
  let score = 0;

    if (brightnessUniformity > 0.7) {
      score += 18;
      reasons.push("[밝기 패턴] 밝기 분포가 매우 균일함 - AI 생성 이미지에서 자주 나타나는 특성");
    } else if (brightnessUniformity > 0.55) {
      score += 10;
      reasons.push("[밝기 패턴] 밝기 분포가 다소 균일한 편");
    }

    if (colorSaturation > 0.5) {
      score += 15;
      reasons.push("[색상 패턴] 과도하게 선명한 색상 채도 감지 - AI 생성 특유의 과채도");
    } else if (colorSaturation > 0.35) {
      score += 8;
      reasons.push("[색상 패턴] 색상 채도가 높은 편");
    } else if (colorSaturation < 0.12) {
      score += 10;
      reasons.push("[색상 패턴] 비정상적으로 낮은 색상 채도");
    }

    if (colorBanding > 0.35) {
      score += 20;
      reasons.push("[색상 패턴] 색상 그라데이션에서 밴딩 현상 감지 - AI 이미지의 일반적인 아티팩트");
    } else if (colorBanding > 0.2) {
      score += 12;
      reasons.push("[색상 패턴] 일부 영역에서 색상 밴딩 감지");
    }

    if (textureRepetition > 0.12) {
      score += 22;
      reasons.push("[텍스처] 반복적인 텍스처 패턴 감지 - AI 생성의 전형적인 징후");
    } else if (textureRepetition > 0.05) {
      score += 14;
      reasons.push("[텍스처] 일부 영역에서 유사한 텍스처 패턴 발견");
    }

    if (smoothness > 0.65) {
      score += 20;
      reasons.push("[텍스처] 비정상적으로 매끄러운 표면 - 과도하게 깔끔한 이미지");
    } else if (smoothness > 0.45) {
      score += 12;
      reasons.push("[텍스처] 부분적으로 과하게 매끄러운 영역 존재");
    }

    if (edgeSharpness > 0.55) {
      score += 14;
      reasons.push("[텍스처] 인위적으로 날카로운 경계선 감지");
    } else if (edgeSharpness < 0.08 && smoothness > 0.35) {
      score += 12;
      reasons.push("[텍스처] 경계선이 너무 부드러움 - 자연스럽지 않은 블러 효과");
    }

    if (noiseLevel < 0.06) {
      score += 18;
      reasons.push("[노이즈] 노이즈가 거의 없음 - 자연 촬영에서는 드문 특성");
    } else if (noiseLevel < 0.12) {
      score += 10;
      reasons.push("[노이즈] 노이즈 수준이 매우 낮음");
    }

    if (contrastVariance < 0.12) {
      score += 12;
      reasons.push("[밝기 패턴] 영역별 대비가 매우 균일함 - 인위적인 조명 특성");
    } else if (contrastVariance < 0.2) {
      score += 6;
      reasons.push("[밝기 패턴] 영역별 대비 변화가 적음");
    }

    if (colorTempConsistency > 0.88) {
      score += 14;
      reasons.push("[색상 패턴] 색온도가 전체적으로 너무 일관됨 - 자연광에서는 드문 현상");
    } else if (colorTempConsistency > 0.8) {
      score += 8;
      reasons.push("[색상 패턴] 색온도 일관성이 높음");
    }

  if (reasons.length === 0) {
    reasons.push("[분석 결과] 분석된 특성들이 자연스러운 범위 내에 있음");
  }

  score = Math.min(100, Math.max(0, score));

  return {
    score,
    reasons,
    details: {
      brightnessUniformity,
      colorDistribution: colorSaturation,
      edgeDensity: 1 - smoothness,
      noiseLevel,
      highFrequencyRatio: edgeSharpness,
    },
  };
}

function getDefaultErrorResult(): HeuristicResult {
  return {
    score: 50,
    reasons: ["[오류] 이미지 분석 중 오류 발생, 기본 점수 적용"],
    details: {
      brightnessUniformity: 0.5,
      colorDistribution: 0.5,
      edgeDensity: 0.5,
      noiseLevel: 0.5,
      highFrequencyRatio: 0.5,
    },
  };
}

export async function analyzeImage(imageUrl: string): Promise<HeuristicResult> {
  try {
    const stats = await fetchAndDecodeImage(imageUrl);
    return analyzeStats(stats);
  } catch (error) {
    console.error("Image analysis error:", error);
    return getDefaultErrorResult();
  }
}

export async function analyzeImageBuffer(buffer: Buffer): Promise<HeuristicResult> {
  try {
    const stats = await decodeImageBuffer(buffer);
    return analyzeStats(stats);
  } catch (error) {
    console.error("Image buffer analysis error:", error);
    return getDefaultErrorResult();
  }
}
