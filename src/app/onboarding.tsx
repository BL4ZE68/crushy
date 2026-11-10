import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { z } from 'zod';
import { CrushyButton } from '../components/CrushyButton';
import { CrushyScreen } from '../components/CrushyScreen';
import { designTokens } from '../theme/theme';
import { useCrushyTheme } from '../theme/useCrushyTheme';
import { AvatarId, useCrushyStore } from '../store/useCrushyStore';

const onboardingSchema = z.object({
  nickname: z.string().trim().min(2, 'Choisis un pseudo d’au moins 2 caractères.').max(20, '20 caractères maximum.'),
});

type OnboardingValues = z.infer<typeof onboardingSchema>;

const avatars: { id: AvatarId; icon: keyof typeof Ionicons.glyphMap; label: string; tint: string }[] = [
  { id: 'heart', icon: 'heart', label: 'Cœur', tint: '#FFB3C7' },
  { id: 'sparkles', icon: 'sparkles', label: 'Étoile', tint: '#FFE27A' },
  { id: 'sunny', icon: 'sunny', label: 'Soleil', tint: '#FFCBA6' },
  { id: 'moon', icon: 'moon', label: 'Lune', tint: '#DCCBFF' },
  { id: 'flame', icon: 'flame', label: 'Flamme', tint: '#FFB4A2' },
  { id: 'planet', icon: 'planet', label: 'Planète', tint: '#BFE3FF' },
  { id: 'flower', icon: 'flower', label: 'Fleur', tint: '#B6F0D3' },
  { id: 'paw', icon: 'paw', label: 'Patoune', tint: '#E8D5FF' },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const completeOnboarding = useCrushyStore((state) => state.completeOnboarding);
  const setAvatarId = useCrushyStore((state) => state.setAvatarId);
  const { palette } = useCrushyTheme();

  const [selectedAvatar, setSelectedAvatar] = useState<AvatarId>('heart');

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: { nickname: '' },
  });

  const submit = handleSubmit(({ nickname }) => {
    setAvatarId(selectedAvatar);
    completeOnboarding(nickname);
    router.replace('/(tabs)');
  });

  return (
    <CrushyScreen
      eyebrow="JUSTE TOI ET MOI"
      title="Faisons connaissance !"
      subtitle="Choisis ton pseudo et ton emblème. Tout reste confidentiel sur ton téléphone."
    >
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Text style={[styles.label, { color: palette.text }]}>Ton petit pseudo</Text>
        <Controller
          control={control}
          name="nickname"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              accessibilityLabel="Ton petit pseudo"
              autoCapitalize="words"
              maxLength={20}
              onBlur={onBlur}
              onChangeText={onChange}
              onSubmitEditing={() => void submit()}
              placeholder="Ex. Sunshine"
              placeholderTextColor={palette.subtle}
              returnKeyType="done"
              style={[
                styles.input,
                {
                  backgroundColor: palette.surface,
                  borderColor: errors.nickname ? palette.accent : palette.border,
                  color: palette.text,
                },
              ]}
              value={value}
            />
          )}
        />
        {errors.nickname ? (
          <Text accessibilityRole="alert" style={[styles.error, { color: palette.accent }]}>
            {errors.nickname.message}
          </Text>
        ) : null}

        <Text style={[styles.label, { color: palette.text, marginTop: 20 }]}>Ton emblème porte-bonheur</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.avatarRow}>
          {avatars.map((avatar) => {
            const isSelected = avatar.id === selectedAvatar;
            return (
              <Pressable
                accessibilityLabel={`Emblème ${avatar.label}`}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                key={avatar.id}
                onPress={() => setSelectedAvatar(avatar.id)}
                style={[
                  styles.avatarChoice,
                  {
                    backgroundColor: isSelected ? palette.surface : palette.surfaceAlt,
                    borderColor: isSelected ? palette.accent : palette.border,
                    borderWidth: isSelected ? 2.5 : 1,
                  },
                ]}
              >
                <View style={[styles.avatarIconBox, { backgroundColor: avatar.tint, borderColor: palette.ink }]}>
                  <Ionicons name={avatar.icon} size={20} color={palette.ink} />
                </View>
                <Text
                  style={[
                    styles.avatarText,
                    {
                      color: palette.text,
                      fontFamily: isSelected ? designTokens.typography.bold : designTokens.typography.regular,
                    },
                  ]}
                >
                  {avatar.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.spacer} />
        <CrushyButton disabled={isSubmitting} onPress={() => void submit()}>
          Entrer dans mon espace
        </CrushyButton>
      </KeyboardAvoidingView>
    </CrushyScreen>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 14, fontFamily: designTokens.typography.bold, marginBottom: 8 },
  input: {
    borderWidth: 1.5,
    minHeight: 52,
    borderRadius: 16,
    paddingHorizontal: 15,
    fontSize: 16,
    fontFamily: designTokens.typography.regular,
  },
  error: { marginTop: 7, fontSize: 13 },
  avatarRow: {
    gap: 10,
    paddingVertical: 4,
  },
  avatarChoice: {
    width: 68,
    height: 84,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  avatarIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  avatarText: {
    fontSize: 10,
    textAlign: 'center',
  },
  spacer: { height: 26 },
});
