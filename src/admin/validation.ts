import { z } from 'zod';

export type AdminSection =
  | 'surprises'
  | 'citations'
  | 'challenges'
  | 'questions'
  | 'music'
  | 'categories';

export type AdminFormValues = Record<string, string>;

const uuid = z.string().trim().regex(
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  'Sélectionne une entrée valide.',
);
const optionalUuid = z.union([uuid, z.literal('')]).transform((value) => value || null);
const published = z.enum(['true', 'false']).transform((value) => value === 'true');
const optionalMood = z.enum(['', 'heureuse', 'triste', 'amoureuse', 'énergique', 'fatiguée', 'rêveuse'])
  .transform((value) => value || null);
const optionalDate = z.string().trim().transform((value) => value || null).pipe(
  z.string().nullable().refine((value) => {
    if (value === null) return true;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }, 'Saisis une date réelle au format AAAA-MM-JJ.'),
);
const requiredText = (message: string, maximum = 2000) =>
  z.string().trim().min(1, message).max(maximum, `Maximum ${maximum} caractères.`);
const optionalDateTime = z.string().trim().transform((value) => value || null).pipe(
  z.string().nullable().refine(
    (value) => value === null || (!Number.isNaN(Date.parse(value)) && value.includes('T')),
    'Saisis une date et une heure valides.',
  ).transform((value) => value === null ? null : new Date(value).toISOString()),
);

const schemas: Record<AdminSection, z.ZodType<Record<string, unknown>, AdminFormValues>> = {
  surprises: z.object({
    title: requiredText('Le titre est obligatoire.', 120),
    body: requiredText('Le message est obligatoire.', 4000),
    kind: z.enum(['secret', 'compliment', 'quote', 'letter', 'joke']),
    category_id: optionalUuid,
    unlock_xp: z.string().regex(/^\d{1,6}$/, 'Indique un nombre entier positif.')
      .transform(Number).refine((value) => value <= 100000, 'Le seuil maximal est de 100 000 XP.'),
    scheduled_at: optionalDateTime,
    is_published: published,
  }),
  citations: z.object({
    content: requiredText('La citation est obligatoire.'),
    mood: optionalMood,
    available_on: optionalDate,
    is_published: published,
  }),
  challenges: z.object({
    title: requiredText('Le titre est obligatoire.', 120),
    description: requiredText('La description est obligatoire.'),
    category_id: optionalUuid,
    xp_reward: z.string().regex(/^\d{1,5}$/, 'Indique un nombre entier positif.')
      .transform(Number).refine((value) => value <= 10000, 'La récompense maximale est de 10 000 XP.'),
    available_at: optionalDateTime,
    is_published: published,
  }),
  questions: z.object({
    game_id: uuid,
    category_id: optionalUuid,
    prompt: requiredText('La question est obligatoire.'),
    kind: z.enum(['truth', 'dare', 'choice']),
    choices: z.string().transform((value) => value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean)),
    answer: z.string().trim().max(1000, 'Maximum 1 000 caractères.').transform((value) => value || null),
    hints: z.string().transform((value) => value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean)),
    reactions: z.string().transform((value) => value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean)),
    is_published: published,
  }).superRefine((values, context) => {
    if (values.kind === 'choice' && values.choices.length !== 2) {
      context.addIssue({ code: 'custom', path: ['choices'], message: 'Ajoute exactement deux choix, un par ligne.' });
    }
    if (values.kind === 'choice' && values.reactions.length > 0 && values.reactions.length !== values.choices.length) {
      context.addIssue({ code: 'custom', path: ['reactions'], message: 'Ajoute une réaction par choix ou laisse ce champ vide.' });
    }
  }),
  music: z.object({
    title: requiredText('Le titre du morceau est obligatoire.', 160),
    artist: requiredText('L’artiste est obligatoire.', 160),
    mood: z.enum(['heureuse', 'triste', 'amoureuse', 'énergique', 'fatiguée', 'rêveuse']),
    genre: requiredText('Le genre est obligatoire.', 80),
    platform_url: z.string().trim().url('Saisis un lien valide.').refine(
      (value) => /^https:\/\/open\.spotify\.com\//i.test(value),
      'Le lien doit provenir de Spotify.',
    ),
    category_id: optionalUuid,
    is_published: published,
  }),
  categories: z.object({
    name: requiredText('Le nom est obligatoire.', 80),
    slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Utilise des minuscules, chiffres et tirets.'),
    kind: z.enum(['surprise', 'challenge', 'game_question', 'music']),
    is_active: published,
  }),
};

export function validateAdminForm(
  section: AdminSection,
  values: AdminFormValues,
): { data: Record<string, unknown> } | { error: string; field?: string } {
  const result = schemas[section].safeParse(values);
  if (!result.success) {
    const issue = result.error.issues[0];
    return {
      error: issue?.message ?? 'Vérifie les champs du formulaire.',
      field: typeof issue?.path[0] === 'string' ? issue.path[0] : undefined,
    };
  }

  return { data: result.data };
}
