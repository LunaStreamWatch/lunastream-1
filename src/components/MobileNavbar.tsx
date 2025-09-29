import React, { useState } from 'react';
import { Menu, X, Home, Search, Bookmark, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MobileNavbarProps {
  className?: string;
}

export default function MobileNavbar({ className = '' }: MobileNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className={`md:hidden ${className}`}>
      {/* Mobile menu button */}
      <button
        onClick={toggleMenu}
        className="p-2 text-white hover:text-gray-300 transition-colors"
        aria-label="Toggle mobile menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={closeMenu}>
          <div className="fixed top-0 right-0 h-full w-64 bg-gray-900 shadow-lg transform transition-transform">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h2 className="text-white font-semibold">Menu</h2>
              <button
                onClick={closeMenu}
                className="p-1 text-white hover:text-gray-300 transition-colors"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            
            <nav className="p-4">
              <ul className="space-y-4">
                <li>
                  <Link
                    to="/"
                    onClick={closeMenu}
                    className="flex items-center space-x-3 text-white hover:text-blue-400 transition-colors"
                  >
                    <Home size={20} />
                    <span>Home</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/search"
                    onClick={closeMenu}
                    className="flex items-center space-x-3 text-white hover:text-blue-400 transition-colors"
                  >
                    <Search size={20} />
                    <span>Search</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/watchlist"
                    onClick={closeMenu}
                    className="flex items-center space-x-3 text-white hover:text-blue-400 transition-colors"
                  >
                    <Bookmark size={20} />
                    <span>Watchlist</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/settings"
                    onClick={closeMenu}
                    className="flex items-center space-x-3 text-white hover:text-blue-400 transition-colors"
                  >
                    <Settings size={20} />
                    <span>Settings</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}