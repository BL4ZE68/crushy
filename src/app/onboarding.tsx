import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { z } from 'zod';
import { CrushyButton } from '../components/CrushyButton';
import { CrushyScreen } from '../components/CrushyScreen';
import { designTokens } from '../theme/theme';
import { useCrushyTheme } from '../theme/useCrushyTheme';
import { useCrushyStore } from '../store/useCrushyStore';

const onboardingSchema = z.object({
  nickname: z.string().trim().min(2, 'Choisis un pseudo d’au moins 2 caractères.').max(20, '20 caractères maximum.'),
});

type OnboardingValues = z.infer<typeof onboardingSchema>;

export default function OnboardingScreen() {
  const router = useRouter();
  const completeOnboarding = useCrushyStore((state) => state.completeOnboarding);
  const { palette } = useCrushyTheme();
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: { nickname: '' },
  });

  const submit = handleSubmit(({ nickname }) => {
    completeOnboarding(nickname);
    router.replace('/(tabs)');
  });

  return (
    <CrushyScreen eyebrow="JUSTE TOI ET MOI" title="Comment t’appeler ?" subtitle="On garde ce petit nom seulement sur ton téléphone.">
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
              style={[styles.input, { backgroundColor: palette.surface, borderColor: errors.nickname ? palette.accent : palette.border, color: palette.text }]}
              value={value}
            />
          )}
        />
        {errors.nickname ? <Text accessibilityRole="alert" style={[styles.error, { color: palette.accent }]}>{errors.nickname.message}</Text> : null}
        <View style={styles.spacer} />
        <CrushyButton disabled={isSubmitting} onPress={() => void submit()}>Entrer dans mon espace</CrushyButton>
      </KeyboardAvoidingView>
    </CrushyScreen>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 14, fontFamily: designTokens.typography.bold, marginBottom: 8 },
  input: { borderWidth: 1, minHeight: 52, borderRadius: 16, paddingHorizontal: 15, fontSize: 16, fontFamily: designTokens.typography.regular },
  error: { marginTop: 7, fontSize: 13 },
  spacer: { height: 22 },
});
