import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { designTokens } from '../../theme/theme';
import { useCrushyTheme } from '../../theme/useCrushyTheme';

type TabIconConfig = {
  active: keyof typeof Ionicons.glyphMap;
  inactive: keyof typeof Ionicons.glyphMap;
};

const tabIcons: Record<string, TabIconConfig> = {
  index: { active: 'home', inactive: 'home-outline' },
  games: { active: 'game-controller', inactive: 'game-controller-outline' },
  surprises: { active: 'gift', inactive: 'gift-outline' },
  music: { active: 'musical-notes', inactive: 'musical-notes-outline' },
  profile: { active: 'person', inactive: 'person-outline' },
};

export default function TabsLayout() {
  const { palette } = useCrushyTheme();
  const reduceMotion = useReducedMotion();

  return (
    <Tabs
      screenOptions={({ route }) => {
        const config = tabIcons[route.name] ?? { active: 'ellipse', inactive: 'ellipse-outline' };
        return {
          headerShown: false,
          tabBarActiveTintColor: palette.accent,
          tabBarInactiveTintColor: palette.subtle,
          tabBarStyle: {
            backgroundColor: palette.surface,
            borderTopColor: palette.border,
            borderTopWidth: 1.5,
            height: 64,
            paddingTop: 8,
            paddingBottom: 8,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontFamily: designTokens.typography.bold,
            marginTop: 2,
          },
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconBox, focused && { backgroundColor: palette.surfaceAlt }]}>
              <Ionicons
                color={focused ? palette.accent : palette.subtle}
                name={focused ? config.active : config.inactive}
                size={21}
              />
            </View>
          ),
          animation: reduceMotion ? 'none' : 'fade',
        };
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Accueil' }} />
      <Tabs.Screen name="games" options={{ title: 'Jeux' }} />
      <Tabs.Screen name="surprises" options={{ title: 'Surprises' }} />
      <Tabs.Screen name="music" options={{ title: 'Musique', tabBarAccessibilityLabel: 'Musique' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profil' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconBox: {
    width: 38,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
