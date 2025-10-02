import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Calendar, Film, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'; // <-- Added new icons
import { Movie, TVShow } from '../types';

type MediaItem = (Movie | TVShow) & { media_type: 'movie' | 'tv'; popularity: number };

type MobileSearchResultsProps = {
  query: string;
  results: MediaItem[];
  loading: boolean;
  error: string | null;
  warningVisible: boolean;
  setWarningVisible: (visible: boolean) => void;
  sortBy: 'score' | 'popularity';
  setSortBy: (sortBy: 'score' | 'popularity') => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  resultsPerPage: number;
  t: any;
  // New props for loading more
  loadMoreResults: () => void;
  hasMore: boolean;
};

const isMovie = (item: MediaItem): item is Movie & { media_type: 'movie' } => item.media_type === 'movie';
const getTitle = (item: MediaItem) => (isMovie(item) ? item.title : (item as TVShow).name);
const getDate = (item: MediaItem) => (isMovie(item) ? item.release_date : (item as TVShow).first_air_date);
const getLink = (item: MediaItem) => (isMovie(item) ? `/movie/${item.id}` : `/tv/${item.id}`);

const SearchResultsMobile: React.FC<MobileSearchResultsProps> = ({
  query,
  results,
  loading,
  error,
  warningVisible,
  setWarningVisible,
  sortBy,
  setSortBy,
  currentPage,
  setCurrentPage,
  resultsPerPage,
  t,
  loadMoreResults,
  hasMore,
}) => {
  const totalLocalPages = Math.ceil(results.length / resultsPerPage);
  const startIdx = (currentPage - 1) * resultsPerPage;
  const paginatedResults = results.slice(startIdx, startIdx + resultsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300 px-4 py-4">

      {/* Warning modal */}
      {warningVisible && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[1000] flex items-center justify-center px-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-lg w-full text-center">
            <h2 className="text-3xl font-bold mb-4 text-pink-600 dark:text-pink-400">Haiii!</h2>
            <p className="mb-6 text-gray-700 dark:text-gray-300">{t.search_stay_safe_warning}</p>
            <button
              onClick={() => setWarningVisible(false)}
              className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg focus:ring-4 focus:ring-pink-400"
            >
              {t.search_stay_safe_continue}
            </button>
          </div>
        </div>
      )}

      {/* Loading & error */}
      {loading && <p className="mt-8 text-center text-gray-600 dark:text-gray-400">{t.search_loading}</p>}
      {error && <p className="mt-8 text-center text-red-600 dark:text-red-400 font-semibold">{error}</p>}

      {/* Results list */}
      {!loading && !error && paginatedResults.length > 0 && (
        <ul className="flex flex-col space-y-4 mt-4">
          {paginatedResults.map((item) => (
            <li
              key={`${item.media_type}-${item.id}`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <Link
                to={getLink(item)}
                className="flex gap-4 p-4 focus:outline-none focus:ring-2 focus:ring-pink-500"
                aria-label={`${getTitle(item)} (${getDate(item)?.slice(0, 4) || 'N/A'}) - ${item.media_type.toUpperCase()}`}
              >
                {item.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w154${item.poster_path}`}
                    alt={getTitle(item)}
                    className="w-24 h-36 object-cover rounded-md flex-shrink-0"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-24 h-36 bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs rounded-md flex-shrink-0">
                    {t.no_poster || 'No Poster'}
                  </div>
                )}

                <div className="flex flex-col flex-grow min-w-0">
                  <h3
                    className="text-lg font-semibold text-gray-900 dark:text-white truncate"
                    title={getTitle(item)}
                  >
                    {getTitle(item)}
                  </h3>

                  <div className="flex items-center space-x-3 text-xs text-gray-600 dark:text-gray-300 font-semibold mt-1">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{getDate(item) ? getDate(item).slice(0, 4) : 'N/A'}</span>
                    </span>

                    <span className="flex items-center space-x-1 text-yellow-500">
                      <Star className="w-4 h-4" />
                      <span>{item.vote_average?.toFixed(1) || '–'}</span>
                    </span>

                    <span className="flex items-center space-x-1 uppercase">
                      <Film className="w-4 h-4" />
                      <span>{item.media_type}</span>
                    </span>
                  </div>

                  <p
                    className="mt-2 text-sm text-gray-700 dark:text-gray-300 line-clamp-3 overflow-hidden"
                    title={item.overview}
                  >
                    {item.overview || 'N/A'}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination and Load More Button */}
      {(totalLocalPages > 1 || hasMore) && (
        <div className="flex flex-col items-center justify-center mt-8 space-y-4">
          <nav aria-label={t.pagination_label} className="flex flex-wrap justify-center gap-2">
            {/* Go to First Page */}
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-md bg-pink-600 text-white font-semibold hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <ChevronsLeft />
            </button>
            {/* Go to Previous Page */}
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-md bg-pink-600 text-white font-semibold hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <ChevronLeft />
            </button>
            {/* Render clickable page numbers */}
            {(() => {
              const pagesToShow = 7;
              let startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
              let endPage = Math.min(totalLocalPages, startPage + pagesToShow - 1);

              // Adjust startPage if we're at the end
              if (endPage - startPage + 1 < pagesToShow) {
                startPage = Math.max(1, endPage - pagesToShow + 1);
              }

              const pageNumbers = [];
              for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    aria-current={currentPage === i ? 'page' : undefined}
                    className={`px-4 py-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-pink-400 ${
                      currentPage === i
                        ? 'bg-pink-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-pink-100 dark:hover:bg-pink-900'
                    }`}
                  >
                    {i}
                  </button>
                );
              }
              return pageNumbers;
            })()}
            {/* Go to Next Page */}
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalLocalPages))}
              disabled={currentPage === totalLocalPages}
              className="px-4 py-2 rounded-md bg-pink-600 text-white font-semibold hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <ChevronRight />
            </button>
            {/* Go to Last Page */}
            <button
              onClick={() => setCurrentPage(totalLocalPages)}
              disabled={currentPage === totalLocalPages}
              className="px-4 py-2 rounded-md bg-pink-600 text-white font-semibold hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <ChevronsRight />
            </button>
          </nav>

          {hasMore && (
            <button
              onClick={loadMoreResults}
              disabled={loading}
              className="px-6 py-3 rounded-md bg-purple-600 text-white font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Load More Results'}
            </button>
          )}
        </div>
      )}
      
      {/* No results */}
      {!loading && !error && results.length === 0 && (
        <p className="mt-12 text-center text-gray-600 dark:text-gray-400">
          {t.search_no_results}
        </p>
      )}
    </div>
  );
};

export default SearchResultsMobile;