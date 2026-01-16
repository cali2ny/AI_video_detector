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
