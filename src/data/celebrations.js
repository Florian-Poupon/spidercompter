import { formatDateKey, normaliseDate } from "../utils/calendarUtils";

const EVENT_TYPES = {
  holiday: {
    color: "bg-rose-100 text-rose-900 border-rose-300",
  },
  celebration: {
    color: "bg-purple-100 text-purple-900 border-purple-300",
  },
  vacation: {
    color: "bg-emerald-100 text-emerald-900 border-emerald-300",
  },
};

const FESTIVE_EVENTS = [
  {
    id: "new-year",
    label: "Jour de l'An",
    month: 1,
    day: 1,
    icon: "🎆",
    description: "On commence l'année avec de bonnes résolutions !",
    type: "holiday",
  },
  {
    id: "valentines-day",
    label: "Saint-Valentin",
    month: 2,
    day: 14,
    icon: "💝",
    description: "Une dose d'amour au coeur de l'hiver.",
    type: "celebration",
  },
  {
    id: "labour-day",
    label: "Fête du Travail",
    month: 5,
    day: 1,
    icon: "🌼",
    description: "On offre du muguet et on se repose !",
    type: "holiday",
  },
  {
    id: "victory-day",
    label: "Victoire 1945",
    month: 5,
    day: 8,
    icon: "🕊️",
    description: "On se souvient de la paix retrouvée.",
    type: "holiday",
  },
  {
    id: "music-day",
    label: "Fête de la Musique",
    month: 6,
    day: 21,
    icon: "🎶",
    description: "Les rues se transforment en scène géante !",
    type: "celebration",
  },
  {
    id: "bastille-day",
    label: "Fête Nationale",
    month: 7,
    day: 14,
    icon: "🎇",
    description: "Bal des pompiers, défilé et feu d'artifice.",
    type: "holiday",
  },
  {
    id: "assumption",
    label: "Assomption",
    month: 8,
    day: 15,
    icon: "☀️",
    description: "Un jour férié idéal pour profiter de l'été.",
    type: "holiday",
  },
  {
    id: "halloween",
    label: "Halloween",
    month: 10,
    day: 31,
    icon: "🎃",
    description: "Sorcières, citrouilles et bonbons à gogo !",
    type: "celebration",
  },
  {
    id: "all-saints",
    label: "Toussaint",
    month: 11,
    day: 1,
    icon: "🍂",
    description: "On pense à nos proches autour d'un bon chocolat chaud.",
    type: "holiday",
  },
  {
    id: "armistice",
    label: "Armistice",
    month: 11,
    day: 11,
    icon: "🕯️",
    description: "On honore la mémoire de 1918.",
    type: "holiday",
  },
  {
    id: "christmas",
    label: "Noël",
    month: 12,
    day: 25,
    icon: "🎄",
    description: "On partage un repas magique en famille.",
    type: "holiday",
  },
  {
    id: "new-years-eve",
    label: "Saint-Sylvestre",
    month: 12,
    day: 31,
    icon: "🥂",
    description: "On clôture l'année avec une fête mémorable !",
    type: "celebration",
  },
];

const ZONE_A_VACATIONS = [
  {
    id: "zone-a-xmas-2023",
    label: "Vacances de Noël (Zone A)",
    start: "2023-12-23",
    end: "2024-01-08",
    icon: "🎁",
    description: "On profite de la magie des fêtes.",
  },
  {
    id: "zone-a-winter-2024",
    label: "Vacances d'hiver (Zone A)",
    start: "2024-02-17",
    end: "2024-03-04",
    icon: "⛷️",
    description: "Direction la montagne ou les grasses matinées !",
  },
  {
    id: "zone-a-spring-2024",
    label: "Vacances de printemps (Zone A)",
    start: "2024-04-13",
    end: "2024-04-29",
    icon: "🌸",
    description: "On voit la nature renaître.",
  },
  {
    id: "zone-a-summer-2024",
    label: "Vacances d'été (Zone A)",
    start: "2024-07-06",
    end: "2024-09-01",
    icon: "🏖️",
    description: "La grande pause estivale !",
  },
  {
    id: "zone-a-allsaints-2024",
    label: "Vacances de la Toussaint (Zone A)",
    start: "2024-10-19",
    end: "2024-11-04",
    icon: "🍁",
    description: "C'est le moment de ressortir les plaids.",
  },
  {
    id: "zone-a-xmas-2024",
    label: "Vacances de Noël (Zone A)",
    start: "2024-12-21",
    end: "2025-01-06",
    icon: "🎁",
    description: "Encore plus de cadeaux et de chocolat chaud !",
  },
  {
    id: "zone-a-winter-2025",
    label: "Vacances d'hiver (Zone A)",
    start: "2025-02-15",
    end: "2025-03-03",
    icon: "⛸️",
    description: "On glisse, on skie et on s'amuse sous la neige.",
  },
  {
    id: "zone-a-spring-2025",
    label: "Vacances de printemps (Zone A)",
    start: "2025-04-12",
    end: "2025-04-28",
    icon: "🌷",
    description: "Parfait pour chasse aux oeufs et balades.",
  },
  {
    id: "zone-a-summer-2025",
    label: "Vacances d'été (Zone A)",
    start: "2025-07-05",
    end: "2025-09-01",
    icon: "🌊",
    description: "On fait le plein de soleil et de souvenirs.",
  },
  {
    id: "zone-a-allsaints-2025",
    label: "Vacances de la Toussaint (Zone A)",
    start: "2025-10-18",
    end: "2025-11-03",
    icon: "🍂",
    description: "Balades en forêt et citrouilles sculptées.",
  },
  {
    id: "zone-a-xmas-2025",
    label: "Vacances de Noël (Zone A)",
    start: "2025-12-20",
    end: "2026-01-05",
    icon: "🎁",
    description: "On termine l'année en beauté.",
  },
];

