import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { spacing, typography, useTheme } from '@/theme';
import type { Cocktail } from '@/types/cocktail';

type Props = {
  cocktail: Cocktail;
  onPress?: () => void;
};

export default function CocktailCard({ cocktail, onPress }: Props) {

  const { theme, scheme } = useTheme();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.surface, opacity: pressed ? 0.92 : 1 },
      ]}
      onPress={onPress}
    >
      <Image
        source={{ uri: cocktail.thumbnail }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
          {cocktail.name}
        </Text>
        <Text style={[styles.meta, { color: theme.textMuted }]} numberOfLines={1}>
          {cocktail.category} · {cocktail.glass}
        </Text>
        <Text style={[styles.alcoholic, { color: theme.primary }]}>
          {cocktail.alcoholic}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: spacing.md,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    // Android shadow
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 260,
  },
  info: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  name: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
  },
  meta: {
    fontSize: typography.size.sm,
  },
  alcoholic: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },
});
