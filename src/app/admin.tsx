import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { z } from 'zod';
import { AdminContentManager } from '../admin/AdminContentManager';
import {
  adminSections,
  AdminStatistics,
  fetchAdminStatistics,
} from '../admin/adminApi';
import { AdminSection } from '../admin/validation';
import { CrushyButton } from '../components/CrushyButton';
import { CrushyScreen, SectionHeading } from '../components/CrushyScreen';
import { supabase } from '../lib/supabase';
import { useCrushyStore } from '../store/useCrushyStore';
import { designTokens } from '../theme/theme';
import { useCrushyTheme } from '../theme/useCrushyTheme';

const loginSchema = z.object({
  email: z.string().trim().email('Saisis une adresse e-mail valide.'),
  password: z.string().min(1, 'Saisis ton mot de passe.'),
});
type LoginValues = z.infer<typeof loginSchema>;
type AuthState = 'loading' | 'unconfigured' | 'signed-out' | 'checking' | 'authorized' | 'denied' | 'error';

const statisticLabels: { key: keyof AdminStatistics; label: string }[] = [
  { key: 'active_users', label: 'Personnes actives' },
  { key: 'activities', label: 'Activités' },
  { key: 'completed_games', label: 'Parties terminées' },
  { key: 'surprises_opened', label: 'Surprises ouvertes' },
  { key: 'published_surprises', label: 'Surprises publiées' },
  { key: 'scheduled_surprises', label: 'Surprises programmées' },
];

