export type RootTabParamList = {
  RandomizerTab: undefined;
  BarFinderTab: undefined;
  JournalTab: undefined;
};

export type RandomizerStackParamList = {
  Randomizer: undefined;
  CocktailDetail: { cocktailId: string };
};

export type JournalStackParamList = {
  Journal: undefined;
  Camera: undefined;
  JournalEntry: { photoUri?: string; cocktailId?: string; cocktailName?: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootTabParamList {}
  }
}
