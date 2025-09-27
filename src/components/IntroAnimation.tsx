import React, { useEffect, useState } from 'react';
import { Film } from 'lucide-react';
import { useAnimation } from './AnimationContext';
import { introSound } from '../assets/sounds/intro';

interface IntroAnimationProps {
  onComplete: () => void;
}

export const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const { settings } = useAnimation();
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!settings.enableWelcomeAnimation) {
      onComplete();
      return;
    }

    const audio = new Audio(introSound);
    audio.play().catch(error => {
      console.log("Audio autoplay prevented:", error);
    });

    const totalDuration = 1900; // Animation: 1.2s, Linger: 0.7s

    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, totalDuration - 700); // Start exit animation 0.7s before end

    const completeTimer = setTimeout(() => {
      onComplete();
    }, totalDuration);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [settings.enableWelcomeAnimation, onComplete]);

  if (!settings.enableWelcomeAnimation) {
    return null;
  }

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black ${
        isExiting ? 'puff-out-center' : ''
      }`}
    >
      <div className={`flex items-center justify-center ${!isExiting ? 'zoom-in-fwd' : ''}`}>
        <Film className="w-24 h-24" color="#deaddd" />
        <h1 
          className="ml-4 text-5xl font-bold" 
          style={{ 
            color: '#deaddd',
            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        >
          LunaStream
        </h1>
      </div>
    </div>
  );
};

export default IntroAnimation;