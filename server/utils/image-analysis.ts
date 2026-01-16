import type { HeuristicResult } from "@shared/schema";

interface PixelData {
  r: number;
  g: number;
  b: number;
}

async function fetchImageAsBuffer(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.status}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

function decodeSimpleJpeg(buffer: Buffer): { width: number; height: number; pixels: PixelData[] } {
  const pixels: PixelData[] = [];
  let width = 320;
  let height = 180;

  for (let i = 0; i < buffer.length - 2; i++) {
    if (buffer[i] === 0xff && buffer[i + 1] === 0xc0) {
      height = (buffer[i + 5] << 8) | buffer[i + 6];
      width = (buffer[i + 7] << 8) | buffer[i + 8];
      break;
    }
  }

  const sampleSize = Math.min(10000, buffer.length / 3);
  const step = Math.floor(buffer.length / sampleSize);

  for (let i = 0; i < buffer.length - 2; i += step) {
    pixels.push({
      r: buffer[i] || 0,
      g: buffer[i + 1] || 0,
      b: buffer[i + 2] || 0,
    });
  }

  return { width, height, pixels };
}

function calculateBrightnessUniformity(pixels: PixelData[]): number {
  if (pixels.length === 0) return 0;

  const brightnesses = pixels.map((p) => (p.r + p.g + p.b) / 3);
  const mean = brightnesses.reduce((a, b) => a + b, 0) / brightnesses.length;
  const variance =
    brightnesses.reduce((sum, b) => sum + Math.pow(b - mean, 2), 0) /
    brightnesses.length;
  const stdDev = Math.sqrt(variance);

  const normalizedStdDev = Math.min(stdDev / 80, 1);
  return 1 - normalizedStdDev;
}

function calculateColorDistribution(pixels: PixelData[]): number {
  if (pixels.length === 0) return 0;

  const histogram: number[] = new Array(16).fill(0);

  for (const pixel of pixels) {
    const hue = Math.floor(
      ((Math.atan2(
        Math.sqrt(3) * (pixel.g - pixel.b),
        2 * pixel.r - pixel.g - pixel.b
      ) *
        180) /
        Math.PI +
        180) /
        22.5
    );
    histogram[Math.min(15, Math.max(0, hue))]++;
  }

  const total = histogram.reduce((a, b) => a + b, 0);
  if (total === 0) return 0;

  const normalized = histogram.map((h) => h / total);
  const entropy = -normalized.reduce((sum, p) => {
    if (p > 0) return sum + p * Math.log2(p);
    return sum;
  }, 0);

  const maxEntropy = Math.log2(16);
  return entropy / maxEntropy;
}

function calculateEdgeDensity(pixels: PixelData[], width: number): number {
  if (pixels.length < width + 1) return 0.5;

  let edgeCount = 0;
  const threshold = 30;

  for (let i = 0; i < pixels.length - 1; i++) {
    const current = (pixels[i].r + pixels[i].g + pixels[i].b) / 3;
    const next = (pixels[i + 1].r + pixels[i + 1].g + pixels[i + 1].b) / 3;

    if (Math.abs(current - next) > threshold) {
      edgeCount++;
    }
  }

  return Math.min(edgeCount / (pixels.length * 0.3), 1);
}

function calculateNoiseLevel(pixels: PixelData[]): number {
  if (pixels.length < 10) return 0.5;

  let noiseSum = 0;
  const windowSize = 5;

  for (let i = windowSize; i < pixels.length - windowSize; i++) {
    const center = (pixels[i].r + pixels[i].g + pixels[i].b) / 3;
    let neighborSum = 0;

    for (let j = -windowSize; j <= windowSize; j++) {
      if (j !== 0) {
        const neighbor =
          (pixels[i + j].r + pixels[i + j].g + pixels[i + j].b) / 3;
        neighborSum += neighbor;
      }
    }

    const neighborAvg = neighborSum / (windowSize * 2);
    noiseSum += Math.abs(center - neighborAvg);
  }

  const avgNoise = noiseSum / (pixels.length - windowSize * 2);
  return Math.min(avgNoise / 20, 1);
}

function calculateHighFrequencyRatio(pixels: PixelData[]): number {
  if (pixels.length < 4) return 0.5;

  let highFreqCount = 0;
  let lowFreqCount = 0;

  for (let i = 2; i < pixels.length - 2; i++) {
    const values = [-2, -1, 0, 1, 2].map(
      (offset) =>
        (pixels[i + offset].r + pixels[i + offset].g + pixels[i + offset].b) / 3
    );

    const lowFreq = Math.abs(values[2] - (values[0] + values[4]) / 2);
    const highFreq = Math.abs(
      values[2] - (values[1] + values[3]) / 2
    );

    if (highFreq > 10) highFreqCount++;
    if (lowFreq > 10) lowFreqCount++;
  }

  const total = highFreqCount + lowFreqCount;
  if (total === 0) return 0.5;

  return highFreqCount / total;
}

export async function analyzeImage(imageUrl: string): Promise<HeuristicResult> {
  try {
    const buffer = await fetchImageAsBuffer(imageUrl);
    const { width, pixels } = decodeSimpleJpeg(buffer);

    const brightnessUniformity = calculateBrightnessUniformity(pixels);
    const colorDistribution = calculateColorDistribution(pixels);
    const edgeDensity = calculateEdgeDensity(pixels, width);
    const noiseLevel = calculateNoiseLevel(pixels);
    const highFrequencyRatio = calculateHighFrequencyRatio(pixels);

    const reasons: string[] = [];

    let score = 0;

    if (brightnessUniformity > 0.7) {
      score += 20;
      reasons.push("밝기 분포가 매우 균일함 (AI 생성 특성)");
    } else if (brightnessUniformity > 0.5) {
      score += 10;
      reasons.push("밝기 분포가 균일한 편");
    }

    if (colorDistribution < 0.4) {
      score += 15;
      reasons.push("색상 다양성이 낮음 (단조로운 색상 분포)");
    } else if (colorDistribution > 0.8) {
      score += 10;
      reasons.push("색상 분포가 매우 균등함");
    }

    if (edgeDensity < 0.2) {
      score += 20;
      reasons.push("경계선이 매우 매끄러움 (과도하게 깔끔한 이미지)");
    } else if (edgeDensity < 0.4) {
      score += 10;
      reasons.push("경계선 밀도가 낮은 편");
    }

    if (noiseLevel < 0.15) {
      score += 25;
      reasons.push("노이즈가 거의 없음 (자연스럽지 않은 깨끗함)");
    } else if (noiseLevel < 0.3) {
      score += 12;
      reasons.push("노이즈 수준이 낮음");
    }

    if (highFrequencyRatio < 0.3) {
      score += 20;
      reasons.push("고주파 성분이 적음 (세밀한 디테일 부족)");
    } else if (highFrequencyRatio < 0.5) {
      score += 10;
      reasons.push("고주파 성분이 다소 낮음");
    }

    if (reasons.length === 0) {
      reasons.push("분석된 특성들이 자연스러운 범위 내에 있음");
    }

    score = Math.min(100, Math.max(0, score));

    return {
      score,
      reasons,
      details: {
        brightnessUniformity,
        colorDistribution,
        edgeDensity,
        noiseLevel,
        highFrequencyRatio,
      },
    };
  } catch (error) {
    return {
      score: 50,
      reasons: ["이미지 분석 중 오류 발생, 기본 점수 적용"],
      details: {
        brightnessUniformity: 0.5,
        colorDistribution: 0.5,
        edgeDensity: 0.5,
        noiseLevel: 0.5,
        highFrequencyRatio: 0.5,
      },
    };
  }
}
