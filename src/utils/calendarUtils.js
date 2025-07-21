// Génère un tableau d'objets { date: Date, label: 'J-xx', isWeekend, month, day, dayOfWeek, monthLabel, dateLabel }
export function generateCalendarDays(startDate, endDate) {
  const days = [];
  let current = new Date(startDate);
  let count = 0;
  const totalDays = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
  while (current <= endDate) {
    const dayOfWeek = (current.getDay() + 6) % 7; // 0 = lundi, 6 = dimanche
    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;
    days.push({
      date: new Date(current),
      label: `J-${totalDays - count}`,
      isWeekend,
      month: current.getMonth(),
      day: current.getDate(),
      dayOfWeek,
      monthLabel: current.toLocaleString("fr-FR", { month: "long" }),
      dateLabel: current.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }),
    });
    current.setDate(current.getDate() + 1);
    count++;
  }
  return days;
}

// Regroupe les jours par mois
export function groupDaysByMonth(days) {
  const months = {};
  days.forEach((d) => {
    if (!months[d.month]) {
      months[d.month] = {
        label: d.monthLabel.charAt(0).toUpperCase() + d.monthLabel.slice(1),
        days: [],
      };
    }
    months[d.month].days.push(d);
  });
  return Object.values(months);
}

// Jours de la semaine (commence par lundi)
export const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
