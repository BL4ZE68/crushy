import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { designTokens } from '../../theme/theme';
import { useCrushyTheme } from '../../theme/useCrushyTheme';

const tabIcons = {
  index: '🏠',
  games: '🎲',
  surprises: '🎁',
  profile: '👤',
} as const;

export default function TabsLayout() {
  const { palette } = useCrushyTheme();
  const reduceMotion = useReducedMotion();

  return (
    <Tabs
      screenOptions={({ route }) => {
        const icon = tabIcons[route.name as keyof typeof tabIcons] ?? '•';
        return {
          headerShown: false,
          tabBarActiveTintColor: palette.accent,
          tabBarInactiveTintColor: palette.subtle,
          tabBarStyle: {
            backgroundColor: palette.surface,
            borderTopColor: palette.border,
            height: 58,
            paddingTop: 4,
            paddingBottom: 4,
          },
          tabBarLabelStyle: { fontSize: 10, fontFamily: designTokens.typography.bold },
          tabBarIcon: () => <Text style={{ fontSize: 19 }}>{icon}</Text>,
          animation: reduceMotion ? 'none' : 'fade',
        };
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Accueil' }} />
      <Tabs.Screen name="games" options={{ title: 'Jeux' }} />
      <Tabs.Screen name="surprises" options={{ title: 'Surprises' }} />
      <Tabs.Screen name="music" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ title: 'Profil' }} />
    </Tabs>
  );
}
