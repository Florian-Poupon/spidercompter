import { useEffect, useMemo, useState } from "react";
import AnnualCalendar from "./components/AnnualCalendar";
import ControlsPanel from "./components/ControlsPanel";
import EventTimeline from "./components/EventTimeline";
import ProgressOverview from "./components/ProgressOverview";
import { calculateProgress, computeStreak, createCalendar, normaliseDate } from "./utils/calendarUtils";
import { describeEventRange, getCelebrationEvents } from "./data/celebrations";

const AVAILABLE_YEARS = [2024, 2025];
const STORAGE_KEY_PREFIX = "annual-calendar:checked";
const YEAR_KEY = "annual-calendar:selected-year";
const AUTO_FILL_KEY = "annual-calendar:auto-fill";

const fallbackYear = (() => {
  const current = new Date().getFullYear();
  if (AVAILABLE_YEARS.includes(current)) {
    return current;
  }
  return AVAILABLE_YEARS[AVAILABLE_YEARS.length - 1];
})();

function safeGet(key) {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    console.warn("Impossible de lire dans le stockage local", error);
    return null;
  }
}

function safeSet(key, value) {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    console.warn("Impossible d'enregistrer dans le stockage local", error);
  }
}

function getStorageKey(year) {
  return `${STORAGE_KEY_PREFIX}:${year}`;
}

function loadChecked(year) {
  const raw = safeGet(getStorageKey(year));
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((value) => typeof value === "string").sort();
    }
  } catch (error) {
    console.warn("Impossible de parser les jours cochés", error);
  }
  return [];
}

function saveChecked(year, values) {
  safeSet(getStorageKey(year), JSON.stringify(values));
}

function loadAutoFill() {
  const raw = safeGet(AUTO_FILL_KEY);
  if (raw === null) {
    return true;
  }
  return raw === "true";
}

function saveAutoFill(value) {
  safeSet(AUTO_FILL_KEY, value ? "true" : "false");
}

function resolveInitialYear() {
  const stored = safeGet(YEAR_KEY);
  if (stored) {
    const parsed = Number.parseInt(stored, 10);
    if (AVAILABLE_YEARS.includes(parsed)) {
      return parsed;
    }
  }
  const current = new Date().getFullYear();
  if (AVAILABLE_YEARS.includes(current)) {
    return current;
  }
  return fallbackYear;
}

export default function App() {
  const initialYear = resolveInitialYear();
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [checkedDays, setCheckedDays] = useState(() => loadChecked(initialYear));
  const [autoFill, setAutoFill] = useState(() => loadAutoFill());
  const [lastInteracted, setLastInteracted] = useState(null);

  const { eventsByDate, timeline } = useMemo(() => getCelebrationEvents(selectedYear), [selectedYear]);
  const { days, months, dayIndexByIso, weekDays } = useMemo(
    () => createCalendar(selectedYear, eventsByDate),
    [selectedYear, eventsByDate],
  );

  const checkedSet = useMemo(() => new Set(checkedDays), [checkedDays]);
  const totalDays = days.length;
  const checkedCount = checkedDays.length;
  const { percentage, remaining } = calculateProgress(checkedCount, totalDays);
  const streak = computeStreak(days, checkedSet);
  const nextDay = useMemo(() => days.find((day) => !checkedSet.has(day.iso)) ?? null, [days, checkedSet]);

  const referenceDate = useMemo(() => {
    const today = normaliseDate(new Date());
    if (today.getFullYear() === selectedYear) {
      return today;
    }
    return normaliseDate(new Date(selectedYear, 0, 1));
  }, [selectedYear]);

  const nextEvent = useMemo(
    () => timeline.find((event) => new Date(event.end) >= referenceDate) ?? null,
    [timeline, referenceDate],
  );

  useEffect(() => {
    saveChecked(selectedYear, checkedDays);
  }, [selectedYear, checkedDays]);

  useEffect(() => {
    safeSet(YEAR_KEY, String(selectedYear));
  }, [selectedYear]);

  useEffect(() => {
    saveAutoFill(autoFill);
  }, [autoFill]);

  useEffect(() => {
    setCheckedDays(loadChecked(selectedYear));
    setLastInteracted(null);
  }, [selectedYear]);

  useEffect(() => {
    if (!lastInteracted) {
      return undefined;
    }
    const timeout = window.setTimeout(() => setLastInteracted(null), 1200);
    return () => window.clearTimeout(timeout);
  }, [lastInteracted]);

  const handleDayAction = (iso, { fillRange }) => {
    const targetIndex = dayIndexByIso.get(iso);
    if (typeof targetIndex !== "number") {
      return;
    }
    setCheckedDays((previous) => {
      const next = new Set(previous);
      if (fillRange) {
        for (let index = 0; index <= targetIndex; index += 1) {
          next.add(days[index].iso);
        }
        for (let index = targetIndex + 1; index < days.length; index += 1) {
          next.delete(days[index].iso);
        }
      } else if (next.has(iso)) {
        next.delete(iso);
      } else {
        next.add(iso);
      }
      const ordered = Array.from(next).sort();
      return ordered;
    });
    setLastInteracted(iso);
  };

  const handleYearChange = (year) => {
    if (AVAILABLE_YEARS.includes(year)) {
      setSelectedYear(year);
    }
  };

  const handleCheckAll = () => {
    const allDays = days.map((day) => day.iso);
    setCheckedDays(allDays);
    if (allDays.length > 0) {
      setLastInteracted(allDays[allDays.length - 1]);
    }
  };

  const handleUncheckAll = () => {
    setCheckedDays([]);
    setLastInteracted(null);
  };

  return (
    <div className="min-h-screen bg-[#fff9f3] pb-16">
      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <ProgressOverview
          checkedCount={checkedCount}
          totalDays={totalDays}
          remaining={remaining}
          percentage={percentage}
          streak={streak}
          nextDay={nextDay}
        />

        {nextEvent && (
          <aside className="flex flex-col gap-2 rounded-3xl border border-indigo-200 bg-indigo-50/70 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 text-indigo-700">
              <span aria-hidden="true" className="text-3xl">
                {nextEvent.icon}
              </span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide">Prochain temps fort</p>
                <p className="text-base font-bold">{nextEvent.label}</p>
                <p className="text-xs text-indigo-600">{describeEventRange(nextEvent)}</p>
              </div>
            </div>
            <p className="text-xs text-indigo-600">
              Pense à cocher la journée correspondante pour célébrer encore plus !
            </p>
          </aside>
        )}

        <ControlsPanel
          years={AVAILABLE_YEARS}
          selectedYear={selectedYear}
          onYearChange={handleYearChange}
          autoFill={autoFill}
          onAutoFillChange={setAutoFill}
          onCheckAll={handleCheckAll}
          onUncheckAll={handleUncheckAll}
          checkedCount={checkedCount}
          totalDays={totalDays}
        />

        <AnnualCalendar
          months={months}
          weekDays={weekDays}
          checkedSet={checkedSet}
          autoFill={autoFill}
          onDayAction={(iso, options) => handleDayAction(iso, options)}
          lastInteracted={lastInteracted}
        />

        <EventTimeline events={timeline} referenceDate={referenceDate} />
      </main>
    </div>
  );
}
