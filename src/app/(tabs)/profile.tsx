import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { z } from 'zod';
import { CrushyButton } from '../../components/CrushyButton';
import { CrushyScreen, SectionHeading } from '../../components/CrushyScreen';
import { AvatarId, useCrushyStore } from '../../store/useCrushyStore';
import { designTokens } from '../../theme/theme';
import { useCrushyTheme } from '../../theme/useCrushyTheme';

const profileSchema = z.object({
  nickname: z.string().trim().min(2, 'Choisis au moins 2 caractères.').max(20, '20 caractères maximum.'),
});

type ProfileValues = z.infer<typeof profileSchema>;

const avatars: { id: AvatarId; icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
  { id: 'heart', icon: 'heart', label: 'Cœur' },
  { id: 'sparkles', icon: 'sparkles', label: 'Étincelles' },
  { id: 'sunny', icon: 'sunny', label: 'Soleil' },
  { id: 'moon', icon: 'moon', label: 'Lune' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const nickname = useCrushyStore((state) => state.nickname);
  const avatarId = useCrushyStore((state) => state.avatarId);
  const setAvatarId = useCrushyStore((state) => state.setAvatarId);
  const setNickname = useCrushyStore((state) => state.setNickname);
  const mood = useCrushyStore((state) => state.mood);
  const xp = useCrushyStore((state) => state.xp);
  const openedSurprises = useCrushyStore((state) => state.openedSurpriseIds.length);
  const gameCompletions = useCrushyStore((state) => state.gameCompletions);
  const unlockedAchievements = useCrushyStore((state) => state.unlockedAchievements);
  const completedGames = Object.values(gameCompletions).reduce((total, count) => total + count, 0);
  const { palette } = useCrushyTheme();
  const selectedAvatar = avatars.find((avatar) => avatar.id === avatarId) ?? avatars[0];
  const { control, handleSubmit, formState: { errors } } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { nickname },
  });
  const submit = handleSubmit(({ nickname: nextNickname }) => setNickname(nextNickname));

  return (
    <CrushyScreen eyebrow="TON PETIT ESPACE PERSO" title="Mon profil" subtitle="Un espace à ton image, gardé sur ton appareil.">
      <View style={[styles.profileCard, { backgroundColor: palette.pink }]}>
        <View style={[styles.avatar, { backgroundColor: palette.surface }]}>
          <Ionicons name={selectedAvatar.icon} size={29} color={palette.accent} />
        </View>
        <Text style={[styles.nickname, { color: palette.text }]}>{nickname}</Text>
        <Text style={[styles.mood, { color: palette.text }]}>{mood ? `Humeur : ${mood}` : 'Humeur à choisir'}</Text>
        <View style={styles.avatars}>
          {avatars.map((avatar) => {
            const active = avatar.id === avatarId;
            return (
              <Pressable
                accessibilityLabel={`Avatar ${avatar.label}`}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                key={avatar.id}
                onPress={() => setAvatarId(avatar.id)}
                style={[styles.avatarOption, { backgroundColor: active ? palette.surface : '#FFFFFF80' }]}
              >
                <Ionicons name={avatar.icon} size={17} color={palette.text} />
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.stats}>
        <Stat label="XP" value={`${xp}`} />
        <Stat label="Niveau" value={`${Math.floor(xp / 100) + 1}`} />
        <Stat label="Jeux" value={`${completedGames}`} />
      </View>

      <SectionHeading>Ton petit nom</SectionHeading>
      <Controller
        control={control}
        name="nickname"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            accessibilityLabel="Ton pseudo"
            autoCapitalize="words"
            maxLength={20}
            onBlur={onBlur}
            onChangeText={onChange}
            onSubmitEditing={() => void submit()}
            placeholder="Ton pseudo"
            placeholderTextColor={palette.subtle}
            returnKeyType="done"
            style={[styles.input, { backgroundColor: palette.surface, borderColor: errors.nickname ? palette.accent : palette.border, color: palette.text }]}
            value={value}
          />
        )}
      />
      {errors.nickname ? <Text accessibilityRole="alert" style={[styles.error, { color: palette.accent }]}>{errors.nickname.message}</Text> : null}
      <CrushyButton secondary onPress={() => void submit()}>Enregistrer mon pseudo</CrushyButton>

      <SectionHeading>Ton espace</SectionHeading>
      <Text style={[styles.summary, { color: palette.subtle }]}>
        {unlockedAchievements.length} badges obtenus · {openedSurprises} surprises découvertes.
      </Text>
      <CrushyButton secondary onPress={() => router.push('/rewards')}>Voir mes badges et mon historique</CrushyButton>
      <CrushyButton secondary onPress={() => router.push('/settings')}>Préférences et notifications</CrushyButton>
    </CrushyScreen>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  const { palette } = useCrushyTheme();
  return (
    <View style={[styles.stat, { backgroundColor: palette.surface, borderColor: palette.border }]}>
      <Text style={[styles.statValue, { color: palette.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: palette.subtle }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  profileCard: { alignItems: 'center', borderRadius: designTokens.radius.xl, paddingVertical: 22, marginTop: 16 },
  avatar: { width: 72, height: 72, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  nickname: { fontSize: 21, fontFamily: designTokens.typography.extraBold, marginTop: 11 },
  mood: { fontSize: 13, marginTop: 3, textTransform: 'capitalize' },
  avatars: { flexDirection: 'row', gap: 9, marginTop: 14 },
  avatarOption: { width: 36, height: 36, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  stats: { flexDirection: 'row', gap: 9, marginTop: 13 },
  stat: { flex: 1, alignItems: 'center', borderWidth: 1, borderRadius: 17, paddingVertical: 13 },
  statValue: { fontSize: 19, fontFamily: designTokens.typography.extraBold },
  statLabel: { fontSize: 10, marginTop: 2 },
  input: { borderWidth: 1, minHeight: 50, borderRadius: designTokens.radius.md, paddingHorizontal: 14, fontSize: 15, fontFamily: designTokens.typography.regular },
  error: { fontSize: 12, marginTop: 6 },
  summary: { fontSize: 13, lineHeight: 19 },
});
