import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, TrendingUp, Star, ArrowLeft, ArrowRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { anilist, Anime } from '../services/anilist';
import GlobalNavbar from './GlobalNavbar';
import { useLanguage } from './LanguageContext';
import { translations } from '../data/i18n';
import { useIsMobile } from '../hooks/useIsMobile';
import Loading from './Loading';

const ITEMS_PER_PAGE = 18;

// Pagination component (unchanged)
const Pagination: React.FC<{ currentPage: number; totalPages: number; onPageChange: (page: number) => void; isMobile: boolean }> = ({
  currentPage,
  totalPages,
  onPageChange,
  isMobile,
}) => {
  if (totalPages <= 1) return null;

  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxPageButtons = isMobile ? 3 : 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }, [currentPage, totalPages, isMobile]);

  return (
    <div className={`flex justify-center items-center gap-2 flex-wrap ${isMobile ? 'mt-6' : 'mt-10'}`}>
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className={`bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full shadow disabled:opacity-40 transition-opacity ${isMobile ? 'px-3 py-2' : 'px-4 py-2'}`}
        aria-label="First page"
      >
        <ChevronsLeft size={isMobile ? 16 : 18} />
      </button>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full shadow disabled:opacity-40 transition-opacity ${isMobile ? 'p-2' : 'px-6 py-2'}`}
        aria-label="Previous page"
      >
        <ArrowLeft className={`inline-block ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} /> <span className={isMobile ? 'sr-only' : 'inline'}>Prev</span>
      </button>

      {pageNumbers.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`font-medium rounded-full shadow transition-all duration-200 ${
            page === currentPage
              ? 'bg-purple-600 text-white px-4 py-2'
              : 'bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-purple-500 hover:text-white px-4 py-2'
          } ${isMobile ? 'text-sm' : 'text-base'}`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full shadow disabled:opacity-40 transition-opacity ${isMobile ? 'p-2' : 'px-6 py-2'}`}
        aria-label="Next page"
      >
        <span className={isMobile ? 'sr-only' : 'inline'}>Next</span> <ArrowRight className={`inline-block ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className={`bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full shadow disabled:opacity-40 transition-opacity ${isMobile ? 'px-3 py-2' : 'px-4 py-2'}`}
        aria-label="Last page"
      >
        <ChevronsRight size={isMobile ? 16 : 18} />
      </button>
    </div>
  );
};

