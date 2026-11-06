import { z } from 'zod';
import { supabase } from '../lib/supabase';
import { AdminFormValues, AdminSection } from './validation';

export type AdminItem = { id: string; [key: string]: unknown };
export type AdminCategory = { id: string; kind: string; name: string };
export type AdminGame = { id: string; slug: string; title: string };
export type AdminOptions = { categories: AdminCategory[]; games: AdminGame[] };
export type AdminStatistics = {
  active_users: number;
  activities: number;
  completed_games: number;
  surprises_opened: number;
  published_surprises: number;
  scheduled_surprises: number;
};
const adminStatisticsSchema: z.ZodType<AdminStatistics> = z.object({
  active_users: z.number().int().nonnegative(),
  activities: z.number().int().nonnegative(),
  completed_games: z.number().int().nonnegative(),
  surprises_opened: z.number().int().nonnegative(),
  published_surprises: z.number().int().nonnegative(),
  scheduled_surprises: z.number().int().nonnegative(),
});

export type AdminField = {
  name: string;
  label: string;
  placeholder?: string;
  multiline?: boolean;
  type?: 'date' | 'datetime' | 'select' | 'toggle';
  options?: { label: string; value: string }[];
  optionSource?: 'categories' | 'games';
  categoryKind?: string;
};

export const adminSections: { id: AdminSection; label: string }[] = [
  { id: 'surprises', label: 'Surprises' },
  { id: 'citations', label: 'Citations' },
  { id: 'challenges', label: 'Défis' },
  { id: 'questions', label: 'Questions jeux' },
  { id: 'music', label: 'Musique' },
  { id: 'categories', label: 'Catégories' },
];

const moods = [
  { label: 'Heureuse', value: 'heureuse' },
  { label: 'Triste', value: 'triste' },
  { label: 'Amoureuse', value: 'amoureuse' },
  { label: 'Énergique', value: 'énergique' },
  { label: 'Fatiguée', value: 'fatiguée' },
  { label: 'Rêveuse', value: 'rêveuse' },
];
const publicationOptions = [
  { label: 'Brouillon', value: 'false' },
  { label: 'Publié', value: 'true' },
];
const categoryField = (categoryKind: string): AdminField => ({
  name: 'category_id',
  label: 'Catégorie (facultative)',
  type: 'select',
  optionSource: 'categories',
  categoryKind,
});

export function getAdminFields(section: AdminSection): AdminField[] {
  switch (section) {
    case 'surprises':
      return [
        { name: 'title', label: 'Titre', placeholder: 'Un mot doux pour toi' },
        { name: 'body', label: 'Message', placeholder: 'Écris le contenu de la surprise…', multiline: true },
        {
          name: 'kind',
          label: 'Type',
          type: 'select',
          options: [
            { label: 'Secret', value: 'secret' },
            { label: 'Compliment', value: 'compliment' },
            { label: 'Citation', value: 'quote' },
            { label: 'Lettre', value: 'letter' },
            { label: 'Humour', value: 'joke' },
          ],
        },
        categoryField('surprise'),
        { name: 'unlock_xp', label: 'XP requis', placeholder: '0' },
        { name: 'scheduled_at', label: 'Date de publication (facultative)', type: 'datetime' },
        { name: 'is_published', label: 'Publication', type: 'select', options: publicationOptions },
      ];
    case 'citations':
      return [
        { name: 'content', label: 'Citation', placeholder: 'Écris une citation originale…', multiline: true },
        { name: 'mood', label: 'Humeur (facultative)', type: 'select', options: [{ label: 'Toutes', value: '' }, ...moods] },
        { name: 'available_on', label: 'Disponible à partir du (AAAA-MM-JJ)', type: 'date', placeholder: '2026-12-24' },
        { name: 'is_published', label: 'Publication', type: 'select', options: publicationOptions },
      ];
    case 'challenges':
      return [
        { name: 'title', label: 'Titre', placeholder: 'Petit défi créatif' },
        { name: 'description', label: 'Description', placeholder: 'Explique le défi…', multiline: true },
        categoryField('challenge'),
        { name: 'xp_reward', label: 'Récompense XP', placeholder: '5' },
        { name: 'available_at', label: 'Disponible à partir du (facultatif)', type: 'datetime' },
        { name: 'is_published', label: 'Publication', type: 'select', options: publicationOptions },
      ];
    case 'questions':
      return [
        { name: 'game_id', label: 'Jeu', type: 'select', optionSource: 'games' },
        categoryField('game_question'),
        { name: 'prompt', label: 'Question ou consigne', placeholder: 'Écris la question…', multiline: true },
        {
          name: 'kind',
          label: 'Type de question',
          type: 'select',
          options: [
            { label: 'Vérité', value: 'truth' },
            { label: 'Action', value: 'dare' },
            { label: 'Choix', value: 'choice' },
          ],
        },
        { name: 'choices', label: 'Choix (un par ligne)', placeholder: 'Premier choix\nDeuxième choix', multiline: true },
        { name: 'reactions', label: 'Réactions (une par ligne)', multiline: true },
        { name: 'is_published', label: 'Publication', type: 'select', options: publicationOptions },
      ];
    case 'music':
      return [
        { name: 'title', label: 'Morceau', placeholder: 'Titre du morceau' },
        { name: 'artist', label: 'Artiste', placeholder: 'Nom de l’artiste' },
        { name: 'mood', label: 'Humeur', type: 'select', options: moods },
        { name: 'genre', label: 'Genre', placeholder: 'Pop, Indie…' },
        { name: 'platform_url', label: 'Lien Spotify ou YouTube Music', placeholder: 'https://open.spotify.com/…' },
        categoryField('music'),
        { name: 'is_published', label: 'Publication', type: 'select', options: publicationOptions },
      ];
    case 'categories':
      return [
        { name: 'name', label: 'Nom de la catégorie', placeholder: 'Petits mots' },
        { name: 'slug', label: 'Identifiant (minuscules et tirets)', placeholder: 'petits-mots' },
        {
          name: 'kind',
          label: 'Utilisée pour',
          type: 'select',
          options: [
            { label: 'Surprises', value: 'surprise' },
            { label: 'Défis', value: 'challenge' },
            { label: 'Questions de jeu', value: 'game_question' },
            { label: 'Musique', value: 'music' },
          ],
        },
        { name: 'is_active', label: 'Visibilité', type: 'select', options: [
          { label: 'Inactive', value: 'false' },
          { label: 'Active', value: 'true' },
        ] },
      ];
  }
}

