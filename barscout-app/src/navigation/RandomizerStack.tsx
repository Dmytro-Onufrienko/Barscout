import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable, Text } from 'react-native';
import { useTheme } from '@/theme';
import RandomizerScreen from '@/screens/RandomizerScreen';
import SearchScreen from '@/screens/SearchScreen';
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
            <Pressable hitSlop={12} onPress={() => navigation.navigate('Search')}>
              <Text style={{ fontSize: 20 }}>🔍</Text>
            </Pressable>
          ),
        })}
      />
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{ title: 'Пошук' }}
      />
      <Stack.Screen
        name="CocktailDetail"
        component={CocktailDetailScreen}
        options={{ title: 'Cocktail Detail' }}
      />
    </Stack.Navigator>
  );
}
