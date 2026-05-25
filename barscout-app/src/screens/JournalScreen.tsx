import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { spacing, typography, useTheme } from '@/theme';
import { useJournal } from '@/contexts/JournalContext';
import JournalListItem from '@/components/JournalListItem';
import type { JournalStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<JournalStackParamList, 'Journal'>;

export default function JournalScreen({ navigation }: Props) {

  const { theme } = useTheme();
  const { entries, loading, refresh } = useJournal();

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} style={styles.loader} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['bottom']}>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <JournalListItem
            entry={item}
            onPress={() => navigation.navigate('JournalDetail', { entryId: item.id })}
          />
        )}
        refreshing={false}
        onRefresh={refresh}
        contentContainerStyle={[
          styles.list,
          entries.length === 0 && styles.emptyContainer,
        ]}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📔</Text>
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
