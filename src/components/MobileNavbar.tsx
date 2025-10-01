import React, { useState, useEffect } from 'react';
import { Menu, X, Home, Search, Archive, Compass, Film, Heart, Flower } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
import { translations } from '../data/i18n';
import { SettingsMenu } from './SettingsMenu';

interface MobileNavbarProps {
  className?: string;
}

export default function MobileNavbar({ className = '' }: MobileNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [logoSpin, setLogoSpin] = useState(false);
  const location = useLocation();
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { path: '/', label: t.nav_home, icon: Home },
    { path: '/search', label: t.nav_search, icon: Search },
    { path: '/anime', label: t.nav_anime || 'Anime', icon: Flower },
    { path: '/discover', label: t.nav_discover, icon: Compass },
    { path: '/vault', label: t.nav_vault, icon: Archive },
  ];
  return (
    <nav className="bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-b border-pink-200/50 dark:border-gray-600/30 sticky top-0 z-50 transition-all duration-300 md:hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 group cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              setLogoSpin(true);
              window.location.href = '/';
              setTimeout(() => {
                setLogoSpin(false);
              }, 2000);
            }}
          >
            <div className={`w-8 h-8 bg-gradient-to-r from-[var(--grad-from)] to-[var(--grad-to)] rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-200 ${logoSpin ? 'animate-spin' : ''}`}
                 style={logoSpin ? { animationDuration: '2000ms' } : undefined}>
              <Film className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-[var(--grad-from)] to-[var(--grad-to)] bg-clip-text text-transparent">
              LunaStream
            </span>
          </div>

          {/* Mobile Navigation Icons */}
          <div className="flex items-center space-x-1">
            {navItems.slice(0, 4).map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-[var(--grad-from)] to-[var(--grad-to)] text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-[var(--grad-from)] dark:hover:text-[var(--grad-to)]'
                  }`}
                  title={item.label}
                >
                  <Icon className="w-5 h-5" />
                </Link>
              );
            })}
            
            {/* Menu Button */}
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-out Menu */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={closeMenu} />
          <div className="fixed top-0 right-0 h-full w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl z-50 transform transition-transform duration-300">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
              <button
                onClick={closeMenu}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-6">
              {/* Navigation Links */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Navigation</h3>
                <div className="space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={closeMenu}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-xl transition-all duration-200 ${
                          isActive(item.path)
                            ? 'bg-gradient-to-r from-[var(--grad-from)] to-[var(--grad-to)] text-white shadow-lg'
                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Donate Button */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Support</h3>
                <Link
                  to="/donate"
                  onClick={closeMenu}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-xl transition-all duration-200 border-2 ${
                    isActive('/donate')
                      ? 'bg-gradient-to-r from-[var(--grad-from)] to-[var(--grad-to)] text-white shadow-lg border-transparent'
                      : 'text-[var(--grad-from)] dark:text-[var(--grad-to)] border-[var(--grad-from)] dark:border-[var(--grad-to)] hover:bg-gradient-to-r hover:from-[var(--grad-from)] hover:to-[var(--grad-to)] hover:text-white'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                  <span className="font-medium">{t.nav_donate}</span>
                </Link>
              </div>
              {/* Settings */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Settings</h3>
                <div className="flex justify-start">
                  <SettingsMenu />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}