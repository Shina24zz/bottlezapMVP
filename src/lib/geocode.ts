/**
 * Server-side geocoding via Google Geocoding API.
 * Uses NEXT_PUBLIC_GOOGLE_MAPS_API_KEY (restrict key to Geocoding + Maps in Google Cloud).
 */
export async function geocodeAddress(
  address: string,
): Promise<{ lat: number; lng: number } | null> {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!key) {
    console.error("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set");
    return null;
  }
  const q = encodeURIComponent(address.trim());
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${q}&key=${key}&region=ie`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = (await res.json()) as {
    status: string;
    results?: { geometry: { location: { lat: number; lng: number } } }[];
  };
  if (data.status !== "OK" || !data.results?.[0]) return null;
  const loc = data.results[0].geometry.location;
  return { lat: loc.lat, lng: loc.lng };
}
