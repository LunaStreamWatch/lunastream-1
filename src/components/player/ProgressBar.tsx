import React from 'react';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  buffered: number;
  onSeek: (time: number) => void;
  className?: string;
}

export function ProgressBar({ currentTime, duration, buffered, onSeek, className = '' }: ProgressBarProps) {
  const progressRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [hoverTime, setHoverTime] = React.useState<number | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    handleSeek(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const time = percentage * duration;
    
    setHoverTime(time);
  };

  const handleSeek = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onSeek(percentage * duration);
  };

  React.useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && progressRef.current) {
        const rect = progressRef.current.getBoundingClientRect();
        const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        onSeek(percentage * duration);
      }
    };

    if (isDragging) {
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDragging, duration, onSeek]);

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;
  const bufferedPercentage = duration ? (buffered / duration) * 100 : 0;

  return (
    <div className={`relative group ${className}`}>
      <div
        ref={progressRef}
        className="h-1 bg-white/30 rounded cursor-pointer group-hover:h-2 transition-all duration-200"
        onMouseDown={handleMouseDown}
        onClick={handleSeek}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverTime(null)}
      >
        <div
          className="h-full bg-white/50 rounded"
          style={{ width: `${bufferedPercentage}%` }}
        />
        <div
          className="absolute top-0 h-full bg-[#fbc9ff] rounded"
          style={{ width: `${progressPercentage}%` }}
        />
        <div
          className="absolute top-1/2 w-3 h-3 bg-[#fbc9ff] rounded-full -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ left: `${progressPercentage}%`, transform: 'translateX(-50%) translateY(-50%)' }}
        />
      </div>
      
      {hoverTime !== null && (
        <div
          className="absolute bottom-6 bg-black/80 text-white text-xs px-2 py-1 rounded pointer-events-none"
          style={{ left: `${(hoverTime / duration) * 100}%`, transform: 'translateX(-50%)' }}
        >
          {Math.floor(hoverTime / 60)}:{(Math.floor(hoverTime % 60)).toString().padStart(2, '0')}
        </div>
      )}
    </div>
  );
}