export default function AdminScreen() {
  const { palette } = useCrushyTheme();
  const [authState, setAuthState] = useState<AuthState>('loading');
  const [userId, setUserId] = useState<string | null>(null);
  const [authError, setAuthError] = useState('');
  const [loginBusy, setLoginBusy] = useState(false);
  const [activeSection, setActiveSection] = useState<AdminSection>('surprises');
  const [statistics, setStatistics] = useState<AdminStatistics | null>(null);
  const [statisticsError, setStatisticsError] = useState('');
  const localXp = useCrushyStore((state) => state.xp);
  const localActivities = useCrushyStore((state) => state.activities.length);
  const localSurprises = useCrushyStore((state) => state.openedSurpriseIds.length);
  const localScheduled = useCrushyStore((state) => Object.keys(state.scheduledSurprises).length);
  const localGames = useCrushyStore((state) => Object.values(state.gameCompletions).reduce((total, count) => total + count, 0));
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    if (!supabase) {
      setAuthState('unconfigured');
      return;
    }

    let active = true;
    const client = supabase;
    void client.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) {
        setAuthError(error.message);
        setAuthState('error');
        return;
      }
      const currentUserId = data.session?.user.id ?? null;
      setUserId(currentUserId);
      setAuthState(currentUserId ? 'checking' : 'signed-out');
    }).catch((error: unknown) => {
      if (!active) return;
      setAuthError(error instanceof Error ? error.message : 'Session Supabase inaccessible.');
      setAuthState('error');
    });

    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      const currentUserId = session?.user.id ?? null;
      setUserId(currentUserId);
      setAuthError('');
      setAuthState(currentUserId ? 'checking' : 'signed-out');
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!userId || !supabase) return;
    let active = true;
    const client = supabase;
    setAuthState('checking');
    void client
      .from('admin_roles')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle()
      .then(
        ({ data, error }) => {
          if (!active) return;
          if (error) {
            setAuthError(error.message);
            setAuthState('error');
          } else if (data) {
            setAuthError('');
            setAuthState('authorized');
          } else {
            setAuthError('Ce compte n’a pas le rôle administrateur autorisé.');
            setAuthState('denied');
          }
        },
        (error: unknown) => {
        if (!active) return;
        setAuthError(error instanceof Error ? error.message : 'Vérification du rôle impossible.');
        setAuthState('error');
        },
      );

    return () => {
      active = false;
    };
  }, [userId]);

  useEffect(() => {
    if (authState !== 'authorized') {
      setStatistics(null);
      return;
    }
    let active = true;
    setStatisticsError('');
    void fetchAdminStatistics()
      .then((result) => {
        if (active) setStatistics(result);
      })
      .catch((error: unknown) => {
        if (!active) return;
        setStatisticsError(error instanceof Error ? error.message : 'Statistiques indisponibles.');
      });
    return () => {
      active = false;
    };
  }, [authState]);

  const submitLogin = handleSubmit(async ({ email, password }) => {
    if (!supabase) return;
    setLoginBusy(true);
    setAuthError('');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (!data.user) throw new Error('Supabase n’a pas renvoyé de compte authentifié.');
      reset({ email: '', password: '' });
      setUserId(data.user.id);
      setAuthState('checking');
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Connexion impossible.');
      setAuthState('signed-out');
    } finally {
      setLoginBusy(false);
    }
  });

  async function signOut() {
    if (!supabase) return;
    try {
      const { error } = await supabase.auth.signOut();
      if (error) setAuthError(error.message);
      else {
        setUserId(null);
        setAuthState('signed-out');
        setActiveSection('surprises');
      }
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Déconnexion impossible.');
    }
  }

  return (
    <CrushyScreen
      eyebrow="ACCÈS PRIVÉ"
      title="Espace administrateur"
      subtitle="Les droits sont vérifiés par Supabase et protégés par les politiques RLS."
    >
      {authState === 'loading' || authState === 'checking' ? (
        <Text style={[styles.info, { color: palette.subtle }]}>Vérification sécurisée de la session…</Text>
      ) : null}

      {authState === 'unconfigured' ? (
        <InfoCard title="Supabase non configuré">
          Renseigne l’URL et la clé publishable du projet dans le fichier .env, puis exécute la migration SQL documentée dans le README.
        </InfoCard>
      ) : null}

      {authState === 'signed-out' || authState === 'error' ? (
        <View style={[styles.loginCard, { backgroundColor: palette.surfaceAlt }]}>
          <Text style={[styles.cardTitle, { color: palette.text }]}>Connexion propriétaire</Text>
          <Text style={[styles.help, { color: palette.subtle }]}>
            Aucun compte ne peut s’inscrire depuis l’application. Le compte administrateur doit être créé dans Supabase.
          </Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                accessibilityLabel="Adresse e-mail administrateur"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
                keyboardType="email-address"
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="Adresse e-mail"
                placeholderTextColor={palette.subtle}
                style={[styles.input, { backgroundColor: palette.surface, borderColor: palette.border, color: palette.text }]}
                value={value}
              />
            )}
          />
          {errors.email ? <Text accessibilityRole="alert" style={[styles.error, { color: palette.accent }]}>{errors.email.message}</Text> : null}
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                accessibilityLabel="Mot de passe administrateur"
                autoCapitalize="none"
                autoComplete="current-password"
                onBlur={onBlur}
                onChangeText={onChange}
                onSubmitEditing={() => void submitLogin()}
                placeholder="Mot de passe"
                placeholderTextColor={palette.subtle}
                secureTextEntry
                style={[styles.input, styles.password, { backgroundColor: palette.surface, borderColor: palette.border, color: palette.text }]}
                value={value}
              />
            )}
          />
          {errors.password ? <Text accessibilityRole="alert" style={[styles.error, { color: palette.accent }]}>{errors.password.message}</Text> : null}
          {authError ? <Text accessibilityRole="alert" style={[styles.error, { color: palette.accent }]}>{authError}</Text> : null}
          <CrushyButton disabled={loginBusy} onPress={() => void submitLogin()}>
            {loginBusy ? 'Connexion…' : 'Se connecter'}
          </CrushyButton>
        </View>
      ) : null}

      {authState === 'denied' ? (
        <View style={[styles.loginCard, { backgroundColor: palette.surfaceAlt }]}>
          <Text style={[styles.cardTitle, { color: palette.text }]}>Accès refusé</Text>
          <Text accessibilityRole="alert" style={[styles.help, { color: palette.accent }]}>{authError}</Text>
          <CrushyButton secondary onPress={() => void signOut()}>Fermer la session</CrushyButton>
        </View>
      ) : null}

      {authState === 'authorized' ? (
        <>
          <View style={[styles.authorizedCard, { backgroundColor: palette.surfaceAlt }]}>
            <Text style={[styles.cardTitle, { color: palette.text }]}>Session administrateur vérifiée</Text>
            <Text style={[styles.help, { color: palette.subtle }]}>Les opérations sont aussi contrôlées par les règles RLS de la base.</Text>
            <CrushyButton secondary onPress={() => void signOut()}>Se déconnecter</CrushyButton>
          </View>

          <SectionHeading>Activité sur cet appareil</SectionHeading>
          <View style={styles.stats}>
            <LocalMetric label="XP obtenus" value={localXp} />
            <LocalMetric label="Parties terminées" value={localGames} />
            <LocalMetric label="Surprises ouvertes" value={localSurprises} />
            <LocalMetric label="Programmations locales" value={localScheduled} />
            <LocalMetric label="Activités récentes" value={localActivities} />
          </View>
          <SectionHeading>Statistiques synchronisées Supabase</SectionHeading>
          <Text style={[styles.help, { color: palette.subtle }]}>
            Ces compteurs concernent les activités enregistrées dans la base. La progression actuelle de CRUSHY reste locale à cet appareil.
          </Text>
          {statisticsError ? <Text accessibilityRole="alert" style={[styles.error, { color: palette.accent }]}>{statisticsError}</Text> : null}
          <View style={styles.stats}>
            {statisticLabels.map(({ key, label }) => (
              <View key={key} style={[styles.stat, { backgroundColor: palette.surface, borderColor: palette.border }]}>
                <Text style={[styles.statValue, { color: palette.text }]}>{statistics?.[key] ?? '—'}</Text>
                <Text style={[styles.statLabel, { color: palette.subtle }]}>{label}</Text>
              </View>
            ))}
          </View>

          <SectionHeading>Gérer les contenus</SectionHeading>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sections}>
            {adminSections.map((section) => (
              <SectionButton
                key={section.id}
                label={section.label}
                onPress={() => setActiveSection(section.id)}
                selected={activeSection === section.id}
              />
            ))}
          </ScrollView>
          <AdminContentManager key={activeSection} section={activeSection} />
        </>
      ) : null}
    </CrushyScreen>
  );
}

