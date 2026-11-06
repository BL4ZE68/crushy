export type Achievement = {
  id: string;
  title: string;
  description: string;
  hidden?: boolean;
  bonusXp?: number;
};

export const achievements: Achievement[] = [
  { id: 'first-game', title: 'Première partie', description: 'Termine ton premier mini-jeu.' },
  { id: 'first-surprise', title: 'Première surprise', description: 'Découvre ton premier petit mot.' },
  { id: 'five-games', title: 'Cinq petits défis', description: 'Termine cinq mini-jeux.' },
  { id: 'ten-games', title: 'Accro aux sourires', description: 'Termine dix mini-jeux, à ton rythme.' },
  {
    id: 'hidden-surprise',
    title: 'Surprise secrète',
    description: 'Une récompense cachée rien que pour toi.',
    hidden: true,
    bonusXp: 25,
  },
  { id: 'explorer', title: 'Exploratrice CRUSHY', description: 'Essaie chaque mini-jeu et découvre une surprise.' },
];

export function getNewAchievements(
  gameCompletions: Readonly<Record<string, number>>,
  openedSurpriseCount: number,
  alreadyUnlocked: readonly string[],
): Achievement[] {
  const completedGames = Object.values(gameCompletions).reduce((total, count) => total + count, 0);
  const playedEveryGame = [
    'truth-or-dare',
    'would-you-rather',
    'word-guess',
    'personality-quiz',
    'timed-challenge',
  ].every((gameId) => (gameCompletions[gameId] ?? 0) > 0);

  const eligible = new Set<string>();
  if (completedGames >= 1) eligible.add('first-game');
  if (openedSurpriseCount >= 1) eligible.add('first-surprise');
  if (completedGames >= 5) eligible.add('five-games');
  if (completedGames >= 10) {
    eligible.add('ten-games');
    eligible.add('hidden-surprise');
  }
  if (playedEveryGame && openedSurpriseCount >= 1) eligible.add('explorer');

  return achievements.filter((achievement) => eligible.has(achievement.id) && !alreadyUnlocked.includes(achievement.id));
}
