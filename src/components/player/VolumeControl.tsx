import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onMuteToggle: () => void;
}

export function VolumeControl({ volume, isMuted, onVolumeChange, onMuteToggle }: VolumeControlProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div 
      className="flex items-center space-x-2 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={onMuteToggle}
        className="text-white hover:text-[#fbc9ff] transition-colors duration-200 p-1"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted || volume === 0 ? (
          <VolumeX className="w-5 h-5" />
        ) : (
          <Volume2 className="w-5 h-5" />
        )}
      </button>
      
      <div className={`transition-all duration-300 ${isHovered ? 'w-20 opacity-100' : 'w-0 opacity-0'} overflow-hidden`}>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #fbc9ff 0%, #fbc9ff ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.3) ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.3) 100%)`
          }}
        />
      </div>
      
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #fbc9ff;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 0 1px rgba(0,0,0,0.1);
        }
        
        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #fbc9ff;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 0 1px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
}