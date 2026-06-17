import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { spacing, typography, useTheme } from '@/theme';
import { useRandomCocktail } from '@/hooks/useRandomCocktail';
import { useCocktailOfTheDay } from '@/hooks/useCocktailOfTheDay';
import CocktailCard from '@/components/CocktailCard';
import CocktailCardSkeleton from '@/components/CocktailCardSkeleton';
import CotdBanner from '@/components/CotdBanner';
import CategoryFilterModal from '@/components/CategoryFilterModal';
import ErrorView from '@/components/ErrorView';
import { useShakeDetector } from '@/hooks/useShakeDetector';
import { useHaptics } from '@/hooks/useHaptics';
import type { RandomizerStackParamList } from '@/types/navigation';

type Nav = NativeStackNavigationProp<RandomizerStackParamList, 'Randomizer'>;

export default function RandomizerScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<Nav>();
  const isFocused = useIsFocused();
  const { cocktail, loading, error, shuffle, category, applyCategory } = useRandomCocktail();
  const { cocktail: cotd } = useCocktailOfTheDay();
  const haptics = useHaptics();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [filterVisible, setFilterVisible] = useState(false);

  useShakeDetector(shuffle, isFocused);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtons}>
          <Pressable hitSlop={12} onPress={() => setFilterVisible(true)}>
            <Ionicons name="filter" size={22} color={theme.text} />
          </Pressable>
          <Pressable hitSlop={12} onPress={() => navigation.navigate('Browse')}>
            <Ionicons name="grid-outline" size={22} color={theme.text} />
          </Pressable>
          <Pressable hitSlop={12} onPress={() => navigation.navigate('Search')}>
            <Ionicons name="search" size={22} color={theme.text} />
          </Pressable>
        </View>
      ),
    });
  }, [navigation, setFilterVisible, theme.text]);

  useEffect(() => {
    shuffle();
  }, []);

  useEffect(() => {
    if (!loading && cocktail) {
      haptics.success();
      scaleAnim.setValue(0.92);
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 120,
        friction: 7,
      }).start();
    }
  }, [cocktail]);

  useEffect(() => {
    if (!loading && error) haptics.error();
  }, [error]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {cotd && (
        <View style={styles.cotdWrap}>
          <CotdBanner
            cocktail={cotd}
            onPress={() => {
              haptics.light();
              navigation.navigate('CocktailDetail', { cocktailId: cotd.id });
            }}
          />
        </View>
      )}

      {category && (
        <Pressable
          style={[styles.filterChip, { backgroundColor: theme.primary }]}
          onPress={() => setFilterVisible(true)}
        >
          <Ionicons name="filter" size={14} color="#fff" />
          <Text style={styles.filterChipText}>{category}</Text>
          <Ionicons name="close" size={14} color="#fff" />
        </Pressable>
      )}

      {loading && <CocktailCardSkeleton />}

      {!loading && error && <ErrorView message={error.message} onRetry={shuffle} />}

      {!loading && cocktail && (
        <View style={styles.content}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <CocktailCard
              cocktail={cocktail}
              onPress={() => {
                haptics.light();
                navigation.navigate('CocktailDetail', { cocktailId: cocktail.id });
              }}
            />
          </Animated.View>
          <Pressable
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={() => shuffle()}
          >
            <Ionicons name="shuffle" size={20} color="#fff" />
            <Text style={styles.buttonText}>Shuffle Again</Text>
          </Pressable>
        </View>
      )}

      <CategoryFilterModal
        visible={filterVisible}
        selected={category}
        onSelect={applyCategory}
        onClose={() => setFilterVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cotdWrap: {
    paddingTop: spacing.md,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.lg,
  },
  button: {
    flexDirection: 'row',
    marginHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'center',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: 20,
  },
  filterChipText: {
    color: '#fff',
    fontSize: typography.size.sm,
    fontWeight: '600',
  },
});
