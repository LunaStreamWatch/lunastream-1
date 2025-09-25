import React from 'react';
import { Cast } from 'lucide-react';

interface CastButtonProps {
  onCast: () => void;
  isCasting: boolean;
}

export function CastButton({ onCast, isCasting }: CastButtonProps) {
  return (
    <button
      onClick={onCast}
      className={`transition-colors duration-200 p-1 ${
        isCasting ? 'text-[#fbc9ff]' : 'text-white hover:text-[#fbc9ff]'
      }`}
      aria-label="Cast to Chromecast"
    >
      <Cast className="w-5 h-5" />
    </button>
  );
}