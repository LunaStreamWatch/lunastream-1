import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, X, Clock, ChevronRight } from 'lucide-react';
import { continueWatchingService, ContinueWatchingItem } from '../services/continueWatching';
import { getPlayerUrl } from '../utils/playerUtils';
import { useLanguage } from './LanguageContext';
import { translations } from '../data/i18n';
import { useIsMobile } from '../hooks/useIsMobile';

const ContinueWatching: React.FC = () => {
  const [items, setItems] = useState<ContinueWatchingItem[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentItem, setCurrentItem] = useState<ContinueWatchingItem | null>(null);
  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  const isMobile = useIsMobile();

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = () => {
    const continueItems = continueWatchingService.getContinueWatchingItems();
    setItems(continueItems);
  };

  const handleContinueWatching = (item: ContinueWatchingItem) => {
    setCurrentItem(item);
    setIsPlaying(true);
  };

  const handleRemoveItem = (e: React.MouseEvent, itemId: string) => {
    e.preventDefault();
    e.stopPropagation();
    continueWatchingService.removeItem(itemId);
    loadItems();
  };

  const handleClosePlayer = () => {
    setIsPlaying(false);
    setCurrentItem(null);
  };

  const getPlayerUrlForItem = (item: ContinueWatchingItem): string => {
    if (item.type === 'movie' && item.tmdbId) {
      return getPlayerUrl('vidify', {
        tmdbId: item.tmdbId.toString(),
        mediaType: 'movie'
      });
    } else if (item.type === 'tv' && item.tmdbId && item.season && item.episode) {
      return getPlayerUrl('vidify', {
        tmdbId: item.tmdbId.toString(),
        mediaType: 'tv',
        seasonNumber: item.season,
        episodeNumber: item.episode
      });
    } else if (item.type === 'anime' && item.anilistId && item.episode) {
      return getPlayerUrl('vidify', {
        anilistId: item.anilistId.toString(),
        mediaType: 'anime',
        episodeNumber: item.episode,
        isDub: item.isDub || false
      });
    }
    throw new Error('Invalid continue watching item');
  };

  const formatProgress = (progress?: number): string => {
    if (!progress) return '';
    return `${Math.round(progress)}%`;
  };

  const formatLastWatched = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (items.length === 0) {
    return null;
  }

  if (isPlaying && currentItem) {
    return (
      <div className="fixed inset-0 bg-black z-50">
        <div className="absolute top-6 right-6 z-10">
          <button
            onClick={handleClosePlayer}
            className="text-white hover:text-gray-300 transition-colors"
            aria-label="Close Player"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        <iframe
          src={getPlayerUrlForItem(currentItem)}
          className="fixed top-0 left-0 w-full h-full border-0"
          title={currentItem.title}
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          referrerPolicy="origin-when-cross-origin"
        />
      </div>
    );
  }

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className={`font-bold text-gray-900 dark:text-white transition-colors duration-300 ${isMobile ? 'text-xl' : 'text-3xl'}`}>
          <Clock className={`inline mr-3 text-pink-500 ${isMobile ? 'w-6 h-6' : 'w-8 h-8'}`} />
          {t.continue_watching || 'Continue Watching'}
        </h2>
        <button
          onClick={() => {
            continueWatchingService.clearAll();
            loadItems();
          }}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
        >
          {t.clear_all || 'Clear All'}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="group block bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-pink-200/50 dark:border-gray-700/50 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
            onClick={() => handleContinueWatching(item)}
          >
            {/* Poster */}
            <div className="aspect-[2/3] overflow-hidden relative">
              <img
                src={item.poster}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              
              {/* Progress Bar */}
              {item.progress && item.progress > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
                  <div 
                    className="h-full bg-gradient-to-r from-pink-500 to-purple-600"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              )}

              {/* Play Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                  <Play className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Remove Button */}
              <button
                onClick={(e) => handleRemoveItem(e, item.id)}
                className="absolute top-2 right-2 w-8 h-8 bg-red-500/90 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                title="Remove from continue watching"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Type Badge */}
              <div className="absolute top-2 left-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${
                  item.type === 'movie' ? 'bg-pink-500/90' : 
                  item.type === 'tv' ? 'bg-purple-500/90' : 
                  'bg-indigo-500/90'
                }`}>
                  {item.type === 'movie' ? t.content_movie_singular : 
                   item.type === 'tv' ? t.content_tv_singular : 
                   'Anime'}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2 line-clamp-2 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                {item.title}
              </h3>
              
              {/* Episode/Season Info */}
              {item.type === 'tv' && item.season && item.episode && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  S{item.season}E{item.episode}
                  {item.episodeTitle && `: ${item.episodeTitle}`}
                </p>
              )}
              
              {item.type === 'anime' && item.episode && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Episode {item.episode} {item.isDub ? '(Dub)' : '(Sub)'}
                </p>
              )}

              {/* Progress and Time */}
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatLastWatched(item.lastWatched)}</span>
                </div>
                {item.progress && (
                  <div className="flex items-center space-x-1">
                    <Play className="w-3 h-3 text-pink-500" />
                    <span className="text-pink-600 dark:text-pink-400 font-medium">{formatProgress(item.progress)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContinueWatching;