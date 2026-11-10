import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { getNewAchievements } from '../rewards/achievements';

export type ThemeMode = 'system' | 'light' | 'dark';
export type Mood = 'heureuse' | 'triste' | 'amoureuse' | 'énergique' | 'fatiguée' | 'rêveuse';
export type AvatarId = 'heart' | 'sparkles' | 'sunny' | 'moon' | 'flame' | 'planet' | 'flower' | 'paw';
export type ActivityKind = 'game' | 'surprise' | 'achievement' | 'mood' | 'schedule' | 'challenge' | 'daily';

export type UserActivity = {
  id: string;
  kind: ActivityKind;
  title: string;
  createdAt: string;
  xp: number;
};

export type ScheduledSurprise = {
  scheduledAt: string;
  notificationId?: string;
};

type CrushyState = {
  hasHydrated: boolean;
  onboardingComplete: boolean;
  nickname: string;
  avatarId: AvatarId;
  themeMode: ThemeMode;
  mood: Mood | null;
  soundsEnabled: boolean;
  hapticsEnabled: boolean;
  notificationsEnabled: boolean;
  xp: number;
  gameCompletions: Record<string, number>;
  openedSurpriseIds: string[];
  scheduledSurprises: Record<string, ScheduledSurprise>;
  unlockedAchievements: string[];
  activities: UserActivity[];
  completedDailyChallenges: string[];
  setHasHydrated: (value: boolean) => void;
  completeOnboarding: (nickname: string) => void;
  setNickname: (nickname: string) => void;
  setAvatarId: (avatarId: AvatarId) => void;
  setThemeMode: (themeMode: ThemeMode) => void;
  setMood: (mood: Mood) => void;
  setSoundsEnabled: (enabled: boolean) => void;
  setHapticsEnabled: (enabled: boolean) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  resetProgress: () => void;
  addXp: (amount: number, title?: string) => void;
  completeGame: (gameId: string, xp: number) => void;
  openSurprise: (surpriseId: string) => void;
  scheduleSurprise: (surpriseId: string, scheduledAt: string, notificationId?: string) => void;
  cancelSurpriseSchedule: (surpriseId: string) => void;
  completeDailyChallenge: (day: string, xp?: number, title?: string) => void;
};

function addActivity(
  activities: UserActivity[],
  kind: ActivityKind,
  title: string,
  xp = 0,
): UserActivity[] {
  return [
    {
      id: `${Date.now()}-${activities.length}`,
      kind,
      title,
      createdAt: new Date().toISOString(),
      xp,
    },
    ...activities,
  ].slice(0, 100);
}

