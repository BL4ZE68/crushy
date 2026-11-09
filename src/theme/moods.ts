import type { Mood } from '../store/useCrushyStore';
import type { palettes } from './theme';

type Palette = (typeof palettes)['light'];

export type MoodMeta = {
  emoji: string;
  /** Couleur de fond associée à l'humeur. */
  tint: (palette: Palette) => string;
  /** Phrase prononcée par Pip pour cette humeur. */
  line: string;
};

export const moodOrder: Mood[] = ['heureuse', 'amoureuse', 'énergique', 'rêveuse', 'fatiguée', 'triste'];

export const moodMeta: Record<Mood, MoodMeta> = {
  heureuse: { emoji: '😊', tint: (p) => p.yellow, line: 'Ton sourire éclaire tout ici !' },
  amoureuse: { emoji: '😍', tint: (p) => p.pink, line: 'Mon petit cœur fait boum boum…' },
  énergique: { emoji: '⚡', tint: (p) => p.peach, line: 'On y va ? J’ai de l’énergie pour deux !' },
  rêveuse: { emoji: '☁️', tint: (p) => p.mint, line: 'Tes pensées ont l’air bien jolies…' },
  fatiguée: { emoji: '😴', tint: (p) => p.lavender, line: 'On y va tout doucement, d’accord ?' },
  triste: { emoji: '🥺', tint: (p) => p.sky, line: 'Je reste là, tout près de toi.' },
};

export const defaultMoodLine = 'Coucou ! Dis-moi comment tu te sens.';
