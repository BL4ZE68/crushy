import { CrushyScreen, SectionHeading } from '../../components/CrushyScreen';
import { FeatureCard } from '../../components/FeatureCard';
import { useCrushyTheme } from '../../theme/useCrushyTheme';

const games = [
  { slug: 'truth-or-dare', title: 'Action ou vérité', description: 'Des questions et petits défis à ton rythme.', label: '5 CATÉGORIES', emoji: '🎲' },
  { slug: 'would-you-rather', title: 'Tu préfères ?', description: 'Deux options improbables, un choix difficile.', label: 'CHOIX RAPIDES', emoji: '🤔' },
  { slug: 'word-guess', title: 'Devine le mot', description: 'Suis les indices et trouve le mot mystère.', label: 'À DEVINER', emoji: '🔤' },
  { slug: 'personality-quiz', title: 'Quiz de personnalité', description: 'Découvre quel petit personnage te ressemble.', label: 'QUIZ', emoji: '✨' },
  { slug: 'timed-challenge', title: 'Défi chrono', description: 'Un mini défi contre le compte à rebours.', label: 'CHRONO', emoji: '⏱️' },
];

export default function GamesScreen() {
  const { palette } = useCrushyTheme();
  return (
    <CrushyScreen eyebrow="PETIT MOMENT DE JEU" title="La zone jeux" subtitle="Choisis un jeu, prends ton temps et amuse-toi.">
      <SectionHeading>Choisis ton jeu</SectionHeading>
      {games.map((game, index) => (
        <FeatureCard
          key={game.slug}
          description={game.description}
          emoji={game.emoji}
          href={{ pathname: '/game/[slug]', params: { slug: game.slug } }}
          label={game.label}
          title={game.title}
          tint={index % 2 === 0 ? palette.surfaceAlt : palette.surface}
        />
      ))}
    </CrushyScreen>
  );
}
