import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { spacing, typography, useTheme } from '@/theme';
import { getCategories } from '@/services/cocktailApi';
import type { RandomizerStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<RandomizerStackParamList, 'Browse'>;

export default function BrowseScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={[styles.hint, { color: theme.textMuted }]}>
          Не вдалося завантажити категорії.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['bottom']}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.chip,
              { backgroundColor: theme.surface, opacity: pressed ? 0.85 : 1 },
            ]}
            onPress={() => navigation.navigate('CategoryResults', { category: item })}
          >
            <Text style={[styles.chipText, { color: theme.text }]} numberOfLines={2}>
              {item}
            </Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  hint: { fontSize: typography.size.md, textAlign: 'center' },
  list: { padding: spacing.md, gap: spacing.sm },
  row: { gap: spacing.sm },
  chip: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 72,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  chipText: {
    fontSize: typography.size.sm,
    fontWeight: '600',
    textAlign: 'center',
  },
});
