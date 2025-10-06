/*
  # Authentication and User Data Schema

  ## Overview
  Creates the complete database schema for user authentication and personalized data storage.

  ## New Tables

  ### profiles
  - `id` (uuid, primary key) - References auth.users
  - `username` (text, unique) - User's chosen username
  - `avatar` (text) - Avatar identifier (e.g., 'default', 'cat', 'dog', etc.)
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last profile update timestamp

  ### continue_watching
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid) - References auth.users
  - `content_type` (text) - Type: 'movie', 'tv', or 'anime'
  - `tmdb_id` (integer) - TMDB identifier (for movies/tv)
  - `anilist_id` (integer) - Anilist identifier (for anime)
  - `title` (text) - Content title
  - `poster` (text) - Poster image URL
  - `progress` (numeric) - Playback progress percentage
  - `season` (integer) - Season number (for TV shows)
  - `episode` (integer) - Episode number
  - `episode_title` (text) - Episode title
  - `total_episodes` (integer) - Total episodes in season
  - `is_dub` (boolean) - Dubbed version flag (for anime)
  - `last_watched` (timestamptz) - Last viewing timestamp
  - `created_at` (timestamptz) - Entry creation timestamp

  ### watchlist
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid) - References auth.users
  - `content_type` (text) - Type: 'movie' or 'tv'
  - `tmdb_id` (integer) - TMDB identifier
  - `title` (text) - Content title
  - `poster_path` (text) - Poster path
  - `release_date` (text) - Release/air date
  - `vote_average` (numeric) - Rating
  - `added_at` (timestamptz) - When added to watchlist
  - Unique constraint on (user_id, content_type, tmdb_id)

  ### favourites
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid) - References auth.users
  - `content_type` (text) - Type: 'movie', 'tv', or 'anime'
  - `tmdb_id` (integer) - TMDB identifier
  - `anilist_id` (integer) - Anilist identifier
  - `title` (text) - Content title
  - `poster` (text) - Poster image URL
  - `added_at` (timestamptz) - When added to favourites
  - Unique constraint on (user_id, content_type, tmdb_id, anilist_id)

  ## Security
  - Enable RLS on all tables
  - Users can only read/write their own data
  - Profile usernames must be unique across all users
  - Authentication required for all operations

  ## Notes
  - All timestamps use timestamptz for timezone awareness
  - Foreign key constraints ensure data integrity
  - Indexes on user_id columns for performance
  - Composite unique constraints prevent duplicate entries
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  avatar text DEFAULT 'default' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create continue_watching table
CREATE TABLE IF NOT EXISTS continue_watching (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content_type text NOT NULL,
  tmdb_id integer,
  anilist_id integer,
  title text NOT NULL,
  poster text NOT NULL,
  progress numeric DEFAULT 0,
  season integer,
  episode integer,
  episode_title text,
  total_episodes integer,
  is_dub boolean DEFAULT false,
  last_watched timestamptz DEFAULT now() NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT valid_content_type CHECK (content_type IN ('movie', 'tv', 'anime'))
);

-- Create watchlist table
CREATE TABLE IF NOT EXISTS watchlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content_type text NOT NULL,
  tmdb_id integer NOT NULL,
  title text NOT NULL,
  poster_path text,
  release_date text,
  vote_average numeric DEFAULT 0,
  added_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT valid_watchlist_type CHECK (content_type IN ('movie', 'tv')),
  UNIQUE(user_id, content_type, tmdb_id)
);

-- Create favourites table
CREATE TABLE IF NOT EXISTS favourites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content_type text NOT NULL,
  tmdb_id integer,
  anilist_id integer,
  title text NOT NULL,
  poster text NOT NULL,
  added_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT valid_favourite_type CHECK (content_type IN ('movie', 'tv', 'anime')),
  UNIQUE(user_id, content_type, tmdb_id, anilist_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_continue_watching_user_id ON continue_watching(user_id);
CREATE INDEX IF NOT EXISTS idx_continue_watching_last_watched ON continue_watching(user_id, last_watched DESC);
CREATE INDEX IF NOT EXISTS idx_watchlist_user_id ON watchlist(user_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_added_at ON watchlist(user_id, added_at DESC);
CREATE INDEX IF NOT EXISTS idx_favourites_user_id ON favourites(user_id);
CREATE INDEX IF NOT EXISTS idx_favourites_added_at ON favourites(user_id, added_at DESC);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE continue_watching ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE favourites ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Continue watching policies
CREATE POLICY "Users can view own continue watching"
  ON continue_watching FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own continue watching"
  ON continue_watching FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own continue watching"
  ON continue_watching FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own continue watching"
  ON continue_watching FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Watchlist policies
CREATE POLICY "Users can view own watchlist"
  ON watchlist FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into own watchlist"
  ON watchlist FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own watchlist"
  ON watchlist FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from own watchlist"
  ON watchlist FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Favourites policies
CREATE POLICY "Users can view own favourites"
  ON favourites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favourites"
  ON favourites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own favourites"
  ON favourites FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favourites"
  ON favourites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at on profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();