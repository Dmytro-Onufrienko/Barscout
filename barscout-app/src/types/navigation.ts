import type { NavigatorScreenParams } from '@react-navigation/native';

export type RootTabParamList = {
  RandomizerTab: NavigatorScreenParams<RandomizerStackParamList> | undefined;
  BarFinderTab: undefined;
  FavoritesTab: undefined;
  JournalTab: NavigatorScreenParams<JournalStackParamList> | undefined;
  SettingsTab: undefined;
};

export type RandomizerStackParamList = {
  Randomizer: undefined;
  CocktailDetail: { cocktailId: string };
};

export type JournalStackParamList = {
  Journal: undefined;
  Camera: undefined;
  JournalEntry: { photoUri?: string; cocktailId?: string; cocktailName?: string; entryId?: string; notes?: string; rating?: number; createdAt?: string };
  JournalDetail: { entryId: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootTabParamList {}
  }
}
