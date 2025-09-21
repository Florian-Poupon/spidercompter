import { formatIsoDate, normaliseDate } from "../utils/dates";

const EVENT_TYPE_STYLES = {
  holiday: "border-rose-300 bg-rose-100 text-rose-900",
  celebration: "border-purple-300 bg-purple-100 text-purple-900",
  vacation: "border-emerald-300 bg-emerald-100 text-emerald-900",
};

const EVENT_TYPE_ORDER = {
  holiday: 0,
  celebration: 1,
  vacation: 2,
};

const FIXED_FESTIVE_DAYS = [
  {
    id: "new-year",
    label: "Jour de l'An",
    month: 1,
    day: 1,
    icon: "🎆",
    description: "On démarre l'année avec plein de nouvelles résolutions !",
    type: "holiday",
  },
  {
    id: "galette",
    label: "Galette des Rois",
    month: 1,
    day: 6,
    icon: "👑",
    description: "Qui trouvera la fève cette année ?",
    type: "celebration",
  },
  {
    id: "valentine",
    label: "Saint-Valentin",
    month: 2,
    day: 14,
    icon: "💖",
    description: "Une belle occasion de dire je t'aime.",
    type: "celebration",
  },
  {
    id: "labour",
    label: "Fête du Travail",
    month: 5,
    day: 1,
    icon: "🌼",
    description: "On offre du muguet et on se repose !",
    type: "holiday",
  },
  {
    id: "victory",
    label: "Victoire 1945",
    month: 5,
    day: 8,
    icon: "🕊️",
    description: "On célèbre la paix retrouvée.",
    type: "holiday",
  },
  {
    id: "music",
    label: "Fête de la Musique",
    month: 6,
    day: 21,
    icon: "🎶",
    description: "Concerts partout dans les rues !",
    type: "celebration",
  },
  {
    id: "national",
    label: "Fête Nationale",
    month: 7,
    day: 14,
    icon: "🎇",
    description: "Défilé, bal des pompiers et feu d'artifice.",
    type: "holiday",
  },
  {
    id: "assomption",
    label: "Assomption",
    month: 8,
    day: 15,
    icon: "☀️",
    description: "Un jour férié estival pour profiter du soleil.",
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
    id: "toussaint",
    label: "Toussaint",
    month: 11,
    day: 1,
    icon: "🍂",
    description: "On pense à nos proches autour d'un chocolat chaud.",
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

const YEAR_SPECIFIC_DAYS = {
  2024: [
    {
      id: "easter-2024",
      label: "Pâques",
      date: "2024-03-31",
      icon: "🥚",
      description: "Chasse aux œufs en famille.",
      type: "celebration",
    },
    {
      id: "easter-monday-2024",
      label: "Lundi de Pâques",
      date: "2024-04-01",
      icon: "🐣",
      description: "Un lundi férié pour prolonger le week-end.",
      type: "holiday",
    },
    {
      id: "ascension-2024",
      label: "Ascension",
      date: "2024-05-09",
      icon: "⛪",
      description: "Un pont parfait pour se reposer.",
      type: "holiday",
    },
    {
      id: "pentecost-2024",
      label: "Lundi de Pentecôte",
      date: "2024-05-20",
      icon: "🕊️",
      description: "Dernier grand week-end du printemps.",
      type: "holiday",
    },
    {
      id: "mothers-day-2024",
      label: "Fête des Mères",
      date: "2024-05-26",
      icon: "💐",
      description: "Un bouquet et un gros câlin pour maman.",
      type: "celebration",
    },
    {
      id: "fathers-day-2024",
      label: "Fête des Pères",
      date: "2024-06-16",
      icon: "🧢",
      description: "Barbecue, cadeaux et bonne humeur.",
      type: "celebration",
    },
  ],
  2025: [
    {
      id: "easter-2025",
      label: "Pâques",
      date: "2025-04-20",
      icon: "🥚",
      description: "On cache les œufs dans le jardin !",
      type: "celebration",
    },
    {
      id: "easter-monday-2025",
      label: "Lundi de Pâques",
      date: "2025-04-21",
      icon: "🐣",
      description: "Un lundi férié pour savourer les chocolats.",
      type: "holiday",
    },
    {
      id: "ascension-2025",
      label: "Ascension",
      date: "2025-05-29",
      icon: "⛪",
      description: "L'occasion de prévoir un grand week-end.",
      type: "holiday",
    },
    {
      id: "pentecost-2025",
      label: "Lundi de Pentecôte",
      date: "2025-06-09",
      icon: "🕊️",
      description: "On prolonge la douceur du printemps.",
      type: "holiday",
    },
    {
      id: "mothers-day-2025",
      label: "Fête des Mères",
      date: "2025-05-25",
      icon: "💐",
      description: "Des dessins, des poèmes et beaucoup d'amour.",
      type: "celebration",
    },
    {
      id: "fathers-day-2025",
      label: "Fête des Pères",
      date: "2025-06-15",
      icon: "🧢",
      description: "On fête tous les papas !",
      type: "celebration",
    },
  ],
};

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
    description: "Parfait pour chasse aux œufs et balades.",
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

function slugify(label) {
  return label
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^\w]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "")
    .toLowerCase();
}

