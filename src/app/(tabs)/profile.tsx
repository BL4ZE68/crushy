import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Vibration,
  View,
} from 'react-native';
import { ChunkyCard } from '../../components/ChunkySurface';
import { CrushyButton } from '../../components/CrushyButton';
import { CrushyMascot } from '../../components/CrushyMascot';
import { CrushyScreen, SectionHeading } from '../../components/CrushyScreen';
import { AvatarId, Mood, useCrushyStore } from '../../store/useCrushyStore';
import { moodMeta, moodOrder } from '../../theme/moods';
import { designTokens } from '../../theme/theme';
import { useCrushyTheme } from '../../theme/useCrushyTheme';

type AvatarOption = {
  id: AvatarId;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  tint: string;
};

const avatars: AvatarOption[] = [
  { id: 'heart', icon: 'heart', label: 'Cœur', tint: '#FFB3C7' },
  { id: 'sparkles', icon: 'sparkles', label: 'Étoile', tint: '#FFE27A' },
  { id: 'sunny', icon: 'sunny', label: 'Soleil', tint: '#FFCBA6' },
  { id: 'moon', icon: 'moon', label: 'Lune', tint: '#DCCBFF' },
  { id: 'flame', icon: 'flame', label: 'Flamme', tint: '#FFB4A2' },
  { id: 'planet', icon: 'planet', label: 'Planète', tint: '#BFE3FF' },
  { id: 'flower', icon: 'flower', label: 'Fleur', tint: '#B6F0D3' },
  { id: 'paw', icon: 'paw', label: 'Patoune', tint: '#E8D5FF' },
];

function getLevelTitle(level: number): string {
  if (level >= 10) return 'Légende de douceur 👑';
  if (level >= 7) return 'Cœur étincelant ✨';
  if (level >= 5) return 'Explorateur d’étoiles 🚀';
  if (level >= 3) return 'Semeur de sourires 🌸';
  if (level >= 2) return 'Ami fidèle 💛';
  return 'Curieux en herbe 🌱';
}

