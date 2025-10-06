/*
  # Create Vault System for LunaStream

  ## Overview
  This migration creates the complete vault system for LunaStream, including watchlist and favorites functionality.

  ## New Tables

  ### 1. `watchlist` Table
  Stores movies and TV shows that users have watched
  - `id` (uuid, primary key) - Unique identifier for each watchlist entry
  - `user_id` (uuid, foreign key) - References auth.users, the user who added this item
  - `content_type` (text) - Type of content: 'movie' or 'tv'
  - `tmdb_id` (integer) - The Movie Database ID for the content
  - `title` (text) - Title of the movie or TV show
  - `poster_path` (text) - Poster image path from TMDB
  - `release_date` (text) - Release or first air date
  - `vote_average` (numeric) - Rating from TMDB
  - `added_at` (timestamptz) - When the item was added to watchlist
  - `created_at` (timestamptz) - Record creation timestamp

  ### 2. `favorites` Table
  Stores users' favorite movies and TV shows
  - `id` (uuid, primary key) - Unique identifier for each favorite entry
  - `user_id` (uuid, foreign key) - References auth.users, the user who favorited this item
  - `content_type` (text) - Type of content: 'movie' or 'tv'
  - `tmdb_id` (integer) - The Movie Database ID for the content
  - `title` (text) - Title of the movie or TV show
  - `name` (text) - Name field for TV shows
  - `poster_path` (text) - Poster image path from TMDB
  - `release_date` (text) - Release date for movies
  - `first_air_date` (text) - First air date for TV shows
  - `vote_average` (numeric) - Rating from TMDB
  - `added_at` (timestamptz) - When the item was added to favorites
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - Enable RLS on both tables
  - Users can only read/write their own watchlist entries
  - Users can only read/write their own favorite entries
  - All policies require authentication
  - Policies check user_id matches auth.uid()

  ## Indexes
  - Index on user_id and content_type for fast filtering
  - Index on tmdb_id for quick lookups
  - Index on added_at for sorting by recency
*/

-- Create watchlist table
CREATE TABLE IF NOT EXISTS watchlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type text NOT NULL CHECK (content_type IN ('movie', 'tv')),
  tmdb_id integer NOT NULL,
  title text NOT NULL,
  poster_path text,
  release_date text DEFAULT '',
  vote_average numeric DEFAULT 0,
  added_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type text NOT NULL CHECK (content_type IN ('movie', 'tv')),
  tmdb_id integer NOT NULL,
  title text,
  name text,
  poster_path text,
  release_date text,
  first_air_date text,
  vote_average numeric DEFAULT 0,
  added_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_watchlist_user_type ON watchlist(user_id, content_type);
CREATE INDEX IF NOT EXISTS idx_watchlist_tmdb ON watchlist(tmdb_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_added ON watchlist(added_at DESC);

CREATE INDEX IF NOT EXISTS idx_favorites_user_type ON favorites(user_id, content_type);
CREATE INDEX IF NOT EXISTS idx_favorites_tmdb ON favorites(tmdb_id);
CREATE INDEX IF NOT EXISTS idx_favorites_added ON favorites(added_at DESC);

-- Ensure unique entries per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_watchlist_unique ON watchlist(user_id, content_type, tmdb_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_favorites_unique ON favorites(user_id, content_type, tmdb_id);

-- Enable Row Level Security
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Watchlist Policies
CREATE POLICY "Users can view their own watchlist"
  ON watchlist FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their watchlist"
  ON watchlist FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their watchlist"
  ON watchlist FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from their watchlist"
  ON watchlist FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Favorites Policies
CREATE POLICY "Users can view their own favorites"
  ON favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their favorites"
  ON favorites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their favorites"
  ON favorites FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from their favorites"
  ON favorites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);