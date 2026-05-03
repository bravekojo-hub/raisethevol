-- ═══════════════════════════════════════════════════════════
-- supabase/schema.sql  —  Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════

-- PROFILES
create table if not exists profiles (
  id uuid references auth.users primary key,
  username text unique,
  display_name text,
  bio text,
  location text,
  avatar_url text,
  website text,
  topics text[] default '{}',
  is_anonymous bool default false,
  is_verified_pro bool default false,
  is_spiritual bool default false,
  followers_count int default 0,
  following_count int default 0,
  voices_count int default 0,
  encouragements_received int default 0,
  created_at timestamptz default now()
);

-- POSTS
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  type text check (type in ('voice','video','text')) not null,
  body text,
  mood text,
  topic text,
  audience text default 'everyone' check (audience in ('everyone','spiritual','professional')),
  is_anonymous bool default false,
  media_url text,
  media_duration int,
  thumbnail_url text,
  likes_count int default 0,
  encouragements_count int default 0,
  replies_count int default 0,
  is_trending bool default false,
  is_deleted bool default false,
  created_at timestamptz default now()
);

-- REPLIES
create table if not exists replies (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  type text check (type in ('voice','video','text')) not null,
  body text,
  media_url text,
  media_duration int,
  is_anonymous bool default false,
  created_at timestamptz default now()
);

-- ENCOURAGEMENTS
create table if not exists encouragements (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique(post_id, user_id)
);

-- LIKES
create table if not exists likes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique(post_id, user_id)
);

-- FOLLOWS
create table if not exists follows (
  follower_id uuid references profiles(id) on delete cascade,
  following_id uuid references profiles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key(follower_id, following_id)
);

-- TOPICS
create table if not exists topics (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  category text,
  voices_count int default 0,
  videos_count int default 0,
  is_trending bool default false,
  last_active_at timestamptz default now()
);

-- NOTIFICATIONS
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid references profiles(id) on delete cascade,
  actor_id uuid references profiles(id),
  type text not null,
  post_id uuid references posts(id),
  message text,
  is_read bool default false,
  created_at timestamptz default now()
);

-- NOTIFICATION PREFERENCES
create table if not exists notification_prefs (
  user_id uuid references profiles(id) primary key,
  all_notifs bool default true,
  on_encourage bool default true,
  on_like bool default true,
  on_milestone bool default false,
  on_voice_reply bool default true,
  on_video_reply bool default true,
  on_text_reply bool default true,
  on_spiritual_reply bool default true,
  on_pro_reply bool default true,
  on_new_follower bool default true,
  on_following_posts bool default false,
  on_trending bool default true,
  on_suggested_topics bool default false,
  on_rising_voices bool default false,
  email_weekly bool default false,
  email_updates bool default false
);

-- BADGES
create table if not exists badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  badge_key text,
  earned_at timestamptz default now(),
  unique(user_id, badge_key)
);

-- REPORTS
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references profiles(id),
  post_id uuid references posts(id),
  reason text,
  status text default 'pending',
  created_at timestamptz default now()
);

-- SEED DEFAULT TOPICS
insert into topics (name, category, voices_count, videos_count, is_trending) values
  ('Grief & healing — how do you carry loss and still find light?', 'Spirituality', 214, 48, true),
  ('Burnout & recovery — real stories from people who came back', 'Professional', 189, 31, false),
  ('First-gen stories — navigating worlds your parents never saw', 'Experience', 302, 67, false),
  ('When prayer was the only thing left — what did you say?', 'Spirituality', 97, 12, false),
  ('Small wins — the moment you realized you were going to be okay', 'Joy', 441, 88, false),
  ('The conversation that changed everything — share yours', 'Experience', 153, 22, false)
on conflict do nothing;


-- ═══════════════════════════════════════════════════════════
-- supabase/functions.sql  —  RPC helper functions
-- Run these in Supabase SQL Editor too
-- ═══════════════════════════════════════════════════════════

