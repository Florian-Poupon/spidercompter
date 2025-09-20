const WEEK_DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const MONTHS = [
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

export function formatDateKey(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function normaliseDate(value) {
  if (typeof value === "string") {
    const match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) {
      const [, year, month, day] = match;
      const normalised = new Date(Number(year), Number(month) - 1, Number(day));
      normalised.setHours(0, 0, 0, 0);
      return normalised;
    }
  }

  const normalised = new Date(value);
  if (!Number.isNaN(normalised.getTime())) {
    normalised.setHours(0, 0, 0, 0);
  }
  return normalised;
}

function buildDay(date, events = []) {
  const weekday = (date.getDay() + 6) % 7; // 0 = lundi
  const monthIndex = date.getMonth();
  const monthName = MONTHS[monthIndex];

  const isWeekend = weekday >= 5;
  const hasVacation = events.some((event) => event.type === "vacation");
  const hasCelebration = events.some((event) => event.type !== "vacation");

  const label = date.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return {
    date,
    iso: formatDateKey(date),
    day: date.getDate(),
    month: monthIndex,
    monthName,
    weekday,
    weekdayLabel: WEEK_DAYS[weekday],
    isWeekend,
    isToday: isSameDate(date, new Date()),
    events,
    hasVacation,
    hasCelebration,
    label,
  };
}

function isSameDate(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function capitalise(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function createCalendar(year, eventsByDate = new Map()) {
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year, 11, 31);
  const days = [];

  for (let cursor = new Date(startOfYear); cursor <= endOfYear; cursor.setDate(cursor.getDate() + 1)) {
    const current = new Date(cursor);
    current.setHours(0, 0, 0, 0);
    const iso = formatDateKey(current);
    const events = eventsByDate.get(iso) ?? [];
    days.push(buildDay(current, events));
  }

  const dayIndexByIso = new Map(days.map((day, index) => [day.iso, index]));

  const months = MONTHS.map((monthName, monthIndex) => {
    const monthDays = days.filter((day) => day.month === monthIndex);
    const weeks = [];
    if (monthDays.length === 0) {
      return {
        index: monthIndex,
        name: capitalise(monthName),
        title: `${capitalise(monthName)} ${year}`,
        weeks,
      };
    }

    let week = [];
    const firstWeekday = monthDays[0].weekday;
    for (let i = 0; i < firstWeekday; i += 1) {
      week.push(null);
    }

    monthDays.forEach((day) => {
      week.push(day);
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    });

    if (week.length > 0) {
      while (week.length < 7) {
        week.push(null);
      }
      weeks.push(week);
    }

    return {
      index: monthIndex,
      name: capitalise(monthName),
      title: `${capitalise(monthName)} ${year}`,
      weeks,
    };
  });

  return {
    days,
    months,
    dayIndexByIso,
    weekDays: WEEK_DAYS,
  };
}

export function calculateProgress(checkedCount, totalDays) {
  if (totalDays <= 0) {
    return {
      percentage: 0,
      remaining: 0,
    };
  }

  const clampedChecked = Math.min(checkedCount, totalDays);
  const remaining = Math.max(totalDays - clampedChecked, 0);
  const percentage = Math.round((clampedChecked / totalDays) * 100);

  return {
    percentage,
    remaining,
  };
}

export function computeStreak(days, checkedSet) {
  let streak = 0;
  for (let i = 0; i < days.length; i += 1) {
    const day = days[i];
    if (!checkedSet.has(day.iso)) {
      break;
    }
    streak += 1;
  }
  return streak;
}

