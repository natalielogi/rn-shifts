import { makeAutoObservable, runInAction } from "mobx";
import type { Shift } from "../types/Shift";

type LoadStatus = "idle" | "loading" | "success" | "error";

class ShiftStore {
  shifts: Shift[] = [];
  status: LoadStatus = "idle";
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async loadMock() {
    this.status = "loading";
    try {
      const make = (i: number): Shift => ({
        id: String(i),
        logo: "https://via.placeholder.com/64",
        address: `Адрес, дом ${10 + i}`,
        companyName: `Компания #${i + 1}`,
        dateStartByCity: "2025-10-10",
        timeStartByCity: "10:00",
        timeEndByCity: "18:00",
        currentWorkers: 3 + (i % 5),
        planWorkers: 5 + (i % 4),
        workTypes: i % 2 ? "Промо" : "Мерч",
        priceWorker: 1800 + i * 100,
        customerFeedbacksCount: 10 + i,
        customerRating: (3 + (i % 3)) as 3 | 4 | 5,
      });

      const data = Array.from({ length: 12 }, (_, i) => make(i));
      await new Promise((r) => setTimeout(r, 400));

      runInAction(() => {
        this.shifts = data;
        this.status = "success";
      });
    } catch (e) {
      runInAction(() => {
        this.error = e instanceof Error ? e.message : "Unknown error";
        this.status = "error";
      });
    }
  }

  get total() {
    return this.shifts.length;
  }

  getById(id: string) {
    return this.shifts.find((s) => s.id === id) || null;
  }
}

export const shiftStore = new ShiftStore();
