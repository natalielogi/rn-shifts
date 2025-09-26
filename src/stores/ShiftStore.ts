import { makeAutoObservable, runInAction } from 'mobx';
import type { Shift } from '../types/Shift';
import { getShiftsByCoords, type RawShift } from '../api/shifts';

type LoadStatus = 'idle' | 'loading' | 'success' | 'error';

const mapRawToShift = (raw: RawShift, idx: number): Shift => {
  const id =
    raw.id ??
    `${raw.companyName}-${raw.dateStartByCity}-${raw.timeStartByCity}-${idx}`;
  return {
    id: String(id),
    logo: raw.logo ?? '',
    address: raw.address ?? '',
    companyName: raw.companyName ?? '',
    dateStartByCity: raw.dateStartByCity ?? '',
    timeStartByCity: raw.timeStartByCity ?? '',
    timeEndByCity: raw.timeEndByCity ?? '',
    currentWorkers: Number(raw.currentWorkers ?? 0),
    planWorkers: Number(raw.planWorkers ?? 0),
    workTypes: raw.workTypes ?? '',
    priceWorker: Number(raw.priceWorker ?? 0),
    customerFeedbacksCount: Number(raw.customerFeedbacksCount ?? 0),
    customerRating: Number(raw.customerRating ?? 0),
  };
};

class ShiftStore {
  shifts: Shift[] = [];
  status: LoadStatus = 'idle';
  error: string | null = null;
  usingDemoData = false;

  constructor() {
    makeAutoObservable(this);
  }

  async loadByCoords(lat: number, lon: number) {
    this.status = 'loading';
    this.error = null;
    try {
      const raw = await getShiftsByCoords(lat, lon);
      const mapped = raw.map(mapRawToShift);

      if (mapped.length === 0) {
        await this.loadMock(true);
        return;
      }

      runInAction(() => {
        this.shifts = mapped;
        this.status = 'success';
        this.usingDemoData = false;
      });
    } catch (e) {
      runInAction(() => {
        this.error = e instanceof Error ? e.message : 'Unknown error';
        this.status = 'error';
      });
    }
  }

  async loadMock(markDemo = true) {
    this.status = 'loading';
    this.error = null;

    const make = (i: number): Shift => ({
      id: String(i),
      logo: '',
      address: `Адрес, дом ${10 + i}`,
      companyName: `Компания #${i + 1}`,
      dateStartByCity: '2025-10-10',
      timeStartByCity: '10:00',
      timeEndByCity: '18:00',
      currentWorkers: 3 + (i % 5),
      planWorkers: 5 + (i % 4),
      workTypes: i % 2 ? 'Промо' : 'Мерч',
      priceWorker: 1800 + i * 100,
      customerFeedbacksCount: 10 + i,
      customerRating: (3 + (i % 3)) as 3 | 4 | 5,
    });

    await new Promise(r => setTimeout(r, 300));

    runInAction(() => {
      this.shifts = Array.from({ length: 12 }, (_, i) => make(i));
      this.status = 'success';
      this.usingDemoData = markDemo;
    });
  }

  get total() {
    return this.shifts.length;
  }

  getById(id: string) {
    return this.shifts.find(s => s.id === id) || null;
  }
}

export const shiftStore = new ShiftStore();
