import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/theme';
import RandomizerScreen from '@/screens/RandomizerScreen';
import SearchScreen from '@/screens/SearchScreen';
import BrowseScreen from '@/screens/BrowseScreen';
import CategoryResultsScreen from '@/screens/CategoryResultsScreen';
import CocktailDetailScreen from '@/screens/CocktailDetailScreen';
import type { RandomizerStackParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator<RandomizerStackParamList>();

export default function RandomizerStack() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.surface },
        headerTintColor: theme.text,
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen
        name="Randomizer"
        component={RandomizerScreen}
        options={({ navigation }) => ({
          title: 'Randomizer',
          headerRight: () => (
            <View style={styles.headerButtons}>
              <Pressable hitSlop={12} onPress={() => navigation.navigate('Browse')}>
                <Text style={{ fontSize: 20 }}>🗂️</Text>
              </Pressable>
              <Pressable hitSlop={12} onPress={() => navigation.navigate('Search')}>
                <Text style={{ fontSize: 20 }}>🔍</Text>
              </Pressable>
            </View>
          ),
        })}
      />
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{ title: 'Пошук' }}
      />
      <Stack.Screen
        name="Browse"
        component={BrowseScreen}
        options={{ title: 'Категорії' }}
      />
      <Stack.Screen
        name="CategoryResults"
        component={CategoryResultsScreen}
        options={({ route }) => ({ title: route.params.category })}
      />
      <Stack.Screen
        name="CocktailDetail"
        component={CocktailDetailScreen}
        options={{ title: 'Cocktail Detail' }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  headerButtons: {
    flexDirection: 'row',
    gap: 16,
  },
});
