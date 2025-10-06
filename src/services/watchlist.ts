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

export interface FavoriteItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  addedAt: number;
}

class WatchlistService {
  async getWatchlistMovies(): Promise<WatchlistMovie[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

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
    } catch (error) {
      console.error('Failed to load watchlist movies:', error);
      return [];
    }
  }

  async addMovieToWatchlist(movie: Omit<WatchlistMovie, 'addedAt'>): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.warn('User not authenticated. Cannot add to watchlist.');
        return;
      }

      const { error } = await supabase
        .from('watchlist')
        .upsert({
          user_id: user.id,
          content_type: 'movie',
          tmdb_id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
          added_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,content_type,tmdb_id'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to add movie to watchlist:', error);
    }
  }

  async removeMovieFromWatchlist(movieId: number): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('user_id', user.id)
        .eq('content_type', 'movie')
        .eq('tmdb_id', movieId);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to remove movie from watchlist:', error);
    }
  }

  async isMovieInWatchlist(movieId: number): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase
        .from('watchlist')
        .select('id')
        .eq('user_id', user.id)
        .eq('content_type', 'movie')
        .eq('tmdb_id', movieId)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error('Failed to check movie in watchlist:', error);
      return false;
    }
  }

  async getWatchlistTV(): Promise<WatchlistTVShow[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('watchlist')
        .select('*')
        .eq('user_id', user.id)
        .eq('content_type', 'tv')
        .order('added_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(item => ({
        id: item.tmdb_id,
        name: item.title,
        poster_path: item.poster_path,
        first_air_date: item.release_date || '',
        vote_average: item.vote_average || 0,
        addedAt: new Date(item.added_at).getTime(),
      }));
    } catch (error) {
      console.error('Failed to load watchlist TV:', error);
      return [];
    }
  }

  async addShowToWatchlist(show: Omit<WatchlistTVShow, 'addedAt'>): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.warn('User not authenticated. Cannot add to watchlist.');
        return;
      }

      const { error } = await supabase
        .from('watchlist')
        .upsert({
          user_id: user.id,
          content_type: 'tv',
          tmdb_id: show.id,
          title: show.name,
          poster_path: show.poster_path,
          release_date: show.first_air_date,
          vote_average: show.vote_average,
          added_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,content_type,tmdb_id'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to add show to watchlist:', error);
    }
  }

  async removeShowFromWatchlist(showId: number): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('user_id', user.id)
        .eq('content_type', 'tv')
        .eq('tmdb_id', showId);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to remove show from watchlist:', error);
    }
  }

  async isShowInWatchlist(showId: number): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase
        .from('watchlist')
        .select('id')
        .eq('user_id', user.id)
        .eq('content_type', 'tv')
        .eq('tmdb_id', showId)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error('Failed to check show in watchlist:', error);
      return false;
    }
  }

  async clearWatchlist(): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to clear watchlist:', error);
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

    const tvShows = (await this.getWatchlistTV()).map(show => ({
      type: 'tv' as const,
      data: show,
      lastActivity: show.addedAt
    }));

    return [...movies, ...tvShows].sort((a, b) => b.lastActivity - a.lastActivity);
  }

  async getFavoriteMovies(): Promise<FavoriteItem[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('favorites')
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
    } catch (error) {
      console.error('Failed to load favorite movies:', error);
      return [];
    }
  }

  async getFavoriteShows(): Promise<FavoriteItem[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .eq('content_type', 'tv')
        .order('added_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(item => ({
        id: item.tmdb_id,
        name: item.name,
        poster_path: item.poster_path,
        first_air_date: item.first_air_date || '',
        vote_average: item.vote_average || 0,
        addedAt: new Date(item.added_at).getTime(),
      }));
    } catch (error) {
      console.error('Failed to load favorite shows:', error);
      return [];
    }
  }

  async addMovieToFavorites(movie: Omit<WatchlistMovie, 'addedAt'>): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.warn('User not authenticated. Cannot add to favorites.');
        return;
      }

      const { error } = await supabase
        .from('favorites')
        .upsert({
          user_id: user.id,
          content_type: 'movie',
          tmdb_id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
          added_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,content_type,tmdb_id'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to add movie to favorites:', error);
    }
  }

  async addShowToFavorites(show: Omit<WatchlistTVShow, 'addedAt'>): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.warn('User not authenticated. Cannot add to favorites.');
        return;
      }

      const { error } = await supabase
        .from('favorites')
        .upsert({
          user_id: user.id,
          content_type: 'tv',
          tmdb_id: show.id,
          name: show.name,
          poster_path: show.poster_path,
          first_air_date: show.first_air_date,
          vote_average: show.vote_average,
          added_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,content_type,tmdb_id'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to add show to favorites:', error);
    }
  }

  async removeMovieFromFavorites(movieId: number): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('content_type', 'movie')
        .eq('tmdb_id', movieId);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to remove movie from favorites:', error);
    }
  }

  async removeShowFromFavorites(showId: number): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('content_type', 'tv')
        .eq('tmdb_id', showId);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to remove show from favorites:', error);
    }
  }

  async isMovieInFavorites(movieId: number): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('content_type', 'movie')
        .eq('tmdb_id', movieId)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error('Failed to check movie in favorites:', error);
      return false;
    }
  }

  async isShowInFavorites(showId: number): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('content_type', 'tv')
        .eq('tmdb_id', showId)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error('Failed to check show in favorites:', error);
      return false;
    }
  }

  async clearFavorites(): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to clear favorites:', error);
    }
  }
}

export const watchlistService = new WatchlistService();
