import React, { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X, Home, Search, Compass, Archive, Heart, Film, Flower } from "lucide-react"
import { translations } from "../data/i18n"
import { useLanguage } from "./LanguageContext"
import { SettingsMenu } from "./SettingsMenu"

const MobileNavbar: React.FC = () => {
  const location = useLocation()
  const { language } = useLanguage()
  const t = translations[language] || translations.en

  const [menuOpen, setMenuOpen] = useState(false)
  const [logoSpin, setLogoSpin] = useState(false)

  const navItems = [
    { path: "/", label: t.nav_home, icon: Home },
    { path: "/search", label: t.nav_search, icon: Search },
    { path: "/anime", label: t.nav_anime || "Anime", icon: Flower },
    { path: "/discover", label: t.nav_discover, icon: Compass },
    { path: "/vault", label: t.nav_vault, icon: Archive },
  ]

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path)

  return (
    <nav className="md:hidden sticky top-0 z-50 bg-white dark:bg-gray-950 shadow-sm border-b border-pink-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Vertically centered by flex and minHeight */}
        <Link to="/" className="flex items-center space-x-2"
          onMouseDown={() => {
            setLogoSpin(true)
            setTimeout(() => setLogoSpin(false), 1200)
          }}
          onClick={() => {
            setLogoSpin(true)
            setTimeout(() => setLogoSpin(false), 1200)
          }}
        >
          <div className={`w-8 h-8 bg-gradient-to-r from-[var(--grad-from)] to-[var(--grad-to)] rounded-lg flex items-center justify-center shadow-lg ${logoSpin ? 'animate-spin' : ''}`}
               style={logoSpin ? { animationDuration: '1200ms' } : undefined}>
            <Film className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-[var(--grad-from)] to-[var(--grad-to)] bg-clip-text text-transparent">
            LunaStream
          </span>
        </Link>
        
        <div className="flex items-center space-x-2">
          {/* Unified settings menu for theme/language/accents/fonts */}
          <SettingsMenu />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-700 dark:text-white p-2"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="px-4 pb-4 space-y-3 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-t border-pink-200/50 dark:border-gray-700/50">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive(path)
                  ? "bg-gradient-to-r from-[var(--grad-from)] to-[var(--grad-to)] text-white"
                  : "text-gray-700 dark:text-white hover:bg-pink-50 dark:hover:bg-gray-800/50"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </Link>
          ))}
          
          {/* Donate Link */}
          <Link
            to="/donate"
            onClick={() => setMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              isActive('/donate')
                ? "bg-gradient-to-r from-[var(--grad-from)] to-[var(--grad-to)] text-white"
                : "text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-700 hover:bg-pink-50 dark:hover:bg-pink-900/20"
            }`}
          >
            <Heart className="w-5 h-5" />
            <span>{t.nav_donate}</span>
          </Link>
        </div>
      )}
    </nav>
  )
}

export default MobileNavbar