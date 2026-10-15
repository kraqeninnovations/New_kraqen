import type { HomeProject } from '@/lib/schemas/home';

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
  fallbackProjects: HomeProject[],
  limit: number = 12
): Promise<HomeProject[]> {
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
        'INSTAGRAM ERROR: token expired or missing permission instagram_basic. Showing manual items from content/home.json.'
      );
      return fallbackProjects;
    }

    const json = (await res.json()) as InstagramApiResponse;
    if (!json.data || !Array.isArray(json.data) || json.data.length === 0) {
      console.warn(
        'INSTAGRAM ERROR: empty or invalid response. Showing manual items from content/home.json.'
      );
      return fallbackProjects;
    }

    return json.data.map((item, index) => {
      const isReel = item.media_product_type === 'REELS' || item.media_type === 'VIDEO';
      const mediaType: 'reel' | 'post' = isReel ? 'reel' : 'post';
      const numStr = String(index + 1).padStart(2, '0');

      let title = `REEL ${numStr}`;
      if (item.caption) {
        const firstLine = item.caption.split('\n')[0].trim();
        if (firstLine.length > 0) {
          title = firstLine.slice(0, 40).toUpperCase();
        }
      }

      const imageUrl = item.thumbnail_url || item.media_url || fallbackProjects[index % fallbackProjects.length]?.image || '/images/work/reel-01.webp';

      return {
        id: item.id,
        number: numStr,
        title,
        name: title,
        category: isReel ? 'REEL' : 'POST',
        services: isReel ? 'INSTAGRAM REEL' : 'INSTAGRAM POST',
        year: item.timestamp ? new Date(item.timestamp).getFullYear().toString() : '2026',
        mediaType,
        instagramUrl: item.permalink,
        image: imageUrl,
        video: '',
        alt: title,
        fit: 'cover' as const,
        imageStyle: 'full-bleed' as const,
      };
    });
  } catch (error) {
    console.warn(
      'INSTAGRAM ERROR: token expired or missing permission instagram_basic. Showing manual items from content/home.json.',
      error
    );
    return fallbackProjects;
  }
}

