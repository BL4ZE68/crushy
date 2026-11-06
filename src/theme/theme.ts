export type ThemeName = 'light' | 'dark';

type SemanticPalette = {
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  subtle: string;
  border: string;
  accent: string;
  overlay: string;
  pink: string;
  lavender: string;
  yellow: string;
};

export const palettes: Record<ThemeName, SemanticPalette> = {
  light: {
    background: '#FFF8F6',
    surface: '#FFFEFD',
    surfaceAlt: '#FBE8E9',
    text: '#4A2F31',
    subtle: '#765F60',
    border: '#EBD7D8',
    accent: '#B53D5E',
    overlay: '#49303399',
    pink: '#FFC4CF',
    lavender: '#F6D6DA',
    yellow: '#FFE7C0',
  },
  dark: {
    background: '#21191C',
    surface: '#302328',
    surfaceAlt: '#3B292E',
    text: '#FFF5F1',
    subtle: '#D4BFC0',
    border: '#554044',
    accent: '#FF93AA',
    overlay: '#10090CCC',
    pink: '#74414D',
    lavender: '#5D4147',
    yellow: '#705A3D',
  },
};

export const designTokens = {
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { md: 16, lg: 24, xl: 32, pill: 999 },
  typography: {
    family: 'Nunito',
    regular: 'Nunito_400Regular',
    bold: 'Nunito_700Bold',
    extraBold: 'Nunito_800ExtraBold',
  },
} as const;
