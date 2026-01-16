import type { ExternalApiResult } from "@shared/schema";

export async function callExternalDetectionApi(
  frames: string[]
): Promise<ExternalApiResult> {
  const apiBaseUrl = process.env.AI_DETECT_API_BASE_URL;
  const apiKey = process.env.AI_DETECT_API_KEY;

  if (!apiBaseUrl || !apiKey) {
    return {
      score: null,
      available: false,
    };
  }

  try {
    const response = await fetch(apiBaseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ frames }),
    });

    if (!response.ok) {
      console.error(`External API error: ${response.status}`);
      return {
        score: null,
        available: true,
      };
    }

    const data = await response.json();

    let probability: number | null = null;

    if (typeof data.probability === "number") {
      probability = data.probability;
    } else if (typeof data.score === "number") {
      probability = data.score > 1 ? data.score / 100 : data.score;
    } else if (typeof data.result?.probability === "number") {
      probability = data.result.probability;
    }

    if (probability !== null) {
      const score = Math.round(probability * 100);
      return {
        score: Math.min(100, Math.max(0, score)),
        available: true,
      };
    }

    return {
      score: null,
      available: true,
    };
  } catch (error) {
    console.error("External API call failed:", error);
    return {
      score: null,
      available: true,
    };
  }
}
