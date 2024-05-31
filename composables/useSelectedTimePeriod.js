import {
  startOfYear,
  endOfYear,
  sub,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
} from "date-fns";

export const useSelectedTimePeriod = (period) => {
  const current = computed(() => {
    switch (period.value) {
      case "Yearly":
        return {
          // ini calculate start of year tahun ini (new Date di paramnya itu buat tau tahun ini tahun apa)
          // ini berarti dari hari pertama tahun ini sampe 31 des tahun ini
          from: startOfYear(new Date()),
          to: endOfYear(new Date()),
        };
      case "Monthly":
        return {
          from: startOfMonth(new Date()),
          to: endOfMonth(new Date()),
        };
      case "Daily":
        return {
          from: startOfDay(new Date()),
          to: endOfDay(new Date()),
        };
    }
  });
  const previous = computed(() => {
    switch (period.value) {
      case "Yearly":
        return {
          // sub iku subtract (kurangi), so iki startofyear tahun ini kurangi 1 tahun
          from: startOfYear(sub(new Date(), { years: 1 })),
          to: endOfYear(new Date(sub(new Date(), { years: 1 }))),
        };
      case "Monthly":
        return {
          from: startOfMonth(sub(new Date(), { months: 1 })),
          to: endOfMonth(new Date(sub(new Date(), { months: 1 }))),
        };
      case "Daily":
        return {
          from: startOfDay(sub(new Date(), { days: 1 })),
          to: endOfDay(new Date(sub(new Date(), { days: 1 }))),
        };
    }
  });

  return { current, previous };
};
