export type RootTabParamList = {
  RandomizerTab: undefined;
  BarFinderTab: undefined;
  JournalTab: undefined;
};

export type RandomizerStackParamList = {
  Randomizer: undefined;
  CocktailDetail: { cocktailId: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootTabParamList {}
  }
}