const AnimeSection: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [searchInput, setSearchInput] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<Anime[]>([]);
  const [contentLoading, setContentLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [trendingTvShows, setTrendingTvShows] = useState<Anime[]>([]);
  const [popularTvShows, setPopularTvShows] = useState<Anime[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Anime[]>([]);
  const [popularMovies, setPopularMovies] = useState<Anime[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  const isMobile = useIsMobile();
  const hasSearched = !!initialQuery;

  // Debounced search query update
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const trimmedSearchInput = searchInput.trim();
      const newParams = new URLSearchParams();
      if (trimmedSearchInput) {
        newParams.set('q', trimmedSearchInput);
      } else {
        newParams.delete('q');
      }
      setSearchParams(newParams);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchInput, setSearchParams]);

  // Fetch initial data
  useEffect(() => {
    if (hasSearched) return;

    const fetchInitialData = async () => {
      try {
        setContentLoading(true);
        const [
          trendingTvData,
          popularTvData,
          trendingMovieData,
          popularMovieData,
        ] = await Promise.all([
          anilist.getTrendingAnime(1, 12, 'TV'),
          anilist.getPopularAnime(1, 12, 'TV'),
          anilist.getTrendingAnime(1, 12, 'MOVIE'),
          anilist.getPopularAnime(1, 12, 'MOVIE'),
        ]);

        setTrendingTvShows(trendingTvData.data.Page.media || []);
        setPopularTvShows(popularTvData.data.Page.media || []);
        setTrendingMovies(trendingMovieData.data.Page.media || []);
        setPopularMovies(popularMovieData.data.Page.media || []);
      } catch (err) {
        console.error('Failed to fetch anime data:', err);
        setError('Failed to load anime/movies data');
      } finally {
        setContentLoading(false);
      }
    };
    fetchInitialData();
  }, [hasSearched]);

  // Perform search
  useEffect(() => {
    const performSearch = async () => {
      if (!initialQuery.trim()) {
        setSearchResults([]);
        setError(null);
        return;
      }

      try {
        setSearchLoading(true);
        setError(null);
        const searchData = await anilist.searchAnime(initialQuery, currentPage, ITEMS_PER_PAGE);
        setSearchResults(searchData.data.Page.media || []);
      } catch (err) {
        console.error('Search failed:', err);
        setError('Search failed. Please try again.');
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    };

    if (hasSearched) {
      performSearch();
    }
  }, [initialQuery, currentPage, hasSearched]);

  // Suggestions
  const [suggestions, setSuggestions] = useState<Anime[]>([]);
  const clearSuggestions = useCallback(() => setSuggestions([]), []);

  useEffect(() => {
    if (!searchInput.trim() || searchInput.length < 2) {
      setSuggestions([]);
      return;
    }
    const fetchSuggestions = async () => {
      try {
        const suggestionsData = await anilist.searchAnime(searchInput, 1, 6);
        setSuggestions(suggestionsData.data.Page.media || []);
      } catch (err) {
        console.error('Failed to fetch suggestions:', err);
        setSuggestions([]);
      }
    };
    const timeout = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: searchInput.trim() });
    clearSuggestions();
    setCurrentPage(1);
  };

  const handleSuggestionClick = (anime: Anime) => {
    clearSuggestions();
    const formatPath = anilist.isMovie(anime) ? "movie" : "tv";
    navigate(`/anime/${formatPath}/${anime.id}`);
  };

  // Use all search results (TV + Movies)
  const searchMedia = useMemo(() => searchResults, [searchResults]);
  const totalPages = Math.ceil(searchMedia.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // AnimeCard component
  const AnimeCard: React.FC<{ anime: Anime }> = ({ anime }) => {
    const displayTitle = anilist.getDisplayTitle(anime);
    const year = anilist.getYear(anime);
    const score = anilist.formatScore(anime.averageScore);
    const formatPath = anilist.isMovie(anime) ? "movie" : "tv";
    const path = `/anime/${formatPath}/${anime.id}`;

    return (
      <div
        onClick={() => navigate(path)}
        className={`group block bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border border-purple-200/50 dark:border-gray-700/50 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer ${isMobile ? 'rounded-lg' : 'rounded-xl'}`}
      >
        <div className="aspect-[2/3] overflow-hidden">
          <img
            src={anime.coverImage.large || '/placeholder.svg'}
            alt={displayTitle}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
        </div>
        <div className={isMobile ? 'p-2' : 'p-4'}>
          <h3 className={`font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors ${isMobile ? 'text-xs' : 'text-sm'}`}>
            {displayTitle}
          </h3>
          <div className={`flex items-center justify-between mt-1 text-gray-500 dark:text-gray-400 ${isMobile ? 'text-xs' : 'text-xs'}`}>
            <span>{year}</span>
            <div className="flex items-center">
              <Star className="w-3 h-3 text-yellow-500 mr-1" />
              <span>{score}</span>
            </div>
          </div>
          <div className={`mt-1 ${isMobile ? 'text-xs' : 'text-xs'}`}>
            <span className={`px-2 py-0.5 rounded-full text-white text-xs font-medium bg-purple-500`}>
              {anime.format}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderSection = (title: string, animes: Anime[], icon: React.FC<any>, iconColor: string) => {
    const IconComponent = icon;
    if (!animes.length) return null;

    return (
      <div className="mb-12">
        <h2 className={`flex items-center mb-8 font-bold text-gray-900 dark:text-white ${isMobile ? 'text-xl' : 'text-3xl'}`}>
          <IconComponent className={`mr-3 ${iconColor} ${isMobile ? 'w-6 h-6' : 'w-8 h-8'}`} />
          {title}
        </h2>
        <div className={`grid gap-6 ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'}`}>
          {animes.map(anime => <AnimeCard key={anime.id} anime={anime} />)}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
      <GlobalNavbar />

      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isMobile ? 'pt-4 pb-8' : 'pt-8 pb-12'}`}>
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 transition-colors duration-300 px-4">
            <span className="bg-gradient-to-r from-[var(--grad-from)] to-[var(--grad-to)] bg-clip-text text-transparent">
              Anime & Movies
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto transition-colors duration-300 px-4">
            LunaStream is your home for all the best anime series and films, past and present.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-xl border border-pink-200/50 dark:border-gray-700/50 transition-colors duration-300">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <Search className={`text-pink-400 dark:text-purple-400 transition-colors duration-300 ${isMobile ? 'h-5 w-5' : 'h-6 w-6'}`} />
                </div>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onBlur={() => setTimeout(clearSuggestions, 200)}
                  placeholder="Search for anime or movies..."
                  className={`block w-full bg-transparent border-0 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:ring-0 focus:outline-none transition-colors duration-300 ${isMobile ? 'pl-12 pr-4 py-4 text-base' : 'pl-16 pr-6 py-6 text-lg'}`}
                />
                <button
                  type="submit"
                  className={`absolute inset-y-0 right-0 flex items-center ${isMobile ? 'pr-2' : 'pr-6'}`}
                >
                  <div className={`bg-gradient-to-r from-[var(--grad-from)] to-[var(--grad-to)] text-white rounded-xl font-semibold hover:opacity-95 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${isMobile ? 'px-4 py-2' : 'px-8 py-3'}`}>
                    <span className={isMobile ? 'hidden' : 'inline'}>Search</span>
                    <Search className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5 hidden'}`} />
                  </div>
                </button>
              </div>
              {/* Suggestions Dropdown */}
              {suggestions.length > 0 && (
                <div className="absolute z-50 mt-2 w-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 max-h-96 overflow-auto">
                  {suggestions.map((anime) => {
                    const displayTitle = anilist.getDisplayTitle(anime);
                    const year = anilist.getYear(anime);
                    const score = anilist.formatScore(anime.averageScore);

                    return (
                      <div
                        key={anime.id}
                        onClick={() => handleSuggestionClick(anime)}
                        className="flex items-center p-4 hover:bg-pink-50 dark:hover:bg-gray-700/50 cursor-pointer transition-all duration-200 border-b border-gray-100 dark:border-gray-700/30 last:border-b-0"
                      >
                        <div className="flex-shrink-0 w-12 h-16 mr-4 rounded-lg overflow-hidden shadow-md">
                          <img
                            src={anime.coverImage.medium || anime.coverImage.large}
                            alt={displayTitle}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                                {displayTitle}
                              </h3>
                              <div className="flex items-center space-x-3 mt-1">
                                <span className="text-xs text-gray-500 dark:text-gray-400">{year}</span>
                                <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                                  <Star className="w-3 h-3 text-yellow-500" />
                                  <span>{score}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Main Content */}
        {hasSearched ? (
          // Search Results View
          <div className="space-y-12">
            <h2 className={`font-bold text-gray-900 dark:text-white ${isMobile ? 'text-xl' : 'text-3xl'}`}>
              Search Results for "{initialQuery}"
            </h2>
            {searchLoading ? (
              <div className="text-center py-16">
                <Loading message="Searching..." />
              </div>
            ) : searchMedia.length > 0 ? (
              <>
                <div className={`grid gap-6 ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'}`}>
                  {searchMedia.map(anime => <AnimeCard key={anime.id} anime={anime} />)}
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  isMobile={isMobile}
                />
              </>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 py-16">
                No results found.
              </div>
            )}
          </div>
        ) : (
          // Initial Landing Page View
          <div className="space-y-12">
            {contentLoading ? (
              <div className="text-center py-16">
                <Loading message="Loading anime sections..." />
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-16">{error}</div>
            ) : (
              <>
                {renderSection(t.popular_tv_shows || "Popular Anime", popularTvShows, Star, 'text-pink-500')}
                {renderSection(t.trending_tv_shows || "Trending Anime", trendingTvShows, TrendingUp, 'text-purple-500')}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimeSection;