export type RawShift = {
  id?: string;
  logo: string;
  address: string;
  companyName: string;
  dateStartByCity: string;
  timeStartByCity: string;
  timeEndByCity: string;
  currentWorkers: number;
  planWorkers: number;
  workTypes: string;
  priceWorker: number;
  customerFeedbacksCount: number;
  customerRating: number;
};

const BASE = 'https://mobile.handswork.pro';

const urlVariants = [
  (lat: number, lon: number) =>
    `${BASE}/api/shift?latitude=${lat}&longitude=${lon}`,
  (lat: number, lon: number) => `${BASE}/api/shift?lat=${lat}&lon=${lon}`,
  (lat: number, lon: number) => `${BASE}/api/shifts?lat=${lat}&lon=${lon}`,
  (lat: number, lon: number) =>
    `${BASE}/api/shifts?latitude=${lat}&longitude=${lon}`,
];

export async function getShiftsByCoords(
  lat: number,
  lon: number,
): Promise<RawShift[]> {
  let lastStatus = 0;
  for (const build of urlVariants) {
    const url = build(lat, lon);
    try {
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      if (res.status === 404) return []; 
      if (!res.ok) {
        lastStatus = res.status;
        continue;
      }
      const data = await res.json();
      if (Array.isArray(data)) return data;
      if (Array.isArray((data as any)?.results)) return (data as any).results;
      return [];
    } catch {
      continue;
    }
  }
  throw new Error(`HTTP ${lastStatus || 0}`);
}
