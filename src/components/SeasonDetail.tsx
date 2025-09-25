import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, Calendar, Info, Star, Tv, Grid, X } from 'lucide-react';
import { tmdb } from '../services/tmdb';
import { analytics } from '../services/analytics';
import { watchlistService } from '../services/watchlist';
import GlobalNavbar from './GlobalNavbar';
import { playerConfigs, getPlayerUrl } from '../utils/playerUtils';
import { useLanguage } from './LanguageContext';
import { translations } from '../data/i18n';
import Loading from './Loading';
import { useIsMobile } from '../hooks/useIsMobile';

interface Episode {
  id: number;
  name: string;
  episode_number: number;
  season_number: number;
  air_date: string;
  overview: string;
  still_path: string | null;
  vote_average: number;
}

interface SeasonData {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  episodes: Episode[];
  vote_average: number; // Add vote_average to the SeasonData interface
}

const SeasonDetail: React.FC = () => {
  const { id, seasonNumber } = useParams<{ id: string; seasonNumber: string }>();
  const [show, setShow] = useState<any>(null);
  const [season, setSeason] = useState<SeasonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showDescriptions, setShowDescriptions] = useState<{ [key: number]: boolean }>({});
  const [seasonCast, setSeasonCast] = useState<any[]>([]);
  
  const { language } = useLanguage();
  const t = translations[language];
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchData = async () => {
      if (!id || !seasonNumber) return;

      setLoading(true);
      try {
        const [showData, seasonData, creditsData] = await Promise.all([
          tmdb.getTVDetails(parseInt(id)),
          tmdb.getTVSeasons(parseInt(id), parseInt(seasonNumber)),
          tmdb.getTVSeasonCredits(parseInt(id), parseInt(seasonNumber))
        ]);

        setShow(showData);
        setSeason(seasonData);
        setSeasonCast(creditsData.cast || []);
      } catch (error) {
        console.error('Failed to fetch season data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, seasonNumber]);

  const handleWatchEpisode = (episode: Episode) => {
    if (!show || !id) return;

    watchlistService.addEpisodeToWatchlist(
      {
        id: show.id,
        name: show.name,
        poster_path: show.poster_path,
        first_air_date: show.first_air_date,
        vote_average: show.vote_average,
      },
      {
        id: episode.id,
        season_number: episode.season_number,
        episode_number: episode.episode_number,
        name: episode.name,
        air_date: episode.air_date,
      }
    );

    const episodeDuration = show.episode_run_time && show.episode_run_time.length > 0 
      ? show.episode_run_time[0] * 60 
      : 45 * 60;

    const newSessionId = analytics.startSession(
      'tv',
      parseInt(id),
      show.name,
      show.poster_path,
      episode.season_number,
      episode.episode_number,
      episodeDuration
    );

    setSessionId(newSessionId);
    setCurrentEpisode(episode);
    setIsPlaying(true);
  };

  const handleClosePlayer = () => {
    if (sessionId) {
      const episodeDuration = show?.episode_run_time && show.episode_run_time.length > 0 
        ? show.episode_run_time[0] * 60 
        : 45 * 60;
      const finalTime = Math.random() * episodeDuration;
      analytics.endSession(sessionId, finalTime);
      setSessionId(null);
    }
    setIsPlaying(false);
    setCurrentEpisode(null);
  };

  const toggleDescription = (episodeId: number) => {
    setShowDescriptions(prev => ({
      ...prev,
      [episodeId]: !prev[episodeId]
    }));
  };

  if (loading) {
    return <Loading message={t.status_loading || 'Loading...'} />;
  }

  if (!season || !show) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t.season_not_found || 'Season not found'}
          </h2>
          <Link to="/" className="text-pink-600 dark:text-pink-400 hover:underline">
            {t.error_404_go_home}
          </Link>
        </div>
      </div>
    );
  }

  if (isPlaying && currentEpisode) {
    return (
      <div className="fixed inset-0 bg-black z-50">
        {/* Close button */}
        <div className="absolute top-6 right-6 z-10">
          <button
            onClick={handleClosePlayer}
            className="text-white hover:text-gray-300 transition-colors"
            aria-label={translations[language].close_player || "Close Player"}
          >
            <X className="w-8 h-8" />
          </button>
        </div>


        {/* Player iframe */}
        <iframe
          src={getPlayerUrl("vidzee", { 
            tmdbId: id!, 
            mediaType: "tv", 
            seasonNumber: currentEpisode.season_number, 
            episodeNumber: currentEpisode.episode_number 
          })}
          className="fixed top-0 left-0 w-full h-full border-0"
          title={`${show.name} - S${currentEpisode.season_number}E${currentEpisode.episode_number}`}
        />
      </div>
    );
  }

  const getFormattedYearRange = (episodes: Episode[]) => {
    if (!episodes || episodes.length === 0) return ""

    const sortedEpisodes = [...episodes].sort((a, b) => new Date(a.air_date).getTime() - new Date(b.air_date).getTime())
    const firstAirDate = sortedEpisodes[0]?.air_date
    const lastAirDate = sortedEpisodes[sortedEpisodes.length - 1]?.air_date || firstAirDate

    const startYear = new Date(firstAirDate).getFullYear()
    const endYear = new Date(lastAirDate).getFullYear()

    return startYear === endYear ? `${startYear}` : `${startYear}-${endYear}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <GlobalNavbar />
      
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${isMobile ? 'px-4 py-4' : ''}`}>
        {/* Back Navigation */}
        <div className="mb-6">
          <Link
            to={`/tv/${id}`}
            className="inline-flex items-center space-x-2 text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.back_to_show || 'Back to Show'}</span>
          </Link>
        </div>

        {/* Season Header */}
        <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-pink-200/50 dark:border-gray-700/50 overflow-hidden mb-8 ${isMobile ? 'rounded-xl' : ''}`}>
          <div className={isMobile ? 'p-4' : 'md:flex'}>
            {!isMobile && (
              <div className="md:flex-shrink-0">
                <img
                  src={tmdb.getImageUrl(season.poster_path || show.poster_path, 'w500')}
                  alt={season.name}
                  className="h-96 w-full object-cover md:h-full md:w-80"
                />
              </div>
            )}
            
            <div className={isMobile ? '' : 'p-8'}>
              <div className="flex items-start justify-between">
                {isMobile && (
                  <div className="flex items-start space-x-4 flex-1">
                    <img
                      src={tmdb.getImageUrl(season.poster_path || show.poster_path, 'w200')}
                      alt={season.name}
                      className="w-20 h-28 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {show.name}
                      </h1>
                      <h2 className="text-lg font-semibold text-pink-600 dark:text-pink-400">
                        {season.name}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {season.episodes?.length || 0} {t.episodes} · {getFormattedYearRange(season.episodes)}
                      </p>
                    </div>
                  </div>
                )}
                
                {!isMobile && (
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {show.name}
                    </h1>
                    <h2 className="text-2xl font-semibold text-pink-600 dark:text-pink-400 mb-4">
                      {season.name}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {season.episodes?.length || 0} {t.episodes} · {getFormattedYearRange(season.episodes)}
                    </p>
                  </div>
                )}

                {/* Season Rating Badge */}
                {season.vote_average > 0 && (
                  <div className="flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full ml-4">
                    <Star className="w-4 h-4 mr-1" />
                    <span className="text-sm font-semibold">{season.vote_average.toFixed(1)}</span>
                  </div>
                )}
              </div>
              
              {season.overview && (
                <p className={`text-gray-700 dark:text-gray-300 leading-relaxed mt-4 ${isMobile ? 'text-sm' : ''}`}>
                  {season.overview}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Cast Section */}
        {seasonCast.length > 0 && (
          <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-pink-200/50 dark:border-gray-700/50 p-6 mb-8 ${isMobile ? 'rounded-xl p-4' : ''}`}>
            <h3 className={`font-bold text-gray-900 dark:text-white mb-4 ${isMobile ? 'text-lg' : 'text-2xl'}`}>
              {t.cast || 'Cast'}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {seasonCast.length === 0 ? (
                <p className="text-gray-700 dark:text-gray-300">
                  {t.status_no_cast_info || "No cast information available."}
                </p>
              ) : (
                <div className="flex flex-wrap gap-6 justify-start">
                  {seasonCast.slice(0, 12).map((castMember) => {
                    // Determine profile image with gender fallback
                    const profileImage = castMember.profile_path
                      ? tmdb.getImageUrl(castMember.profile_path, "w185")
                      : castMember.gender === 1
                      ? "/female.png"
                      : castMember.gender === 2
                      ? "/male.png"
                      : "/unknown.png";

                    return (
                      <div key={castMember.id} className="w-28 text-center">
                        <img
                          src={profileImage}
                          alt={castMember.name}
                          className="w-28 h-28 object-cover rounded-full shadow-sm mb-2 border border-gray-300 dark:border-gray-600"
                        />
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                          {castMember.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {castMember.character}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}


            </div>
          </div>
        )}

        {/* Episodes List */}
        <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-pink-200/50 dark:border-gray-700/50 p-6 ${isMobile ? 'rounded-xl p-4' : ''}`}>
          <h3 className={`font-bold text-gray-900 dark:text-white mb-6 ${isMobile ? 'text-lg mb-4' : 'text-2xl'}`}>
            {t.episodes}
          </h3>
          
          <div className="space-y-3">
            {season.episodes?.map((episode) => (
              <div
                key={episode.id}
                className={`group bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-pink-200/50 dark:border-gray-600/50 overflow-hidden hover:shadow-lg transition-all duration-300 ${isMobile ? 'rounded-lg' : ''}`}
              >
                <div className={isMobile ? 'p-3' : 'p-4'}>
                  <div className="flex items-center justify-between">
                    <div className={`flex items-start flex-1 ${isMobile ? 'space-x-2' : 'space-x-4'}`}>
                      <Link
                        to={`/tv/${id}/season/${episode.season_number}/episode/${episode.episode_number}`}
                        className={`md:flex-shrink-0 ${isMobile ? 'w-20' : 'w-48'}`}
                      >
                        <img
                          src={tmdb.getImageUrl(episode.still_path || show.backdrop_path, isMobile ? 'w200' : 'w500')}
                          alt={episode.name}
                          className={`object-cover rounded-lg ${isMobile ? 'w-full h-auto' : 'w-48 h-28'}`}
                        />
                      </Link>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center">
                            <span className={`bg-gradient-to-r from-pink-500 to-purple-600 text-white px-2 py-1 rounded-full font-semibold ${isMobile ? 'text-xs' : 'text-sm'}`}>
                              {episode.episode_number}
                            </span>
                            <Link
                              to={`/tv/${id}/season/${episode.season_number}/episode/${episode.episode_number}`}
                              className={`font-semibold text-gray-900 dark:text-white hover:text-pink-600 dark:hover:text-pink-400 transition-colors ml-2 ${isMobile ? 'text-sm truncate' : 'text-lg'}`}
                            >
                              {episode.name}
                            </Link>
                          </div>
                          
                          {/* Episode Rating Badge */}
                          {episode.vote_average > 0 && (
                            <div className="flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full ml-auto">
                              <Star className="w-3 h-3 mr-1" />
                              <span className="text-xs font-semibold">{episode.vote_average.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                        
                        {episode.air_date && (
                          <p className={`text-gray-500 dark:text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                            <Calendar className="inline w-3 h-3 mr-1" />
                            {new Date(episode.air_date).toLocaleDateString()}
                          </p>
                        )}
                        
                        <div className="mt-2 text-gray-700 dark:text-gray-300 leading-relaxed">
                          <p className={`mt-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                            {episode.overview.length > 150 ? `${episode.overview.substring(0, 150)}...` : episode.overview}
                            <Link
                              to={`/tv/${id}/season/${episode.season_number}/episode/${episode.episode_number}`}
                              className="text-pink-600 dark:text-pink-400 hover:underline ml-1"
                            >
                              {t.details || 'Details'}
                            </Link>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="ml-4 flex-shrink-0 flex items-center space-x-2">
                      <button
                        onClick={() => handleWatchEpisode(episode)}
                        className={`bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold hover:from-pink-600 hover:to-purple-700 transition-colors flex items-center space-x-1 shadow-lg ${isMobile ? 'px-2 py-1 rounded-lg text-xs' : 'px-4 py-2 rounded-xl text-sm'}`}
                      >
                        <Play className={isMobile ? 'w-3 h-3' : 'w-4 h-4'} />
                        <span>{t.action_watch}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeasonDetail;