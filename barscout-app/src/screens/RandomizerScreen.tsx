import { useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, typography } from '@/theme';
import { useRandomCocktail } from '@/hooks/useRandomCocktail';
import CocktailCard from '@/components/CocktailCard';
import CocktailCardSkeleton from '@/components/CocktailCardSkeleton';
import ErrorView from '@/components/ErrorView';
import { useShakeDetector } from '@/hooks/useShakeDetector';
import { useHaptics } from '@/hooks/useHaptics';
import type { RandomizerStackParamList } from '@/types/navigation';

type Nav = NativeStackNavigationProp<RandomizerStackParamList, 'Randomizer'>;

export default function RandomizerScreen() {
  const scheme = useColorScheme() ?? 'light';
  const theme = colors[scheme];
  const navigation = useNavigation<Nav>();
  const isFocused = useIsFocused();
  const { cocktail, loading, error, shuffle } = useRandomCocktail();
  const haptics = useHaptics();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useShakeDetector(shuffle, isFocused);

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
            onPress={shuffle}
          >
            <Text style={styles.buttonText}>🎲 Shuffle Again</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.lg,
  },
  button: {
    marginHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
  },
});
