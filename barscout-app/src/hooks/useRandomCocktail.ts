import { useState, useCallback } from 'react';
import { getRandomCocktail, getRandomFromCategory } from '@/services/cocktailApi';
import type { Cocktail } from '@/types/cocktail';

export function useRandomCocktail() {
  const [cocktail, setCocktail] = useState<Cocktail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [category, setCategory] = useState<string | null>(null);

  const shuffle = useCallback(async (cat?: string | null) => {
    setLoading(true);
    setError(null);
    try {
      const active = cat !== undefined ? cat : category;
      const data = active ? await getRandomFromCategory(active) : await getRandomCocktail();
      setCocktail(data);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [category]);

  const applyCategory = useCallback((cat: string | null) => {
    setCategory(cat);
    shuffle(cat);
  }, [shuffle]);

  return { cocktail, loading, error, shuffle, category, applyCategory };
}
