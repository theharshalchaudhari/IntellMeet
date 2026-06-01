export const getYoutubeVideoId = (url: string) => {
  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname.includes('youtu.be')) {
      return parsedUrl.pathname.replace('/', '') || null;
    }

    if (parsedUrl.searchParams.has('v')) {
      return parsedUrl.searchParams.get('v');
    }

    const segments = parsedUrl.pathname.split('/').filter(Boolean);

    return segments[segments.length - 1] ?? null;
  } catch {
    return null;
  }
};

export const getYoutubeThumbnail = (url: string) => {
  const videoId = getYoutubeVideoId(url);

  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
};

export const formatDateTime = (value: string | null) => {
  if (!value) return 'Not scheduled';

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
};