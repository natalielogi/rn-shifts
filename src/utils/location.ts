import Geolocation, { GeoPosition } from 'react-native-geolocation-service';

export async function requestLocation(): Promise<{ lat: number; lon: number }> {
  try {
    const pos = await new Promise<GeoPosition>((resolve, reject) =>
      Geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }),
    );
    return { lat: pos.coords.latitude, lon: pos.coords.longitude };
  } catch (e: any) {
    await Geolocation.requestAuthorization('whenInUse');
    const pos = await new Promise<GeoPosition>((resolve, reject) =>
      Geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }),
    );
    return { lat: pos.coords.latitude, lon: pos.coords.longitude };
  }
}
