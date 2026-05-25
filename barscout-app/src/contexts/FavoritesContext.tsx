import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { favoritesStorage } from '@/storage/favoritesStorage';
import type { FavoriteItem } from '@/types/favorite';

type FavoritesContextValue = {
  favorites: FavoriteItem[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (item: FavoriteItem) => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    favoritesStorage.getAll().then(setFavorites);
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.some((f) => f.id === id),
    [favorites],
  );

  const toggleFavorite = useCallback(async (item: FavoriteItem) => {
    const isNowFav = await favoritesStorage.toggle(item);
    setFavorites((prev) =>
      isNowFav ? [item, ...prev] : prev.filter((f) => f.id !== item.id),
    );
  }, []);

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
