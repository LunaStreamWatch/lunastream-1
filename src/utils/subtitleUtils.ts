import { SubtitleTrack } from '../types/player';

// Extract content ID from video URL
export function extractContentId(videoUrl: string): string {
  // For this example, we'll use a hash of the URL as content ID
  // In a real implementation, this would be extracted from your video service
  const hash = btoa(videoUrl).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
  return hash;
}

// Dynamically discover available subtitle languages
export async function discoverSubtitleTracks(contentId: string): Promise<SubtitleTrack[]> {
  const commonLanguages = [
    { id: '1', language: 'English', country: 'US' },
    { id: '2', language: 'Spanish', country: 'ES' },
    { id: '3', language: 'French', country: 'FR' },
    { id: '4', language: 'German', country: 'DE' },
    { id: '5', language: 'Italian', country: 'IT' },
    { id: '6', language: 'Portuguese', country: 'PT' },
    { id: '7', language: 'Russian', country: 'RU' },
    { id: '8', language: 'Japanese', country: 'JP' },
    { id: '9', language: 'Korean', country: 'KR' },
    { id: '10', language: 'Chinese', country: 'CN' },
  ];

  const availableTracks: SubtitleTrack[] = [];

  // Test each language to see if subtitles are available
  for (const lang of commonLanguages) {
    try {
      const url = `https://sub.wyzie.ru/c/${contentId}/id/${lang.id}?format=srt&encoding=UTF-8`;
      const response = await fetch(url, { method: 'HEAD' });
      
      if (response.ok) {
        availableTracks.push({
          ...lang,
          url
        });
      }
    } catch (error) {
      // Language not available, continue
      console.log(`Subtitle not available for ${lang.language}`);
    }
  }

  return availableTracks;
}

// Check if Chromecast is available
export function isChromecastAvailable(): boolean {
  return 'chrome' in window && 'cast' in (window as any).chrome;
}

// Initialize Chromecast
export function initializeChromecast(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!isChromecastAvailable()) {
      reject(new Error('Chromecast not available'));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1';
    script.onload = () => {
      (window as any).__onGCastApiAvailable = (isAvailable: boolean) => {
        if (isAvailable) {
          resolve();
        } else {
          reject(new Error('Cast API not available'));
        }
      };
    };
    script.onerror = () => reject(new Error('Failed to load Cast SDK'));
    document.head.appendChild(script);
  });
}