export default function ProfileScreen() {
  const router = useRouter();
  const nickname = useCrushyStore((state) => state.nickname);
  const avatarId = useCrushyStore((state) => state.avatarId);
  const setAvatarId = useCrushyStore((state) => state.setAvatarId);
  const setNickname = useCrushyStore((state) => state.setNickname);
  const mood = useCrushyStore((state) => state.mood);
  const setMood = useCrushyStore((state) => state.setMood);
  const xp = useCrushyStore((state) => state.xp);
  const hapticsEnabled = useCrushyStore((state) => state.hapticsEnabled);
  const openedSurprises = useCrushyStore((state) => state.openedSurpriseIds.length);
  const gameCompletions = useCrushyStore((state) => state.gameCompletions);
  const unlockedAchievements = useCrushyStore((state) => state.unlockedAchievements);
  const completedGames = Object.values(gameCompletions).reduce((total, count) => total + count, 0);

  const { palette } = useCrushyTheme();
  const selectedAvatar = avatars.find((avatar) => avatar.id === avatarId) ?? avatars[0];

  const level = Math.floor(xp / 100) + 1;
  const xpInLevel = xp % 100;
  const levelTitle = getLevelTitle(level);

  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nicknameInput, setNicknameInput] = useState(nickname);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  function triggerHaptic() {
    if (hapticsEnabled) {
      try {
        Vibration.vibrate(20);
      } catch {
        // Ignoré sur plateformes sans support
      }
    }
  }

  function handleSaveNickname() {
    const trimmed = nicknameInput.trim();
    if (trimmed.length < 2) {
      Alert.alert('Pseudo trop court', 'Choisis au moins 2 caractères.');
      return;
    }
    if (trimmed.length > 20) {
      Alert.alert('Pseudo trop long', 'Maximum 20 caractères.');
      return;
    }
    setNickname(trimmed);
    setIsEditingNickname(false);
    triggerHaptic();
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 2400);
  }

  function handleCancelNickname() {
    setNicknameInput(nickname);
    setIsEditingNickname(false);
  }

  function selectMood(m: Mood) {
    triggerHaptic();
    setMood(m);
  }

  function selectAvatar(id: AvatarId) {
    triggerHaptic();
    setAvatarId(id);
  }

  const moodColor = mood ? moodMeta[mood].tint(palette) : palette.pink;

  return (
    <CrushyScreen
      eyebrow="TON PETIT ESPACE PERSO"
      title="Mon profil"
      subtitle="Personnalise ton espace, garde un œil sur tes victoires et ajuste tes préférences."
    >
      {/* Carte héro du profil */}
      <ChunkyCard tint={moodColor} radius={designTokens.radius.xl} depth={4} style={styles.heroCardWrap}>
        <View style={styles.heroCard}>
          {/* Badge interactif avec Pip */}
          <View style={styles.mascotContainer}>
            <CrushyMascot expression={mood ?? 'neutre'} size={106} interactive />
            <View style={[styles.avatarBadge, { backgroundColor: palette.surface, borderColor: palette.ink }]}>
              <Ionicons name={selectedAvatar.icon} size={18} color={palette.accent} />
            </View>
          </View>

          {/* Pseudo & Titre */}
          <View style={styles.heroIdentity}>
            <View style={styles.nicknameRow}>
              <Text style={[styles.nicknameText, { color: palette.text }]}>{nickname}</Text>
              <Pressable
                accessibilityLabel="Modifier mon pseudo"
                accessibilityRole="button"
                onPress={() => {
                  setNicknameInput(nickname);
                  setIsEditingNickname(true);
                  triggerHaptic();
                }}
                style={[styles.editIconBtn, { backgroundColor: palette.surface, borderColor: palette.ink }]}
              >
                <Ionicons name="pencil" size={13} color={palette.text} />
              </Pressable>
            </View>

            <View style={[styles.rankPill, { backgroundColor: palette.surface, borderColor: palette.ink }]}>
              <Text style={[styles.rankText, { color: palette.accent }]}>{levelTitle}</Text>
            </View>

            <Text style={[styles.moodStatus, { color: palette.text }]}>
              {mood ? `${moodMeta[mood].emoji} Humeur : ${mood}` : '✨ Choisis ton humeur ci-dessous'}
            </Text>
          </View>

          {/* Barre de progression niveau */}
          <View style={[styles.levelBarWrap, { backgroundColor: palette.surface, borderColor: palette.ink }]}>
            <View style={styles.levelBarHeader}>
              <Text style={[styles.levelBarLabel, { color: palette.text }]}>Niveau {level}</Text>
              <Text style={[styles.levelBarXp, { color: palette.subtle }]}>
                {xpInLevel} / 100 XP ({100 - xpInLevel} XP restants)
              </Text>
            </View>
            <View style={[styles.progressBarTrack, { backgroundColor: palette.surfaceAlt }]}>
              <View
                style={[
                  styles.progressBarFill,
                  { backgroundColor: palette.accent, width: `${Math.min(Math.max(xpInLevel, 6), 100)}%` },
                ]}
              />
            </View>
          </View>
        </View>
      </ChunkyCard>

      {/* Message de succès mise à jour pseudo */}
      {saveSuccessNotice ? (
        <View style={[styles.successBanner, { backgroundColor: palette.mint, borderColor: palette.ink }]}>
          <Ionicons name="checkmark-circle" size={18} color={palette.ink} />
          <Text style={[styles.successText, { color: palette.ink }]}>Pseudo mis à jour avec succès ! ✨</Text>
        </View>
      ) : null}

      {/* Modal/Zone d'édition inline du pseudo */}
      {isEditingNickname ? (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ChunkyCard tint={palette.surface} radius={designTokens.radius.lg} style={styles.editCard}>
            <View style={styles.editForm}>
              <Text style={[styles.editFormTitle, { color: palette.text }]}>Changer ton pseudo</Text>
              <Text style={[styles.editFormSubtitle, { color: palette.subtle }]}>
                Visible sur ton accueil et lors de tes victoires (2 à 20 caractères).
              </Text>
              <TextInput
                accessibilityLabel="Nouveau pseudo"
                autoCapitalize="words"
                autoFocus
                maxLength={20}
                onChangeText={setNicknameInput}
                onSubmitEditing={handleSaveNickname}
                placeholder="Ex. Sunshine"
                placeholderTextColor={palette.subtle}
                returnKeyType="done"
                style={[
                  styles.nicknameInput,
                  { backgroundColor: palette.surfaceAlt, borderColor: palette.ink, color: palette.text },
                ]}
                value={nicknameInput}
              />
              <View style={styles.editActions}>
                <Pressable
                  accessibilityRole="button"
                  onPress={handleCancelNickname}
                  style={[styles.cancelBtn, { borderColor: palette.border }]}
                >
                  <Text style={[styles.cancelBtnText, { color: palette.subtle }]}>Annuler</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={handleSaveNickname}
                  style={[styles.saveBtn, { backgroundColor: palette.accent, borderColor: palette.ink }]}
                >
                  <Text style={[styles.saveBtnText, { color: palette.onAccent }]}>Enregistrer</Text>
                </Pressable>
              </View>
            </View>
          </ChunkyCard>
        </KeyboardAvoidingView>
      ) : null}

      {/* Statistiques en 4 cartes style stickers */}
      <View style={styles.statsGrid}>
        <StatCard
          icon="flash"
          iconColor="#FF9800"
          label="XP Total"
          value={`${xp}`}
        />
        <StatCard
          icon="ribbon"
          iconColor="#E91E63"
          label="Badges"
          value={`${unlockedAchievements.length}/6`}
        />
        <StatCard
          icon="game-controller"
          iconColor="#9C27B0"
          label="Jeux joués"
          value={`${completedGames}`}
        />
        <StatCard
          icon="gift"
          iconColor="#00BCD4"
          label="Surprises"
          value={`${openedSurprises}`}
        />
      </View>

      {/* Choix d'avatar */}
      <SectionHeading>Choisis ton emblème</SectionHeading>
      <Text style={[styles.sectionSubtitle, { color: palette.subtle }]}>
        Un petit symbole porte-bonheur qui t’accompagne partout.
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.avatarScroll}
      >
        {avatars.map((avatar) => {
          const isSelected = avatar.id === avatarId;
          return (
            <Pressable
              accessibilityLabel={`Emblème ${avatar.label}`}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              key={avatar.id}
              onPress={() => selectAvatar(avatar.id)}
              style={[
                styles.avatarCard,
                {
                  backgroundColor: isSelected ? palette.surface : palette.surfaceAlt,
                  borderColor: isSelected ? palette.accent : palette.border,
                  borderWidth: isSelected ? 2.5 : 1,
                  transform: [{ scale: isSelected ? 1.05 : 1 }],
                },
              ]}
            >
              <View style={[styles.avatarIconCircle, { backgroundColor: avatar.tint, borderColor: palette.ink }]}>
                <Ionicons name={avatar.icon} size={22} color={palette.ink} />
              </View>
              <Text
                style={[
                  styles.avatarLabel,
                  { color: palette.text, fontFamily: isSelected ? designTokens.typography.bold : designTokens.typography.regular },
                ]}
              >
                {avatar.label}
              </Text>
              {isSelected ? (
                <View style={[styles.selectedCheck, { backgroundColor: palette.accent }]}>
                  <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Humeur rapide */}
      <SectionHeading>Mon humeur du moment</SectionHeading>
      <Text style={[styles.sectionSubtitle, { color: palette.subtle }]}>
        Touche une humeur pour faire réagir Pip et adapter ton univers.
      </Text>
      <View style={styles.moodGrid}>
        {moodOrder.map((m) => {
          const isSelected = mood === m;
          const meta = moodMeta[m];
          return (
            <Pressable
              accessibilityLabel={`Humeur ${m}`}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              key={m}
              onPress={() => selectMood(m)}
              style={[
                styles.moodPill,
                {
                  backgroundColor: isSelected ? meta.tint(palette) : palette.surface,
                  borderColor: isSelected ? palette.ink : palette.border,
                  borderWidth: isSelected ? 2.5 : 1,
                },
              ]}
            >
              <Text style={styles.moodEmoji}>{meta.emoji}</Text>
              <Text
                style={[
                  styles.moodPillText,
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

      {/* Menu & Navigation Espace Personnel */}
      <SectionHeading>Mon univers CRUSHY</SectionHeading>
      <View style={styles.menuList}>
        <MenuItem
          icon="ribbon-outline"
          iconTint={palette.yellow}
          title="Mes récompenses & trophées"
          subtitle={`${unlockedAchievements.length} badges obtenus · Historique d’activité complet`}
          onPress={() => router.push('/rewards')}
        />
        <MenuItem
          icon="sunny-outline"
          iconTint={palette.peach}
          title="Mon humeur & défis du jour"
          subtitle="Citation personnalisée, blague du jour et petit défi"
          onPress={() => router.push('/daily')}
        />
        <MenuItem
          icon="musical-notes-outline"
          iconTint={palette.lavender}
          title="Ambiance & musiques douces"
          subtitle="Découvre des playlists adaptées à tes humeurs"
          onPress={() => router.push('/music')}
        />
        <MenuItem
          icon="settings-outline"
          iconTint={palette.sky}
          title="Réglages & préférences"
          subtitle="Thème, rappels quotidiens, sons et données locales"
          onPress={() => router.push('/settings')}
        />
      </View>

      <View style={styles.footerSpace} />
    </CrushyScreen>
  );
}

function StatCard({
  icon,
  iconColor,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  label: string;
  value: string;
}) {
  const { palette } = useCrushyTheme();
  return (
    <ChunkyCard radius={designTokens.radius.lg} depth={3} style={styles.statCardWrap}>
      <View style={styles.statCardContent}>
        <View style={[styles.statIconContainer, { backgroundColor: palette.surfaceAlt }]}>
          <Ionicons name={icon} size={16} color={iconColor} />
        </View>
        <Text style={[styles.statValue, { color: palette.text }]}>{value}</Text>
        <Text style={[styles.statLabel, { color: palette.subtle }]}>{label}</Text>
      </View>
    </ChunkyCard>
  );
}

function MenuItem({
  icon,
  iconTint,
  title,
  subtitle,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  iconTint: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  const { palette } = useCrushyTheme();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.menuItemWrap,
        {
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      <ChunkyCard radius={designTokens.radius.lg} depth={3} tint={palette.surface}>
        <View style={styles.menuItemInner}>
          <View style={[styles.menuIconBox, { backgroundColor: iconTint, borderColor: palette.ink }]}>
            <Ionicons name={icon} size={22} color={palette.ink} />
          </View>
          <View style={styles.menuTextBox}>
            <Text style={[styles.menuTitle, { color: palette.text }]}>{title}</Text>
            <Text style={[styles.menuSubtitle, { color: palette.subtle }]} numberOfLines={2}>
              {subtitle}
            </Text>
          </View>
          <View style={[styles.menuChevron, { backgroundColor: palette.surfaceAlt }]}>
            <Ionicons name="chevron-forward" size={16} color={palette.text} />
          </View>
        </View>
      </ChunkyCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  heroCardWrap: { marginTop: 14 },
  heroCard: {
    padding: 18,
    alignItems: 'center',
  },
  mascotContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: -6,
    right: 8,
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroIdentity: {
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  nicknameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nicknameText: {
    fontSize: 24,
    fontFamily: designTokens.typography.extraBold,
  },
  editIconBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankPill: {
    marginTop: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: designTokens.radius.pill,
    borderWidth: 1.5,
  },
  rankText: {
    fontSize: 12,
    fontFamily: designTokens.typography.bold,
  },
  moodStatus: {
    fontSize: 13,
    marginTop: 6,
    fontFamily: designTokens.typography.regular,
  },
  levelBarWrap: {
    width: '100%',
    marginTop: 16,
    padding: 12,
    borderRadius: designTokens.radius.md,
    borderWidth: 1.5,
  },
  levelBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelBarLabel: {
    fontSize: 13,
    fontFamily: designTokens.typography.bold,
  },
  levelBarXp: {
    fontSize: 11,
    fontFamily: designTokens.typography.regular,
  },
  progressBarTrack: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  successBanner: {
    marginTop: 12,
    padding: 12,
    borderRadius: designTokens.radius.md,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  successText: {
    fontSize: 13,
    fontFamily: designTokens.typography.bold,
  },
  editCard: {
    marginTop: 14,
  },
  editForm: {
    padding: 16,
  },
  editFormTitle: {
    fontSize: 16,
    fontFamily: designTokens.typography.bold,
  },
  editFormSubtitle: {
    fontSize: 12,
    marginTop: 2,
    marginBottom: 12,
  },
  nicknameInput: {
    minHeight: 48,
    borderWidth: 2,
    borderRadius: designTokens.radius.md,
    paddingHorizontal: 14,
    fontSize: 15,
    fontFamily: designTokens.typography.bold,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 14,
  },
  cancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: designTokens.radius.md,
    borderWidth: 1,
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 13,
    fontFamily: designTokens.typography.bold,
  },
  saveBtn: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: designTokens.radius.md,
    borderWidth: 2,
    justifyContent: 'center',
  },
  saveBtnText: {
    fontSize: 13,
    fontFamily: designTokens.typography.bold,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 18,
  },
  statCardWrap: {
    flexBasis: '47%',
    flexGrow: 1,
  },
  statCardContent: {
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 20,
    fontFamily: designTokens.typography.extraBold,
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
    fontFamily: designTokens.typography.regular,
  },
  sectionSubtitle: {
    fontSize: 13,
    marginTop: -8,
    marginBottom: 12,
    lineHeight: 18,
  },
  avatarScroll: {
    paddingRight: 10,
    gap: 10,
    paddingVertical: 6,
  },
  avatarCard: {
    width: 76,
    height: 96,
    borderRadius: designTokens.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    position: 'relative',
  },
  avatarIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  avatarLabel: {
    fontSize: 11,
    textAlign: 'center',
  },
  selectedCheck: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  moodPill: {
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
  moodPillText: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  menuList: {
    gap: 12,
    marginTop: 4,
  },
  menuItemWrap: {
    marginBottom: 2,
  },
  menuItemInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  menuIconBox: {
    width: 44,
    height: 44,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTextBox: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 14,
    fontFamily: designTokens.typography.bold,
  },
  menuSubtitle: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
  },
  menuChevron: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerSpace: {
    height: 30,
  },
});
