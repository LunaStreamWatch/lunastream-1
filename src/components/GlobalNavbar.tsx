import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Film,
  Archive,
  Home,
  Search,
  Compass,
  Heart,
  Flower,
  Menu,
  X,
} from "lucide-react";
import { translations } from "../data/i18n";
import { SettingsMenu } from "./SettingsMenu";
import { AccountMenu } from "./AccountMenu";
import { useLanguage } from "./LanguageContext";

const GlobalNavbar: React.FC = () => {
  const location = useLocation();
  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const navItems = [
    { path: "/", label: t.nav_home, icon: Home },
    { path: "/search", label: t.nav_search, icon: Search },
    { path: "/anime", label: t.nav_anime || "Anime", icon: Flower },
    { path: "/discover", label: t.nav_discover, icon: Compass },
    { path: "/vault", label: t.nav_vault, icon: Archive },
  ];

  return (
    <>
      {/* Navbar */}
      <nav className="bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-b border-pink-200/50 dark:border-gray-600/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-r from-[var(--grad-from)] to-[var(--grad-to)] rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <Film className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-[var(--grad-from)] to-[var(--grad-to)] bg-clip-text text-transparent">
                LunaStream
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-1 absolute left-1/2 transform -translate-x-1/2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all ${
                      isActive(item.path)
                        ? "bg-gradient-to-r from-[var(--grad-from)] to-[var(--grad-to)] text-white shadow-lg"
                        : "text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-pink-600 dark:hover:text-pink-400"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right side: Donate + Account + Settings (Desktop only) */}
            <div className="hidden md:flex items-center ml-auto space-x-3 z-10">
              <Link
                to="/donate"
                className="p-2 rounded-lg text-pink-500 hover:text-pink-600 transition flex items-center"
                title={t.nav_donate}
              >
                <Heart className="w-5 h-5" />
              </Link>

              <AccountMenu />
              <SettingsMenu />
            </div>

            {/* Mobile Hamburger */}
            <div className="md:hidden ml-auto flex items-center">
              <button
                onClick={() => setMenuOpen(true)}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />

          {/* Drawer */}
          <div className="relative z-50 w-72 max-w-full h-full bg-white dark:bg-gray-900 p-6 space-y-6 overflow-y-auto shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">Menu</span>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation links */}
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                      isActive(item.path)
                        ? "bg-gradient-to-r from-[var(--grad-from)] to-[var(--grad-to)] text-white shadow-lg"
                        : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Bottom: Donate + Account + Settings */}
            <div className="mt-auto flex items-center justify-start space-x-3">
              <Link
                to="/donate"
                onClick={() => setMenuOpen(false)}
                className="p-2 rounded-lg text-pink-500 hover:text-pink-600 transition flex items-center"
                title={t.nav_donate}
              >
                <Heart className="w-5 h-5" />
              </Link>

              <div className="flex items-center h-full">
                <AccountMenu />
              </div>

              <div className="flex items-center h-full">
                <SettingsMenu />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GlobalNavbar;
