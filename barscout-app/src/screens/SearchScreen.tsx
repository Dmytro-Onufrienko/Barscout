import { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { spacing, typography, useTheme } from '@/theme';
import { searchByName } from '@/services/cocktailApi';
import { useHaptics } from '@/hooks/useHaptics';
import CocktailCard from '@/components/CocktailCard';
import type { Cocktail } from '@/types/cocktail';
import type { RandomizerStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<RandomizerStackParamList, 'Search'>;

type SearchState = 'idle' | 'loading' | 'done' | 'error';

export default function SearchScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const haptics = useHaptics();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Cocktail[]>([]);
  const [state, setState] = useState<SearchState>('idle');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runSearch = useCallback(async (text: string) => {
    if (!text.trim()) {
      setResults([]);
      setState('idle');
      return;
    }
    setState('loading');
    try {
      const data = await searchByName(text.trim());
      setResults(data);
      setState('done');
    } catch {
      setState('error');
    }
  }, []);

  const handleChangeText = (text: string) => {
    setQuery(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(text), 400);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['bottom']}>
      <View style={[styles.searchBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.searchIcon, { color: theme.textMuted }]}>🔍</Text>
        <TextInput
          style={[styles.input, { color: theme.text }]}
          value={query}
          onChangeText={handleChangeText}
          placeholder="Margarita, Negroni…"
          placeholderTextColor={theme.textMuted}
          autoFocus
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      {state === 'loading' && (
        <ActivityIndicator style={styles.centered} size="large" color={theme.primary} />
      )}

      {state === 'error' && (
        <View style={styles.centered}>
          <Text style={[styles.hint, { color: theme.textMuted }]}>
            Щось пішло не так. Спробуйте ще раз.
          </Text>
        </View>
      )}

      {state === 'done' && results.length === 0 && (
        <View style={styles.centered}>
          <Text style={styles.emptyEmoji}>🍹</Text>
          <Text style={[styles.hint, { color: theme.textMuted }]}>
            Нічого не знайдено для "{query}"
          </Text>
        </View>
      )}

      {state === 'idle' && (
        <View style={styles.centered}>
          <Text style={styles.emptyEmoji}>🍸</Text>
          <Text style={[styles.hint, { color: theme.textMuted }]}>
            Введіть назву коктейлю
          </Text>
        </View>
      )}

      {state === 'done' && results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <CocktailCard
              cocktail={item}
              onPress={() => {
                haptics.light();
                navigation.navigate('CocktailDetail', { cocktailId: item.id });
              }}
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    gap: spacing.xs,
  },
  searchIcon: { fontSize: 16 },
  input: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    fontSize: typography.size.md,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  emptyEmoji: { fontSize: 48 },
  hint: {
    fontSize: typography.size.md,
    textAlign: 'center',
  },
  list: {
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  separator: { height: spacing.sm },
});
