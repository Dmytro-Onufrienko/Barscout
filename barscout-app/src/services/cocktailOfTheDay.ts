import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRandomCocktail } from './cocktailApi';
import type { Cocktail } from '@/types/cocktail';

const STORAGE_KEY = '@barscout:cotd';

type CotdEntry = {
  date: string;
  cocktail: Cocktail;
};

function todayString(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function getCocktailOfTheDay(): Promise<Cocktail> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (raw) {
    const entry: CotdEntry = JSON.parse(raw);
    if (entry.date === todayString()) return entry.cocktail;
  }

  const cocktail = await getRandomCocktail();
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ date: todayString(), cocktail }));
  return cocktail;
}
