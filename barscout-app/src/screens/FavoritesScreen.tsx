import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
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

  const handlePress = (item: FavoriteItem) => {
    haptics.light();
    tabNav.navigate('RandomizerTab', {
      screen: 'CocktailDetail',
      params: { cocktailId: item.id },
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['bottom']}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          favorites.length === 0 && styles.emptyContainer,
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
              <Text style={styles.heart}>❤️</Text>
            </Pressable>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🤍</Text>
            <Text style={[styles.emptyText, { color: theme.textMuted }]}>
              Поки що пусто.{'\n'}Додай улюблені коктейлі!
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
