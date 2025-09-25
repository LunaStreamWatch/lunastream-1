import React from 'react';
import { Subtitles, Check } from 'lucide-react';
import { SubtitleTrack } from '../types/player';

interface SubtitleMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  subtitleTracks: SubtitleTrack[];
  currentSubtitle: string | null;
  onSubtitleChange: (trackId: string | null) => void;
}

export function SubtitleMenu({
  isOpen,
  onToggle,
  subtitleTracks,
  currentSubtitle,
  onSubtitleChange
}: SubtitleMenuProps) {
  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="text-white hover:text-[#fbc9ff] transition-colors duration-200 p-1"
        aria-label="Subtitles"
      >
        <Subtitles className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="text-[#fbc9ff] transition-colors duration-200 p-1"
        aria-label="Subtitles"
      >
        <Subtitles className="w-5 h-5" />
      </button>
      
      <div className="absolute bottom-full right-0 mb-2 bg-black/90 backdrop-blur-sm rounded-lg border border-white/20 min-w-[200px] overflow-hidden">
        <div className="p-2">
          <div className="text-white text-sm font-medium mb-2 px-2">Subtitles</div>
          
          <button
            onClick={() => onSubtitleChange(null)}
            className="w-full text-left px-2 py-2 text-white hover:bg-white/10 rounded text-sm flex items-center justify-between"
          >
            <span>Off</span>
            {!currentSubtitle && <Check className="w-4 h-4 text-[#fbc9ff]" />}
          </button>
          
          {subtitleTracks.map((track) => (
            <button
              key={track.id}
              onClick={() => onSubtitleChange(track.id)}
              className="w-full text-left px-2 py-2 text-white hover:bg-white/10 rounded text-sm flex items-center justify-between"
            >
              <div className="flex items-center space-x-2">
                <img
                  src={`https://flagsapi.com/${track.country}/flat/24.png`}
                  alt={`${track.country} flag`}
                  className="w-4 h-3 rounded-sm"
                />
                <span>{track.language}</span>
              </div>
              {currentSubtitle === track.id && <Check className="w-4 h-4 text-[#fbc9ff]" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}