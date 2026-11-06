alter table public.music_recommendations
  drop constraint if exists music_recommendations_platform_url_check;

alter table public.music_recommendations
  add constraint music_recommendations_platform_url_check
  check (lower(platform_url) ~ '^https://open\.spotify\.com/')
  not valid;
