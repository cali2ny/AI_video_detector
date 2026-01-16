export interface VideoMetadata {
  channelTitle?: string;
  durationSeconds?: number;
}

export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

export function getThumbnailUrls(videoId: string): string[] {
  return [
    `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
    `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
  ];
}

export async function getBestThumbnail(videoId: string): Promise<string> {
  const urls = getThumbnailUrls(videoId);
  
  for (const url of urls) {
    try {
      const response = await fetch(url, { method: "HEAD" });
      if (response.ok) {
        const contentLength = response.headers.get("content-length");
        if (contentLength && parseInt(contentLength) > 1000) {
          return url;
        }
      }
    } catch {
      continue;
    }
  }
  
  return urls[2];
}

function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  
  const hours = parseInt(match[1] || "0");
  const minutes = parseInt(match[2] || "0");
  const seconds = parseInt(match[3] || "0");
  
  return hours * 3600 + minutes * 60 + seconds;
}

export async function getVideoMetadata(videoId: string): Promise<VideoMetadata> {
  const apiKey = process.env.YT_API_KEY;
  
  if (!apiKey) {
    return {};
  }

  try {
    const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails&key=${apiKey}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      console.warn("YouTube API request failed:", response.status);
      return {};
    }

    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      return {};
    }

    const item = data.items[0];
    const snippet = item.snippet || {};
    const contentDetails = item.contentDetails || {};

    return {
      channelTitle: snippet.channelTitle,
      durationSeconds: contentDetails.duration ? parseDuration(contentDetails.duration) : undefined,
    };
  } catch (error) {
    console.warn("Error fetching YouTube metadata:", error);
    return {};
  }
}
