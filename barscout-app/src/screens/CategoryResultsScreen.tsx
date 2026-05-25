import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { spacing, useTheme } from '@/theme';
import { filterByCategory } from '@/services/cocktailApi';
import { useHaptics } from '@/hooks/useHaptics';
import CocktailListItem from '@/components/CocktailListItem';
import type { CocktailPreview } from '@/types/cocktail';
import type { RandomizerStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<RandomizerStackParamList, 'CategoryResults'>;

export default function CategoryResultsScreen({ route, navigation }: Props) {
  const { theme } = useTheme();
  const haptics = useHaptics();
  const { category } = route.params;
  const [results, setResults] = useState<CocktailPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    filterByCategory(category)
      .then(setResults)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [category]);

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
          Не вдалося завантажити коктейлі.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['bottom']}>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <CocktailListItem
            cocktail={item}
            onPress={() => {
              haptics.light();
              navigation.navigate('CocktailDetail', { cocktailId: item.id });
            }}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  hint: { fontSize: 16, textAlign: 'center' },
  list: { padding: spacing.md },
  separator: { height: spacing.sm },
});
