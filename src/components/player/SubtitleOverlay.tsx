import React from 'react';
import { SubtitleCue, PlayerSettings } from '../types/player';

interface SubtitleOverlayProps {
  cues: SubtitleCue[];
  currentTime: number;
  settings: PlayerSettings['subtitleSettings'];
}

export function SubtitleOverlay({ cues, currentTime, settings }: SubtitleOverlayProps) {
  const adjustedTime = currentTime + settings.delay;
  const currentCue = cues.find(cue => adjustedTime >= cue.start && adjustedTime <= cue.end);

  if (!currentCue) return null;

  return (
    <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 pointer-events-none z-20">
      <div
        className="px-2 py-1 rounded max-w-md text-center leading-tight"
        style={{
          fontSize: `${settings.fontSize}px`,
          color: settings.color,
          backgroundColor: `${settings.backgroundColor}${Math.round(settings.backgroundOpacity * 255).toString(16).padStart(2, '0')}`,
          textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
        }}
      >
        {currentCue.text.split('\n').map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
    </div>
  );
}