import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type PlayerId = 'vidzy' | 'vidify' | 'videasy' | 'vidfast';

interface PlayerContextType {
  currentPlayer: PlayerId;
  setCurrentPlayer: (player: PlayerId) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

interface PlayerProviderProps {
  children: ReactNode;
}

export const PlayerProvider: React.FC<PlayerProviderProps> = ({ children }) => {
  const [currentPlayer, setCurrentPlayerState] = useState<PlayerId>(() => {
    try {
      const stored = localStorage.getItem('player');
      return (stored as PlayerId) || 'vidzy';
    } catch {
      return 'vidzy';
    }
  });

  const setCurrentPlayer = (player: PlayerId) => {
    setCurrentPlayerState(player);
    try {
      localStorage.setItem('player', player);
    } catch (error) {
      console.error('Failed to save player preference:', error);
    }
  };

  // Listen for storage changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'player' && e.newValue) {
        setCurrentPlayerState(e.newValue as PlayerId);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <PlayerContext.Provider value={{ currentPlayer, setCurrentPlayer }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};