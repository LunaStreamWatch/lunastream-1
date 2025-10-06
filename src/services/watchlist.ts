import { supabase } from '../lib/supabase';

export interface WatchlistMovie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  addedAt: number;
}

export interface WatchlistTVShow {
  id: number;
  name: string;
  poster_path: string | null;
  first_air_date: string;
  vote_average: number;
  addedAt: number;
}

export interface WatchlistEpisode {
  id: number;
  season_number: number;
  episode_number: number;
  name: string;
  air_date: string;
  watchedAt: number;
}

export interface WatchlistTVGroup {
  show: WatchlistTVShow;
  episodes: WatchlistEpisode[];
}

class WatchlistService {
  private readonly MOVIES_KEY = 'lunastream-watchlist-movies';
  private readonly TV_KEY = 'lunastream-watchlist-tv';
  private readonly RECENTLY_VIEWED_MOVIES_KEY = 'recentlyViewedMovies';
  private readonly RECENTLY_VIEWED_TV_KEY = 'recentlyViewedTVEpisodes';

  async getWatchlistMovies(): Promise<WatchlistMovie[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from('watchlist')
          .select('*')
          .eq('user_id', user.id)
          .eq('content_type', 'movie')
          .order('added_at', { ascending: false });

        if (error) throw error;

        return (data || []).map(item => ({
          id: item.tmdb_id,
          title: item.title,
          poster_path: item.poster_path,
          release_date: item.release_date || '',
          vote_average: item.vote_average || 0,
          addedAt: new Date(item.added_at).getTime(),
        }));
      }

