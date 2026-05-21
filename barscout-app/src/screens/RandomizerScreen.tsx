import { useEffect } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, typography } from '@/theme';
import { useRandomCocktail } from '@/hooks/useRandomCocktail';
import CocktailCard from '@/components/CocktailCard';
import type { RandomizerStackParamList } from '@/types/navigation';

type Nav = NativeStackNavigationProp<RandomizerStackParamList, 'Randomizer'>;

export default function RandomizerScreen() {
  const scheme = useColorScheme() ?? 'light';
  const theme = colors[scheme];
  const navigation = useNavigation<Nav>();
  const { cocktail, loading, error, shuffle } = useRandomCocktail();

  useEffect(() => {
    shuffle();
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {loading && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      )}

      {!loading && error && (
        <View style={styles.centered}>
          <Text style={[styles.errorText, { color: theme.error }]}>
            {error.message}
          </Text>
          <Pressable
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={shuffle}
          >
            <Text style={styles.buttonText}>Retry</Text>
          </Pressable>
        </View>
      )}

      {!loading && cocktail && (
        <View style={styles.content}>
          <CocktailCard
            cocktail={cocktail}
            onPress={() => navigation.navigate('CocktailDetail', { cocktailId: cocktail.id })}
          />
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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.lg,
  },
  errorText: {
    fontSize: typography.size.md,
    textAlign: 'center',
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
