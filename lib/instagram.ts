export interface InstagramProject {
  id: string;
  number: string;
  name: string;
  title: string;
  services: string;
  category: string;
  year: string;
  mediaType: 'reel' | 'post' | 'image';
  instagramUrl: string;
  image: string;
  video: string;
  alt: string;
  fit: 'cover' | 'inset';
  imageStyle: 'cover' | 'inset';
}

interface InstagramMediaItem {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_product_type?: 'REELS' | 'FEED';
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
}

interface InstagramApiResponse {
  data?: InstagramMediaItem[];
  error?: {
    message: string;
    type: string;
    code: number;
  };
}

export async function fetchInstagramProjects(
  fallbackProjects: InstagramProject[] = [],
  limit: number = 12
): Promise<InstagramProject[]> {
  const userId = process.env.INSTAGRAM_USER_ID;
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!userId || !accessToken) {
    return fallbackProjects;
  }

  try {
    const url = `https://graph.instagram.com/${userId}/media?fields=id,caption,media_type,media_product_type,media_url,thumbnail_url,permalink,timestamp&limit=${limit}&access_token=${accessToken}`;

    const res = await fetch(url, {
      next: { revalidate: 3600, tags: ['instagram'] },
    });

    if (!res.ok) {
      console.warn(
        'INSTAGRAM ERROR: token expired or missing permission instagram_basic. Showing manual items.'
      );
      return fallbackProjects;
    }

    const json = (await res.json()) as InstagramApiResponse;
    if (!json.data || !Array.isArray(json.data) || json.data.length === 0) {
      console.warn(
        'INSTAGRAM ERROR: empty or invalid response. Showing manual items.'
      );
      return fallbackProjects;
    }

    return json.data.map((item, index) => {
      const isReel = item.media_product_type === 'REELS' || item.media_type === 'VIDEO';
      const mediaType: 'reel' | 'post' = isReel ? 'reel' : 'post';
      const numStr = String(index + 1).padStart(2, '0');
      const firstLine = item.caption ? item.caption.split('\n')[0].slice(0, 32).toUpperCase() : `REEL ${numStr}`;

      return {
        id: item.id,
        number: numStr,
        name: firstLine,
        title: firstLine,
        services: isReel ? 'REEL' : 'POST',
        category: 'SOCIAL CREATIVES',
        year: item.timestamp ? new Date(item.timestamp).getFullYear().toString() : '2026',
        mediaType,
        instagramUrl: item.permalink,
        image: item.thumbnail_url || item.media_url || '/images/hero-runner.jpg',
        video: item.media_url || '',
        alt: item.caption ? item.caption.slice(0, 100) : `Kraqen Instagram post ${numStr}`,
        fit: 'cover' as const,
        imageStyle: 'cover' as const,
      };
    });
  } catch (err: unknown) {
    console.warn(
      'INSTAGRAM ERROR: network error while fetching Instagram feed. Falling back.',
      err
    );
    return fallbackProjects;
  }
}
