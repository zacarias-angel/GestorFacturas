// Tema Dark inspirado en thebermuda.com
import { MD3DarkTheme, configureFonts } from 'react-native-paper';

export const colors = {
  // Fondos
  background: '#0a0a0a',
  backgroundLight: '#1a1a1a',
  backgroundCard: '#1e1e1e',
  
  // Primarios
  primary: '#FF6B35', // Naranja vibrante
  primaryLight: '#FF8C61',
  primaryDark: '#E55A2B',
  
  // Secundarios
  secondary: '#FF006E', // Fucsia/Magenta
  secondaryLight: '#FF3389',
  secondaryDark: '#D6005C',
  
  // Acentos
  accent: '#FFB800', // Amarillo/Oro
  accentLight: '#FFC933',
  
  // Texto
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textDisabled: '#6B6B6B',
  
  // Estados
  success: '#00FF87', // Verde neón
  warning: '#FFB800',
  error: '#FF006E',
  info: '#00D9FF',
  
  // Neutral
  border: '#2a2a2a',
  divider: '#333333',
  overlay: 'rgba(0, 0, 0, 0.8)',
  
  // Botones
  buttonPrimary: '#FF6B35',
  buttonSecondary: '#FF006E',
  buttonDisabled: '#3a3a3a',
  
  // Específicos
  pendiente: '#FFB800',
  pagada: '#00FF87',
  cancelada: '#FF006E',
  
  // Gradientes
  gradient1: ['#FF6B35', '#FF006E'],
  gradient2: ['#FF006E', '#8A2BE2'],
  gradient3: ['#0a0a0a', '#1a1a1a'],
};

const fontConfig = {
  web: {
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    light: {
      fontFamily: 'System',
      fontWeight: '300',
    },
    thin: {
      fontFamily: 'System',
      fontWeight: '100',
    },
  },
  ios: {
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    light: {
      fontFamily: 'System',
      fontWeight: '300',
    },
    thin: {
      fontFamily: 'System',
      fontWeight: '100',
    },
  },
  android: {
    regular: {
      fontFamily: 'sans-serif',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'sans-serif-medium',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'sans-serif-light',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'sans-serif-thin',
      fontWeight: 'normal',
    },
  },
};

export const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    tertiary: colors.accent,
    surface: colors.backgroundCard,
    surfaceVariant: colors.backgroundLight,
    background: colors.background,
    error: colors.error,
    onSurface: colors.text,
    onSurfaceVariant: colors.textSecondary,
    onBackground: colors.text,
    outline: colors.border,
    surfaceDisabled: colors.buttonDisabled,
    onSurfaceDisabled: colors.textDisabled,
  },
  fonts: configureFonts({ config: fontConfig }),
};
