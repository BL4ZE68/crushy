create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nickname text not null default 'Aventurière',
  avatar text not null default 'heart',
  mood text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_roles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'admin' check (role = 'admin'),
  granted_at timestamptz not null default now()
);
create unique index if not exists admin_roles_single_owner_idx
  on public.admin_roles (role);

create table if not exists public.content_categories (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('surprise', 'challenge', 'game_question', 'music')),
  slug text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null check (length(trim(name)) between 1 and 80),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (kind, slug)
);

create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (length(trim(title)) between 1 and 100),
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.surprises (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(trim(title)) between 1 and 120),
  body text not null check (length(trim(body)) between 1 and 4000),
  kind text not null check (kind in ('secret', 'compliment', 'quote', 'letter', 'joke')),
  category_id uuid references public.content_categories (id) on delete set null,
  unlock_xp integer not null default 0 check (unlock_xp between 0 and 100000),
  scheduled_at timestamptz,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.daily_contents (
  id uuid primary key default gen_random_uuid(),
  content_type text not null check (content_type in ('quote', 'joke', 'thought', 'question')),
  content text not null check (length(trim(content)) between 1 and 2000),
  mood text check (mood is null or mood in ('heureuse', 'triste', 'amoureuse', 'énergique', 'fatiguée', 'rêveuse')),
  available_on date,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.challenges (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(trim(title)) between 1 and 120),
  description text not null check (length(trim(description)) between 1 and 2000),
  category_id uuid references public.content_categories (id) on delete set null,
  xp_reward integer not null default 5 check (xp_reward between 0 and 10000),
  available_at timestamptz,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.game_questions (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games (id) on delete cascade,
  category_id uuid references public.content_categories (id) on delete set null,
  prompt text not null check (length(trim(prompt)) between 1 and 2000),
  kind text not null check (kind in ('truth', 'dare', 'choice', 'word', 'quiz', 'timed')),
  choices jsonb not null default '[]'::jsonb check (jsonb_typeof(choices) = 'array'),
  answer text,
  hints text[] not null default '{}',
  reactions text[] not null default '{}',
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.music_recommendations (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(trim(title)) between 1 and 160),
  artist text not null check (length(trim(artist)) between 1 and 160),
  mood text not null check (mood in ('heureuse', 'triste', 'amoureuse', 'énergique', 'fatiguée', 'rêveuse')),
  genre text not null check (length(trim(genre)) between 1 and 80),
  platform_url text not null check (lower(platform_url) ~ '^https://(open\.spotify\.com|music\.youtube\.com)/'),
  category_id uuid references public.content_categories (id) on delete set null,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.game_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  game_id uuid not null references public.games (id) on delete cascade,
  score integer not null default 0 check (score >= 0),
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.surprise_reads (
  user_id uuid not null references auth.users (id) on delete cascade,
  surprise_id uuid not null references public.surprises (id) on delete cascade,
  read_at timestamptz not null default now(),
  primary key (user_id, surprise_id)
);

create table if not exists public.user_rewards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  reward_key text not null,
  xp integer not null default 0 check (xp >= 0),
  earned_at timestamptz not null default now(),
  unique (user_id, reward_key)
);

create table if not exists public.user_activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  activity_type text not null check (length(trim(activity_type)) between 1 and 80),
  details jsonb not null default '{}'::jsonb check (jsonb_typeof(details) = 'object'),
  occurred_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null check (length(trim(title)) between 1 and 160),
  body text not null check (length(trim(body)) between 1 and 1000),
  scheduled_at timestamptz,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists surprises_published_schedule_idx
  on public.surprises (scheduled_at) where is_published;
create index if not exists surprises_published_created_idx
  on public.surprises (created_at desc) where is_published;
create index if not exists daily_contents_available_idx
  on public.daily_contents (mood, available_on, content_type) where is_published;
create index if not exists challenges_available_idx
  on public.challenges (available_at) where is_published;
create index if not exists game_questions_game_category_idx
  on public.game_questions (game_id, category_id) where is_published;
create index if not exists music_recommendations_mood_idx
  on public.music_recommendations (mood, created_at desc) where is_published;
create index if not exists game_sessions_user_completed_idx
  on public.game_sessions (user_id, completed_at);
create index if not exists user_activities_user_occurred_idx
  on public.user_activities (user_id, occurred_at desc);
create index if not exists surprise_reads_read_at_idx
  on public.surprise_reads (read_at desc);
create index if not exists notifications_user_created_idx
  on public.notifications (user_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_roles as roles
    where roles.user_id = (select auth.uid())
      and roles.role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles', 'admin_roles', 'content_categories', 'games', 'surprises',
    'daily_contents', 'challenges', 'game_questions', 'music_recommendations',
    'game_sessions', 'surprise_reads', 'user_rewards', 'user_activities', 'notifications'
  ]
  loop
    execute format('alter table public.%I enable row level security', table_name);
  end loop;
end;
$$;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles', 'content_categories', 'games', 'surprises', 'daily_contents',
    'challenges', 'game_questions', 'music_recommendations'
  ]
  loop
    execute format(
      'create trigger %I before update on public.%I for each row execute function public.set_updated_at()',
      table_name || '_set_updated_at',
      table_name
    );
  end loop;
end;
$$;

create policy "Profiles are private to their owner"
  on public.profiles for all to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

create policy "Users can read their own admin role"
  on public.admin_roles for select to authenticated
  using (user_id = (select auth.uid()));

