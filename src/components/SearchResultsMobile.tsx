import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Film, Star, Calendar, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { tmdb, fetchMultiplePages } from '../services/tmdb';
import Fuse from 'fuse.js';
import { Movie, TVShow } from '../types';
import GlobalNavbar from './GlobalNavbar';
import { translations } from '../data/i18n';
import { useLanguage } from "./LanguageContext";

type MediaItem = (Movie | TVShow) & { media_type: 'movie' | 'tv'; popularity: number };

const fuseOptions: Fuse.IFuseOptions<MediaItem> = {
  keys: [
    { name: 'title', weight: 0.9 },
    { name: 'name', weight: 0.9 },
    { name: 'original_title', weight: 0.7 },
    { name: 'original_name', weight: 0.7 },
    { name: 'overview', weight: 0.1 }
  ],
  threshold: 0.4,
  ignoreLocation: true,
  minMatchCharLength: 1,
  includeScore: true,
  findAllMatches: true,
  useExtendedSearch: true,
  includeMatches: true,
};

const preprocessQuery = (query: string): string =>
  query.toLowerCase().trim()
    .replace(/[^\w\s\-'.:]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\b&\b/g, 'and');

const MobileSearchResults: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialSort = (searchParams.get('sort') as 'popularity' | 'score') || 'score';

  const [searchInput, setSearchInput] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState<'score' | 'popularity'>(initialSort);
  const [results, setResults] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 12; // Fewer items per page on mobile
  const startIdx = (currentPage - 1) * resultsPerPage;
  const paginatedResults = results.slice(startIdx, startIdx + resultsPerPage);

  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  const activeFetchId = useRef(0);

  // Effect to sync search input with URL params and handle debouncing
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const trimmedSearchInput = searchInput.trim();
      const newParams = new URLSearchParams();
      if (trimmedSearchInput) {
        newParams.set('q', trimmedSearchInput);
      }
      newParams.set('sort', sortBy);
      setSearchParams(newParams);
      setQuery(trimmedSearchInput);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchInput, sortBy, setSearchParams]);

  // Main effect to fetch results when the query changes
  useEffect(() => {
    if (!query) {
      setResults([]);
      setLoading(false);
      setError(null);
      setCurrentPage(1);
      return;
    }

    const fetchId = ++activeFetchId.current;
    setLoading(true);
    setError(null);

    const fetchInitialResults = async () => {
      try {
        const processed = preprocessQuery(query);
        const [movieResults, tvResults] = await Promise.all([
          fetchMultiplePages('/search/movie', { query: processed }, 1, 5),
          fetchMultiplePages('/search/tv', { query: processed }, 1, 5),
        ]);

        if (fetchId !== activeFetchId.current) return;

        const combinedResults: MediaItem[] = [
          ...movieResults.results.map(m => ({ ...m, media_type: 'movie', popularity: m.popularity || 0 })),
          ...tvResults.results.map(t => ({ ...t, media_type: 'tv', popularity: t.popularity || 0 })),
        ];

        const filteredResults = combinedResults.filter(item => item.poster_path);
        const fuse = new Fuse(filteredResults, fuseOptions);
        const fuseResults = fuse.search(query);

        const sortedResults = fuseResults
          .map(({ item, score }) => ({ ...item, score }))
          .sort((a, b) => {
            if (sortBy === 'popularity') {
              return (b.popularity - a.popularity) || (a.score! - b.score!);
            }
            return (a.score! - b.score!) || (b.popularity - a.popularity);
          });

        if (fetchId !== activeFetchId.current) return;
        setResults(sortedResults);
        setCurrentPage(1);
        setLoading(false);

      } catch (err) {
        if (fetchId !== activeFetchId.current) return;
        console.error("API Fetch Error:", err);
        setError(t.search_fail);
        setLoading(false);
      }
    };

    fetchInitialResults();
  }, [query, sortBy, t]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as 'popularity' | 'score');
  };

  const isMovie = (item: MediaItem): item is Movie & { media_type: 'movie' } => item.media_type === 'movie';
  const getTitle = (item: MediaItem) => isMovie(item) ? item.title : (item as TVShow).name;
  const getDate = (item: MediaItem) => isMovie(item) ? item.release_date : (item as TVShow).first_air_date;
  const getLink = (item: MediaItem) => isMovie(item) ? `/movie/${item.id}` : `/tv/${item.id}`;

  const totalLocalPages = Math.ceil(results.length / resultsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
      <GlobalNavbar />
      
      {/* Mobile Search Header */}
      <div className="bg-white/90 dark:bg-gray-950/90 backdrop-blur-md sticky top-16 z-40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-col space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
              <input
                type="text"
                placeholder={t.search_placeholder}
                value={searchInput}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl border border-pink-200/50 dark:border-gray-600/30 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-200 text-sm"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-700 dark:text-gray-300 truncate">
                {t.search_results_for} "<span className="font-semibold bg-gradient-to-r from-[var(--grad-from)] to-[var(--grad-to)] bg-clip-text text-transparent">{query}</span>" — {results.length} {results.length === 1 ? t.result : t.results}
              </p>
              <select
                aria-label={t.filter_sort_label}
                value={sortBy}
                onChange={handleSortChange}
                className="text-xs rounded-lg border border-pink-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="score">{t.filter_relevance}</option>
                <option value="popularity">{t.filter_popularity}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            {t.search_results_for} "<span className="bg-gradient-to-r from-[var(--grad-from)] to-[var(--grad-to)] bg-clip-text text-transparent">{query}</span>"
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">{results.length} {results.length === 1 ? t.result : t.results}</p>
          {loading && <p className="text-sm text-gray-600 dark:text-gray-400">{t.search_loading}</p>}
          {error && <p className="text-sm text-red-600 dark:text-red-400 font-semibold">{error}</p>}
        </div>

        {!loading && !error && results.length > 0 && (
          <>
            <div className="grid grid-cols-2 gap-3">
              {paginatedResults.map((item) => (
                <Link
                  to={getLink(item)}
                  key={`${item.media_type}-${item.id}`}
                  className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border border-purple-200/50 dark:border-gray-700/50 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer rounded-lg"
                  aria-label={`${getTitle(item)} (${getDate(item)?.slice(0, 4) || 'N/A'})`}
                >
                  <div className="aspect-[2/3] w-full relative overflow-hidden bg-gray-200 dark:bg-gray-700">
                    {item.poster_path ? (
                      <img
                        loading="lazy"
                        src={`https://image.tmdb.org/t/p/w185${item.poster_path}`}
                        alt={getTitle(item)}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs">
                        {t.content_no_image || 'No Image'}
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors text-xs">
                      {getTitle(item)}
                    </h3>
                    <div className="flex items-center justify-between mt-1 text-gray-500 dark:text-gray-400 text-xs">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        {getDate(item) ? getDate(item).slice(0, 4) : 'N/A'}
                      </span>
                      <span className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        {item.vote_average.toFixed(1)}
                      </span>
                    </div>
                    <div className="mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-white text-xs font-medium ${item.media_type === 'movie' ? 'bg-pink-500' : 'bg-purple-500'}`}>
                        {item.media_type === 'movie' ? t.content_movie_singular : t.content_tv_singular}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Mobile Pagination */}
            {totalLocalPages > 1 && (
              <div className="flex justify-center items-center gap-2 flex-wrap mt-6">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="bg-gradient-to-r from-[var(--grad-from)] to-[var(--grad-to)] text-white rounded-full shadow disabled:opacity-40 transition-opacity px-3 py-2"
                  title={t.nav_first_page}
                >
                  <ChevronsLeft size={16} />
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="bg-gradient-to-r from-[var(--grad-from)] to-[var(--grad-to)] text-white rounded-full shadow disabled:opacity-40 transition-opacity px-4 py-2 text-sm"
                >
                  <ChevronLeft className="inline-block mr-2 w-4 h-4" />
                  {t.nav_previous}
                </button>

                <span className="font-medium text-gray-700 dark:text-gray-300 text-sm">
                  {t.nav_page} {currentPage} {t.nav_of} {totalLocalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalLocalPages))}
                  disabled={currentPage === totalLocalPages}
                  className="bg-gradient-to-r from-[var(--grad-from)] to-[var(--grad-to)] text-white rounded-full shadow disabled:opacity-40 transition-opacity px-4 py-2 text-sm"
                >
                  {t.nav_next}
                  <ChevronRight className="inline-block ml-2 w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage(totalLocalPages)}
                  disabled={currentPage === totalLocalPages}
                  className="bg-gradient-to-r from-[var(--grad-from)] to-[var(--grad-to)] text-white rounded-full shadow disabled:opacity-40 transition-opacity px-3 py-2"
                  title={t.nav_last_page}
                >
                  <ChevronsRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
        
        {/* No results */}
        {!loading && !error && results.length === 0 && query && (
          <div className="text-center py-16">
            <p className="text-gray-600 dark:text-gray-400 text-base">
              {t.search_no_results}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MobileSearchResults;