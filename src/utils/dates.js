const WEEKDAY_LABELS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const MONTH_LABELS = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

function capitalise(word) {
  if (!word) {
    return "";
  }
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function normaliseDate(input) {
  if (input instanceof Date) {
    const copy = new Date(input);
    if (!Number.isNaN(copy.getTime())) {
      copy.setHours(0, 0, 0, 0);
    }
    return copy;
  }

  if (typeof input === "string") {
    const trimmed = input.trim();
    const match = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) {
      const [, year, month, day] = match;
      const date = new Date(Number(year), Number(month) - 1, Number(day));
      date.setHours(0, 0, 0, 0);
      return date;
    }
  }

  const parsed = new Date(input);
  if (!Number.isNaN(parsed.getTime())) {
    parsed.setHours(0, 0, 0, 0);
  }
  return parsed;
}

export function formatIsoDate(date) {
  const normalised = normaliseDate(date);
  if (Number.isNaN(normalised.getTime())) {
    return "";
  }
  const year = normalised.getFullYear();
  const month = `${normalised.getMonth() + 1}`.padStart(2, "0");
  const day = `${normalised.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function buildYearCalendar(year, eventsByDate = new Map()) {
  const startOfYear = normaliseDate(new Date(year, 0, 1));
  const endOfYear = normaliseDate(new Date(year, 11, 31));
  const today = normaliseDate(new Date());

  const days = [];
  const indexByIso = new Map();

  for (let cursor = new Date(startOfYear); cursor <= endOfYear; cursor.setDate(cursor.getDate() + 1)) {
    const current = normaliseDate(cursor);
    const iso = formatIsoDate(current);
    const events = eventsByDate.get(iso) ?? [];
    const weekdayIndex = (current.getDay() + 6) % 7; // convertir en semaine démarrant lundi
    const monthIndex = current.getMonth();

    const hasVacation = events.some((event) => event.type === "vacation");
    const hasCelebration = events.some((event) => event.type !== "vacation");

    const entry = {
      iso,
      date: current,
      dayNumber: current.getDate(),
      monthIndex,
      monthLabel: capitalise(MONTH_LABELS[monthIndex]),
      weekdayIndex,
      weekdayLabel: WEEKDAY_LABELS[weekdayIndex],
      isWeekend: weekdayIndex >= 5,
      isToday: isSameDay(current, today),
      events,
      hasVacation,
      hasCelebration,
      label: current.toLocaleDateString("fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };

    days.push(entry);
    indexByIso.set(iso, days.length - 1);
  }

  const months = MONTH_LABELS.map((monthName, monthIndex) => {
    const monthDays = days.filter((day) => day.monthIndex === monthIndex);

    if (monthDays.length === 0) {
      return {
        index: monthIndex,
        label: capitalise(monthName),
        title: `${capitalise(monthName)} ${year}`,
        daysCount: 0,
        weeks: [],
      };
    }

    const weeks = [];
    let currentWeek = new Array(monthDays[0].weekdayIndex).fill(null);

    monthDays.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }

    return {
      index: monthIndex,
      label: capitalise(monthName),
      title: `${capitalise(monthName)} ${year}`,
      daysCount: monthDays.length,
      weeks,
    };
  });

  return {
    year,
    days,
    months,
    weekDays: WEEKDAY_LABELS,
    indexByIso,
  };
}

export function calculateProgress(checkedCount, totalDays) {
  if (totalDays <= 0) {
    return {
      percentage: 0,
      remainingDays: 0,
    };
  }

  const safeChecked = Math.min(Math.max(checkedCount, 0), totalDays);
  const remainingDays = Math.max(totalDays - safeChecked, 0);
  const percentage = Math.round((safeChecked / totalDays) * 100);

  return {
    percentage,
    remainingDays,
  };
}

export function computeStreak(days, checkedSet) {
  let streak = 0;
  for (let index = 0; index < days.length; index += 1) {
    const day = days[index];
    if (!checkedSet.has(day.iso)) {
      break;
    }
    streak += 1;
  }
  return streak;
}

export function describeEventPeriod(event, locale = "fr-FR") {
  if (!event) {
    return "";
  }

  const { startDate, endDate, isRange, label } = event;
  const safeStart = normaliseDate(startDate);
  const safeEnd = normaliseDate(endDate);

  if (Number.isNaN(safeStart.getTime())) {
    return label;
  }

  if (!isRange || Number.isNaN(safeEnd.getTime()) || safeStart.getTime() === safeEnd.getTime()) {
    const dateLabel = safeStart.toLocaleDateString(locale, { day: "numeric", month: "long" });
    return `${label} – ${dateLabel}`;
  }

  const sameMonth =
    safeStart.getFullYear() === safeEnd.getFullYear() && safeStart.getMonth() === safeEnd.getMonth();

  const options = { day: "numeric", month: "long" };
  const startLabel = safeStart.toLocaleDateString(locale, options);
  const endLabel = safeEnd.toLocaleDateString(locale, options);

  if (sameMonth) {
    return `${label} – du ${startLabel} au ${endLabel}`;
  }

  return `${label} – du ${startLabel} au ${endLabel}`;
}

export const WEEK_LABELS = WEEKDAY_LABELS;
export const MONTH_NAMES = MONTH_LABELS.map(capitalise);
