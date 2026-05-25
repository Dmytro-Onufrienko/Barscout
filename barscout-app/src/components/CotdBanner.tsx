import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { spacing, typography, useTheme } from '@/theme';
import type { Cocktail } from '@/types/cocktail';

type Props = {
  cocktail: Cocktail;
  onPress: () => void;
};

export default function CotdBanner({ cocktail, onPress }: Props) {
  const { theme } = useTheme();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: theme.surface, opacity: pressed ? 0.88 : 1 },
      ]}
      onPress={onPress}
    >
      <Image source={{ uri: cocktail.thumbnail }} style={styles.thumb} resizeMode="cover" />
      <View style={styles.info}>
        <Text style={[styles.label, { color: theme.primary }]}>☀️ Cocktail of the Day</Text>
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
          {cocktail.name}
        </Text>
        <Text style={[styles.meta, { color: theme.textMuted }]} numberOfLines={1}>
          {cocktail.category} · {cocktail.alcoholic}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.md,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  thumb: {
    width: 80,
    height: 80,
  },
  info: {
    flex: 1,
    paddingHorizontal: spacing.md,
    gap: 2,
  },
  label: {
    fontSize: typography.size.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  name: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
  },
  meta: {
    fontSize: typography.size.sm,
  },
});
