import { useLocalSearchParams } from 'expo-router';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { CrushyScreen } from '../../components/CrushyScreen';
import { MemoryGame } from '../../components/games/MemoryGame';
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
    subtitle: 'Douze dilemmes légers par série, avec de nouvelles questions à chaque partie.',
    Component: WouldYouRatherGame,
  },
  'word-guess': {
    title: 'Devine le mot',
    subtitle: 'Trois essais et un indice à chaque tentative.',
    Component: WordGuessGame,
  },
  'personality-quiz': {
    title: 'Quiz de personnalité',
    subtitle: 'Vingt questions pour découvrir ton petit portrait.',
    Component: PersonalityQuizGame,
  },
  'timed-challenge': {
    title: 'Défi chrono',
    subtitle: 'Trois missions de réflexes à réussir en huit secondes.',
    Component: TimedChallengeGame,
  },
  'memory': {
    title: 'Le Memory de Pip',
    subtitle: 'Choisis entre 6, 12 ou 32 cartes et retrouve les paires à ton rythme.',
    Component: MemoryGame,
  },
} as const;

export default function GameScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const game = games[slug as keyof typeof games];

  if (!game) {
    return <CrushyScreen eyebrow="ZONE JEUX" title="Jeu introuvable" subtitle="Ce mini-jeu n’est pas disponible." />;
  }

  const { Component } = game;
  const screen = (
    <CrushyScreen eyebrow="ZONE JEUX" title={game.title} subtitle={game.subtitle}>
      <Component />
    </CrushyScreen>
  );

  if (slug !== 'word-guess') return screen;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      style={styles.keyboardAvoiding}
    >
      {screen}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoiding: { flex: 1 },
});