function createSingleDayEvent(definition, date, { withYearSuffix = true } = {}) {
  const startDate = normaliseDate(date);
  if (Number.isNaN(startDate.getTime())) {
    return null;
  }

  const baseId = definition.id ?? slugify(definition.label);
  const id = withYearSuffix ? `${baseId}-${startDate.getFullYear()}` : baseId;

  return {
    id,
    label: definition.label,
    icon: definition.icon,
    description: definition.description ?? "",
    type: definition.type,
    colorClass: EVENT_TYPE_STYLES[definition.type] ?? "border-sky-300 bg-sky-100 text-sky-900",
    isRange: false,
    startDate,
    endDate: startDate,
    startIso: formatIsoDate(startDate),
    endIso: formatIsoDate(startDate),
    order: EVENT_TYPE_ORDER[definition.type] ?? 99,
    source: definition,
  };
}

function createVacationEvent(vacation, startDate, endDate) {
  const safeStart = normaliseDate(startDate);
  const safeEnd = normaliseDate(endDate);

  return {
    id: vacation.id,
    label: vacation.label,
    icon: vacation.icon,
    description: vacation.description ?? "",
    type: "vacation",
    colorClass: EVENT_TYPE_STYLES.vacation,
    isRange: true,
    startDate: safeStart,
    endDate: safeEnd,
    startIso: formatIsoDate(safeStart),
    endIso: formatIsoDate(safeEnd),
    order: EVENT_TYPE_ORDER.vacation,
    source: vacation,
  };
}

function addEventToMap(event, map) {
  for (let cursor = new Date(event.startDate); cursor <= event.endDate; cursor.setDate(cursor.getDate() + 1)) {
    const current = normaliseDate(cursor);
    const iso = formatIsoDate(current);
    const list = map.get(iso);
    if (list) {
      list.push(event);
    } else {
      map.set(iso, [event]);
    }
  }
}

function sortEvents(list) {
  return [...list].sort((a, b) => {
    const startDiff = a.startDate - b.startDate;
    if (startDiff !== 0) {
      return startDiff;
    }

    if (a.order !== b.order) {
      return a.order - b.order;
    }

    if (a.endDate && b.endDate) {
      const endDiff = a.endDate - b.endDate;
      if (endDiff !== 0) {
        return endDiff;
      }
    }

    return a.label.localeCompare(b.label, "fr");
  });
}

export function generateEventsForYear(year) {
  const startOfYear = normaliseDate(new Date(year, 0, 1));
  const endOfYear = normaliseDate(new Date(year, 11, 31));

  const events = [];

  FIXED_FESTIVE_DAYS.forEach((definition) => {
    const date = new Date(year, definition.month - 1, definition.day);
    const event = createSingleDayEvent(definition, date, { withYearSuffix: true });
    if (event) {
      events.push(event);
    }
  });

  (YEAR_SPECIFIC_DAYS[year] ?? []).forEach((definition) => {
    const event = createSingleDayEvent(definition, definition.date, { withYearSuffix: false });
    if (event) {
      events.push(event);
    }
  });

  ZONE_A_VACATIONS.forEach((vacation) => {
    const start = normaliseDate(vacation.start);
    const end = normaliseDate(vacation.end);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return;
    }

    if (end < startOfYear || start > endOfYear) {
      return;
    }

    const effectiveStart = start < startOfYear ? new Date(startOfYear) : new Date(start);
    const effectiveEnd = end > endOfYear ? new Date(endOfYear) : new Date(end);

    const event = createVacationEvent(vacation, effectiveStart, effectiveEnd);
    events.push(event);
  });

  const timeline = sortEvents(events);
  const eventsByDate = new Map();

  timeline.forEach((event) => {
    addEventToMap(event, eventsByDate);
  });

  eventsByDate.forEach((list, iso) => {
    eventsByDate.set(iso, sortEvents(list));
  });

  return {
    eventsByDate,
    timeline,
  };
}
