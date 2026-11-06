import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { useReducedMotion } from 'react-native-reanimated';
import { designTokens } from '../../theme/theme';
import { useCrushyTheme } from '../../theme/useCrushyTheme';

const tabIcons = {
  index: ['home', 'home-outline'],
  games: ['game-controller', 'game-controller-outline'],
  surprises: ['gift', 'gift-outline'],
  music: ['musical-notes', 'musical-notes-outline'],
  profile: ['person-circle', 'person-circle-outline'],
} as const;

export default function TabsLayout() {
  const { palette } = useCrushyTheme();
  const reduceMotion = useReducedMotion();

  return (
    <Tabs
      screenOptions={({ route }) => {
        const [active, inactive] = tabIcons[route.name as keyof typeof tabIcons] ?? ['ellipse', 'ellipse-outline'];
        return {
          headerShown: false,
          tabBarActiveTintColor: palette.accent,
          tabBarInactiveTintColor: palette.subtle,
          tabBarStyle: {
            backgroundColor: palette.surface,
            borderTopColor: palette.border,
            height: 64,
            paddingTop: 6,
            paddingBottom: 7,
          },
          tabBarLabelStyle: { fontSize: 10, fontFamily: designTokens.typography.bold },
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name={(focused ? active : inactive) as keyof typeof Ionicons.glyphMap}
              size={size}
              color={focused ? palette.accent : palette.subtle}
            />
          ),
          animation: reduceMotion ? 'none' : 'fade',
        };
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Accueil' }} />
      <Tabs.Screen name="games" options={{ title: 'Jeux' }} />
      <Tabs.Screen name="surprises" options={{ title: 'Surprises' }} />
      <Tabs.Screen name="music" options={{ title: 'Musique' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profil' }} />
    </Tabs>
  );
}
