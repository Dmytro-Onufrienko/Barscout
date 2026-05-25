import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FavoriteItem } from '@/types/favorite';

const KEY = '@barscout:favorites_v2';

export const favoritesStorage = {
  async getAll(): Promise<FavoriteItem[]> {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  async add(item: FavoriteItem): Promise<void> {
    const all = await this.getAll();
    if (!all.find((i) => i.id === item.id)) {
      await AsyncStorage.setItem(KEY, JSON.stringify([item, ...all]));
    }
  },

  async remove(id: string): Promise<void> {
    const all = await this.getAll();
    await AsyncStorage.setItem(KEY, JSON.stringify(all.filter((i) => i.id !== id)));
  },

  async has(id: string): Promise<boolean> {
    const all = await this.getAll();
    return all.some((i) => i.id === id);
  },

  async toggle(item: FavoriteItem): Promise<boolean> {
    const isFav = await this.has(item.id);
    if (isFav) await this.remove(item.id);
    else await this.add(item);
    return !isFav;
  },
};