function InfoCard({ title, children }: { title: string; children: string }) {
  const { palette } = useCrushyTheme();
  return (
    <View style={[styles.loginCard, { backgroundColor: palette.surfaceAlt }]}>
      <Text style={[styles.cardTitle, { color: palette.text }]}>{title}</Text>
      <Text style={[styles.help, { color: palette.subtle }]}>{children}</Text>
    </View>
  );
}

function SectionButton({ label, onPress, selected }: { label: string; onPress: () => void; selected: boolean }) {
  const { palette } = useCrushyTheme();
  return (
    <Text
      accessibilityRole="button"
      onPress={onPress}
      style={[
        styles.sectionButton,
        { backgroundColor: selected ? palette.pink : palette.surface, borderColor: palette.border, color: palette.text },
      ]}
    >
      {label}
    </Text>
  );
}

function LocalMetric({ label, value }: { label: string; value: number }) {
  const { palette } = useCrushyTheme();
  return (
    <View style={[styles.stat, { backgroundColor: palette.surface, borderColor: palette.border }]}>
      <Text style={[styles.statValue, { color: palette.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: palette.subtle }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  info: { fontSize: 14, lineHeight: 21, marginTop: 10 },
  loginCard: { borderRadius: designTokens.radius.lg, padding: 18, marginTop: 14 },
  authorizedCard: { borderRadius: designTokens.radius.lg, padding: 16, marginTop: 12 },
  cardTitle: { fontSize: 18, fontFamily: designTokens.typography.bold },
  help: { fontSize: 13, lineHeight: 19, marginTop: 7 },
  input: { borderWidth: 1, minHeight: 48, borderRadius: designTokens.radius.md, paddingHorizontal: 13, fontSize: 14, marginTop: 12 },
  password: { marginTop: 9 },
  error: { fontSize: 12, lineHeight: 18, marginTop: 5 },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  stat: { width: '31%', minHeight: 78, flexGrow: 1, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderRadius: 16, padding: 8 },
  statValue: { fontSize: 20, fontFamily: designTokens.typography.extraBold },
  statLabel: { textAlign: 'center', fontSize: 10, lineHeight: 13, marginTop: 3 },
  sections: { gap: 7 },
  sectionButton: { overflow: 'hidden', borderWidth: 1, borderRadius: designTokens.radius.pill, paddingHorizontal: 13, paddingVertical: 9, fontSize: 12, fontFamily: designTokens.typography.bold },
});