function getClient() {
  if (!supabase) throw new Error('Supabase n’est pas configuré.');
  return supabase;
}

function getTable(section: AdminSection): string {
  return section === 'citations' ? 'daily_contents' : section;
}

export async function fetchAdminItems(section: AdminSection): Promise<AdminItem[]> {
  let query = getClient().from(getTable(section)).select('*');
  if (section === 'citations') query = query.eq('content_type', 'quote');
  const { data, error } = await query.order('created_at', { ascending: false }).limit(100);
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function fetchAdminOptions(): Promise<AdminOptions> {
  const client = getClient();
  const [categoriesResult, gamesResult] = await Promise.all([
    client.from('content_categories').select('id, kind, name').eq('is_active', true).order('name'),
    client.from('games').select('id, slug, title').order('title'),
  ]);
  if (categoriesResult.error) throw new Error(categoriesResult.error.message);
  if (gamesResult.error) throw new Error(gamesResult.error.message);
  return {
    categories: categoriesResult.data ?? [],
    games: gamesResult.data ?? [],
  };
}

function toDatabaseRecord(section: AdminSection, values: Record<string, unknown>) {
  if (section !== 'citations') return values;
  return { ...values, content_type: 'quote' };
}

export async function saveAdminItem(
  section: AdminSection,
  values: Record<string, unknown>,
  id?: string,
): Promise<void> {
  const query = getClient().from(getTable(section));
  const result = id
    ? await query.update(toDatabaseRecord(section, values)).eq('id', id)
    : await query.insert(toDatabaseRecord(section, values));
  if (result.error) throw new Error(result.error.message);
}

export async function deleteAdminItem(section: AdminSection, id: string): Promise<void> {
  const { error } = await getClient().from(getTable(section)).delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function fetchAdminStatistics(): Promise<AdminStatistics> {
  const { data, error } = await getClient().rpc('get_admin_statistics');
  if (error) throw new Error(error.message);
  const parsed = adminStatisticsSchema.safeParse(data);
  if (!parsed.success) throw new Error('Les statistiques reçues sont invalides.');
  return parsed.data;
}

export function getItemTitle(item: AdminItem): string {
  for (const key of ['title', 'content', 'prompt', 'name']) {
    const value = item[key];
    if (typeof value === 'string' && value.trim()) return value;
  }
  return 'Contenu sans titre';
}

export function getItemSubtitle(item: AdminItem): string {
  for (const key of ['body', 'description', 'artist', 'slug']) {
    const value = item[key];
    if (typeof value === 'string' && value.trim()) return value;
  }
  return '';
}

export function getAdminFormValues(section: AdminSection, item?: AdminItem): AdminFormValues {
  const defaults: Record<AdminSection, AdminFormValues> = {
    surprises: { kind: 'compliment', unlock_xp: '0', is_published: 'false' },
    citations: { mood: '', available_on: '', is_published: 'false' },
    challenges: { xp_reward: '5', is_published: 'false' },
    questions: { kind: 'truth', choices: '', answer: '', hints: '', reactions: '', is_published: 'false' },
    music: { mood: 'heureuse', is_published: 'false' },
    categories: { kind: 'surprise', is_active: 'true' },
  };
  const result: AdminFormValues = { ...defaults[section] };
  for (const field of getAdminFields(section)) {
    const value = item?.[field.name];
    if (field.type === 'datetime' && typeof value === 'string') {
      result[field.name] = value;
    } else if (field.type === 'date' && typeof value === 'string') {
      result[field.name] = value;
    } else if (Array.isArray(value)) {
      result[field.name] = value.join('\n');
    } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      result[field.name] = String(value);
    } else {
      result[field.name] = field.type === 'toggle' ? 'true' : '';
    }
  }
  return result;
}

