import { useEffect, useMemo, useState } from 'react';
import { Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CrushyScreen, SectionHeading } from '../../components/CrushyScreen';
import { CrushyStateMessage } from '../../components/CrushyStateMessage';
import { designTokens } from '../../theme/theme';
import { useCrushyTheme } from '../../theme/useCrushyTheme';
import { Mood, useCrushyStore } from '../../store/useCrushyStore';
import { fetchPublishedMusic, ManagedTrack } from '../../lib/publicContent';
import {
  getMusicSearchUrl,
  getPlaylistSearchUrl,
  musicGenres,
  musicMoods,
  musicQuotes,
  MusicGenre,
  trackRecommendations,
} from '../../music/recommendations';

type MusicPlatform = 'spotify' | 'youtube';
type GenreFilter = MusicGenre | string;

const moodLabels: Record<Mood, string> = {
  heureuse: 'Heureuse',
  triste: 'Triste',
  amoureuse: 'Amoureuse',
  énergique: 'Énergique',
  fatiguée: 'Fatiguée',
  rêveuse: 'Rêveuse',
};

async function openExternalLink(url: string) {
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert('Lien indisponible', 'Cette plateforme ne peut pas être ouverte sur ton appareil.');
  }
}

export default function MusicScreen() {
  const { palette } = useCrushyTheme();
  const savedMood = useCrushyStore((state) => state.mood);
  const setSavedMood = useCrushyStore((state) => state.setMood);
  const [selected, setSelected] = useState<Mood>(savedMood ?? 'rêveuse');
  const [platform, setPlatform] = useState<MusicPlatform>('spotify');
  const [genre, setGenre] = useState<GenreFilter>('Tout');
  const [publishedTracks, setPublishedTracks] = useState<ManagedTrack[]>([]);
  const [contentError, setContentError] = useState('');
  const [loadingTracks, setLoadingTracks] = useState(true);

  useEffect(() => {
    if (savedMood) setSelected(savedMood);
  }, [savedMood]);

  useEffect(() => {
    let active = true;
    setPublishedTracks([]);
    setContentError('');
    setLoadingTracks(true);
    void fetchPublishedMusic(selected)
      .then((tracks) => {
        if (active) setPublishedTracks(tracks);
      })
      .catch((error: unknown) => {
        if (!active) return;
        console.warn('Impossible de charger les suggestions musicales publiées.', error);
        setContentError('Les suggestions en ligne sont indisponibles. Les titres intégrés restent accessibles.');
      })
      .finally(() => {
        if (active) setLoadingTracks(false);
      });
    return () => {
      active = false;
    };
  }, [selected]);

  const tracks = useMemo(() => [
    ...publishedTracks.map((track) => ({
      title: track.title,
      artist: track.artist,
      genre: track.genre,
      platformUrl: track.platform_url,
    })),
    ...trackRecommendations[selected],
  ].filter((track) => genre === 'Tout' || track.genre === genre), [genre, publishedTracks, selected]);
  const genreOptions = useMemo(
    () => ['Tout', ...new Set([...musicGenres, ...publishedTracks.map((track) => track.genre)])],
    [publishedTracks],
  );

  function chooseMood(mood: Mood) {
    setSelected(mood);
    setSavedMood(mood);
    setGenre('Tout');
  }

  return (
    <CrushyScreen eyebrow="BANDE-SON DE TON MOMENT" title="Music mood" subtitle="Des idées personnalisées, à écouter sur les plateformes officielles.">
      <SectionHeading>Choisis ton humeur</SectionHeading>
      <View style={styles.moods}>
        {musicMoods.map((mood) => {
          const active = selected === mood;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              key={mood}
              onPress={() => chooseMood(mood)}
              style={[styles.moodChip, { backgroundColor: active ? palette.text : palette.surfaceAlt }]}
            >
              <Text style={[styles.moodText, { color: active ? palette.background : palette.text }]}>{moodLabels[mood]}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={[styles.quoteCard, { backgroundColor: palette.lavender }]}>
        <Text style={[styles.quoteLabel, { color: palette.text }]}>PETITE CITATION MUSICALE</Text>
        <Text style={[styles.quote, { color: palette.text }]}>{musicQuotes[selected]}</Text>
      </View>

      <SectionHeading>Quelques chansons pour toi</SectionHeading>
      {contentError ? <CrushyStateMessage message={contentError} title="Suggestions indisponibles" tone="warning" /> : null}
      {loadingTracks ? <CrushyStateMessage message="On vérifie s’il y a de nouvelles suggestions pour toi." title="Un instant" tone="loading" /> : null}
      <View style={styles.genreFilters}>
        {genreOptions.map((item) => {
          const active = genre === item;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              key={item}
              onPress={() => setGenre(item)}
              style={[styles.genreChip, { backgroundColor: active ? palette.pink : palette.surfaceAlt }]}
            >
              <Text style={[styles.genreText, { color: palette.text }]}>{item}</Text>
            </Pressable>
          );
        })}
      </View>
      {tracks.length ? tracks.map((track) => (
        <Pressable
          accessibilityRole="link"
          key={`${track.artist}-${track.title}`}
          onPress={() => void openExternalLink(track.platformUrl ?? getMusicSearchUrl(track.title, track.artist, platform))}
          style={({ pressed }) => [styles.track, { backgroundColor: palette.surface, borderColor: palette.border, opacity: pressed ? 0.82 : 1 }]}
        >
          <View style={[styles.trackIcon, { backgroundColor: palette.surfaceAlt }]}>
            <Ionicons name="musical-note" size={19} color={palette.accent} />
          </View>
          <View style={styles.trackCopy}>
            <Text style={[styles.trackTitle, { color: palette.text }]}>{track.title}</Text>
            <Text style={[styles.trackArtist, { color: palette.subtle }]}>{track.artist} · {track.genre}</Text>
          </View>
          <Ionicons name="open-outline" size={18} color={palette.accent} />
        </Pressable>
      )) : (
        <CrushyStateMessage message="Essaie un autre genre pour découvrir d’autres titres." title="Rien dans cette catégorie" />
      )}

      <SectionHeading>Ta playlist du moment</SectionHeading>
      <View style={styles.platforms}>
        {([
          ['spotify', 'Spotify'],
          ['youtube', 'YouTube Music'],
        ] as const).map(([id, label]) => {
          const active = platform === id;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              key={id}
              onPress={() => setPlatform(id)}
              style={[styles.platform, { backgroundColor: active ? palette.text : palette.surfaceAlt }]}
            >
              <Text style={[styles.platformText, { color: active ? palette.background : palette.text }]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
      <Pressable
        accessibilityRole="link"
        onPress={() => void openExternalLink(getPlaylistSearchUrl(selected, platform))}
        style={({ pressed }) => [styles.playlist, { backgroundColor: palette.pink, opacity: pressed ? 0.82 : 1 }]}
      >
        <View style={styles.playlistCopy}>
          <Text style={[styles.playlistEyebrow, { color: palette.text }]}>PLAYLIST PERSONNALISÉE</Text>
          <Text style={[styles.playlistTitle, { color: palette.text }]}>{moodLabels[selected]} · pour ton humeur</Text>
          <Text style={[styles.playlistSubtitle, { color: palette.text }]}>Ouvrir la recherche sur {platform === 'spotify' ? 'Spotify' : 'YouTube Music'}</Text>
        </View>
        <Ionicons name="open-outline" size={21} color={palette.text} />
      </Pressable>
      <Text style={[styles.disclaimer, { color: palette.subtle }]}>
        CRUSHY ne lit ni ne stocke de morceaux. Les suggestions et recherches sont des liens externes ; disponibilité selon la plateforme et ta région.
      </Text>
    </CrushyScreen>
  );
}

const styles = StyleSheet.create({
  moods: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  moodChip: { borderRadius: designTokens.radius.pill, paddingVertical: 9, paddingHorizontal: 13 },
  moodText: { fontSize: 12, fontFamily: designTokens.typography.bold },
  quoteCard: { borderRadius: designTokens.radius.lg, padding: 17, marginTop: 16 },
  quoteLabel: { fontSize: 10, letterSpacing: 1.1, fontFamily: designTokens.typography.bold },
  quote: { fontSize: 15, lineHeight: 22, fontFamily: designTokens.typography.bold, marginTop: 8 },
  genreFilters: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 8 },
  genreChip: { paddingVertical: 7, paddingHorizontal: 11, borderRadius: designTokens.radius.pill },
  genreText: { fontSize: 11, fontFamily: designTokens.typography.bold },
  track: { borderWidth: 1, borderRadius: designTokens.radius.md, minHeight: 68, flexDirection: 'row', alignItems: 'center', padding: 11, marginBottom: 8 },
  trackIcon: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  trackCopy: { flex: 1, marginLeft: 11 },
  trackTitle: { fontSize: 14, fontFamily: designTokens.typography.bold },
  trackArtist: { fontSize: 11, marginTop: 3 },
  platforms: { flexDirection: 'row', gap: 9 },
  platform: { flex: 1, minHeight: 42, borderRadius: designTokens.radius.md, alignItems: 'center', justifyContent: 'center' },
  platformText: { fontSize: 12, fontFamily: designTokens.typography.bold },
  playlist: { borderRadius: designTokens.radius.lg, minHeight: 100, padding: 16, flexDirection: 'row', alignItems: 'center', marginTop: 11 },
  playlistCopy: { flex: 1, paddingRight: 8 },
  playlistEyebrow: { fontSize: 9, letterSpacing: 1.1, fontFamily: designTokens.typography.bold },
  playlistTitle: { fontSize: 16, fontFamily: designTokens.typography.extraBold, marginTop: 5 },
  playlistSubtitle: { fontSize: 11, marginTop: 4, opacity: 0.82 },
  disclaimer: { fontSize: 11, lineHeight: 17, marginTop: 13 },
});
