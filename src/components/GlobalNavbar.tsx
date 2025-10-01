import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Film, Archive, Home, Search, Compass, Heart, ChevronDown, Flower } from 'lucide-react';
import { translations } from '../data/i18n';
import { SettingsMenu } from './SettingsMenu';

import { useIsMobile } from "../hooks/useIsMobile"
import MobileNavbar from "./MobileNavbar"

import { useLanguage } from './LanguageContext';

const GlobalNavbar: React.FC = () => {
  const location = useLocation();
  const { language, setLanguage } = useLanguage();

  const isMobile = useIsMobile()

  // **Return MobileNavbar entirely on mobile**
  if (isMobile) {
    return <MobileNavbar />
  }

  const t = translations[language] || translations.en;

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Define nav items with translated labels
  const navItems = [
    { path: '/', label: t.nav_home, icon: Home },
    { path: '/search', label: t.nav_search, icon: Search },
    { path: '/anime', label: t.nav_anime || 'Anime', icon: Flower },
    { path: '/discover', label: t.nav_discover, icon: Compass },
    // { path: '/soon', label: t.home_coming_soon, icon: Calendar }, // optional
    { path: '/vault', label: t.nav_vault, icon: Archive },
  ];

  // Add spin state for LunaStream icon
  const [logoSpin, setLogoSpin] = useState(false);

  return (
    <nav className="bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-b border-pink-200/50 dark:border-gray-600/30 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center h-16">
          <div className="flex items-center space-x-2 group z-10 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              setLogoSpin(true);
              // Navigate immediately but keep spinning
              window.location.href = '/';
              // Keep spinning for additional time after navigation
              setTimeout(() => {
                setLogoSpin(false);
              }, 2000);
            }}
          >
            <div className={`w-8 h-8 bg-gradient-to-r from-[var(--grad-from)] to-[var(--grad-to)] rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-200 ${logoSpin ? 'animate-spin' : ''}`}
                 style={logoSpin ? { animationDuration: '2000ms' } : undefined}>
              <Film className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[var(--grad-from)] to-[var(--grad-to)] bg-clip-text text-transparent">
              LunaStream
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 absolute left-1/2 transform -translate-x-1/2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-[var(--grad-from)] to-[var(--grad-to)] text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-pink-600 dark:hover:text-pink-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-1 ml-auto z-10">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-[var(--grad-from)] to-[var(--grad-to)] text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-pink-600 dark:hover:text-pink-400'
                  }`}
                  title={item.label}
                >
                  <Icon className="w-5 h-5" />
                </Link>
              );
            })}
          </div>

          {/* Right side controls: Donate, ThemeToggle, LanguageSelector */}
          <div className="flex items-center ml-auto space-x-3 z-10">
            <Link
              to="/donate"
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                isActive('/donate')
                  ? 'bg-gradient-to-r from-[var(--grad-from)] to-[var(--grad-to)] text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-pink-600 dark:hover:text-pink-400'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>{t.nav_donate}</span>
            </Link>

            {/* Unified Settings menu */}
            <SettingsMenu />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default GlobalNavbar;