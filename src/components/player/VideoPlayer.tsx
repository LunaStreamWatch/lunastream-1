import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Maximize,
  Minimize,
  PictureInPicture2
} from 'lucide-react';
import { VideoPlayerProps, PlayerSettings, SubtitleCue, SubtitleTrack } from '../types/player';
import { parseSRT, formatTime } from '../utils/srtParser';
import { extractContentId, discoverSubtitleTracks } from '../utils/subtitleUtils';
import { useChromecast } from '../hooks/useChromecast';
import { ProgressBar } from './ProgressBar';
import { VolumeControl } from './VolumeControl';
import { SettingsMenu } from './SettingsMenu';
import { SubtitleMenu } from './SubtitleMenu';
import { CastButton } from './CastButton';
import { SubtitleOverlay } from './SubtitleOverlay';

export function VideoPlayer({
  src,
  subtitleTracks = [],
  poster,
  autoPlay = false,
  className = ''
}: VideoPlayerProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = React.useRef<NodeJS.Timeout>();
  const { isAvailable: isCastAvailable, isConnected: isCasting, startCasting, stopCasting } = useChromecast();
  
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [buffered, setBuffered] = React.useState(0);
  const [volume, setVolume] = React.useState(1);
  const [isMuted, setIsMuted] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [showControls, setShowControls] = React.useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [isSubtitleMenuOpen, setIsSubtitleMenuOpen] = React.useState(false);
  const [currentSubtitle, setCurrentSubtitle] = React.useState<string | null>(null);
  const [subtitleCues, setSubtitleCues] = React.useState<SubtitleCue[]>([]);
  const [availableSubtitles, setAvailableSubtitles] = React.useState<SubtitleTrack[]>([]);
  const [isLoadingSubtitles, setIsLoadingSubtitles] = React.useState(false);
  
  const [settings, setSettings] = React.useState<PlayerSettings>({
    playbackSpeed: 1,
    subtitleSettings: {
      fontSize: 16,
      color: '#ffffff',
      delay: 0,
      backgroundColor: '#000000',
      backgroundOpacity: 0.5
    },
    theme: 'dark'
  });

  // Discover available subtitles when video loads
  React.useEffect(() => {
    const loadSubtitles = async () => {
      setIsLoadingSubtitles(true);
      try {
        const contentId = extractContentId(src);
        const tracks = await discoverSubtitleTracks(contentId);
        setAvailableSubtitles(tracks);
      } catch (error) {
        console.error('Failed to discover subtitles:', error);
        setAvailableSubtitles([]);
      } finally {
        setIsLoadingSubtitles(false);
      }
    };

    loadSubtitles();
  }, [src]);
  // Video event handlers
  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };
  const handleProgress = () => {
    if (videoRef.current && videoRef.current.buffered.length > 0) {
      const bufferedEnd = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
      setBuffered(bufferedEnd);
    }
  };

  // Control functions
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
    }
  };

  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 10);
    }
  };

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
    }
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (videoRef.current) {
      videoRef.current.muted = newMuted;
    }
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!isFullscreen) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

  const togglePictureInPicture = async () => {
    if (!videoRef.current) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (error) {
      console.error('Picture-in-Picture error:', error);
    }
  };

  const handleCast = () => {
    if (isCasting) {
      stopCasting();
    } else {
      startCasting(src, 'Video Player');
    }
  };
  // Controls visibility
  const showControlsTemporarily = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const handleMouseMove = () => {
    showControlsTemporarily();
  };

  const handleClick = () => {
    if (!showControls) {
      showControlsTemporarily();
    } else {
      togglePlay();
    }
  };

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target !== document.body) return;
      
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skipBackward();
          break;
        case 'ArrowRight':
          e.preventDefault();
          skipForward();
          break;
        case 'KeyF':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fullscreen detection
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Apply playback speed
  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = settings.playbackSpeed;
    }
  }, [settings.playbackSpeed]);

  // Load subtitles
  React.useEffect(() => {
    if (!currentSubtitle) {
      setSubtitleCues([]);
      return;
    }

    const track = availableSubtitles.find(t => t.id === currentSubtitle);
    if (!track) return;

    fetch(track.url)
      .then(response => response.text())
      .then(srtContent => {
        const cues = parseSRT(srtContent);
        setSubtitleCues(cues);
      })
      .catch(error => {
        console.error('Failed to load subtitles:', error);
        setSubtitleCues([]);
      });
  }, [currentSubtitle, availableSubtitles]);

  // Auto-hide controls when playing
  React.useEffect(() => {
    if (isPlaying) {
      showControlsTemporarily();
    } else {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    }
  }, [isPlaying]);

  return (
    <div
      ref={containerRef}
      className={`relative bg-black rounded-lg overflow-hidden group ${className} ${isFullscreen ? 'w-screen h-screen' : ''}`}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        className="w-full h-full object-contain"
        onPlay={handlePlay}
        onPause={handlePause}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onProgress={handleProgress}
      />
      
      {currentSubtitle && (
        <SubtitleOverlay
          cues={subtitleCues}
          currentTime={currentTime}
          settings={settings.subtitleSettings}
        />
      )}
      
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <ProgressBar
            currentTime={currentTime}
            duration={duration}
            buffered={buffered}
            onSeek={handleSeek}
            className="mb-3"
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                className="text-white hover:text-[#fbc9ff] transition-colors duration-200 p-1"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </button>
              
              <button
                onClick={(e) => { e.stopPropagation(); skipBackward(); }}
                className="text-white hover:text-[#fbc9ff] transition-colors duration-200 p-1"
                aria-label="Skip back 10 seconds"
              >
                <SkipBack className="w-5 h-5" />
              </button>
              
              <button
                onClick={(e) => { e.stopPropagation(); skipForward(); }}
                className="text-white hover:text-[#fbc9ff] transition-colors duration-200 p-1"
                aria-label="Skip forward 10 seconds"
              >
                <SkipForward className="w-5 h-5" />
              </button>
              
              <VolumeControl
                volume={volume}
                isMuted={isMuted}
                onVolumeChange={handleVolumeChange}
                onMuteToggle={toggleMute}
              />
              
              <div className="text-white text-sm font-medium">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div onClick={(e) => e.stopPropagation()}>
                <SubtitleMenu
                  isOpen={isSubtitleMenuOpen}
                  onToggle={() => setIsSubtitleMenuOpen(!isSubtitleMenuOpen)}
                  subtitleTracks={availableSubtitles}
                  currentSubtitle={currentSubtitle}
                  onSubtitleChange={setCurrentSubtitle}
                />
              </div>
              
              {isCastAvailable && (
                <CastButton
                  onCast={handleCast}
                  isCasting={isCasting}
                />
              )}
              
              <button
                onClick={(e) => { e.stopPropagation(); togglePictureInPicture(); }}
                className="text-white hover:text-[#fbc9ff] transition-colors duration-200 p-1"
                aria-label="Picture in Picture"
              >
                <PictureInPicture2 className="w-5 h-5" />
              </button>
              
              <div onClick={(e) => e.stopPropagation()}>
                <SettingsMenu
                  isOpen={isSettingsOpen}
                  onToggle={() => setIsSettingsOpen(!isSettingsOpen)}
                  settings={settings}
                  onSettingsChange={setSettings}
                />
              </div>
              
              <button
                onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
                className="text-white hover:text-[#fbc9ff] transition-colors duration-200 p-1"
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                {isFullscreen ? (
                  <Minimize className="w-5 h-5" />
                ) : (
                  <Maximize className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={(e) => { e.stopPropagation(); togglePlay(); }}
            className="bg-black/50 hover:bg-black/70 text-white rounded-full p-4 transition-all duration-200 hover:scale-110"
            aria-label="Play"
          >
            <Play className="w-12 h-12 ml-1" />
          </button>
        </div>
      )}
      
      {isLoadingSubtitles && (
        <div className="absolute top-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded">
          Loading subtitles...
        </div>
      )}
    </div>
  );
}