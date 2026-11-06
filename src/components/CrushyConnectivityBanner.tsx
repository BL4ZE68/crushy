import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNetworkState } from 'expo-network';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCrushyTheme } from '../theme/useCrushyTheme';
import { designTokens } from '../theme/theme';

export function CrushyConnectivityBanner() {
  const network = useNetworkState();
  const offline = network.isConnected === false || network.isInternetReachable === false;
  const [connectionRestored, setConnectionRestored] = useState(false);
  const wasOffline = useRef(false);
  const { palette } = useCrushyTheme();

  useEffect(() => {
    if (offline) {
      wasOffline.current = true;
      setConnectionRestored(false);
      return;
    }

    if (!wasOffline.current) return;
    wasOffline.current = false;
    setConnectionRestored(true);
    const timer = setTimeout(() => setConnectionRestored(false), 2200);
    return () => clearTimeout(timer);
  }, [offline]);

  if (!offline && !connectionRestored) return null;

  const backgroundColor = offline ? palette.text : palette.accent;
  const message = offline
    ? 'Hors ligne · ta progression reste sauvegardée sur cet appareil.'
    : 'Connexion rétablie';

  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor }}>
      <View accessibilityLiveRegion="polite" style={styles.banner}>
        <Text style={[styles.message, { color: palette.background }]}>{message}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  banner: {
    minHeight: 40,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    fontSize: 12,
    textAlign: 'center',
    fontFamily: designTokens.typography.bold,
  },
});
