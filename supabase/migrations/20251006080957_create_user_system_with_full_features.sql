/*
  # Complete User Authentication and Data System
  
  1. New Tables
    - `profiles` - User profiles with username and avatar
      - `id` (uuid, primary key, references auth.users)
      - `username` (text, unique)
      - `avatar` (text) - Netflix-style profile picture identifier
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `watchlist` - User's saved watchlist
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `content_type` (text) - 'movie' or 'tv' or 'anime'
      - `tmdb_id` (integer) - TMDB ID for movies/tv
      - `anilist_id` (integer) - AniList ID for anime
      - `title` (text)
      - `poster_path` (text)
      - `release_date` (text)
      - `vote_average` (numeric)
      - `added_at` (timestamptz)
    
    - `favorites` - User's favorite content
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `content_type` (text) - 'movie' or 'tv' or 'anime'
      - `tmdb_id` (integer)
      - `anilist_id` (integer)
      - `title` (text)
      - `name` (text)
      - `poster_path` (text)
      - `release_date` (text)
      - `first_air_date` (text)
      - `vote_average` (numeric)
      - `added_at` (timestamptz)
    
    - `continue_watching` - Track viewing progress
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `content_type` (text) - 'movie', 'tv', or 'anime'
      - `tmdb_id` (integer)
      - `anilist_id` (integer)
      - `title` (text)
      - `poster` (text)
      - `progress` (numeric) - Percentage watched
      - `season` (integer)
      - `episode` (integer)
      - `episode_title` (text)
      - `total_episodes` (integer)
      - `is_dub` (boolean)
      - `last_watched` (timestamptz)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access only their own data
    - Users can read their own profile and update their own data
  
  3. Functions
    - Trigger to automatically update `updated_at` timestamp
    - Function to create profile on user signup
*/

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  avatar text NOT NULL DEFAULT 'fuchsia',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE TABLE IF NOT EXISTS public.watchlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type text CHECK (content_type IN ('movie', 'tv', 'anime')) NOT NULL,
  tmdb_id integer,
  anilist_id integer,
  title text NOT NULL,
  poster_path text,
  release_date text,
  vote_average numeric,
  added_at timestamptz DEFAULT now(),
  UNIQUE(user_id, content_type, tmdb_id, anilist_id)
);

ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own watchlist"
  ON public.watchlist
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own watchlist"
  ON public.watchlist
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own watchlist"
  ON public.watchlist
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own watchlist"
  ON public.watchlist
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type text CHECK (content_type IN ('movie', 'tv', 'anime')) NOT NULL,
  tmdb_id integer,
  anilist_id integer,
  title text,
  name text,
  poster_path text,
  release_date text,
  first_air_date text,
  vote_average numeric,
  added_at timestamptz DEFAULT now(),
  UNIQUE(user_id, content_type, tmdb_id, anilist_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own favorites"
  ON public.favorites
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON public.favorites
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own favorites"
  ON public.favorites
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON public.favorites
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.continue_watching (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type text CHECK (content_type IN ('movie', 'tv', 'anime')) NOT NULL,
  tmdb_id integer,
  anilist_id integer,
  title text NOT NULL,
  poster text,
  progress numeric DEFAULT 0,
  season integer,
  episode integer,
  episode_title text,
  total_episodes integer,
  is_dub boolean DEFAULT false,
  last_watched timestamptz DEFAULT now()
);

ALTER TABLE public.continue_watching ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own continue watching"
  ON public.continue_watching
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own continue watching"
  ON public.continue_watching
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own continue watching"
  ON public.continue_watching
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own continue watching"
  ON public.continue_watching
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at 
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW 
  EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'avatar', 'fuchsia')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
