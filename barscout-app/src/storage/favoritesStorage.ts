import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@barscout:favorites_v1';

export const favoritesStorage = {
  async getAll(): Promise<string[]> {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  async add(id: string): Promise<void> {
    const all = await this.getAll();
    if (!all.includes(id)) {
      await AsyncStorage.setItem(KEY, JSON.stringify([id, ...all]));
    }
  },

  async remove(id: string): Promise<void> {
    const all = await this.getAll();
    await AsyncStorage.setItem(KEY, JSON.stringify(all.filter((i) => i !== id)));
  },

  async has(id: string): Promise<boolean> {
    const all = await this.getAll();
    return all.includes(id);
  },

  async toggle(id: string): Promise<boolean> {
    const isFav = await this.has(id);
    if (isFav) await this.remove(id);
    else await this.add(id);
    return !isFav;
  },
};
