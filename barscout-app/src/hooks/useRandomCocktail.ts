import { useState, useCallback } from 'react';
import { getRandomCocktail } from '@/services/cocktailApi';
import type { Cocktail } from '@/types/cocktail';

export function useRandomCocktail() {
  const [cocktail, setCocktail] = useState<Cocktail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const shuffle = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRandomCocktail();
      setCocktail(data);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { cocktail, loading, error, shuffle };
}
