-- ============================================================
-- Fluentra · Phase 7 — Posts feed (text, likes, comments)
-- Run ONCE in Supabase → SQL Editor → Run. Safe to re-run.
-- Requires Phase 4 (profiles + friendships) to already be applied.
-- ============================================================

-- ---------- POSTS --------------------------------------------
create table if not exists public.posts (
  id          uuid primary key default gen_random_uuid(),
  author      uuid not null references auth.users(id) on delete cascade,
  body        text not null,
  image_url   text,
  visibility  text not null default 'public',   -- 'public' | 'friends'
  created_at  timestamptz not null default now()
);
create index if not exists posts_created_idx on public.posts (created_at desc);
create index if not exists posts_author_idx  on public.posts (author, created_at desc);

-- Helper: can the current user see a given post?
-- SECURITY DEFINER so it can evaluate visibility + friendship without
-- tripping over the row-level policies of the tables it reads.
create or replace function public.can_see_post(p_id uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from public.posts p
    where p.id = p_id and (
      p.visibility = 'public'
      or p.author = auth.uid()
      or (p.visibility = 'friends' and exists (
        select 1 from public.friendships f
        where f.status = 'accepted' and (
          (f.requester = auth.uid() and f.addressee = p.author) or
          (f.addressee = auth.uid() and f.requester = p.author))))
    )
  );
$$;

alter table public.posts enable row level security;
drop policy if exists "posts_read" on public.posts;
create policy "posts_read" on public.posts
  for select to authenticated using (
    visibility = 'public'
    or author = auth.uid()
    or (visibility = 'friends' and exists (
      select 1 from public.friendships f
      where f.status = 'accepted' and (
        (f.requester = auth.uid() and f.addressee = posts.author) or
        (f.addressee = auth.uid() and f.requester = posts.author))))
  );
drop policy if exists "posts_insert" on public.posts;
create policy "posts_insert" on public.posts
  for insert to authenticated with check (author = auth.uid());
drop policy if exists "posts_delete" on public.posts;
create policy "posts_delete" on public.posts
  for delete to authenticated using (author = auth.uid());
drop policy if exists "posts_update" on public.posts;
create policy "posts_update" on public.posts
  for update to authenticated using (author = auth.uid()) with check (author = auth.uid());

-- ---------- LIKES --------------------------------------------
create table if not exists public.post_likes (
  post_id     uuid not null references public.posts(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (post_id, user_id)
);

alter table public.post_likes enable row level security;
drop policy if exists "likes_read" on public.post_likes;
create policy "likes_read" on public.post_likes
  for select to authenticated using (public.can_see_post(post_id));
drop policy if exists "likes_insert" on public.post_likes;
create policy "likes_insert" on public.post_likes
  for insert to authenticated with check (user_id = auth.uid() and public.can_see_post(post_id));
drop policy if exists "likes_delete" on public.post_likes;
create policy "likes_delete" on public.post_likes
  for delete to authenticated using (user_id = auth.uid());

-- ---------- COMMENTS -----------------------------------------
create table if not exists public.post_comments (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid not null references public.posts(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  body        text not null,
  created_at  timestamptz not null default now()
);
create index if not exists post_comments_post_idx on public.post_comments (post_id, created_at);

alter table public.post_comments enable row level security;
drop policy if exists "comments_read" on public.post_comments;
create policy "comments_read" on public.post_comments
  for select to authenticated using (public.can_see_post(post_id));
drop policy if exists "comments_insert" on public.post_comments;
create policy "comments_insert" on public.post_comments
  for insert to authenticated with check (user_id = auth.uid() and public.can_see_post(post_id));
drop policy if exists "comments_delete" on public.post_comments;
create policy "comments_delete" on public.post_comments
  for delete to authenticated using (user_id = auth.uid());

-- ============================================================
-- Done. "Success. No rows returned" = good.
-- ============================================================
