import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@/theme';
import RandomizerScreen from '@/screens/RandomizerScreen';
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
        options={{ title: 'Randomizer' }}
      />
      <Stack.Screen
        name="CocktailDetail"
        component={CocktailDetailScreen}
        options={{ title: 'Cocktail Detail' }}
      />
    </Stack.Navigator>
  );
}
