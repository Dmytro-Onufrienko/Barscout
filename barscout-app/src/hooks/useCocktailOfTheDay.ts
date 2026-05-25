import { useEffect, useState } from 'react';
import { getCocktailOfTheDay } from '@/services/cocktailOfTheDay';
import type { Cocktail } from '@/types/cocktail';

export function useCocktailOfTheDay() {
  const [cocktail, setCocktail] = useState<Cocktail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCocktailOfTheDay()
      .then(setCocktail)
      .finally(() => setLoading(false));
  }, []);

  return { cocktail, loading };
}
