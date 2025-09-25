import React from 'react';
import { Settings, Check } from 'lucide-react';
import { PlayerSettings } from '../types/player';

interface SettingsMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  settings: PlayerSettings;
  onSettingsChange: (settings: PlayerSettings) => void;
}

export function SettingsMenu({
  isOpen,
  onToggle,
  settings,
  onSettingsChange
}: SettingsMenuProps) {
  const [activeMenu, setActiveMenu] = React.useState<'main' | 'speed' | 'subtitle-style'>('main');
  
  const playbackSpeeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
  const fontSizes = [12, 14, 16, 18, 20, 24];
  const colors = ['#ffffff', '#ffff00', '#00ff00', '#00ffff', '#ff0000', '#ff00ff'];

  const updateSubtitleSettings = (updates: Partial<typeof settings.subtitleSettings>) => {
    onSettingsChange({
      ...settings,
      subtitleSettings: { ...settings.subtitleSettings, ...updates }
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="text-white hover:text-[#fbc9ff] transition-colors duration-200 p-1"
        aria-label="Settings"
      >
        <Settings className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="text-[#fbc9ff] transition-colors duration-200 p-1"
        aria-label="Settings"
      >
        <Settings className="w-5 h-5" />
      </button>
      
      <div className="absolute bottom-full right-0 mb-2 bg-black/90 backdrop-blur-sm rounded-lg border border-white/20 min-w-[200px] overflow-hidden">
        {activeMenu === 'main' && (
          <div className="p-2">
            <div className="text-white text-sm font-medium mb-2 px-2">Settings</div>
            
            <button
              onClick={() => setActiveMenu('speed')}
              className="w-full text-left px-2 py-2 text-white hover:bg-white/10 rounded text-sm flex items-center justify-between"
            >
              <span>Playback Speed</span>
              <span className="text-[#fbc9ff]">{settings.playbackSpeed}x</span>
            </button>
            
            <button
              onClick={() => setActiveMenu('subtitle-style')}
              className="w-full text-left px-2 py-2 text-white hover:bg-white/10 rounded text-sm"
            >
              Subtitle Style
            </button>
            
            <div className="border-t border-white/20 mt-2 pt-2">
              <button
                onClick={() => onSettingsChange({ ...settings, theme: settings.theme === 'dark' ? 'light' : 'dark' })}
                className="w-full text-left px-2 py-2 text-white hover:bg-white/10 rounded text-sm flex items-center justify-between"
              >
                <span>Theme</span>
                <span className="text-[#fbc9ff] capitalize">{settings.theme}</span>
              </button>
            </div>
          </div>
        )}
        
        {activeMenu === 'speed' && (
          <div className="p-2">
            <button
              onClick={() => setActiveMenu('main')}
              className="text-[#fbc9ff] text-sm mb-2 hover:text-white transition-colors"
            >
              ← Back
            </button>
            <div className="text-white text-sm font-medium mb-2 px-2">Playback Speed</div>
            {playbackSpeeds.map((speed) => (
              <button
                key={speed}
                onClick={() => onSettingsChange({ ...settings, playbackSpeed: speed })}
                className="w-full text-left px-2 py-2 text-white hover:bg-white/10 rounded text-sm flex items-center justify-between"
              >
                <span>{speed}x</span>
                {settings.playbackSpeed === speed && <Check className="w-4 h-4 text-[#fbc9ff]" />}
              </button>
            ))}
          </div>
        )}
        
        {activeMenu === 'subtitle-style' && (
          <div className="p-2">
            <button
              onClick={() => setActiveMenu('main')}
              className="text-[#fbc9ff] text-sm mb-2 hover:text-white transition-colors"
            >
              ← Back
            </button>
            <div className="text-white text-sm font-medium mb-3 px-2">Subtitle Style</div>
            
            <div className="space-y-3">
              <div>
                <label className="text-white text-xs mb-1 block px-2">Font Size</label>
                <div className="flex flex-wrap gap-1 px-2">
                  {fontSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => updateSubtitleSettings({ fontSize: size })}
                      className={`px-2 py-1 text-xs rounded ${
                        settings.subtitleSettings.fontSize === size
                          ? 'bg-[#fbc9ff] text-black'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      {size}px
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-white text-xs mb-1 block px-2">Text Color</label>
                <div className="flex flex-wrap gap-1 px-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => updateSubtitleSettings({ color })}
                      className={`w-6 h-6 rounded border-2 ${
                        settings.subtitleSettings.color === color
                          ? 'border-[#fbc9ff]'
                          : 'border-white/30'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              
              <div className="px-2">
                <label className="text-white text-xs mb-1 block">Delay: {settings.subtitleSettings.delay}s</label>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.1"
                  value={settings.subtitleSettings.delay}
                  onChange={(e) => updateSubtitleSettings({ delay: parseFloat(e.target.value) })}
                  className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}