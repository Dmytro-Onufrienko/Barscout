import { useEffect, useLayoutEffect, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, spacing, typography } from '@/theme';
import { getById } from '@/services/cocktailApi';
import type { Cocktail } from '@/types/cocktail';
import type { RandomizerStackParamList } from '@/types/navigation';
import CocktailCardSkeleton from '@/components/CocktailCardSkeleton';
import ErrorView from '@/components/ErrorView';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useHaptics } from '@/hooks/useHaptics';

type Props = NativeStackScreenProps<RandomizerStackParamList, 'CocktailDetail'>;

export default function CocktailDetailScreen({ route, navigation }: Props) {
  const { cocktailId } = route.params;
  const scheme = useColorScheme() ?? 'light';
  const theme = colors[scheme];

  const { isFavorite, toggleFavorite } = useFavorites();
  const haptics = useHaptics();
  const [cocktail, setCocktail] = useState<Cocktail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fav = isFavorite(cocktailId);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          hitSlop={12}
          onPress={async () => {
            await toggleFavorite(cocktailId);
            haptics.light();
          }}
        >
          <Text style={{ fontSize: 22 }}>{fav ? '❤️' : '🤍'}</Text>
        </Pressable>
      ),
    });
  }, [fav, cocktailId]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getById(cocktailId);
        if (!cancelled) setCocktail(data);
      } catch (e) {
        if (!cancelled) setError(e as Error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [cocktailId]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <CocktailCardSkeleton />
      </SafeAreaView>
    );
  }

  if (error || !cocktail) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <ErrorView message={error?.message ?? 'Cocktail not found'} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: cocktail.thumbnail }} style={styles.hero} resizeMode="cover" />

        <View style={styles.body}>
          <Text style={[styles.name, { color: theme.text }]}>{cocktail.name}</Text>

          <View style={styles.tags}>
            <Tag label={cocktail.category} color={theme.primary} />
            <Tag label={cocktail.glass} color={theme.textMuted} />
            <Tag label={cocktail.alcoholic} color={theme.textMuted} />
          </View>

          <Text style={[styles.sectionTitle, { color: theme.text }]}>Ingredients</Text>
          {cocktail.ingredients.map((ing, i) => (
            <View key={i} style={[styles.ingredient, { borderBottomColor: theme.border }]}>
              <Text style={[styles.ingredientName, { color: theme.text }]}>{ing.name}</Text>
              {ing.measure ? (
                <Text style={[styles.ingredientMeasure, { color: theme.textMuted }]}>
                  {ing.measure}
                </Text>
              ) : null}
            </View>
          ))}

          <Text style={[styles.sectionTitle, { color: theme.text }]}>Instructions</Text>
          <Text style={[styles.instructions, { color: theme.text }]}>
            {cocktail.instructions}
          </Text>

          <Pressable
            style={[styles.saveButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => {
              // TODO: connect in Phase 6
            }}
          >
            <Text style={[styles.saveButtonText, { color: theme.text }]}>
              💾 Save to Journal
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Tag({ label, color }: { label: string; color: string }) {
  return (
    <View style={[styles.tag, { borderColor: color }]}>
      <Text style={[styles.tagText, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hero: {
    width: '100%',
    height: 300,
  },
  body: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  name: {
    fontSize: typography.size.xxxl,
    fontWeight: typography.weight.bold,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  tag: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  tagText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
  },
  sectionTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  ingredient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  ingredientName: {
    fontSize: typography.size.md,
  },
  ingredientMeasure: {
    fontSize: typography.size.md,
  },
  instructions: {
    fontSize: typography.size.md,
    lineHeight: typography.size.md * 1.6,
  },
  saveButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
  },
});
