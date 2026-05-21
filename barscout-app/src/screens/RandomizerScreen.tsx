import { Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '@/theme';
import type { RandomizerStackParamList } from '@/types/navigation';

type Nav = NativeStackNavigationProp<RandomizerStackParamList, 'Randomizer'>;

export default function RandomizerScreen() {
  const scheme = useColorScheme() ?? 'light';
  const theme = colors[scheme];
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>Randomizer</Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>
          Your cocktail will appear here
        </Text>
        {/* TODO: remove after Step 2.4 */}
        <Pressable
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={() => navigation.navigate('CocktailDetail', { cocktailId: 'test-123' })}
        >
          <Text style={styles.buttonText}>Go to Detail →</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 15,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});
