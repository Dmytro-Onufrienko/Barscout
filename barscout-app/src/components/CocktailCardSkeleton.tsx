import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { spacing, useTheme } from '@/theme';

export default function CocktailCardSkeleton() {
  const { theme, scheme } = useTheme();
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  const bg = scheme === 'dark' ? '#334155' : '#E2E8F0';

  return (
    <Animated.View style={[styles.card, { backgroundColor: theme.surface, opacity }]}>
      <View style={[styles.image, { backgroundColor: bg }]} />
      <View style={styles.info}>
        <View style={[styles.lineLg, { backgroundColor: bg }]} />
        <View style={[styles.lineSm, { backgroundColor: bg }]} />
        <View style={[styles.lineXs, { backgroundColor: bg }]} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 260,
  },
  info: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  lineLg: {
    height: 20,
    borderRadius: 4,
    width: '65%',
  },
  lineSm: {
    height: 14,
    borderRadius: 4,
    width: '80%',
  },
  lineXs: {
    height: 14,
    borderRadius: 4,
    width: '40%',
  },
});
