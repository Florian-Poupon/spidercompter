import React from "react";
import CalendarDay from "./CalendarDay";

// Fonction utilitaire pour découper un mois en semaines alignées (avec cases vides)
function getCalendarGrid(days) {
  if (!days || !days.length) return [];
  const firstDay = days[0];
  const lastDay = days[days.length - 1];

  // dayOfWeek: 0 = lundi, 6 = dimanche
  const startWeekDay = firstDay.dayOfWeek;
  const endWeekDay = lastDay.dayOfWeek;

  const emptyBefore = Array.from({ length: startWeekDay }, (_, i) => ({ empty: true, key: `empty-before-${i}` }));
  const emptyAfter = Array.from({ length: 6 - endWeekDay }, (_, i) => ({ empty: true, key: `empty-after-${i}` }));

  const fullGrid = [...emptyBefore, ...days, ...emptyAfter];
  const weeks = [];
  for (let i = 0; i < fullGrid.length; i += 7) {
    weeks.push(fullGrid.slice(i, i + 7));
  }
  return weeks;
}

export default function CalendarMonth({ month, onCheck }) {
  const weeks = getCalendarGrid(month.days);

  return (
    <div className="mb-10 font-[var(--font-dynapuff)]">
      {/* Titre du mois */}
      <div className="sticky top-0 z-30 flex justify-center mb-5">
        <div className="bg-spidey-blue-soft text-white w-full max-w-[350px] items-center text-center text-3xl font-extrabold rounded-full px-8 py-3 shadow">
          {month.label.charAt(0).toUpperCase() + month.label.slice(1)}
        </div>
      </div>
      {/* Grille calendrier en mode semainier */}
      <div className="flex flex-col gap-12 items-center w-full">
        {weeks.map((week, i) => (
          <div key={i} className="flex flex-col gap-2 items-center w-full">
            {/* Lundi à vendredi */}
            <div className="grid grid-cols-5 gap-2  max-w-xl mx-auto">
              {week
                .slice(0, 5)
                .map((day, idx) =>
                  day.empty ? (
                    <div key={day.key} className="aspect-square w-full h-full" />
                  ) : (
                    <CalendarDay key={day.date.toISOString()} day={day} badge={day.badge} onClick={() => !day.isChecked && onCheck(day.idx)} />
                  )
                )}
            </div>
            {/* Samedi et dimanche */}
            <div className="grid grid-cols-5 gap-2  max-w-xl mx-auto">
              {week
                .slice(5)
                .map((day, idx) =>
                  day.empty ? (
                    <div key={day.key} className="aspect-square w-full h-full" />
                  ) : (
                    <CalendarDay key={day.date.toISOString()} day={day} badge={day.badge} onClick={() => !day.isChecked && onCheck(day.idx)} />
                  )
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
