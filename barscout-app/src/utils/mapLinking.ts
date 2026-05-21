import { Linking, Platform } from 'react-native';

export async function openInMaps(lat: number, lon: number, label: string): Promise<void> {
  const encoded = encodeURIComponent(label);
  const url = Platform.select({
    ios: `maps:0,0?q=${encoded}@${lat},${lon}`,
    android: `geo:0,0?q=${lat},${lon}(${encoded})`,
  });

  if (url && (await Linking.canOpenURL(url))) {
    await Linking.openURL(url);
  } else {
    await Linking.openURL(
      `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`,
    );
  }
}