function createEventInstance(event, year) {
  const date = new Date(year, event.month - 1, event.day);
  const iso = formatDateKey(date);
  return {
    id: `${event.id}-${year}`,
    type: event.type,
    label: event.label,
    icon: event.icon,
    description: event.description,
    colorClass: EVENT_TYPES[event.type]?.color ?? "bg-sky-100 text-sky-900 border-sky-300",
    start: iso,
    end: iso,
    isRange: false,
    original: event,
  };
}

function createVacationInstance(vacation) {
  const start = normaliseDate(vacation.start);
  const end = normaliseDate(vacation.end);
  return {
    id: vacation.id,
    type: "vacation",
    label: vacation.label,
    icon: vacation.icon,
    description: vacation.description,
    colorClass: EVENT_TYPES.vacation.color,
    start: formatDateKey(start),
    end: formatDateKey(end),
    isRange: true,
    original: vacation,
    startDate: start,
    endDate: end,
  };
}

export function getCelebrationEvents(year) {
  const startOfYear = normaliseDate(new Date(year, 0, 1));
  const endOfYear = normaliseDate(new Date(year, 11, 31));

  const eventsByDate = new Map();
  const timeline = [];

  FESTIVE_EVENTS.forEach((event) => {
    const instance = createEventInstance(event, year);
    timeline.push(instance);
    eventsByDate.set(instance.start, [instance, ...(eventsByDate.get(instance.start) ?? [])]);
  });

  ZONE_A_VACATIONS.forEach((vacation) => {
    const instance = createVacationInstance(vacation);
    const { startDate, endDate } = instance;

    if (endDate < startOfYear || startDate > endOfYear) {
      return;
    }

    const effectiveStart = startDate < startOfYear ? startOfYear : startDate;
    const effectiveEnd = endDate > endOfYear ? endOfYear : endDate;

    timeline.push({
      ...instance,
      start: formatDateKey(effectiveStart),
      end: formatDateKey(effectiveEnd),
    });

    for (let cursor = new Date(effectiveStart); cursor <= effectiveEnd; cursor.setDate(cursor.getDate() + 1)) {
      const current = formatDateKey(cursor);
      const list = eventsByDate.get(current) ?? [];
      eventsByDate.set(current, [
        {
          ...instance,
          start: formatDateKey(effectiveStart),
          end: formatDateKey(effectiveEnd),
        },
        ...list,
      ]);
    }
  });

  const sortedTimeline = timeline
    .map((event) => ({
      ...event,
      startDate: normaliseDate(event.start),
      endDate: normaliseDate(event.end),
    }))
    .sort((a, b) => a.startDate - b.startDate);

  return {
    eventsByDate,
    timeline: sortedTimeline,
  };
}

export function describeEventRange(event) {
  const startDate = normaliseDate(event.start);

  if (!event.isRange || Number.isNaN(startDate.getTime())) {
    const dateLabel = Number.isNaN(startDate.getTime())
      ? ""
      : startDate.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
    return `${event.label}${dateLabel ? ` – le ${dateLabel}` : ""}`.trim();
  }

  const endDate = normaliseDate(event.end);
  if (Number.isNaN(endDate.getTime())) {
    return event.label;
  }

  const sameMonth =
    startDate.getFullYear() === endDate.getFullYear() && startDate.getMonth() === endDate.getMonth();

  const startLabel = startDate.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
  const endLabel = endDate.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });

  if (sameMonth) {
    return `${event.label} – du ${startLabel} au ${endLabel}`;
  }

  const startLabelWithMonth = startDate.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
  const endLabelWithMonth = endDate.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
  return `${event.label} – du ${startLabelWithMonth} au ${endLabelWithMonth}`;
}

