import { useColorScheme } from 'react-native';
import { palettes } from './theme';
import { useCrushyStore } from '../store/useCrushyStore';

export function useCrushyTheme() {
  const systemScheme = useColorScheme();
  const themeMode = useCrushyStore((state) => state.themeMode);
  const isDark = themeMode === 'dark' || (themeMode === 'system' && systemScheme === 'dark');

  return { palette: isDark ? palettes.dark : palettes.light, isDark };
}
