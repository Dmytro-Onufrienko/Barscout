import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { spacing, typography, useTheme } from '@/theme';
import Stars from '@/components/Stars';
import type { JournalEntry } from '@/types/journalEntry';

type Props = {
  entry: JournalEntry;
  onPress: () => void;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function JournalListItem({ entry, onPress }: Props) {

  const { theme, scheme } = useTheme();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: theme.surface, opacity: pressed ? 0.8 : 1 },
      ]}
      onPress={onPress}
    >
      {entry.photoUri ? (
        <Image source={{ uri: entry.photoUri }} style={styles.thumbnail} resizeMode="cover" />
      ) : (
        <View style={[styles.thumbnail, styles.noPhoto, { backgroundColor: theme.background }]}>
          <Ionicons name="wine-outline" size={28} color={theme.textMuted} />
        </View>
      )}

      <View style={styles.info}>
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
          {entry.cocktailName}
        </Text>
        <Stars rating={entry.rating} size={14} />
        <Text style={[styles.date, { color: theme.textMuted }]}>
          {formatDate(entry.createdAt)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingRight: spacing.md,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
    borderRadius: 12,
    overflow: 'hidden',
  },
  thumbnail: {
    width: 72,
    height: 72,
  },
  noPhoto: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
  },
  date: {
    fontSize: typography.size.sm,
  },
});
