export type PromptCategory = 'drôle' | 'personnel' | 'amitié' | 'crush' | 'insolite';
export type PromptKind = 'vérité' | 'action';

export type GamePrompt = {
  id: string;
  category: PromptCategory;
  kind: PromptKind;
  text: string;
};

export const promptCategories: PromptCategory[] = ['drôle', 'personnel', 'amitié', 'crush', 'insolite'];

export const gamePrompts: GamePrompt[] = [
  { id: 'fun-truth-1', category: 'drôle', kind: 'vérité', text: 'Quelle est la chose la plus drôle que tu aies faite sans t’en rendre compte ?' },
  { id: 'fun-truth-2', category: 'drôle', kind: 'vérité', text: 'Si tu devais parler comme un personnage de dessin animé toute la journée, lequel choisirais-tu ?' },
  { id: 'fun-action-1', category: 'drôle', kind: 'action', text: 'Fais ta meilleure imitation d’un chat qui réclame à manger.' },
  { id: 'fun-action-2', category: 'drôle', kind: 'action', text: 'Invente un nom de super-héros pour ton humeur du moment.' },
  { id: 'personal-truth-1', category: 'personnel', kind: 'vérité', text: 'Quelle petite chose te remonte toujours le moral ?' },
  { id: 'personal-truth-2', category: 'personnel', kind: 'vérité', text: 'De quoi es-tu fière, même si tu en parles rarement ?' },
  { id: 'personal-action-1', category: 'personnel', kind: 'action', text: 'Choisis une chanson qui décrit ton humeur et fredonne quelques secondes.' },
  { id: 'personal-action-2', category: 'personnel', kind: 'action', text: 'Envoie-toi une note avec un compliment que tu mérites d’entendre.' },
  { id: 'friendship-truth-1', category: 'amitié', kind: 'vérité', text: 'Quel souvenir d’amitié te donne encore le sourire ?' },
  { id: 'friendship-truth-2', category: 'amitié', kind: 'vérité', text: 'Quelle qualité apprécies-tu le plus chez une amie ?' },
  { id: 'friendship-action-1', category: 'amitié', kind: 'action', text: 'Pense à une personne qui compte pour toi et envoie-lui un petit coucou.' },
  { id: 'friendship-action-2', category: 'amitié', kind: 'action', text: 'Décris ton amie idéale en trois mots.' },
  { id: 'crush-truth-1', category: 'crush', kind: 'vérité', text: 'Quel geste attentionné te fait fondre à coup sûr ?' },
  { id: 'crush-truth-2', category: 'crush', kind: 'vérité', text: 'Quelle serait ta sortie parfaite à deux ?' },
  { id: 'crush-action-1', category: 'crush', kind: 'action', text: 'Imagine un rendez-vous surprise et donne-lui un nom de film.' },
  { id: 'crush-action-2', category: 'crush', kind: 'action', text: 'Fais une liste mentale de trois choses qui rendent quelqu’un attachant.' },
  { id: 'odd-truth-1', category: 'insolite', kind: 'vérité', text: 'Si les animaux pouvaient parler, lequel serait le plus impoli ?' },
  { id: 'odd-truth-2', category: 'insolite', kind: 'vérité', text: 'Quelle règle absurde aimerais-tu instaurer pour une journée ?' },
  { id: 'odd-action-1', category: 'insolite', kind: 'action', text: 'Invente une poignée de main secrète avec toi-même.' },
  { id: 'odd-action-2', category: 'insolite', kind: 'action', text: 'Donne un nom très sérieux à un objet près de toi.' },
];

export type ChoiceQuestion = {
  id: string;
  prompt: string;
  choices: [string, string];
  reactions: [string, string];
};

export const wouldYouRatherQuestions: ChoiceQuestion[] = [
  { id: 'choice-1', prompt: 'Tu préfères…', choices: ['Parler aux animaux', 'Comprendre toutes les langues'], reactions: ['Les animaux auraient sûrement plein de potins !', 'Plus aucune chanson sans paroles mystérieuses.'] },
  { id: 'choice-2', prompt: 'Tu préfères…', choices: ['Vivre près de la mer', 'Vivre près d’une forêt'], reactions: ['Le bruit des vagues pour se réveiller.', 'Une petite promenade sous les arbres.'] },
  { id: 'choice-3', prompt: 'Tu préfères…', choices: ['Un pique-nique improvisé', 'Une soirée film cocooning'], reactions: ['La couverture à carreaux t’attend !', 'Pop-corn et chaussettes douillettes.'] },
  { id: 'choice-4', prompt: 'Tu préfères…', choices: ['Savoir dessiner parfaitement', 'Savoir chanter parfaitement'], reactions: ['Le monde devient ton carnet.', 'Concert privé dans la salle de bain !'] },
  { id: 'choice-5', prompt: 'Tu préfères…', choices: ['Un voyage surprise', 'Une journée entière sans programme'], reactions: ['Valise prête, destination mystère.', 'Le luxe de suivre son envie du moment.'] },
  { id: 'choice-6', prompt: 'Tu préfères…', choices: ['Des pancakes tous les matins', 'Une pizza chaque vendredi'], reactions: ['Le petit-déjeuner devient une fête.', 'Vendredi vient de gagner des points.'] },
];

