import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { spacing, typography, useTheme } from '@/theme';
import type { CocktailPreview } from '@/types/cocktail';

type Props = {
  cocktail: CocktailPreview;
  onPress?: () => void;
};

export default function CocktailListItem({ cocktail, onPress }: Props) {
  const { theme } = useTheme();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: theme.surface, opacity: pressed ? 0.88 : 1 },
      ]}
      onPress={onPress}
    >
      <Image source={{ uri: cocktail.thumbnail }} style={styles.thumb} resizeMode="cover" />
      <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
        {cocktail.name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
    gap: spacing.md,
    paddingRight: spacing.md,
  },
  thumb: {
    width: 72,
    height: 72,
  },
  name: {
    flex: 1,
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
  },
});
