import { useEffect, useMemo, useState } from 'react';
import { Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ChunkyCard } from '../../components/ChunkySurface';
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
  const { palette, isDark } = useCrushyTheme();
  const savedMood = useCrushyStore((state) => state.mood);
  const setSavedMood = useCrushyStore((state) => state.setMood);
  const [selected, setSelected] = useState<Mood>(savedMood ?? 'rêveuse');
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
    <CrushyScreen eyebrow="BANDE-SON DE TON MOMENT" title="Music mood" subtitle="Des idées et des playlists personnalisées à découvrir sur Spotify.">
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
              style={[
                styles.moodChip,
                { backgroundColor: active ? palette.text : palette.surfaceAlt, borderColor: active ? palette.text : palette.ink },
              ]}
            >
              <Text style={[styles.moodText, { color: active ? palette.background : palette.text }]}>{moodLabels[mood]}</Text>
            </Pressable>
          );
        })}
      </View>

      <ChunkyCard tint={palette.lavender} radius={designTokens.radius.lg} style={styles.quoteWrap}>
        <View style={styles.quoteCard}>
          <Text style={[styles.quoteLabel, { color: palette.text }]}>PETITE CITATION MUSICALE</Text>
          <Text style={[styles.quote, { color: palette.text }]}>{musicQuotes[selected]}</Text>
        </View>
      </ChunkyCard>

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
              style={[
                styles.genreChip,
                { backgroundColor: active ? palette.pink : palette.surfaceAlt, borderColor: palette.ink },
              ]}
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
          onPress={() => void openExternalLink(track.platformUrl ?? getMusicSearchUrl(track.title, track.artist))}
          style={({ pressed }) => [
            styles.track,
            { backgroundColor: palette.surface, borderColor: palette.ink, opacity: pressed ? 0.82 : 1 },
          ]}
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

      <SectionHeading>Ta playlist Spotify</SectionHeading>
      <View style={styles.playlistWrap}>
        {!isDark ? <View style={[styles.playlistShadow, { backgroundColor: palette.shadow }]} /> : null}
        <Pressable
          accessibilityRole="link"
          onPress={() => void openExternalLink(getPlaylistSearchUrl(selected))}
          style={({ pressed }) => [
            styles.playlist,
            {
              backgroundColor: palette.pink,
              borderColor: palette.ink,
              transform: !isDark ? [{ translateY: pressed ? designTokens.chunky.depth : 0 }] : undefined,
            },
          ]}
        >
          <View style={styles.playlistCopy}>
            <Text style={[styles.playlistEyebrow, { color: palette.text }]}>PLAYLIST SPOTIFY</Text>
            <Text style={[styles.playlistTitle, { color: palette.text }]}>{moodLabels[selected]} · pour ton humeur</Text>
            <Text style={[styles.playlistSubtitle, { color: palette.text }]}>Trouver une playlist sur Spotify</Text>
          </View>
          <Ionicons name="open-outline" size={21} color={palette.text} />
        </Pressable>
      </View>
      <Text style={[styles.disclaimer, { color: palette.subtle }]}>
        CRUSHY ne lit ni ne stocke de morceaux. Les titres et playlists s’ouvrent dans Spotify ; disponibilité selon ton compte et ta région.
      </Text>
    </CrushyScreen>
  );
}

const styles = StyleSheet.create({
  moods: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  moodChip: { borderRadius: designTokens.radius.pill, paddingVertical: 9, paddingHorizontal: 13, borderWidth: 2 },
  moodText: { fontSize: 12, fontFamily: designTokens.typography.bold },
  quoteWrap: { marginTop: 16 },
  quoteCard: { padding: 17 },
  quoteLabel: { fontSize: 10, letterSpacing: 1.1, fontFamily: designTokens.typography.bold },
  quote: { fontSize: 15, lineHeight: 22, fontFamily: designTokens.typography.bold, marginTop: 8 },
  genreFilters: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 8 },
  genreChip: { paddingVertical: 7, paddingHorizontal: 11, borderRadius: designTokens.radius.pill, borderWidth: 2 },
  genreText: { fontSize: 11, fontFamily: designTokens.typography.bold },
  track: { borderWidth: 2, borderRadius: designTokens.radius.md, minHeight: 68, flexDirection: 'row', alignItems: 'center', padding: 11, marginBottom: 8 },
  trackIcon: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  trackCopy: { flex: 1, marginLeft: 11 },
  trackTitle: { fontSize: 14, fontFamily: designTokens.typography.bold },
  trackArtist: { fontSize: 11, marginTop: 3 },
  playlistWrap: { marginTop: 11 },
  playlistShadow: {
    position: 'absolute',
    top: designTokens.chunky.depth,
    left: 0,
    right: 0,
    bottom: -designTokens.chunky.depth,
    borderRadius: designTokens.radius.lg,
  },
  playlist: { borderWidth: 2.5, borderRadius: designTokens.radius.lg, minHeight: 100, padding: 16, flexDirection: 'row', alignItems: 'center' },
  playlistCopy: { flex: 1, paddingRight: 8 },
  playlistEyebrow: { fontSize: 9, letterSpacing: 1.1, fontFamily: designTokens.typography.bold },
  playlistTitle: { fontSize: 16, fontFamily: designTokens.typography.extraBold, marginTop: 5 },
  playlistSubtitle: { fontSize: 11, marginTop: 4, opacity: 0.82 },
  disclaimer: { fontSize: 11, lineHeight: 17, marginTop: 13 },
});
