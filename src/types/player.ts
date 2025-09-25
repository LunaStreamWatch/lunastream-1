export interface SubtitleTrack {
  id: string;
  language: string;
  country: string;
  url: string;
}

export interface SubtitleCue {
  start: number;
  end: number;
  text: string;
}

export interface PlayerSettings {
  playbackSpeed: number;
  subtitleSettings: {
    fontSize: number;
    color: string;
    delay: number;
    backgroundColor: string;
    backgroundOpacity: number;
  };
  theme: 'dark' | 'light';
}

export interface VideoPlayerProps {
  src: string;
  subtitleTracks?: SubtitleTrack[];
  poster?: string;
  autoPlay?: boolean;
  className?: string;
}