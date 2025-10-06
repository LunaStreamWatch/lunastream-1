import { supabase } from '../lib/supabase';

export interface ContinueWatchingItem {
  id: string;
  type: 'movie' | 'tv' | 'anime';
  tmdbId?: number;
  anilistId?: number;
  title: string;
  poster: string;
  lastWatched: number;
  progress?: number;
  season?: number;
  episode?: number;
  episodeTitle?: string;
  totalEpisodes?: number;
  isDub?: boolean;
}

class ContinueWatchingService {
  private readonly STORAGE_KEY = 'lunastream-continue-watching';
  private readonly MAX_ITEMS = 10;

  async getContinueWatchingItems(): Promise<ContinueWatchingItem[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from('continue_watching')
          .select('*')
          .eq('user_id', user.id)
          .order('last_watched', { ascending: false })
          .limit(this.MAX_ITEMS);

        if (error) throw error;

        return (data || []).map(item => ({
          id: this.generateIdFromDb(item),
          type: item.content_type as 'movie' | 'tv' | 'anime',
          tmdbId: item.tmdb_id || undefined,
          anilistId: item.anilist_id || undefined,
          title: item.title,
          poster: item.poster,
          lastWatched: new Date(item.last_watched).getTime(),
          progress: item.progress || undefined,
          season: item.season || undefined,
          episode: item.episode || undefined,
          episodeTitle: item.episode_title || undefined,
          totalEpisodes: item.total_episodes || undefined,
          isDub: item.is_dub,
        }));
      }

      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];

      const items = JSON.parse(stored);
      return items.sort((a: ContinueWatchingItem, b: ContinueWatchingItem) =>
        b.lastWatched - a.lastWatched
      );
    } catch (error) {
      console.error('Failed to load continue watching items:', error);
      return [];
    }
  }

  async addOrUpdateItem(item: Omit<ContinueWatchingItem, 'id' | 'lastWatched'>): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const uniqueKey = this.generateUniqueKey(item);

        const { data: existing } = await supabase
          .from('continue_watching')
          .select('id')
          .eq('user_id', user.id)
          .eq('content_type', item.type)
          .eq('tmdb_id', item.tmdbId || null)
          .eq('anilist_id', item.anilistId || null)
          .eq('season', item.season || null)
          .eq('episode', item.episode || null)
          .eq('is_dub', item.isDub || false)
          .maybeSingle();

        const dbItem = {
          user_id: user.id,
          content_type: item.type,
          tmdb_id: item.tmdbId || null,
          anilist_id: item.anilistId || null,
          title: item.title,
          poster: item.poster,
          progress: item.progress || 0,
          season: item.season || null,
          episode: item.episode || null,
          episode_title: item.episodeTitle || null,
          total_episodes: item.totalEpisodes || null,
          is_dub: item.isDub || false,
          last_watched: new Date().toISOString(),
        };

        if (existing) {
          await supabase
            .from('continue_watching')
            .update(dbItem)
            .eq('id', existing.id);
        } else {
          await supabase
            .from('continue_watching')
            .insert(dbItem);
        }

        const { data: allItems } = await supabase
          .from('continue_watching')
          .select('id, last_watched')
          .eq('user_id', user.id)
          .order('last_watched', { ascending: false });

        if (allItems && allItems.length > this.MAX_ITEMS) {
          const idsToDelete = allItems.slice(this.MAX_ITEMS).map(i => i.id);
          await supabase
            .from('continue_watching')
            .delete()
            .in('id', idsToDelete);
        }

        return;
      }

      const items = await this.getContinueWatchingItems();
      const id = this.generateId(item);

      const filteredItems = items.filter(existing => existing.id !== id);

      const newItem: ContinueWatchingItem = {
        ...item,
        id,
        lastWatched: Date.now()
      };

      const updatedItems = [newItem, ...filteredItems].slice(0, this.MAX_ITEMS);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedItems));
    } catch (error) {
      console.error('Failed to save continue watching item:', error);
    }
  }

  async removeItem(id: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const parts = id.split('-');
        if (parts[0] === 'movie') {
          await supabase
            .from('continue_watching')
            .delete()
            .eq('user_id', user.id)
            .eq('content_type', 'movie')
            .eq('tmdb_id', parseInt(parts[1]));
        } else if (parts[0] === 'tv') {
          const season = parseInt(parts[1].substring(1));
          const episode = parseInt(parts[2].substring(1));
          await supabase
            .from('continue_watching')
            .delete()
            .eq('user_id', user.id)
            .eq('content_type', 'tv')
            .eq('season', season)
            .eq('episode', episode);
        } else if (parts[0] === 'anime') {
          const episode = parseInt(parts[1].substring(1));
          const isDub = id.endsWith('-dub');
          await supabase
            .from('continue_watching')
            .delete()
            .eq('user_id', user.id)
            .eq('content_type', 'anime')
            .eq('episode', episode)
            .eq('is_dub', isDub);
        }

        return;
      }

      const items = await this.getContinueWatchingItems();
      const filteredItems = items.filter(item => item.id !== id);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredItems));
    } catch (error) {
      console.error('Failed to remove continue watching item:', error);
    }
  }

  async clearAll(): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        await supabase
          .from('continue_watching')
          .delete()
          .eq('user_id', user.id);
        return;
      }

      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear continue watching items:', error);
    }
  }

  private generateId(item: Omit<ContinueWatchingItem, 'id' | 'lastWatched'>): string {
    if (item.type === 'movie') {
      return `movie-${item.tmdbId}`;
    } else if (item.type === 'tv') {
      return `tv-${item.tmdbId}-s${item.season}-e${item.episode}`;
    } else if (item.type === 'anime') {
      return `anime-${item.anilistId}-e${item.episode}${item.isDub ? '-dub' : '-sub'}`;
    }
    return `unknown-${Date.now()}`;
  }

  private generateIdFromDb(item: any): string {
    if (item.content_type === 'movie') {
      return `movie-${item.tmdb_id}`;
    } else if (item.content_type === 'tv') {
      return `tv-${item.tmdb_id}-s${item.season}-e${item.episode}`;
    } else if (item.content_type === 'anime') {
      return `anime-${item.anilist_id}-e${item.episode}${item.is_dub ? '-dub' : '-sub'}`;
    }
    return `unknown-${Date.now()}`;
  }

  private generateUniqueKey(item: Omit<ContinueWatchingItem, 'id' | 'lastWatched'>): string {
    return `${item.type}-${item.tmdbId || item.anilistId}-${item.season || 0}-${item.episode || 0}-${item.isDub || false}`;
  }

  getNextEpisode(currentItem: ContinueWatchingItem): { season: number; episode: number } | null {
    if (currentItem.type !== 'tv' || !currentItem.season || !currentItem.episode) {
      return null;
    }

    return {
      season: currentItem.season,
      episode: currentItem.episode + 1
    };
  }
}

export const continueWatchingService = new ContinueWatchingService();