create policy "Active categories are public"
  on public.content_categories for select to anon, authenticated
  using (is_active or (select public.is_admin()));
create policy "Admins manage categories"
  on public.content_categories for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Published games are public"
  on public.games for select to anon, authenticated
  using (is_published or (select public.is_admin()));
create policy "Admins manage games"
  on public.games for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Published surprises are public when available"
  on public.surprises for select to anon, authenticated
  using (
    (is_published and (scheduled_at is null or scheduled_at <= now()))
    or (select public.is_admin())
  );
create policy "Admins manage surprises"
  on public.surprises for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Published daily content is public"
  on public.daily_contents for select to anon, authenticated
  using (
    (is_published and (available_on is null or available_on <= current_date))
    or (select public.is_admin())
  );
create policy "Admins manage daily content"
  on public.daily_contents for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Published challenges are public when available"
  on public.challenges for select to anon, authenticated
  using (
    (is_published and (available_at is null or available_at <= now()))
    or (select public.is_admin())
  );
create policy "Admins manage challenges"
  on public.challenges for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Admins manage game questions"
  on public.game_questions for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Published music recommendations are public"
  on public.music_recommendations for select to anon, authenticated
  using (is_published or (select public.is_admin()));
create policy "Admins manage music recommendations"
  on public.music_recommendations for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Users manage their own game sessions"
  on public.game_sessions for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "Users read their own surprise history"
  on public.surprise_reads for select to authenticated
  using (user_id = (select auth.uid()));
create policy "Users record their own surprise reads"
  on public.surprise_reads for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1
      from public.surprises as available_surprise
      where available_surprise.id = surprise_reads.surprise_id
    )
  );
create policy "Admins read surprise history"
  on public.surprise_reads for select to authenticated
  using ((select public.is_admin()));

create policy "Users read their own rewards"
  on public.user_rewards for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));
create policy "Admins manage rewards"
  on public.user_rewards for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Users read their own activity"
  on public.user_activities for select to authenticated
  using (user_id = (select auth.uid()));
create policy "Users record their own activity"
  on public.user_activities for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy "Admins read activity"
  on public.user_activities for select to authenticated
  using ((select public.is_admin()));

create policy "Users manage their own notifications"
  on public.notifications for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create view public.published_game_questions
with (security_barrier = true)
as
select
  questions.id,
  games.slug as game_slug,
  questions.category_id,
  categories.slug as category_slug,
  questions.prompt,
  questions.kind,
  questions.choices,
  questions.hints,
  questions.reactions,
  questions.created_at
from public.game_questions as questions
join public.games as games on games.id = questions.game_id
left join public.content_categories as categories
  on categories.id = questions.category_id and categories.is_active
where questions.is_published and games.is_published;

grant select on public.published_game_questions to anon, authenticated;

create or replace function public.get_admin_statistics()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not (select public.is_admin()) then
    raise exception 'admin access required' using errcode = '42501';
  end if;

  return jsonb_build_object(
    'active_users', (select count(distinct activities.user_id) from public.user_activities as activities),
    'activities', (select count(*) from public.user_activities),
    'completed_games', (select count(*) from public.game_sessions where completed_at is not null),
    'surprises_opened', (select count(*) from public.surprise_reads),
    'published_surprises', (select count(*) from public.surprises where is_published),
    'scheduled_surprises', (
      select count(*) from public.surprises
      where is_published and scheduled_at > now()
    )
  );
end;
$$;

revoke all on function public.get_admin_statistics() from public;
grant execute on function public.get_admin_statistics() to authenticated;

grant usage on schema public to anon, authenticated;
grant select on public.content_categories, public.games, public.surprises,
  public.daily_contents, public.challenges, public.music_recommendations
  to anon, authenticated;
grant select on public.admin_roles to authenticated;
grant select, insert, update, delete on public.profiles, public.game_sessions,
  public.surprise_reads, public.user_rewards, public.user_activities, public.notifications
  to authenticated;
grant select, insert, update, delete on public.content_categories, public.games,
  public.surprises, public.daily_contents, public.challenges, public.game_questions,
  public.music_recommendations to authenticated;
grant usage, select on all sequences in schema public to authenticated;

insert into public.games (slug, title)
values
  ('truth-or-dare', 'Action ou vérité'),
  ('would-you-rather', 'Tu préfères ?'),
  ('word-guess', 'Devine le mot'),
  ('personality-quiz', 'Quiz de personnalité'),
  ('timed-challenge', 'Défi chrono'),
  ('memory', 'Le Memory de Pip')
on conflict (slug) do nothing;

insert into public.content_categories (kind, slug, name)
values
  ('surprise', 'compliment', 'Compliment'),
  ('surprise', 'secret', 'Message secret'),
  ('surprise', 'citation', 'Citation'),
  ('surprise', 'lettre', 'Petite lettre'),
  ('surprise', 'humour', 'Humour'),
  ('challenge', 'quotidien', 'Défi du jour'),
  ('challenge', 'creatif', 'Créatif'),
  ('game_question', 'drole', 'Drôle'),
  ('game_question', 'personnel', 'Personnel'),
  ('game_question', 'amitie', 'Amitié'),
  ('game_question', 'crush', 'Crush'),
  ('game_question', 'insolite', 'Insolite'),
  ('music', 'pop', 'Pop'),
  ('music', 'indie', 'Indie'),
  ('music', 'instrumental', 'Instrumental'),
  ('music', 'soul', 'Soul')
on conflict (kind, slug) do nothing;
