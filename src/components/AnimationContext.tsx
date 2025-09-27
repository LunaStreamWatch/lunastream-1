import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimationSettingsService, type AnimationSettings } from '../services/animationSettings';

type AnimationContextType = {
  settings: AnimationSettings;
  updateSettings: (newSettings: Partial<AnimationSettings>) => void;
};

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export const AnimationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AnimationSettings>(() => 
    AnimationSettingsService.getSettings()
  );

  const updateSettings = useCallback((newSettings: Partial<AnimationSettings>) => {
    AnimationSettingsService.saveSettings(newSettings);
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  return (
    <AnimationContext.Provider value={{ settings, updateSettings }}>
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (context === undefined) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
};