import DayCell from "./DayCell";

export default function MonthGrid({
  month,
  weekDays,
  checkedSet,
  autoFill,
  onDayAction,
  lastInteracted,
}) {
  const cells = month.weeks.flat();

  return (
    <section className="rounded-3xl bg-white/90 p-4 shadow-sm ring-1 ring-slate-200">
      <header className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800 sm:text-xl">{month.title}</h2>
        <span className="text-xs uppercase tracking-wide text-slate-400">{cells.filter(Boolean).length} jours</span>
      </header>
      <div className="grid grid-cols-7 gap-2 text-[0.65rem] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">
        {weekDays.map((weekday) => (
          <span key={weekday} className="text-center">
            {weekday}
          </span>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-2">
        {cells.map((cell, index) =>
          cell ? (
            <DayCell
              key={cell.iso}
              day={cell}
              isChecked={checkedSet.has(cell.iso)}
              autoFill={autoFill}
              onAction={onDayAction}
              isLastInteracted={lastInteracted === cell.iso}
            />
          ) : (
            <div key={`${month.index}-${index}`} aria-hidden="true" />
          ),
        )}
      </div>
    </section>
  );
}
