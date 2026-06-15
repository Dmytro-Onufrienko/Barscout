# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Critical Rule

**Read the exact versioned Expo docs before writing any code involving Expo packages:**
https://docs.expo.dev/versions/v54.0.0/

Expo SDK APIs change between versions. Using docs from the wrong version causes subtle, hard-to-debug errors (e.g., `expo-file-system` v4 removed `documentDirectory` from the top-level import — must use `expo-file-system/legacy`).

## Commands

```bash
# Start dev server (Expo Go)
npx expo start

# Run on iOS simulator
npx expo start --ios

# Run on Android emulator
npx expo start --android

# TypeScript check
npx tsc --noEmit
```

There are no tests in this project. There is no lint script — TSC is the only static check.

## Architecture

### Stack
- **Expo SDK 54** + React Native 0.81 + React 19
- **React Navigation v7**: bottom tabs + native stacks
- **New Architecture enabled** (`newArchEnabled: true` in app.json)
- TypeScript strict mode
- Path alias: `@/` → `src/`

### Navigation structure
```
RootNavigator
  ├── OnboardingScreen        (shown once on first launch, outside NavigationContainer)
  └── NavigationContainer
        └── BottomTabs (5 tabs)
              ├── RandomizerTab → RandomizerStack
              │     ├── RandomizerScreen
              │     ├── SearchScreen
              │     ├── BrowseScreen
              │     ├── CategoryResultsScreen
              │     └── CocktailDetailScreen
              ├── BarFinderTab → BarFinderScreen
              ├── FavoritesTab → FavoritesScreen
              ├── JournalTab → JournalStack
              │     ├── JournalScreen
              │     ├── CameraScreen
              │     ├── JournalEntryScreen
              │     └── JournalDetailScreen
              └── SettingsTab → SettingsScreen
```

Cross-tab navigation (e.g., CocktailDetail → JournalEntry) uses `useNavigation<BottomTabNavigationProp<RootTabParamList>>()` with `NavigatorScreenParams` in `RootTabParamList`.

### Context providers (App.tsx, outer to inner)
1. `ThemeProvider` — light/dark/auto, persisted to AsyncStorage (`@barscout/colorMode`)
2. `OnboardingProvider` — first-launch flag (`@barscout:onboarded`)
3. `JournalProvider` — journal entries in memory + AsyncStorage
4. `FavoritesProvider` — favorites list in memory + AsyncStorage

### Data layer
- **Remote**: TheCocktailDB free API (`https://www.thecocktaildb.com/api/json/v1/1`)
  - `getRandomCocktail`, `searchByName`, `searchByIngredient`, `getById`
  - `getCategories`, `filterByCategory` → returns `CocktailPreview[]` (id/name/thumbnail only)
  - `getRandomFromCategory` → picks random from category then fetches full data via `getById`
- **Bar data**: Overpass API (`https://overpass-api.de/api/interpreter`) — amenity=bar/pub within radius
- **Local storage**: AsyncStorage for journal entries, favorites, theme, onboarding, cocktail-of-the-day cache
- **Photos**: `expo-file-system/legacy` — camera images moved from cache to `documentDirectory/cocktail_photos/`

### Key types
- `Cocktail` — full cocktail data including `ingredients: Ingredient[]` and optional `video?: string`
- `CocktailPreview` — minimal `{ id, name, thumbnail }` returned by filter endpoints
- `FavoriteItem` — `{ id, name, thumbnail }` (stored with thumbnail to avoid refetch)
- `JournalEntry` — `{ id, cocktailId?, cocktailName, photoUri?, rating, notes, createdAt }`

### Theme system
`useTheme()` returns `{ theme, colorMode, setColorMode, scheme }`:
- `theme` — resolved `ThemeColors` object (use everywhere for colors)
- `scheme` — `'light' | 'dark'` (resolved from colorMode + system)
- All navigators (BottomTabs, RandomizerStack, JournalStack) use `useTheme()` so headers re-render on theme change

### Gotchas
- `expo-file-system` must be imported from `expo-file-system/legacy` — the v4 top-level API removed `documentDirectory`
- `CocktailDetailScreen` is typed to `RandomizerStackParamList` but is also navigated to from Favorites and Journal tabs via cross-tab navigation (`RandomizerTab → CocktailDetail`)
- Camera screen navigates back with `route.params.photoUri` — `JournalEntryScreen` watches this via `useEffect` on `route.params.photoUri` (not initial state) because the screen is already mounted
- Journal edit must pass `entryId` + `createdAt` through nav params to avoid creating a duplicate entry and overwriting the original timestamp
