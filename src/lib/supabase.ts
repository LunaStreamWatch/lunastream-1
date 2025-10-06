import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          avatar: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          avatar?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          avatar?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      continue_watching: {
        Row: {
          id: string;
          user_id: string;
          content_type: 'movie' | 'tv' | 'anime';
          tmdb_id: number | null;
          anilist_id: number | null;
          title: string;
          poster: string;
          progress: number;
          season: number | null;
          episode: number | null;
          episode_title: string | null;
          total_episodes: number | null;
          is_dub: boolean;
          last_watched: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          content_type: 'movie' | 'tv' | 'anime';
          tmdb_id?: number | null;
          anilist_id?: number | null;
          title: string;
          poster: string;
          progress?: number;
          season?: number | null;
          episode?: number | null;
          episode_title?: string | null;
          total_episodes?: number | null;
          is_dub?: boolean;
          last_watched?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          content_type?: 'movie' | 'tv' | 'anime';
          tmdb_id?: number | null;
          anilist_id?: number | null;
          title?: string;
          poster?: string;
          progress?: number;
          season?: number | null;
          episode?: number | null;
          episode_title?: string | null;
          total_episodes?: number | null;
          is_dub?: boolean;
          last_watched?: string;
          created_at?: string;
        };
      };
      watchlist: {
        Row: {
          id: string;
          user_id: string;
          content_type: 'movie' | 'tv';
          tmdb_id: number;
          title: string;
          poster_path: string | null;
          release_date: string | null;
          vote_average: number;
          added_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          content_type: 'movie' | 'tv';
          tmdb_id: number;
          title: string;
          poster_path?: string | null;
          release_date?: string | null;
          vote_average?: number;
          added_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          content_type?: 'movie' | 'tv';
          tmdb_id?: number;
          title?: string;
          poster_path?: string | null;
          release_date?: string | null;
          vote_average?: number;
          added_at?: string;
        };
      };
      favourites: {
        Row: {
          id: string;
          user_id: string;
          content_type: 'movie' | 'tv' | 'anime';
          tmdb_id: number | null;
          anilist_id: number | null;
          title: string;
          poster: string;
          added_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          content_type: 'movie' | 'tv' | 'anime';
          tmdb_id?: number | null;
          anilist_id?: number | null;
          title: string;
          poster: string;
          added_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          content_type?: 'movie' | 'tv' | 'anime';
          tmdb_id?: number | null;
          anilist_id?: number | null;
          title?: string;
          poster?: string;
          added_at?: string;
        };
      };
    };
  };
}
