export type AnimationSettings = {
  enableWelcomeAnimation: boolean;
};

const defaultSettings: AnimationSettings = {
  enableWelcomeAnimation: false, // Default to false
};

export class AnimationSettingsService {
  private static readonly STORAGE_KEY = 'lunastream-animation-settings';

  static getSettings(): AnimationSettings {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return { ...defaultSettings, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error("Failed to read animation settings, using defaults.", error);
    }
    // If nothing is stored or parsing fails, save and return default settings
    this.saveSettings(defaultSettings);
    return defaultSettings;
  }

  static saveSettings(settings: Partial<AnimationSettings>): void {
    try {
      const currentSettings = this.getSettings();
      const newSettings = { ...currentSettings, ...settings };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newSettings));
    } catch (error) {
      console.error("Failed to save animation settings.", error);
    }
  }
}

export const defaultAnimationSettings = defaultSettings;