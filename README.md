https://lunastream.lol

Setup (Supabase + Auth)

1) Environment

Create a `.env` file in the project root with:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

2) Supabase SQL (run in SQL editor)

```sql
-- profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  avatar text not null default 'default',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;
create policy "profiles select own and public" on public.profiles
  for select using (true);
create policy "profiles update own" on public.profiles
  for update using (auth.uid() = id);
create policy "profiles insert own" on public.profiles
  for insert with check (auth.uid() = id);

-- watchlist
create table if not exists public.watchlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content_type text check (content_type in ('movie','tv')) not null,
  tmdb_id integer not null,
  title text not null,
  poster_path text,
  release_date text,
  vote_average numeric,
  added_at timestamp with time zone default now(),
  unique(user_id, content_type, tmdb_id)
);

alter table public.watchlist enable row level security;
create policy "watchlist read own" on public.watchlist for select using (auth.uid() = user_id);
create policy "watchlist write own" on public.watchlist for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- favorites
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content_type text check (content_type in ('movie','tv')) not null,
  tmdb_id integer not null,
  title text,
  name text,
  poster_path text,
  release_date text,
  first_air_date text,
  vote_average numeric,
  added_at timestamp with time zone default now(),
  unique(user_id, content_type, tmdb_id)
);

alter table public.favorites enable row level security;
create policy "favorites read own" on public.favorites for select using (auth.uid() = user_id);
create policy "favorites write own" on public.favorites for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- continue_watching
create table if not exists public.continue_watching (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content_type text check (content_type in ('movie','tv','anime')) not null,
  tmdb_id integer,
  anilist_id integer,
  title text not null,
  poster text,
  progress numeric default 0,
  season integer,
  episode integer,
  episode_title text,
  total_episodes integer,
  is_dub boolean default false,
  last_watched timestamp with time zone default now()
);

alter table public.continue_watching enable row level security;
create policy "continue read own" on public.continue_watching for select using (auth.uid() = user_id);
create policy "continue write own" on public.continue_watching for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- helper to keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
```

3) Auth settings

- Enable Email confirmations
- Site URL: your deployed URL or `https://localhost:3000`
- Redirect URLs: add `/#/auth/callback`

4) Run the app

```bash
npm install
npm run dev
```