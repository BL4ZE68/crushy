import { z } from 'zod';
import { Mood } from '../store/useCrushyStore';
import { supabase } from './supabase';

const moodSchema = z.enum(['heureuse', 'triste', 'amoureuse', 'énergique', 'fatiguée', 'rêveuse']);

export const managedSurpriseSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  body: z.string(),
  kind: z.enum(['secret', 'compliment', 'quote', 'letter', 'joke']),
  unlock_xp: z.number().int().nonnegative(),
  scheduled_at: z.string().nullable(),
});
export type ManagedSurprise = z.infer<typeof managedSurpriseSchema>;

const managedDailyItemSchema = z.object({
  content_type: z.enum(['quote', 'joke', 'thought', 'question']),
  content: z.string(),
  mood: moodSchema.nullable(),
});
export type ManagedDailyItem = z.infer<typeof managedDailyItemSchema>;

export const managedChallengeSchema = z.object({
  title: z.string(),
  description: z.string(),
  xp_reward: z.number().int().nonnegative(),
});
export type ManagedChallenge = z.infer<typeof managedChallengeSchema>;

export const managedTrackSchema = z.object({
  title: z.string(),
  artist: z.string(),
  mood: moodSchema,
  genre: z.string(),
  platform_url: z.string().url().refine(
    (value) => /^https:\/\/open\.spotify\.com\//i.test(value),
    'Lien musical non pris en charge.',
  ),
});
export type ManagedTrack = z.infer<typeof managedTrackSchema>;

export const managedGameQuestionSchema = z.object({
  id: z.string().uuid(),
  game_slug: z.string(),
  category_slug: z.string().nullable(),
  prompt: z.string(),
  kind: z.enum(['truth', 'dare', 'choice', 'word', 'quiz', 'timed']),
  choices: z.array(z.string()),
  reactions: z.array(z.string()),
});
export type ManagedGameQuestion = z.infer<typeof managedGameQuestionSchema>;

function getClient() {
  if (!supabase) return null;
  return supabase;
}

export async function fetchPublishedSurprises(): Promise<ManagedSurprise[]> {
  const client = getClient();
  if (!client) return [];
  const { data, error } = await client
    .from('surprises')
    .select('id, title, body, kind, unlock_xp, scheduled_at')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) throw new Error(error.message);
  return z.array(managedSurpriseSchema).parse(data ?? []);
}

export async function fetchPublishedDailyItems(mood: Mood, day: string): Promise<ManagedDailyItem[]> {
  const client = getClient();
  if (!client) return [];
  const { data, error } = await client
    .from('daily_contents')
    .select('content_type, content, mood, available_on')
    .eq('is_published', true)
    .or(`mood.is.null,mood.eq.${mood}`)
    .or(`available_on.is.null,available_on.lte.${day}`)
    .order('available_on', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw new Error(error.message);
  return z.array(managedDailyItemSchema).parse(data ?? []);
}

export async function fetchPublishedChallenge(now: string): Promise<ManagedChallenge | null> {
  const client = getClient();
  if (!client) return null;
  const { data, error } = await client
    .from('challenges')
    .select('title, description, xp_reward, available_at')
    .eq('is_published', true)
    .or(`available_at.is.null,available_at.lte.${now}`)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? managedChallengeSchema.parse(data) : null;
}

export async function fetchPublishedMusic(mood: Mood): Promise<ManagedTrack[]> {
  const client = getClient();
  if (!client) return [];
  const { data, error } = await client
    .from('music_recommendations')
    .select('title, artist, mood, genre, platform_url')
    .eq('is_published', true)
    .eq('mood', mood)
    .ilike('platform_url', 'https://open.spotify.com/%')
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw new Error(error.message);
  return z.array(managedTrackSchema).parse(data ?? []);
}

export async function fetchPublishedGameQuestions(gameSlug: string): Promise<ManagedGameQuestion[]> {
  const client = getClient();
  if (!client) return [];
  const { data, error } = await client
    .from('published_game_questions')
    .select('id, game_slug, category_slug, prompt, kind, choices, reactions')
    .eq('game_slug', gameSlug)
    .limit(100);
  if (error) throw new Error(error.message);
  return z.array(managedGameQuestionSchema).parse(data ?? []);
}
