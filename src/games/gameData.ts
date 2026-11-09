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
  // --- drôle ---
  { id: 'fun-truth-1', category: 'drôle', kind: 'vérité', text: 'Quelle est la chose la plus drôle que tu aies faite sans t’en rendre compte ?' },
  { id: 'fun-truth-2', category: 'drôle', kind: 'vérité', text: 'Si tu devais parler comme un personnage de dessin animé toute la journée, lequel choisirais-tu ?' },
  { id: 'fun-truth-3', category: 'drôle', kind: 'vérité', text: 'Quel est le surnom le plus ridicule qu’on t’ait donné, et que tu assumes un peu ?' },
  { id: 'fun-truth-4', category: 'drôle', kind: 'vérité', text: 'Si ta vie était une sitcom, quel serait le titre de l’épisode d’aujourd’hui ?' },
  { id: 'fun-truth-5', category: 'drôle', kind: 'vérité', text: 'Quelle habitude un peu bizarre as-tu, que personne ne soupçonne ?' },
  { id: 'fun-action-1', category: 'drôle', kind: 'action', text: 'Fais ta meilleure imitation d’un chat qui réclame à manger.' },
  { id: 'fun-action-2', category: 'drôle', kind: 'action', text: 'Invente un nom de super-héros pour ton humeur du moment.' },
  { id: 'fun-action-3', category: 'drôle', kind: 'action', text: 'Raconte ce que tu as mangé aujourd’hui comme si tu commentais un match sportif.' },
  { id: 'fun-action-4', category: 'drôle', kind: 'action', text: 'Fais le bruit le plus ridicule que tu connaisses, sans rire. Bonne chance.' },
  { id: 'fun-action-5', category: 'drôle', kind: 'action', text: 'Invente un slogan publicitaire pour toi-même, en mode très premier degré.' },
  // --- personnel ---
  { id: 'personal-truth-1', category: 'personnel', kind: 'vérité', text: 'Quelle petite chose te remonte toujours le moral ?' },
  { id: 'personal-truth-2', category: 'personnel', kind: 'vérité', text: 'De quoi es-tu fière, même si tu en parles rarement ?' },
  { id: 'personal-truth-3', category: 'personnel', kind: 'vérité', text: 'Quel conseil donnerais-tu à la toi d’il y a un an ?' },
  { id: 'personal-truth-4', category: 'personnel', kind: 'vérité', text: 'Quelle chanson te représente le mieux en ce moment ?' },
  { id: 'personal-truth-5', category: 'personnel', kind: 'vérité', text: 'Quel est le compliment qui t’a le plus marquée, et qui te l’a fait ?' },
  { id: 'personal-action-1', category: 'personnel', kind: 'action', text: 'Choisis une chanson qui décrit ton humeur et fredonne quelques secondes.' },
  { id: 'personal-action-2', category: 'personnel', kind: 'action', text: 'Envoie-toi une note avec un compliment que tu mérites d’entendre.' },
  { id: 'personal-action-3', category: 'personnel', kind: 'action', text: 'Note trois choses pour lesquelles tu es reconnaissante aujourd’hui.' },
  { id: 'personal-action-4', category: 'personnel', kind: 'action', text: 'Décris ta journée idéale en cinq mots, pas un de plus.' },
  { id: 'personal-action-5', category: 'personnel', kind: 'action', text: 'Note deux petites victoires de cette semaine, même minuscules.' },
  // --- amitié ---
  { id: 'friendship-truth-1', category: 'amitié', kind: 'vérité', text: 'Quel souvenir d’amitié te donne encore le sourire ?' },
  { id: 'friendship-truth-2', category: 'amitié', kind: 'vérité', text: 'Quelle qualité apprécies-tu le plus chez une amie ?' },
  { id: 'friendship-truth-3', category: 'amitié', kind: 'vérité', text: 'Qui est la personne qui te fait le plus rire, et pourquoi ?' },
  { id: 'friendship-truth-4', category: 'amitié', kind: 'vérité', text: 'Quel est le meilleur conseil qu’une amie t’ait donné ?' },
  { id: 'friendship-truth-5', category: 'amitié', kind: 'vérité', text: 'Quelle tradition ou petit rituel partages-tu avec quelqu’un que tu aimes ?' },
  { id: 'friendship-action-1', category: 'amitié', kind: 'action', text: 'Pense à une personne qui compte pour toi et envoie-lui un petit coucou.' },
  { id: 'friendship-action-2', category: 'amitié', kind: 'action', text: 'Décris ton amie idéale en trois mots.' },
  { id: 'friendship-action-3', category: 'amitié', kind: 'action', text: 'Écris le début d’un message pour remercier quelqu’un qui t’a soutenue récemment.' },
  { id: 'friendship-action-4', category: 'amitié', kind: 'action', text: 'Choisis un emoji qui résume ta meilleure amie et explique pourquoi.' },
  { id: 'friendship-action-5', category: 'amitié', kind: 'action', text: 'Imagine une sortie parfaite entre amies et donne-lui un nom.' },
  // --- crush ---
  { id: 'crush-truth-1', category: 'crush', kind: 'vérité', text: 'Quel geste attentionné te fait fondre à coup sûr ?' },
  { id: 'crush-truth-2', category: 'crush', kind: 'vérité', text: 'Quelle serait ta sortie parfaite à deux ?' },
  { id: 'crush-truth-3', category: 'crush', kind: 'vérité', text: 'Quel petit détail chez quelqu’un te fait craquer en premier ?' },
  { id: 'crush-truth-4', category: 'crush', kind: 'vérité', text: 'Quelle est la chose la plus romantique que tu aies vue dans un film ?' },
  { id: 'crush-truth-5', category: 'crush', kind: 'vérité', text: 'Tu préfères les mots doux écrits ou dits à voix haute ?' },
  { id: 'crush-action-1', category: 'crush', kind: 'action', text: 'Imagine un rendez-vous surprise et donne-lui un nom de film.' },
  { id: 'crush-action-2', category: 'crush', kind: 'action', text: 'Fais une liste mentale de trois choses qui rendent quelqu’un attachant.' },
  { id: 'crush-action-3', category: 'crush', kind: 'action', text: 'Décris ton partenaire idéal avec une métaphore : un plat, une saison ou une couleur.' },
  { id: 'crush-action-4', category: 'crush', kind: 'action', text: 'Invente une phrase d’accroche volontairement beaucoup trop sérieuse.' },
  { id: 'crush-action-5', category: 'crush', kind: 'action', text: 'Choisis une chanson d’amour et explique en une phrase pourquoi elle te représente.' },
  // --- insolite ---
  { id: 'odd-truth-1', category: 'insolite', kind: 'vérité', text: 'Si les animaux pouvaient parler, lequel serait le plus impoli ?' },
  { id: 'odd-truth-2', category: 'insolite', kind: 'vérité', text: 'Quelle règle absurde aimerais-tu instaurer pour une journée ?' },
  { id: 'odd-truth-3', category: 'insolite', kind: 'vérité', text: 'Si tu devais vivre dans un dessin animé, lequel choisirais-tu et pourquoi ?' },
  { id: 'odd-truth-4', category: 'insolite', kind: 'vérité', text: 'Quel super-pouvoir totalement inutile aimerais-tu avoir ?' },
  { id: 'odd-truth-5', category: 'insolite', kind: 'vérité', text: 'Si tu étais un plat, lequel serais-tu et pourquoi ?' },
  { id: 'odd-action-1', category: 'insolite', kind: 'action', text: 'Invente une poignée de main secrète avec toi-même.' },
  { id: 'odd-action-2', category: 'insolite', kind: 'action', text: 'Donne un nom très sérieux à un objet près de toi.' },
  { id: 'odd-action-3', category: 'insolite', kind: 'action', text: 'Invente un mot qui n’existe pas et donne-lui une définition convaincante.' },
  { id: 'odd-action-4', category: 'insolite', kind: 'action', text: 'Raconte un souvenir d’enfance en changeant volontairement un détail, le plus sérieusement possible.' },
  { id: 'odd-action-5', category: 'insolite', kind: 'action', text: 'Décris la météo du jour comme un bulletin d’information très dramatique.' },
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
  { id: 'choice-7', prompt: 'Tu préfères…', choices: ['Te réveiller sans réveil, toujours à l’heure', 'Ne jamais être fatiguée, même après une courte nuit'], reactions: ['Le matin devient tout de suite plus doux.', 'Ton énergie ne connaît plus de pause.'] },
  { id: 'choice-8', prompt: 'Et si tu devais choisir :', choices: ['Relire ton livre préféré pour toujours', 'Découvrir un livre génial chaque semaine'], reactions: ['Une vieille habitude qui rassure.', 'Ta pile à lire n’a aucune chance de refroidir.'] },
  { id: 'choice-9', prompt: 'Tu préfères…', choices: ['Un câlin qui dure une minute entière', 'Dix petits compliments sincères dans la journée'], reactions: ['Soixante secondes qui changent tout.', 'Dix petites phrases, une grande journée.'] },
  { id: 'choice-10', prompt: 'Dans l’idéal, tu choisis…', choices: ['Mettre le temps en pause dix minutes par jour', 'Revivre ta journée préférée une fois par mois'], reactions: ['Dix minutes rien que pour souffler.', 'Le meilleur jour de ta vie, en rediffusion.'] },
  { id: 'choice-11', prompt: 'Tu préfères…', choices: ['Une maison toujours bien rangée sans effort', 'Un frigo toujours plein de bonnes surprises'], reactions: ['Zéro rangement, que du confort.', 'Chaque ouverture de frigo devient une surprise.'] },
  { id: 'choice-12', prompt: 'Si tu devais trancher :', choices: ['Savoir toujours ce qu’il faut dire', 'Savoir toujours ce qu’il faut faire'], reactions: ['Les mots justes, toujours au bon moment.', 'Les actes parlent plus fort que les discours.'] },
  { id: 'choice-13', prompt: 'Tu préfères…', choices: ['Voyager dans le passé pour un jour', 'Voir cinq minutes de ton futur'], reactions: ['Un petit détour dans tes souvenirs.', 'Un aperçu qui donne le sourire d’avance.'] },
  { id: 'choice-14', prompt: 'Et si tu devais choisir :', choices: ['Un fou rire qui dure toute la soirée', 'Un silence confortable avec quelqu’un'], reactions: ['Les fous rires, ça recharge les batteries.', 'Le silence qui dit tout sans un mot.'] },
  { id: 'choice-15', prompt: 'Tu préfères…', choices: ['Recevoir une lettre manuscrite', 'Recevoir un message vocal surprise'], reactions: ['L’écriture a ce petit quelque chose en plus.', 'Une voix qui surprend toujours agréablement.'] },
  { id: 'choice-16', prompt: 'Dans l’idéal, tu choisis…', choices: ['Une playlist faite pour toi', 'Une liste de films faite pour toi'], reactions: ['Chaque chanson pensée pour ton humeur.', 'Un petit cinéma rien que pour toi.'] },
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
  {
    id: 'personality-6',
    prompt: 'Ta façon de profiter d’une journée libre ?',
    choices: [
      { text: 'Un plan plein de soleil dehors', type: 'rayon' },
      { text: 'Un moment cocooning avec tes pensées', type: 'reveuse' },
      { text: 'Une activité décidée sur un coup de tête', type: 'etincelle' },
    ],
  },
  {
    id: 'personality-7',
    prompt: 'Dans un groupe, on compte souvent sur toi pour…',
    choices: [
      { text: 'Apaiser les tensions', type: 'coeur' },
      { text: 'Lancer une idée originale', type: 'etincelle' },
      { text: 'Garder le cap et l’énergie', type: 'rayon' },
    ],
  },
  {
    id: 'personality-8',
    prompt: 'Ton rituel du soir préféré ?',
    choices: [
      { text: 'Écrire ou penser à ceux que tu aimes', type: 'coeur' },
      { text: 'Improviser une dernière petite aventure', type: 'etincelle' },
      { text: 'Laisser vagabonder ton imagination', type: 'reveuse' },
    ],
  },
  {
    id: 'personality-9',
    prompt: 'Ce qui te touche le plus chez quelqu’un ?',
    choices: [
      { text: 'Sa gentillesse sincère', type: 'coeur' },
      { text: 'Son énergie positive', type: 'rayon' },
      { text: 'Sa sensibilité discrète', type: 'reveuse' },
    ],
  },
  {
    id: 'personality-10',
    prompt: 'Ta manière de marquer un moment important ?',
    choices: [
      { text: 'Le partager avec les gens que tu aimes', type: 'coeur' },
      { text: 'L’improviser en grande fête', type: 'etincelle' },
      { text: 'Le garder précieusement dans tes pensées', type: 'reveuse' },
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
  { answer: 'licorne', hints: ['Je n’existe que dans les histoires.', 'On me dessine souvent en couleurs pastel.', 'J’ai une longue corne sur le front.'] },
  { answer: 'bibliotheque', hints: ['Je suis un endroit calme rempli d’histoires.', 'On y vient pour emprunter un livre.', 'Mon nom commence par biblio.'] },
  { answer: 'tournesol', hints: ['Je suis une fleur qui aime regarder le ciel.', 'Mon nom parle du soleil.', 'Mes pétales jaunes forment un grand cercle.'] },
  { answer: 'bougie', hints: ['On m’allume pour créer une ambiance douce.', 'Je fonds petit à petit.', 'J’ai une petite flamme au bout d’une mèche.'] },
  { answer: 'cerf-volant', hints: ['On me fait voler avec un fil.', 'J’aime les jours de vent.', 'Mon nom contient un animal qui bondit dans la forêt.'] },
  { answer: 'confiture', hints: ['On m’étale sur une tartine.', 'Je suis faite de fruits et de sucre.', 'Je me garde dans un pot en verre.'] },
  { answer: 'hirondelle', hints: ['Je reviens chaque printemps.', 'Je suis un petit oiseau voyageur.', 'On dit que je ne fais pas le printemps à moi seule.'] },
  { answer: 'etoile filante', hints: ['On me voit traverser le ciel la nuit.', 'On dit qu’il faut faire un vœu en me voyant.', 'Je porte le nom d’un astre qui file.'] },
  { answer: 'aquarium', hints: ['Je suis rempli d’eau et de vie.', 'Des poissons y nagent tranquillement.', 'On me pose souvent dans un salon.'] },
  { answer: 'framboise', hints: ['Je suis un petit fruit rouge et sucré.', 'On me retrouve souvent en tarte ou en confiture.', 'Mon nom ressemble à un petit bruit malicieux.'] },
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