create or replace function increment_voices_count(uid uuid)
returns void language sql as $$
  update profiles set voices_count = voices_count + 1 where id = uid;
$$;

create or replace function increment_encouragements(pid uuid)
returns void language sql as $$
  update posts set encouragements_count = encouragements_count + 1 where id = pid;
$$;

create or replace function decrement_encouragements(pid uuid)
returns void language sql as $$
  update posts set encouragements_count = greatest(0, encouragements_count - 1) where id = pid;
$$;

create or replace function increment_encouragements_received(uid uuid)
returns void language sql as $$
  update profiles set encouragements_received = encouragements_received + 1 where id = uid;
$$;

create or replace function increment_likes(pid uuid)
returns void language sql as $$
  update posts set likes_count = likes_count + 1 where id = pid;
$$;

create or replace function decrement_likes(pid uuid)
returns void language sql as $$
  update posts set likes_count = greatest(0, likes_count - 1) where id = pid;
$$;

create or replace function increment_replies_count(pid uuid)
returns void language sql as $$
  update posts set replies_count = replies_count + 1 where id = pid;
$$;

create or replace function increment_followers(uid uuid)
returns void language sql as $$
  update profiles set followers_count = followers_count + 1 where id = uid;
$$;

create or replace function decrement_followers(uid uuid)
returns void language sql as $$
  update profiles set followers_count = greatest(0, followers_count - 1) where id = uid;
$$;

create or replace function increment_following(uid uuid)
returns void language sql as $$
  update profiles set following_count = following_count + 1 where id = uid;
$$;

create or replace function decrement_following(uid uuid)
returns void language sql as $$
  update profiles set following_count = greatest(0, following_count - 1) where id = uid;
$$;


-- ═══════════════════════════════════════════════════════════
-- Row Level Security (RLS) Policies
-- ═══════════════════════════════════════════════════════════

alter table profiles enable row level security;
alter table posts enable row level security;
alter table replies enable row level security;
alter table encouragements enable row level security;
alter table likes enable row level security;
alter table follows enable row level security;
alter table notifications enable row level security;
alter table notification_prefs enable row level security;
alter table badges enable row level security;

-- Profiles: anyone can read, only owner can write
create policy "Public profiles" on profiles for select using (true);
create policy "Own profile update" on profiles for update using (auth.uid() = id);

-- Posts: public read (non-deleted), own write
create policy "Public posts" on posts for select using (is_deleted = false);
create policy "Authenticated insert" on posts for insert with check (auth.uid() = user_id);
create policy "Own post update" on posts for update using (auth.uid() = user_id);

-- Replies: public read, auth insert
create policy "Public replies" on replies for select using (true);
create policy "Auth reply insert" on replies for insert with check (auth.uid() = user_id);

-- Encouragements: public read, auth insert/delete
create policy "Public encouragements" on encouragements for select using (true);
create policy "Auth encourage" on encouragements for insert with check (auth.uid() = user_id);
create policy "Own encourage delete" on encouragements for delete using (auth.uid() = user_id);

-- Likes: same pattern
create policy "Public likes" on likes for select using (true);
create policy "Auth like" on likes for insert with check (auth.uid() = user_id);
create policy "Own like delete" on likes for delete using (auth.uid() = user_id);

-- Follows
create policy "Public follows" on follows for select using (true);
create policy "Auth follow" on follows for insert with check (auth.uid() = follower_id);
create policy "Own unfollow" on follows for delete using (auth.uid() = follower_id);

-- Notifications: only recipient can read
create policy "Own notifications" on notifications for select using (auth.uid() = recipient_id);
create policy "Own notif update" on notifications for update using (auth.uid() = recipient_id);

-- Notif prefs: only owner
create policy "Own notif prefs" on notification_prefs for all using (auth.uid() = user_id);

-- Badges: public read
create policy "Public badges" on badges for select using (true);
