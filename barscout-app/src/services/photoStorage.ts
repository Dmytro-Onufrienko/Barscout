import * as FileSystem from 'expo-file-system/legacy';

const PHOTOS_DIR = `${FileSystem.documentDirectory}cocktail_photos/`;

async function ensureDir(): Promise<void> {
  const info = await FileSystem.getInfoAsync(PHOTOS_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(PHOTOS_DIR, { intermediates: true });
  }
}

export async function savePhotoPermanently(cacheUri: string): Promise<string> {
  await ensureDir();
  const filename = `${Date.now()}.jpg`;
  const dest = `${PHOTOS_DIR}${filename}`;
  await FileSystem.moveAsync({ from: cacheUri, to: dest });
  return dest;
}

export async function deletePhoto(uri: string): Promise<void> {
  try {
    await FileSystem.deleteAsync(uri, { idempotent: true });
  } catch (e) {
    console.warn('Failed to delete photo', e);
  }
}

export async function getPhotoSize(uri: string): Promise<number> {
  const info = await FileSystem.getInfoAsync(uri);
  if (!info.exists) return 0;
  return info.size ?? 0;
}
