/*
  # Create Watch Statistics Table

  1. New Tables
    - `watch_stats`
      - `id` (uuid, primary key)
      - `event_type` (text) - 'watch' or 'continue_watching'
      - `media_type` (text) - 'movie', 'tv', or 'anime'
      - `tmdb_id` (integer, nullable) - for movies and TV shows
      - `anilist_id` (integer, nullable) - for anime
      - `season_number` (integer, nullable) - for TV shows
      - `episode_number` (integer, nullable) - for TV shows and anime
      - `title` (text) - content title
      - `user_agent` (text, nullable) - browser info
      - `created_at` (timestamptz) - when the event occurred
      
  2. Indexes
    - Index on `created_at` for time-based queries
    - Index on `media_type` for filtering
    - Index on `event_type` for analytics
    
  3. Security
    - Enable RLS on `watch_stats` table
    - Add policy for anonymous users to insert their own stats
    - Add policy for reading aggregate stats (optional for future analytics)
*/

CREATE TABLE IF NOT EXISTS watch_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL CHECK (event_type IN ('watch', 'continue_watching')),
  media_type text NOT NULL CHECK (media_type IN ('movie', 'tv', 'anime')),
  tmdb_id integer,
  anilist_id integer,
  season_number integer,
  episode_number integer,
  title text NOT NULL,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_watch_stats_created_at ON watch_stats(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_watch_stats_media_type ON watch_stats(media_type);
CREATE INDEX IF NOT EXISTS idx_watch_stats_event_type ON watch_stats(event_type);
CREATE INDEX IF NOT EXISTS idx_watch_stats_tmdb_id ON watch_stats(tmdb_id) WHERE tmdb_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_watch_stats_anilist_id ON watch_stats(anilist_id) WHERE anilist_id IS NOT NULL;

-- Enable Row Level Security
ALTER TABLE watch_stats ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert stats (anonymous tracking)
CREATE POLICY "Anyone can insert watch stats"
  ON watch_stats
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow reading stats (for future analytics dashboard)
CREATE POLICY "Anyone can read watch stats"
  ON watch_stats
  FOR SELECT
  TO anon, authenticated
  USING (true);