      const stored = localStorage.getItem(this.MOVIES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load watchlist movies:', error);
      return [];
    }
  }

  async addMovieToWatchlist(movie: Omit<WatchlistMovie, 'addedAt'>): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: existing } = await supabase
          .from('watchlist')
          .select('id')
          .eq('user_id', user.id)
          .eq('content_type', 'movie')
          .eq('tmdb_id', movie.id)
          .maybeSingle();

        if (!existing) {
          await supabase
            .from('watchlist')
            .insert({
              user_id: user.id,
              content_type: 'movie',
              tmdb_id: movie.id,
              title: movie.title,
              poster_path: movie.poster_path,
              release_date: movie.release_date,
              vote_average: movie.vote_average,
            });
        }

        return;
      }

      const movies = await this.getWatchlistMovies();
      const exists = movies.some(m => m.id === movie.id);

      if (!exists) {
        const newMovie: WatchlistMovie = {
          ...movie,
          addedAt: Date.now()
        };
        movies.unshift(newMovie);
        localStorage.setItem(this.MOVIES_KEY, JSON.stringify(movies));
      }
    } catch (error) {
      console.error('Failed to add movie to watchlist:', error);
    }
  }

  async removeMovieFromWatchlist(movieId: number): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        await supabase
          .from('watchlist')
          .delete()
          .eq('user_id', user.id)
          .eq('content_type', 'movie')
          .eq('tmdb_id', movieId);

        return;
      }

      const movies = await this.getWatchlistMovies();
      const filtered = movies.filter(m => m.id !== movieId);
      localStorage.setItem(this.MOVIES_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to remove movie from watchlist:', error);
    }
  }

  async isMovieInWatchlist(movieId: number): Promise<boolean> {
    const movies = await this.getWatchlistMovies();
    return movies.some(m => m.id === movieId);
  }

  async getWatchlistTV(): Promise<Record<number, WatchlistTVGroup>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from('watchlist')
          .select('*')
          .eq('user_id', user.id)
          .eq('content_type', 'tv')
          .order('added_at', { ascending: false });

        if (error) throw error;

        const grouped: Record<number, WatchlistTVGroup> = {};

        (data || []).forEach(item => {
          const showId = item.tmdb_id;

          if (!grouped[showId]) {
            grouped[showId] = {
              show: {
                id: showId,
                name: item.title,
                poster_path: item.poster_path,
                first_air_date: item.release_date || '',
                vote_average: item.vote_average || 0,
                addedAt: new Date(item.added_at).getTime(),
              },
              episodes: [],
            };
          }
        });

        return grouped;
      }

      const stored = localStorage.getItem(this.TV_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Failed to load watchlist TV:', error);
      return {};
    }
  }

  async addEpisodeToWatchlist(
    show: Omit<WatchlistTVShow, 'addedAt'>,
    episode: Omit<WatchlistEpisode, 'watchedAt'>
  ): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: existing } = await supabase
          .from('watchlist')
          .select('id')
          .eq('user_id', user.id)
          .eq('content_type', 'tv')
          .eq('tmdb_id', show.id)
          .maybeSingle();

        if (!existing) {
          await supabase
            .from('watchlist')
            .insert({
              user_id: user.id,
              content_type: 'tv',
              tmdb_id: show.id,
              title: show.name,
              poster_path: show.poster_path,
              release_date: show.first_air_date,
              vote_average: show.vote_average,
            });
        }

        return;
      }

      const tvShows = await this.getWatchlistTV();

      if (!tvShows[show.id]) {
        tvShows[show.id] = {
          show: { ...show, addedAt: Date.now() },
          episodes: []
        };
      }

      const episodes = tvShows[show.id].episodes;
      const exists = episodes.some(
        ep => ep.season_number === episode.season_number &&
          ep.episode_number === episode.episode_number
      );

      if (!exists) {
        const newEpisode: WatchlistEpisode = {
          ...episode,
          watchedAt: Date.now()
        };
        episodes.unshift(newEpisode);

        tvShows[show.id].episodes = episodes.slice(0, 10);
        localStorage.setItem(this.TV_KEY, JSON.stringify(tvShows));
      }
    } catch (error) {
      console.error('Failed to add episode to watchlist:', error);
    }
  }

  async removeShowFromWatchlist(showId: number): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        await supabase
          .from('watchlist')
          .delete()
          .eq('user_id', user.id)
          .eq('content_type', 'tv')
          .eq('tmdb_id', showId);

        return;
      }

      const tvShows = await this.getWatchlistTV();
      delete tvShows[showId];
      localStorage.setItem(this.TV_KEY, JSON.stringify(tvShows));
    } catch (error) {
      console.error('Failed to remove show from watchlist:', error);
    }
  }

  async isShowInWatchlist(showId: number): Promise<boolean> {
    const tvShows = await this.getWatchlistTV();
    return showId in tvShows;
  }

  async clearWatchlist(): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        await supabase
          .from('watchlist')
          .delete()
          .eq('user_id', user.id);

        return;
      }

      localStorage.removeItem(this.MOVIES_KEY);
      localStorage.removeItem(this.TV_KEY);
    } catch (error) {
      console.error('Failed to clear watchlist:', error);
    }
  }

  importFromRecentlyViewed(): void {
    try {
      const recentMovies = localStorage.getItem(this.RECENTLY_VIEWED_MOVIES_KEY);
      if (recentMovies) {
        const movies = JSON.parse(recentMovies);
        movies.forEach((movie: any) => {
          this.addMovieToWatchlist({
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            vote_average: movie.vote_average || 0
          });
        });
      }

      const recentTV = localStorage.getItem(this.RECENTLY_VIEWED_TV_KEY);
      if (recentTV) {
        const tvData = JSON.parse(recentTV);
        Object.values(tvData).forEach((group: any) => {
          group.episodes.forEach((episode: any) => {
            this.addEpisodeToWatchlist(
              {
                id: group.show.id,
                name: group.show.name,
                poster_path: group.show.poster_path,
                first_air_date: group.show.first_air_date,
                vote_average: group.show.vote_average || 0
              },
              {
                id: episode.id,
                season_number: episode.season_number,
                episode_number: episode.episode_number,
                name: episode.name,
                air_date: episode.air_date
              }
            );
          });
        });
      }
    } catch (error) {
      console.error('Failed to import from recently viewed:', error);
    }
  }

  async getCombinedWatchlist(): Promise<Array<{
    type: 'movie' | 'tv';
    data: WatchlistMovie | WatchlistTVShow;
    lastActivity: number;
  }>> {
    const movies = (await this.getWatchlistMovies()).map(movie => ({
      type: 'movie' as const,
      data: movie,
      lastActivity: movie.addedAt
    }));

    const tvShows = Object.values(await this.getWatchlistTV()).map(group => ({
      type: 'tv' as const,
      data: group.show,
      lastActivity: Math.max(group.show.addedAt, ...group.episodes.map(ep => ep.watchedAt))
    }));

    return [...movies, ...tvShows].sort((a, b) => b.lastActivity - a.lastActivity);
  }
}

export const watchlistService = new WatchlistService();
