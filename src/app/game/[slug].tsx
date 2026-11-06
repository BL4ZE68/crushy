import { useLocalSearchParams } from 'expo-router';
import { CrushyScreen } from '../../components/CrushyScreen';
import { PersonalityQuizGame } from '../../components/games/PersonalityQuizGame';
import { TimedChallengeGame } from '../../components/games/TimedChallengeGame';
import { TruthOrDareGame } from '../../components/games/TruthOrDareGame';
import { WouldYouRatherGame } from '../../components/games/WouldYouRatherGame';
import { WordGuessGame } from '../../components/games/WordGuessGame';

const games = {
  'truth-or-dare': {
    title: 'Action ou vérité',
    subtitle: 'Choisis une catégorie et laisse le hasard décider.',
    Component: TruthOrDareGame,
  },
  'would-you-rather': {
    title: 'Tu préfères ?',
    subtitle: 'Six dilemmes légers, six choix rien qu’à toi.',
    Component: WouldYouRatherGame,
  },
  'word-guess': {
    title: 'Devine le mot',
    subtitle: 'Trois essais et un indice à chaque tentative.',
    Component: WordGuessGame,
  },
  'personality-quiz': {
    title: 'Quiz de personnalité',
    subtitle: 'Cinq questions pour découvrir ton petit portrait.',
    Component: PersonalityQuizGame,
  },
  'timed-challenge': {
    title: 'Défi chrono',
    subtitle: 'Tape dix fois avant la fin des douze secondes !',
    Component: TimedChallengeGame,
  },
} as const;

export default function GameScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const game = games[slug as keyof typeof games];

  if (!game) {
    return <CrushyScreen eyebrow="ZONE JEUX" title="Jeu introuvable" subtitle="Ce mini-jeu n’est pas disponible." />;
  }

  const { Component } = game;
  return (
    <CrushyScreen eyebrow="ZONE JEUX" title={game.title} subtitle={game.subtitle}>
      <Component />
    </CrushyScreen>
  );
}
