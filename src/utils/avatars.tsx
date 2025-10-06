import React from 'react';

export const AVATAR_OPTIONS = [
  { id: 'blue', label: 'Blue', color: '#1E88E5', face: 'smile' },
  { id: 'red', label: 'Red', color: '#E53935', face: 'happy' },
  { id: 'green', label: 'Green', color: '#43A047', face: 'cool' },
  { id: 'yellow', label: 'Yellow', color: '#FDD835', face: 'cheerful' },
  { id: 'orange', label: 'Orange', color: '#FB8C00', face: 'grin' },
  { id: 'teal', label: 'Teal', color: '#00897B', face: 'wink' },
  { id: 'pink', label: 'Pink', color: '#D81B60', face: 'joy' },
  { id: 'cyan', label: 'Cyan', color: '#00ACC1', face: 'pleased' },
] as const;

export type AvatarId = typeof AVATAR_OPTIONS[number]['id'];

export const getAvatarColor = (avatarId: string): string => {
  const avatar = AVATAR_OPTIONS.find(a => a.id === avatarId);
  return avatar?.color || AVATAR_OPTIONS[0].color;
};

export const getAvatarFace = (avatarId: string): string => {
  const avatar = AVATAR_OPTIONS.find(a => a.id === avatarId);
  return avatar?.face || AVATAR_OPTIONS[0].face;
};

export const AvatarIcon: React.FC<{
  avatarId: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}> = ({ avatarId, size = 'medium', className = '' }) => {
  const color = getAvatarColor(avatarId);
  const face = getAvatarFace(avatarId);

  const sizeClass = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  }[size];

  const eyeSize = {
    small: 2,
    medium: 3,
    large: 4
  }[size];

  const mouthSize = {
    small: 8,
    medium: 12,
    large: 16
  }[size];

  return (
    <div
      className={`${sizeClass} ${className} rounded-lg flex items-center justify-center`}
      style={{ backgroundColor: color }}
    >
      <svg viewBox="0 0 24 24" className="w-full h-full p-1">
        {/* Eyes */}
        <circle cx="8" cy="9" r={eyeSize} fill="white" />
        <circle cx="16" cy="9" r={eyeSize} fill="white" />

        {/* Smile */}
        {face === 'smile' && (
          <path
            d={`M 7 ${14} Q 12 ${14 + mouthSize/3} 17 ${14}`}
            stroke="white"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        )}

        {/* Happy */}
        {face === 'happy' && (
          <path
            d={`M 7 ${13} Q 12 ${13 + mouthSize/2} 17 ${13}`}
            stroke="white"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
        )}

        {/* Cool */}
        {face === 'cool' && (
          <>
            <line x1="5" y1="9" x2="11" y2="9" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <line x1="13" y1="9" x2="19" y2="9" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <line x1="7" y1="14" x2="17" y2="14" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </>
        )}

        {/* Cheerful */}
        {face === 'cheerful' && (
          <path
            d={`M 6 ${14} Q 12 ${14 + mouthSize/2.5} 18 ${14}`}
            stroke="white"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
        )}

        {/* Grin */}
        {face === 'grin' && (
          <>
            <path
              d={`M 7 ${13} Q 12 ${13 + mouthSize/2} 17 ${13}`}
              stroke="white"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <line x1="10" y1="15" x2="14" y2="15" stroke="white" strokeWidth="1.5" />
          </>
        )}

        {/* Wink */}
        {face === 'wink' && (
          <>
            <line x1="6" y1="9" x2="10" y2="9" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <path
              d={`M 7 ${14} Q 12 ${14 + mouthSize/3} 17 ${14}`}
              stroke="white"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </>
        )}

        {/* Joy */}
        {face === 'joy' && (
          <>
            <path
              d={`M 7 ${12} Q 12 ${12 + mouthSize/2} 17 ${12}`}
              stroke="white"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="8" cy="6" r="1.5" fill="white" />
            <circle cx="16" cy="6" r="1.5" fill="white" />
          </>
        )}

        {/* Pleased */}
        {face === 'pleased' && (
          <>
            <line x1="6" y1="8" x2="10" y2="10" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <line x1="14" y1="10" x2="18" y2="8" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <path
              d={`M 8 ${14} Q 12 ${14 + mouthSize/3} 16 ${14}`}
              stroke="white"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </>
        )}
      </svg>
    </div>
  );
};
