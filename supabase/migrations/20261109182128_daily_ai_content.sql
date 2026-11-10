alter table public.daily_contents
  add column generation_key text,
  add constraint daily_contents_generation_key_key unique (generation_key);

alter table public.challenges
  add column generation_key text,
  add constraint challenges_generation_key_key unique (generation_key);