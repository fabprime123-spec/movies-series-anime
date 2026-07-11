import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

const { MediaDownloader } = NativeModules;
const mediaDownloaderEmitter = new NativeEventEmitter(MediaDownloader);

export const downloadMediaPackage = async (
  details: any,
  onProgress?: (text: string, current: number, total: number) => void
): Promise<string> => {
  if (Platform.OS !== 'android') {
    throw new Error('This feature is currently only supported on Android.');
  }

  if (!MediaDownloader) {
    throw new Error('Native MediaDownloader module is not available. Did you rebuild the app?');
  }

  const { title, name, original_title, original_name } = details;
  const mediaName = (title || name || original_title || original_name).replace(/[^a-zA-Z0-9 -]/g, '');
  const year = (details.release_date || details.first_air_date || 'Unknown').substring(0, 4);
  const folderName = `${mediaName} (${year})`;

  // 1. Prepare Metadata Map
  const mdContent = generateMarkdown(details);
  const metadataMap: Record<string, string> = {
    'metadata/Details.md': mdContent,
    'metadata/RawData.json': JSON.stringify(details, null, 2),
    'related/Recommended.json': JSON.stringify(details.recommendations?.results || [], null, 2),
    'related/Similar.json': JSON.stringify(details.similar?.results || [], null, 2),
  };

  // 2. Prepare Images Array
  const imagesToDownload: { url: string, path: string }[] = [];
  const pushImages = (arr: any[], subfolder: string) => {
    if (!arr) return;
    arr.forEach((img, idx) => {
      if (img.file_path) {
        imagesToDownload.push({
          url: `https://image.tmdb.org/t/p/original${img.file_path}`,
          path: `images/${subfolder}_${idx + 1}.jpg`
        });
      }
    });
  };

  if (details.poster_path) {
    imagesToDownload.push({
      url: `https://image.tmdb.org/t/p/original${details.poster_path}`,
      path: `images/Primary_Poster.jpg`
    });
  }
  if (details.backdrop_path) {
    imagesToDownload.push({
      url: `https://image.tmdb.org/t/p/original${details.backdrop_path}`,
      path: `images/Primary_Backdrop.jpg`
    });
  }

  pushImages(details.images?.posters, 'poster');
  pushImages(details.images?.backdrops, 'backdrop');
  pushImages(details.images?.logos, 'logo');

  // 3. Listen to Progress
  const subscription = mediaDownloaderEmitter.addListener(
    'onDownloadProgress',
    (event: { message: string; current: number; total: number }) => {
      onProgress?.(event.message, event.current, event.total);
    }
  );

  // 4. Trigger Native Module
  try {
    const finalPath = await MediaDownloader.downloadAndZipMedia(
      folderName,
      metadataMap,
      imagesToDownload
    );
    return finalPath;
  } finally {
    subscription.remove();
  }
};

const generateMarkdown = (details: any): string => {
  const title = details.title || details.name;
  const originalTitle = details.original_title || details.original_name;
  const type = details.title ? 'Movie' : 'TV Series';
  const tagline = details.tagline ? `> *${details.tagline}*` : '';
  const status = details.status || 'Unknown';
  const languages = (details.spoken_languages || []).map((l:any) => l.english_name).join(', ');
  const countries = (details.production_countries || []).map((c:any) => c.name).join(', ');
  const genres = (details.genres || []).map((g: any) => g.name).join(', ');
  
  let md = `# ${title}\n`;
  if (originalTitle && originalTitle !== title) md += `**Original Title:** ${originalTitle}\n\n`;
  if (tagline) md += `${tagline}\n\n`;
  
  md += `**Type:** ${type}\n`;
  md += `**Status:** ${status}\n`;
  md += `**Release Date:** ${details.release_date || details.first_air_date}\n`;
  md += `**Genres:** ${genres}\n`;
  md += `**Languages:** ${languages}\n`;
  md += `**Production Countries:** ${countries}\n`;
  if (details.vote_average) md += `**Rating:** ⭐ ${details.vote_average.toFixed(1)}/10 (${details.vote_count} votes)\n`;
  
  md += `\n## Overview\n${details.overview}\n\n`;

  // Videos
  if (details.videos?.results?.length > 0) {
    md += `## Videos & Trailers\n`;
    details.videos.results.forEach((v: any) => {
      if (v.site === 'YouTube') {
        md += `- [${v.type}] [${v.name}](https://www.youtube.com/watch?v=${v.key})\n`;
      }
    });
    md += `\n`;
  }

  // Cast & Crew
  if (details.credits) {
    if (details.credits.cast?.length > 0) {
      md += `## Top Cast\n`;
      details.credits.cast.slice(0, 15).forEach((c: any) => {
        md += `- **${c.name}** as ${c.character}\n`;
      });
      md += `\n`;
    }

    const directors = details.credits.crew.filter((c:any) => c.job === 'Director');
    if (directors.length > 0) {
      md += `## Directors\n`;
      directors.forEach((d:any) => md += `- ${d.name}\n`);
      md += `\n`;
    }

    const composers = details.credits.crew.filter((c:any) => c.job === 'Original Music Composer' || c.job === 'Music');
    if (composers.length > 0) {
      md += `## Music & Soundtrack By\n`;
      composers.forEach((c:any) => md += `- ${c.name}\n`);
      md += `\n`;
    }
  }

  return md;
};
