import DayButton from "./DayButton";

export default function MonthSection({
  month,
  weekDays,
  checkedSet,
  autoFill,
  onDayToggle,
  highlightDay,
}) {
  return (
    <section className="rounded-3xl bg-white/90 p-4 shadow-sm ring-1 ring-slate-200">
      <header className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800 sm:text-xl">{month.title}</h2>
        <span className="text-xs uppercase tracking-wide text-slate-400">{month.daysCount} jours</span>
      </header>
      <div className="grid grid-cols-7 gap-2 text-[0.65rem] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">
        {weekDays.map((weekday) => (
          <span key={`${month.index}-${weekday}`} className="text-center">
            {weekday}
          </span>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-2">
        {month.weeks.flatMap((week, weekIndex) =>
          week.map((day, dayIndex) =>
            day ? (
              <DayButton
                key={day.iso}
                day={day}
                isChecked={checkedSet.has(day.iso)}
                autoFill={autoFill}
                onToggle={onDayToggle}
                isHighlighted={highlightDay === day.iso}
              />
            ) : (
              <div key={`empty-${month.index}-${weekIndex}-${dayIndex}`} aria-hidden="true" />
            ),
          ),
        )}
      </div>
    </section>
  );
}
