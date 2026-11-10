import { Mood } from '../store/useCrushyStore';

export type MusicGenre = 'Pop' | 'Indie' | 'Instrumental' | 'Soul';

export type TrackRecommendation = {
  title: string;
  artist: string;
  genre: string;
  platformUrl?: string;
};

export const musicMoods: Mood[] = ['heureuse', 'triste', 'amoureuse', 'énergique', 'fatiguée', 'rêveuse'];
export const musicGenres: MusicGenre[] = ['Pop', 'Indie', 'Instrumental', 'Soul'];

export const trackRecommendations: Record<Mood, TrackRecommendation[]> = {
  heureuse: [
    { title: 'Levitating', artist: 'Dua Lipa', genre: 'Pop' },
    { title: 'Sunday Best', artist: 'Surfaces', genre: 'Indie' },
    { title: 'Lovely Day', artist: 'Bill Withers', genre: 'Soul' },
  ],
  triste: [
    { title: 'Nuvole Bianche', artist: 'Ludovico Einaudi', genre: 'Instrumental' },
    { title: 'The Night We Met', artist: 'Lord Huron', genre: 'Indie' },
    { title: 'Fix You', artist: 'Coldplay', genre: 'Pop' },
  ],
  amoureuse: [
    { title: 'La vie en rose', artist: 'Édith Piaf', genre: 'Soul' },
    { title: 'Until I Found You', artist: 'Stephen Sanchez', genre: 'Pop' },
    { title: 'Lover', artist: 'Taylor Swift', genre: 'Indie' },
  ],
  énergique: [
    { title: 'Can’t Stop the Feeling!', artist: 'Justin Timberlake', genre: 'Pop' },
    { title: 'Good as Hell', artist: 'Lizzo', genre: 'Soul' },
    { title: 'Dog Days Are Over', artist: 'Florence + The Machine', genre: 'Indie' },
  ],
  fatiguée: [
    { title: 'Weightless', artist: 'Marconi Union', genre: 'Instrumental' },
    { title: 'Bloom', artist: 'The Paper Kites', genre: 'Indie' },
    { title: 'Sunset Lover', artist: 'Petit Biscuit', genre: 'Instrumental' },
  ],
  rêveuse: [
    { title: 'Space Song', artist: 'Beach House', genre: 'Indie' },
    { title: 'Experience', artist: 'Ludovico Einaudi', genre: 'Instrumental' },
    { title: 'Golden Hour', artist: 'JVKE', genre: 'Pop' },
  ],
};

export const musicQuotes: Record<Mood, string> = {
  heureuse: 'Une bonne mélodie peut accompagner un sourire, sans lui voler la vedette.',
  triste: 'Parfois, une chanson ne change pas tout : elle tient simplement compagnie.',
  amoureuse: 'Les plus belles bandes-son laissent de la place aux souvenirs.',
  énergique: 'Laisse le rythme te porter, sans oublier que c’est toi qui choisis la cadence.',
  fatiguée: 'Tu peux écouter doucement, ou ne rien écouter du tout.',
  rêveuse: 'Certaines mélodies donnent l’impression d’ouvrir une fenêtre sur ailleurs.',
};

/** Playlists publiques existantes, sélectionnées pour chaque humeur. */
export const moodPlaylists: Record<Mood, { title: string; url: string }> = {
  heureuse: { title: 'Mood Booster', url: 'https://open.spotify.com/playlist/37i9dQZF1DX3rxVfibe1L0' },
  triste: { title: 'Sad Songs', url: 'https://open.spotify.com/playlist/37i9dQZF1DX7qK8ma5wgG1' },
  amoureuse: { title: 'Love Pop', url: 'https://open.spotify.com/playlist/37i9dQZF1DX50QitC6Oqtn' },
  énergique: { title: 'Beast Mode', url: 'https://open.spotify.com/playlist/37i9dQZF1DX76Wlfdnj7AP' },
  fatiguée: { title: 'Deep Focus', url: 'https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ' },
  rêveuse: { title: 'Dreampop', url: 'https://open.spotify.com/playlist/37i9dQZF1DX6uhsAfngvaD' },
};

export function getMusicSearchUrl(title: string, artist: string): string {
  const query = encodeURIComponent(`${title} ${artist}`);
  return `https://open.spotify.com/search/${query}`;
}

export function getMoodPlaylistUrl(mood: Mood): string {
  return moodPlaylists[mood].url;
}
