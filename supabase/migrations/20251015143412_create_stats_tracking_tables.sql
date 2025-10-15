/*
  # Create Statistics Tracking System

  1. New Tables
    - `watch_stats`
      - `id` (int, primary key)
      - `total_count` (bigint) - Total number of watches recorded
      - `updated_at` (timestamptz) - Last update timestamp
    
    - `unique_visitors`
      - `id` (uuid, primary key)
      - `ip_address` (text) - Hashed IP address for privacy
      - `first_visit` (timestamptz) - First visit timestamp
      - `created_at` (timestamptz) - Record creation time
    
    - `visitor_stats`
      - `id` (int, primary key)
      - `total_unique` (bigint) - Total unique visitors
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add policies for authenticated service role write access

  3. Important Notes
    - Uses a singleton pattern for stats tables (only one row)
    - IP addresses are hashed for privacy compliance
    - Indexes added for performance on IP lookups
*/

-- Create watch_stats table
CREATE TABLE IF NOT EXISTS watch_stats (
  id int PRIMARY KEY DEFAULT 1,
  total_count bigint DEFAULT 0 NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT single_row_watch_stats CHECK (id = 1)
);

-- Insert initial row
INSERT INTO watch_stats (id, total_count) 
VALUES (1, 0) 
ON CONFLICT (id) DO NOTHING;

-- Create unique_visitors table
CREATE TABLE IF NOT EXISTS unique_visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text UNIQUE NOT NULL,
  first_visit timestamptz DEFAULT now() NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create visitor_stats table
CREATE TABLE IF NOT EXISTS visitor_stats (
  id int PRIMARY KEY DEFAULT 1,
  total_unique bigint DEFAULT 0 NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT single_row_visitor_stats CHECK (id = 1)
);

-- Insert initial row
INSERT INTO visitor_stats (id, total_unique)
VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;

-- Create index for faster IP lookups
CREATE INDEX IF NOT EXISTS idx_unique_visitors_ip ON unique_visitors(ip_address);

-- Enable RLS
ALTER TABLE watch_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE unique_visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_stats ENABLE ROW LEVEL SECURITY;

-- Policies for watch_stats (public read, authenticated write)
CREATE POLICY "Anyone can read watch stats"
  ON watch_stats FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Service can update watch stats"
  ON watch_stats FOR UPDATE
  TO authenticated
  USING (id = 1)
  WITH CHECK (id = 1);

-- Policies for unique_visitors (authenticated access only)
CREATE POLICY "Service can read visitors"
  ON unique_visitors FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service can insert visitors"
  ON unique_visitors FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policies for visitor_stats (public read, authenticated write)
CREATE POLICY "Anyone can read visitor stats"
  ON visitor_stats FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Service can update visitor stats"
  ON visitor_stats FOR UPDATE
  TO authenticated
  USING (id = 1)
  WITH CHECK (id = 1);
