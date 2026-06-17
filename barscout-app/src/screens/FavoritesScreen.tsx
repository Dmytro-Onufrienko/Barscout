import { useMemo, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { spacing, typography, useTheme } from '@/theme';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useHaptics } from '@/hooks/useHaptics';
import type { FavoriteItem } from '@/types/favorite';
import type { RootTabParamList } from '@/types/navigation';

export default function FavoritesScreen() {
  const { theme } = useTheme();
  const { favorites, toggleFavorite } = useFavorites();
  const haptics = useHaptics();
  const tabNav = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? favorites.filter((f) => f.name.toLowerCase().includes(q)) : favorites;
  }, [favorites, query]);

  const handlePress = (item: FavoriteItem) => {
    haptics.light();
    tabNav.navigate('RandomizerTab', {
      screen: 'CocktailDetail',
      params: { cocktailId: item.id },
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['bottom']}>
      {favorites.length > 0 && (
        <View style={[styles.searchBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Ionicons name="search" size={18} color={theme.textMuted} style={styles.searchIcon} />
          <TextInput
            style={[styles.input, { color: theme.text }]}
            value={query}
            onChangeText={setQuery}
            placeholder="Пошук…"
            placeholderTextColor={theme.textMuted}
            clearButtonMode="while-editing"
            returnKeyType="search"
          />
        </View>
      )}

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.list,
          filtered.length === 0 && styles.emptyContainer,
        ]}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.row, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => handlePress(item)}
          >
            <Image source={{ uri: item.thumbnail }} style={styles.thumb} resizeMode="cover" />
            <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
              {item.name}
            </Text>
            <Pressable
              hitSlop={12}
              onPress={async () => {
                await toggleFavorite(item);
                haptics.light();
              }}
            >
              <Ionicons name="heart" size={22} color={theme.error} />
            </Pressable>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            {favorites.length === 0 ? (
              <>
                <Ionicons name="heart-outline" size={48} color={theme.textMuted} />
                <Text style={[styles.emptyText, { color: theme.textMuted }]}>
                  Поки що пусто.{'\n'}Додай улюблені коктейлі!
                </Text>
              </>
            ) : (
              <>
                <Ionicons name="search" size={48} color={theme.textMuted} />
                <Text style={[styles.emptyText, { color: theme.textMuted }]}>
                  Нічого не знайдено для "{query}"
                </Text>
              </>
            )}
          </View>
        }
      />
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
  list: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  emptyContainer: { flex: 1 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    gap: spacing.sm,
    paddingRight: spacing.md,
  },
  thumb: {
    width: 72,
    height: 72,
  },
  name: {
    flex: 1,
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
  },
  heart: { fontSize: 20 },
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
});
