export const Colors = {
  bgPrimary: '#0D0D0F',
  bgSecondary: '#1A1A1F',
  bgCard: '#222228',
  accentPrimary: '#C2527A',
  accentSecondary: '#8B5E8C',
  textPrimary: '#F5F0F2',
  textSecondary: '#9E8FA0',
  border: '#2E2832',
  danger: '#E05C5C',
  online: '#4CAF50',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  // Derived
  accentPrimaryAlpha20: 'rgba(194, 82, 122, 0.2)',
  accentSecondaryAlpha20: 'rgba(139, 94, 140, 0.2)',
  blackAlpha50: 'rgba(0, 0, 0, 0.5)',
  blackAlpha70: 'rgba(0, 0, 0, 0.7)',
  blackAlpha30: 'rgba(0, 0, 0, 0.3)',
};

export const Typography = {
  headingSize: 20,
  headingWeight: '600' as const,
  bodySize: 15,
  bodyWeight: '400' as const,
  labelSize: 12,
  labelWeight: '500' as const,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const Radius = {
  card: 12,
  button: 24,
  pill: 20,
  sm: 8,
  full: 9999,
};

export const HeaderGradient = [Colors.accentPrimary, Colors.accentSecondary] as const;
