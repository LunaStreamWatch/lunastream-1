import { supabase } from './supabase';

export interface WatchStatEvent {
  event_type: 'watch' | 'continue_watching';
  media_type: 'movie' | 'tv' | 'anime';
  tmdb_id?: number;
  anilist_id?: number;
  season_number?: number;
  episode_number?: number;
  title: string;
}

class WatchStatsService {
  async recordWatchEvent(event: WatchStatEvent): Promise<void> {
    try {
      const user_agent = navigator.userAgent;

      const { error } = await supabase
        .from('watch_stats')
        .insert({
          ...event,
          user_agent,
        });

      if (error) {
        console.error('Failed to record watch stat:', error);
      }
    } catch (err) {
      console.error('Error recording watch stat:', err);
    }
  }

  async getStats(filters?: {
    media_type?: string;
    event_type?: string;
    days?: number;
  }) {
    try {
      let query = supabase.from('watch_stats').select('*');

      if (filters?.media_type) {
        query = query.eq('media_type', filters.media_type);
      }

      if (filters?.event_type) {
        query = query.eq('event_type', filters.event_type);
      }

      if (filters?.days) {
        const date = new Date();
        date.setDate(date.getDate() - filters.days);
        query = query.gte('created_at', date.toISOString());
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to fetch watch stats:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Error fetching watch stats:', err);
      return [];
    }
  }
}

export const watchStatsService = new WatchStatsService();
