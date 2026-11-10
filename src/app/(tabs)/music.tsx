import { useEffect, useMemo, useState } from 'react';
import { Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ChunkyCard } from '../../components/ChunkySurface';
import { CrushyMascot } from '../../components/CrushyMascot';
import { CrushyScreen, SectionHeading } from '../../components/CrushyScreen';
import { CrushyStateMessage } from '../../components/CrushyStateMessage';
import { designTokens } from '../../theme/theme';
import { useCrushyTheme } from '../../theme/useCrushyTheme';
import { Mood, useCrushyStore } from '../../store/useCrushyStore';
import { fetchPublishedMusic, ManagedTrack } from '../../lib/publicContent';
import { moodMeta, moodOrder } from '../../theme/moods';
import {
  getMusicSearchUrl,
  getMoodPlaylistUrl,
  musicGenres,
  musicQuotes,
  moodPlaylists,
  MusicGenre,
  trackRecommendations,
} from '../../music/recommendations';

type GenreFilter = MusicGenre | string;

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

  const tracks = useMemo(
    () =>
      [
        ...publishedTracks.map((track) => ({
          title: track.title,
          artist: track.artist,
          genre: track.genre,
          platformUrl: track.platform_url,
        })),
        ...trackRecommendations[selected],
      ].filter((track) => genre === 'Tout' || track.genre === genre),
    [genre, publishedTracks, selected],
  );

  const genreOptions = useMemo(
    () => ['Tout', ...new Set([...musicGenres, ...publishedTracks.map((track) => track.genre)])],
    [publishedTracks],
  );

  function chooseMood(m: Mood) {
    setSelected(m);
    setSavedMood(m);
    setGenre('Tout');
  }

  const currentMeta = moodMeta[selected];
  const playlist = moodPlaylists[selected];

  return (
    <CrushyScreen
      eyebrow="BANDE-SON DE TON MOMENT"
      title="Ambiance musique"
      subtitle="Des morceaux et playlists Spotify choisis tout spécialement pour accompagner ton humeur."
    >
      {/* Sélecteur d'humeur en pilules avec emoji */}
      <SectionHeading>Ton ambiance du moment</SectionHeading>
      <View style={styles.moods}>
        {moodOrder.map((m) => {
          const isSelected = selected === m;
          const meta = moodMeta[m];
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              key={m}
              onPress={() => chooseMood(m)}
              style={[
                styles.moodChip,
                {
                  backgroundColor: isSelected ? meta.tint(palette) : palette.surface,
                  borderColor: isSelected ? palette.ink : palette.border,
                  borderWidth: isSelected ? 2.5 : 1.5,
                },
              ]}
            >
              <Text style={styles.moodEmoji}>{meta.emoji}</Text>
              <Text
                style={[
                  styles.moodText,
                  {
                    color: palette.text,
                    fontFamily: isSelected ? designTokens.typography.bold : designTokens.typography.regular,
                  },
                ]}
              >
                {m}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Citation musicale avec Pip */}
      <ChunkyCard tint={currentMeta.tint(palette)} radius={designTokens.radius.xl} depth={4} style={styles.quoteWrap}>
        <View style={styles.quoteCard}>
          <View style={styles.quoteCopy}>
            <View style={[styles.quoteBadge, { backgroundColor: palette.surface, borderColor: palette.ink }]}>
              <Text style={[styles.quoteLabel, { color: palette.accent }]}>NOTE D’INSPIRATION</Text>
            </View>
            <Text style={[styles.quote, { color: palette.text }]}>{musicQuotes[selected]}</Text>
          </View>
          <CrushyMascot expression={selected} size={84} interactive />
        </View>
      </ChunkyCard>

      {/* Playlist Spotify mise en avant */}
      <SectionHeading>Ta playlist Spotify</SectionHeading>
      <ChunkyCard tint={palette.pink} radius={designTokens.radius.lg} depth={3} style={styles.playlistCardWrap}>
        <Pressable
          accessibilityLabel={`Ouvrir la playlist ${playlist.title} sur Spotify`}
          accessibilityRole="link"
          onPress={() => void openExternalLink(getMoodPlaylistUrl(selected))}
          style={styles.playlistInner}
        >
          <View style={[styles.spotifyLogoBox, { backgroundColor: palette.surface, borderColor: palette.ink }]}>
            <Ionicons name="musical-notes" size={24} color={palette.accent} />
          </View>
          <View style={styles.playlistCopy}>
            <Text style={[styles.playlistEyebrow, { color: palette.text }]}>SÉLECTION OFFICIELLE</Text>
            <Text style={[styles.playlistTitle, { color: palette.text }]}>{playlist.title}</Text>
            <Text style={[styles.playlistSubtitle, { color: palette.text }]}>
              Ouvrir sur Spotify · Ambiance {selected}
            </Text>
          </View>
          <View style={[styles.openButtonCircle, { backgroundColor: palette.surface, borderColor: palette.ink }]}>
            <Ionicons name="open-outline" size={18} color={palette.ink} />
          </View>
        </Pressable>
      </ChunkyCard>

      {/* Morceaux recommandés */}
      <SectionHeading>Morceaux recommandés</SectionHeading>
      {contentError ? (
        <CrushyStateMessage message={contentError} title="Suggestions indisponibles" tone="warning" />
      ) : null}
      {loadingTracks ? (
        <CrushyStateMessage message="On vérifie s’il y a de nouvelles suggestions pour toi." title="Un instant" tone="loading" />
      ) : null}

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
                {
                  backgroundColor: active ? palette.text : palette.surface,
                  borderColor: active ? palette.ink : palette.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.genreText,
                  {
                    color: active ? palette.background : palette.text,
                    fontFamily: active ? designTokens.typography.bold : designTokens.typography.regular,
                  },
                ]}
              >
                {item}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.tracksList}>
        {tracks.length ? (
          tracks.map((track) => (
            <Pressable
              accessibilityLabel={`Écouter ${track.title} de ${track.artist} sur Spotify`}
              accessibilityRole="link"
              key={`${track.artist}-${track.title}`}
              onPress={() => void openExternalLink(track.platformUrl ?? getMusicSearchUrl(track.title, track.artist))}
              style={({ pressed }) => [
                styles.trackPressable,
                { transform: [{ scale: pressed ? 0.98 : 1 }] },
              ]}
            >
              <ChunkyCard radius={designTokens.radius.md} tint={palette.surface} depth={2}>
                <View style={styles.trackInner}>
                  <View style={[styles.trackIcon, { backgroundColor: palette.surfaceAlt, borderColor: palette.ink }]}>
                    <Ionicons name="disc-outline" size={20} color={palette.accent} />
                  </View>
                  <View style={styles.trackCopy}>
                    <Text style={[styles.trackTitle, { color: palette.text }]}>{track.title}</Text>
                    <Text style={[styles.trackArtist, { color: palette.subtle }]}>
                      {track.artist} · {track.genre}
                    </Text>
                  </View>
                  <View style={[styles.miniOpenBadge, { backgroundColor: palette.surfaceAlt }]}>
                    <Ionicons name="arrow-forward" size={14} color={palette.text} />
                  </View>
                </View>
              </ChunkyCard>
            </Pressable>
          ))
        ) : (
          <CrushyStateMessage message="Essaie un autre genre pour découvrir d’autres titres." title="Rien dans cette catégorie" />
        )}
      </View>

      <Text style={[styles.disclaimer, { color: palette.subtle }]}>
        CRUSHY ne lit ni ne stocke de morceaux. Les titres s’ouvrent directement dans Spotify. 🎧
      </Text>

      <View style={styles.footerSpacing} />
    </CrushyScreen>
  );
}