export const useCrushyStore = create<CrushyState>()(
  persist(
    (set) => ({
      hasHydrated: false,
      onboardingComplete: false,
      nickname: 'Toi',
      avatarId: 'heart',
      themeMode: 'system',
      mood: null,
      soundsEnabled: false,
      hapticsEnabled: true,
      notificationsEnabled: false,
      xp: 0,
      gameCompletions: {},
      openedSurpriseIds: [],
      scheduledSurprises: {},
      unlockedAchievements: [],
      activities: [],
      completedDailyChallenges: [],
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      completeOnboarding: (nickname) => set({ onboardingComplete: true, nickname }),
      setNickname: (nickname) => set({ nickname }),
      setAvatarId: (avatarId) => set({ avatarId }),
      setThemeMode: (themeMode) => set({ themeMode }),
      setSoundsEnabled: (soundsEnabled) => set({ soundsEnabled }),
      setHapticsEnabled: (hapticsEnabled) => set({ hapticsEnabled }),
      setMood: (mood) =>
        set((state) => state.mood === mood
          ? state
          : {
              mood,
              activities: addActivity(state.activities, 'mood', `Humeur : ${mood}`),
            }),
      setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
      resetProgress: () =>
        set((state) => ({
          xp: 0,
          gameCompletions: {},
          openedSurpriseIds: [],
          scheduledSurprises: {},
          unlockedAchievements: [],
          activities: addActivity([], 'challenge', 'Progression réinitialisée'),
          completedDailyChallenges: [],
        })),
      addXp: (amount, title = 'Petit défi réussi') =>
        set((state) => ({
          xp: state.xp + amount,
          activities: addActivity(state.activities, 'challenge', title, amount),
        })),
      completeGame: (gameId, xp) =>
        set((state) => {
          const gameCompletions = {
            ...state.gameCompletions,
            [gameId]: (state.gameCompletions[gameId] ?? 0) + 1,
          };
          const newlyUnlocked = getNewAchievements(
            gameCompletions,
            state.openedSurpriseIds.length,
            state.unlockedAchievements,
          );
          const bonusXp = newlyUnlocked.reduce((total, achievement) => total + (achievement.bonusXp ?? 0), 0);
          let activities = addActivity(state.activities, 'game', `Mini-jeu terminé : ${gameId}`, xp);
          for (const achievement of newlyUnlocked) {
            activities = addActivity(activities, 'achievement', `Badge obtenu : ${achievement.title}`, achievement.bonusXp ?? 0);
          }

          return {
            xp: state.xp + xp + bonusXp,
            gameCompletions,
            unlockedAchievements: [
              ...state.unlockedAchievements,
              ...newlyUnlocked.map((achievement) => achievement.id),
            ],
            activities,
          };
        }),
      openSurprise: (surpriseId) =>
        set((state) => {
          if (state.openedSurpriseIds.includes(surpriseId)) return state;
          const openedSurpriseIds = [...state.openedSurpriseIds, surpriseId];
          const scheduledSurprises = { ...state.scheduledSurprises };
          delete scheduledSurprises[surpriseId];
          const newlyUnlocked = getNewAchievements(
            state.gameCompletions,
            openedSurpriseIds.length,
            state.unlockedAchievements,
          );
          const bonusXp = newlyUnlocked.reduce((total, achievement) => total + (achievement.bonusXp ?? 0), 0);
          let activities = addActivity(state.activities, 'surprise', 'Surprise découverte', 5);
          for (const achievement of newlyUnlocked) {
            activities = addActivity(activities, 'achievement', `Badge obtenu : ${achievement.title}`, achievement.bonusXp ?? 0);
          }

          return {
            openedSurpriseIds,
            scheduledSurprises,
            xp: state.xp + 5 + bonusXp,
            unlockedAchievements: [
              ...state.unlockedAchievements,
              ...newlyUnlocked.map((achievement) => achievement.id),
            ],
            activities,
          };
        }),
      scheduleSurprise: (surpriseId, scheduledAt, notificationId) =>
        set((state) => ({
          scheduledSurprises: {
            ...state.scheduledSurprises,
            [surpriseId]: { scheduledAt, notificationId },
          },
          activities: addActivity(state.activities, 'schedule', 'Surprise programmée'),
        })),
      cancelSurpriseSchedule: (surpriseId) =>
        set((state) => {
          const scheduledSurprises = { ...state.scheduledSurprises };
          delete scheduledSurprises[surpriseId];
          return { scheduledSurprises };
        }),
      completeDailyChallenge: (day, xp = 5, title = 'Défi du jour terminé') =>
        set((state) => {
          if (state.completedDailyChallenges.includes(day)) return state;
          return {
            xp: state.xp + xp,
            completedDailyChallenges: [...state.completedDailyChallenges, day].slice(-30),
            activities: addActivity(state.activities, 'daily', title, xp),
          };
        }),
    }),
    {
      name: 'crushy-preferences',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        onboardingComplete: state.onboardingComplete,
        nickname: state.nickname,
        avatarId: state.avatarId,
        themeMode: state.themeMode,
        mood: state.mood,
        soundsEnabled: state.soundsEnabled,
        hapticsEnabled: state.hapticsEnabled,
        notificationsEnabled: state.notificationsEnabled,
        xp: state.xp,
        gameCompletions: state.gameCompletions,
        openedSurpriseIds: state.openedSurpriseIds,
        scheduledSurprises: state.scheduledSurprises,
        unlockedAchievements: state.unlockedAchievements,
        activities: state.activities,
        completedDailyChallenges: state.completedDailyChallenges,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) console.warn('Impossible de restaurer les préférences CRUSHY.', error);
        (state ?? useCrushyStore.getState()).setHasHydrated(true);
      },
    },
  ),
);
