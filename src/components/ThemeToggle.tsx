import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';
import { useLanguage } from './LanguageContext';
import { translations } from '../data/i18n';

const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useDarkMode();
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  return (
    <button
      onClick={toggleTheme}
      className="p-2 text-gray-600 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors duration-200"
      aria-label={isDark ? (t.switch_to_light_mode || 'Switch to light mode') : (t.switch_to_dark_mode || 'Switch to dark mode')}
    >
      {isDark ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
};

export default ThemeToggle;