const styles = StyleSheet.create({
  moods: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: -4,
  },
  moodChip: {
    flexBasis: '31%',
    flexGrow: 1,
    minHeight: 46,
    borderRadius: designTokens.radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    gap: 6,
  },
  moodEmoji: {
    fontSize: 16,
  },
  moodText: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  quoteWrap: {
    marginTop: 14,
    marginBottom: 6,
  },
  quoteCard: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quoteCopy: {
    flex: 1,
  },
  quoteBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: designTokens.radius.pill,
    borderWidth: 1.5,
    marginBottom: 6,
  },
  quoteLabel: {
    fontSize: 9,
    fontFamily: designTokens.typography.extraBold,
  },
  quote: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: designTokens.typography.bold,
  },
  playlistCardWrap: {
    marginTop: 4,
  },
  playlistInner: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  spotifyLogoBox: {
    width: 48,
    height: 48,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playlistCopy: {
    flex: 1,
  },
  playlistEyebrow: {
    fontSize: 9,
    letterSpacing: 1.1,
    fontFamily: designTokens.typography.bold,
  },
  playlistTitle: {
    fontSize: 16,
    fontFamily: designTokens.typography.extraBold,
    marginTop: 2,
  },
  playlistSubtitle: {
    fontSize: 11,
    marginTop: 3,
    opacity: 0.85,
  },
  openButtonCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genreFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginTop: -4,
    marginBottom: 12,
  },
  genreChip: {
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderRadius: designTokens.radius.pill,
    borderWidth: 1.5,
  },
  genreText: {
    fontSize: 11,
  },
  tracksList: {
    gap: 8,
  },
  trackPressable: {
    marginBottom: 2,
  },
  trackInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  trackIcon: {
    width: 40,
    height: 40,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackCopy: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 14,
    fontFamily: designTokens.typography.bold,
  },
  trackArtist: {
    fontSize: 11,
    marginTop: 2,
  },
  miniOpenBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disclaimer: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 18,
    textAlign: 'center',
  },
  footerSpacing: {
    height: 32,
  },
});
