export type Bar = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  tags: Record<string, string>;
  distanceMeters?: number;
};