export const personalityQuestions = [
  {
    id: 'personality-1',
    prompt: 'Ton après-midi idéal ressemble plutôt à…',
    choices: [
      { text: 'Une promenade au soleil', type: 'rayon' },
      { text: 'Un livre et un coin tranquille', type: 'reveuse' },
      { text: 'Un plan improvisé entre amies', type: 'etincelle' },
    ],
  },
  {
    id: 'personality-2',
    prompt: 'Quand une amie a besoin de toi, tu…',
    choices: [
      { text: 'Trouves les mots qui réconfortent', type: 'coeur' },
      { text: 'Lui proposes une petite aventure', type: 'etincelle' },
      { text: 'L’écoutes avec toute ton attention', type: 'reveuse' },
    ],
  },
  {
    id: 'personality-3',
    prompt: 'La surprise qui te ferait plaisir ?',
    choices: [
      { text: 'Un mot doux inattendu', type: 'coeur' },
      { text: 'Une sortie spontanée', type: 'rayon' },
      { text: 'Un petit cadeau original', type: 'etincelle' },
    ],
  },
  {
    id: 'personality-4',
    prompt: 'Choisis ta météo intérieure :',
    choices: [
      { text: 'Un soleil tranquille', type: 'rayon' },
      { text: 'Un ciel étoilé', type: 'reveuse' },
      { text: 'Une pluie de confettis', type: 'etincelle' },
    ],
  },
  {
    id: 'personality-5',
    prompt: 'Ce qui te ressemble le plus, c’est…',
    choices: [
      { text: 'Ta gentillesse', type: 'coeur' },
      { text: 'Ton imagination', type: 'reveuse' },
      { text: 'Ton énergie contagieuse', type: 'rayon' },
    ],
  },
] as const;

export const personalityProfiles = {
  rayon: { title: 'Petit rayon de soleil', description: 'Tu apportes de l’élan et de la lumière autour de toi. Ta bonne humeur sait faire de la place aux autres.' },
  reveuse: { title: 'Grande rêveuse', description: 'Tu remarques les détails et tu as un monde intérieur plein de belles idées.' },
  etincelle: { title: 'Étincelle spontanée', description: 'Tu sais transformer un moment ordinaire en aventure inattendue.' },
  coeur: { title: 'Cœur tout doux', description: 'Ton écoute et tes petites attentions rendent les gens précieux autour de toi.' },
} as const;

export type PersonalityType = keyof typeof personalityProfiles;

export type WordRiddle = {
  answer: string;
  hints: [string, string, string];
};

export const wordRiddles: WordRiddle[] = [
  { answer: 'arc-en-ciel', hints: ['Je viens souvent après la pluie.', 'Je dessine plusieurs couleurs dans le ciel.', 'Mon nom commence par arc.'] },
  { answer: 'papillon', hints: ['Je commence ma vie autrement.', 'J’aime les fleurs et le soleil.', 'Je vole avec de grandes ailes colorées.'] },
  { answer: 'chocolat', hints: ['On me partage volontiers au goûter.', 'Je peux être noir, blanc ou au lait.', 'Je fond doucement dans la bouche.'] },
  { answer: 'parapluie', hints: ['Je sors quand le ciel fait des siennes.', 'Je me plie pour se ranger.', 'Je protège de la pluie.'] },
  { answer: 'coccinelle', hints: ['Je porte une jolie couleur vive.', 'J’ai de petites ailes.', 'Je suis rouge avec des points noirs.'] },
];

export function getRandomPrompt(
  category: PromptCategory,
  kind: PromptKind,
  previousId?: string,
  random: () => number = Math.random,
  additionalPrompts: readonly GamePrompt[] = [],
): GamePrompt {
  const pool = [
    ...gamePrompts.filter((item) => item.category === category && item.kind === kind),
    ...additionalPrompts.filter((item) => item.category === category && item.kind === kind),
  ];
  const fresh = pool.filter((item) => item.id !== previousId);
  const candidates = fresh.length > 0 ? fresh : pool;
  const sample = Math.max(0, Math.min(0.999999999, random()));
  const index = Math.floor(sample * candidates.length);
  return candidates[index];
}

export function normalizeAnswer(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('fr-FR')
    .replace(/[^a-z0-9]/g, '');
}

export function isCorrectWordGuess(input: string, answer: string): boolean {
  return normalizeAnswer(input) === normalizeAnswer(answer);
}

export type WordGuessOutcome = 'correct' | 'incorrect' | 'out-of-attempts';

export function evaluateWordGuess(input: string, answer: string, attemptsRemaining: number): WordGuessOutcome {
  if (isCorrectWordGuess(input, answer)) return 'correct';
  return attemptsRemaining <= 1 ? 'out-of-attempts' : 'incorrect';
}

export function getPersonalityOutcome(answers: readonly PersonalityType[]): PersonalityType {
  const counts = new Map<PersonalityType, number>();
  for (const answer of answers) counts.set(answer, (counts.get(answer) ?? 0) + 1);

  return (Object.keys(personalityProfiles) as PersonalityType[]).reduce((leader, candidate) =>
    (counts.get(candidate) ?? 0) > (counts.get(leader) ?? 0) ? candidate : leader,
  'rayon');
}

export function didCompleteTimedChallenge(taps: number, target: number, secondsRemaining: number): boolean {
  return taps >= target && secondsRemaining > 0;
}
