import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { spacing, typography, useTheme } from '@/theme';
import { useJournal } from '@/contexts/JournalContext';
import JournalListItem from '@/components/JournalListItem';
import type { JournalEntry } from '@/types/journalEntry';
import type { JournalStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<JournalStackParamList, 'Journal'>;

type SortKey = 'newest' | 'oldest' | 'rating';

const SORT_OPTIONS: { key: SortKey; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'newest', label: 'Newest', icon: 'time-outline' },
  { key: 'oldest', label: 'Oldest', icon: 'time' },
  { key: 'rating', label: 'Best', icon: 'star' },
];

function sortEntries(entries: JournalEntry[], sort: SortKey): JournalEntry[] {
  const copy = [...entries];
  if (sort === 'newest') return copy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  if (sort === 'oldest') return copy.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  return copy.sort((a, b) => b.rating - a.rating);
}

export default function JournalScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const { entries, loading, refresh } = useJournal();
  const [sort, setSort] = useState<SortKey>('newest');

  const sorted = useMemo(() => sortEntries(entries, sort), [entries, sort]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} style={styles.loader} />
      </SafeAreaView>
    );
  }

  const header = entries.length > 0 ? (
    <>
      <StatsHeader entries={entries} />
      <SortBar sort={sort} onSort={setSort} />
    </>
  ) : null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['bottom']}>
      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <JournalListItem
            entry={item}
            onPress={() => navigation.navigate('JournalDetail', { entryId: item.id })}
          />
        )}
        refreshing={false}
        onRefresh={refresh}
        ListHeaderComponent={header}
        contentContainerStyle={[
          styles.list,
          entries.length === 0 && styles.emptyContainer,
        ]}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="book-outline" size={56} color={theme.textMuted} />
            <Text style={[styles.emptyText, { color: theme.textMuted }]}>
              Поки що пусто.{'\n'}Додай перший коктейль!
            </Text>
          </View>
        }
      />

      <Pressable
        style={[styles.fab, { backgroundColor: theme.primary }]}
        onPress={() => navigation.navigate('JournalEntry', {})}
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </SafeAreaView>
  );
}

function SortBar({ sort, onSort }: { sort: SortKey; onSort: (s: SortKey) => void }) {
  const { theme } = useTheme();
  return (
    <View style={sortStyles.row}>
      {SORT_OPTIONS.map((opt) => (
        <Pressable
          key={opt.key}
          style={[
            sortStyles.chip,
            { borderColor: theme.border, backgroundColor: opt.key === sort ? theme.primary : theme.surface },
          ]}
          onPress={() => onSort(opt.key)}
        >
          <Ionicons
            name={opt.icon}
            size={13}
            color={opt.key === sort ? '#fff' : theme.textMuted}
          />
          <Text style={[sortStyles.chipText, { color: opt.key === sort ? '#fff' : theme.textMuted }]}>
            {opt.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function StatsHeader({ entries }: { entries: JournalEntry[] }) {
  const { theme } = useTheme();
  const rated = entries.filter((e) => e.rating > 0);
  const avgRating = rated.length > 0
    ? (rated.reduce((sum, e) => sum + e.rating, 0) / rated.length).toFixed(1)
    : null;
  const withPhoto = entries.filter((e) => e.photoUri).length;

  return (
    <View style={[statsStyles.card, { backgroundColor: theme.surface }]}>
      <View style={statsStyles.stat}>
        <Text style={[statsStyles.value, { color: theme.text }]}>{entries.length}</Text>
        <Text style={[statsStyles.label, { color: theme.textMuted }]}>Tastings</Text>
      </View>
      <View style={[statsStyles.divider, { backgroundColor: theme.border }]} />
      <View style={statsStyles.stat}>
        <Text style={[statsStyles.value, { color: theme.text }]}>
          {avgRating ?? '—'}
        </Text>
        <Text style={[statsStyles.label, { color: theme.textMuted }]}>Avg Rating</Text>
      </View>
      <View style={[statsStyles.divider, { backgroundColor: theme.border }]} />
      <View style={statsStyles.stat}>
        <Text style={[statsStyles.value, { color: theme.text }]}>{withPhoto}</Text>
        <Text style={[statsStyles.label, { color: theme.textMuted }]}>With Photo</Text>
      </View>
    </View>
  );
}

const sortStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs + 2,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: typography.size.xs,
    fontWeight: '600',
  },
});

const statsStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 14,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    paddingVertical: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  value: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
  },
  label: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    marginVertical: spacing.xs,
  },
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  loader: { flex: 1 },
  list: {
    paddingTop: spacing.sm,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  emptyEmoji: { fontSize: 56 },
  emptyText: {
    fontSize: typography.size.md,
    textAlign: 'center',
    lineHeight: typography.size.md * 1.6,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: {
    color: '#fff',
    fontSize: 28,
    lineHeight: 32,
    fontWeight: typography.weight.regular,
  },
});
