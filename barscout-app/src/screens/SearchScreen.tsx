import { useCallback, useEffect, useRef, useState } from 'react';
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
import { searchByName, searchByIngredient } from '@/services/cocktailApi';
import { useHaptics } from '@/hooks/useHaptics';
import CocktailCard from '@/components/CocktailCard';
import CocktailListItem from '@/components/CocktailListItem';
import type { Cocktail, CocktailPreview } from '@/types/cocktail';
import type { RandomizerStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<RandomizerStackParamList, 'Search'>;

type SearchMode = 'name' | 'ingredient';
type SearchState = 'idle' | 'loading' | 'done' | 'error';

export default function SearchScreen({ navigation, route }: Props) {
  const { theme } = useTheme();
  const haptics = useHaptics();
  const [mode, setMode] = useState<SearchMode>(route.params?.initialMode ?? 'name');
  const [query, setQuery] = useState(route.params?.initialQuery ?? '');
  const [nameResults, setNameResults] = useState<Cocktail[]>([]);
  const [ingredientResults, setIngredientResults] = useState<CocktailPreview[]>([]);
  const [state, setState] = useState<SearchState>('idle');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runSearch = useCallback(async (text: string, searchMode: SearchMode) => {
    if (!text.trim()) {
      setNameResults([]);
      setIngredientResults([]);
      setState('idle');
      return;
    }
    setState('loading');
    try {
      if (searchMode === 'name') {
        const data = await searchByName(text.trim());
        setNameResults(data);
      } else {
        const data = await searchByIngredient(text.trim());
        setIngredientResults(data);
      }
      setState('done');
    } catch {
      setState('error');
    }
  }, []);

  useEffect(() => {
    if (query.trim()) runSearch(query, mode);
  }, []);

  const handleChangeText = (text: string) => {
    setQuery(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(text, mode), 400);
  };

  const handleModeChange = (newMode: SearchMode) => {
    setMode(newMode);
    setNameResults([]);
    setIngredientResults([]);
    setState(query.trim() ? 'loading' : 'idle');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim()) {
      debounceRef.current = setTimeout(() => runSearch(query, newMode), 0);
    }
  };

  const results = mode === 'name' ? nameResults : ingredientResults;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['bottom']}>
      <View style={[styles.searchBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.searchIcon, { color: theme.textMuted }]}>🔍</Text>
        <TextInput
          style={[styles.input, { color: theme.text }]}
          value={query}
          onChangeText={handleChangeText}
          placeholder={mode === 'name' ? 'Margarita, Negroni…' : 'Vodka, Lime juice…'}
          placeholderTextColor={theme.textMuted}
          autoFocus
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      <View style={[styles.segmentRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        {(['name', 'ingredient'] as SearchMode[]).map((m) => (
          <Pressable
            key={m}
            style={[
              styles.segment,
              m === mode && { backgroundColor: theme.primary },
            ]}
            onPress={() => handleModeChange(m)}
          >
            <Text style={[styles.segmentText, { color: m === mode ? '#fff' : theme.textMuted }]}>
              {m === 'name' ? 'By Name' : 'By Ingredient'}
            </Text>
          </Pressable>
        ))}
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
          <Text style={styles.emptyEmoji}>{mode === 'name' ? '🍸' : '🍋'}</Text>
          <Text style={[styles.hint, { color: theme.textMuted }]}>
            {mode === 'name' ? 'Введіть назву коктейлю' : 'Введіть назву інгредієнта'}
          </Text>
        </View>
      )}

      {state === 'done' && results.length > 0 && mode === 'name' && (
        <FlatList
          data={nameResults}
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

      {state === 'done' && results.length > 0 && mode === 'ingredient' && (
        <FlatList
          data={ingredientResults}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listCompact}
          keyboardShouldPersistTaps="handled"
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
    marginBottom: spacing.sm,
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
  segmentRow: {
    flexDirection: 'row',
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
  },
  segment: {
    flex: 1,
    paddingVertical: spacing.xs + 2,
    alignItems: 'center',
  },
  segmentText: {
    fontSize: typography.size.sm,
    fontWeight: '600',
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
  listCompact: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  separator: { height: spacing.sm },
});
