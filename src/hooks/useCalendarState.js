import { useCallback, useEffect, useMemo, useState } from "react";
import { generateEventsForYear } from "../data/events";
import {
  buildYearCalendar,
  calculateProgress,
  computeStreak,
  normaliseDate,
} from "../utils/dates";
import { useLocalStorage } from "./useLocalStorage";

const STORAGE_NAMESPACE = "spidercompter";
const AUTO_FILL_KEY = `${STORAGE_NAMESPACE}:auto-fill`;
const YEAR_KEY = `${STORAGE_NAMESPACE}:year`;

function getCheckedKey(year) {
  return `${STORAGE_NAMESPACE}:checked:${year}`;
}

function selectInitialYear(years) {
  if (!Array.isArray(years) || years.length === 0) {
    return new Date().getFullYear();
  }
  const current = new Date().getFullYear();
  if (years.includes(current)) {
    return current;
  }
  return years[0];
}

function readYearFromStorage(rawValue, fallback, years) {
  const parsed = Number.parseInt(rawValue, 10);
  if (Number.isNaN(parsed)) {
    return fallback;
  }
  if (Array.isArray(years) && years.includes(parsed)) {
    return parsed;
  }
  return fallback;
}

function readCheckedDays(year) {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(getCheckedKey(year));
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) {
      return parsed.filter((value) => typeof value === "string").sort();
    }
  } catch (error) {
    console.warn("Impossible de récupérer les cases cochées", error);
  }

  return [];
}

function writeCheckedDays(year, values) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(getCheckedKey(year), JSON.stringify(values));
  } catch (error) {
    console.warn("Impossible d'enregistrer les cases cochées", error);
  }
}

export function useCalendarState(availableYears) {
  const years = useMemo(() => {
    if (Array.isArray(availableYears) && availableYears.length > 0) {
      return [...availableYears].sort((a, b) => a - b);
    }
    return [new Date().getFullYear()];
  }, [availableYears]);

  const fallbackYear = useMemo(() => selectInitialYear(years), [years]);

  const [year, setStoredYear] = useLocalStorage(
    YEAR_KEY,
    () => fallbackYear,
    {
      parse: (raw) => readYearFromStorage(raw, fallbackYear, years),
      serialize: (value) => String(value),
    },
  );

  const [autoFill, setAutoFill] = useLocalStorage(
    AUTO_FILL_KEY,
    () => true,
    {
      parse: (raw) => raw === "true",
      serialize: (value) => (value ? "true" : "false"),
    },
  );

  const [checkedDays, setCheckedDays] = useState(() => readCheckedDays(year));
  const [lastAction, setLastAction] = useState(null);

  useEffect(() => {
    setCheckedDays(readCheckedDays(year));
    setLastAction(null);
  }, [year]);

  useEffect(() => {
    writeCheckedDays(year, checkedDays);
  }, [year, checkedDays]);

  useEffect(() => {
    if (!lastAction) {
      return undefined;
    }

    const timeout = window.setTimeout(() => setLastAction(null), 1200);
    return () => window.clearTimeout(timeout);
  }, [lastAction]);

  const { eventsByDate, timeline } = useMemo(() => generateEventsForYear(year), [year]);

  const calendar = useMemo(
    () => buildYearCalendar(year, eventsByDate),
    [year, eventsByDate],
  );

  const checkedSet = useMemo(() => new Set(checkedDays), [checkedDays]);

  const checkedCount = checkedDays.length;
  const totalDays = calendar.days.length;
  const { percentage, remainingDays } = useMemo(
    () => calculateProgress(checkedCount, totalDays),
    [checkedCount, totalDays],
  );
  const streak = useMemo(
    () => computeStreak(calendar.days, checkedSet),
    [calendar.days, checkedSet],
  );
  const nextDay = useMemo(
    () => calendar.days.find((day) => !checkedSet.has(day.iso)) ?? null,
    [calendar.days, checkedSet],
  );

  const referenceDate = useMemo(() => {
    const today = normaliseDate(new Date());
    if (today.getFullYear() === year) {
      return today;
    }
    return normaliseDate(new Date(year, 0, 1));
  }, [year]);

  const nextEvent = useMemo(
    () => timeline.find((event) => event.endDate >= referenceDate) ?? null,
    [timeline, referenceDate],
  );

  const toggleDay = useCallback(
    (iso, { fill } = {}) => {
      const targetIndex = calendar.indexByIso.get(iso);
      if (typeof targetIndex !== "number") {
        return;
      }

      setCheckedDays((previous) => {
        const next = new Set(previous);
        if (fill) {
          for (let index = 0; index <= targetIndex; index += 1) {
            next.add(calendar.days[index].iso);
          }
          for (let index = targetIndex + 1; index < calendar.days.length; index += 1) {
            next.delete(calendar.days[index].iso);
          }
        } else if (next.has(iso)) {
          next.delete(iso);
        } else {
          next.add(iso);
        }
        return Array.from(next).sort();
      });
      setLastAction(iso);
    },
    [calendar.days, calendar.indexByIso, setCheckedDays, setLastAction],
  );

  const checkAll = useCallback(() => {
    if (calendar.days.length === 0) {
      return;
    }
    setCheckedDays(calendar.days.map((day) => day.iso));
    setLastAction(calendar.days[calendar.days.length - 1].iso);
  }, [calendar.days, setCheckedDays, setLastAction]);

  const clearAll = useCallback(() => {
    setCheckedDays([]);
    setLastAction(null);
  }, [setCheckedDays, setLastAction]);

  const changeYear = useCallback(
    (value) => {
      if (!years.includes(value)) {
        return;
      }
      setStoredYear(value);
    },
    [setStoredYear, years],
  );

  const stats = useMemo(
    () => ({
      year,
      totalDays,
      checkedCount,
      remainingDays,
      percentage,
      streak,
      nextDay,
    }),
    [year, totalDays, checkedCount, remainingDays, percentage, streak, nextDay],
  );

  return {
    year,
    years,
    setYear: changeYear,
    autoFill,
    setAutoFill,
    calendar,
    checkedDays,
    checkedSet,
    stats,
    timeline,
    referenceDate,
    nextEvent,
    toggleDay,
    checkAll,
    clearAll,
    lastAction,
  };
}
