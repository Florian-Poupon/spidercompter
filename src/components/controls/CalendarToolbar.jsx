export default function CalendarToolbar({
  years,
  selectedYear,
  onYearChange,
  autoFill,
  onAutoFillChange,
  onCheckAll,
  onClearAll,
  checkedCount,
  totalDays,
}) {
  const allChecked = totalDays > 0 && checkedCount === totalDays;
  const noneChecked = checkedCount === 0;

  return (
    <section className="flex flex-col gap-4 rounded-3xl bg-white/80 p-4 shadow-sm ring-1 ring-slate-200 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-3">
        <label className="text-sm font-semibold text-slate-600" htmlFor="year-select">
          Année suivie
        </label>
        <select
          id="year-select"
          value={selectedYear}
          onChange={(event) => onYearChange(Number(event.target.value))}
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => onAutoFillChange(!autoFill)}
          className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition ${
            autoFill
              ? "border-indigo-300 bg-indigo-50 text-indigo-700"
              : "border-slate-300 bg-white text-slate-600 hover:border-indigo-300"
          }`}
          aria-pressed={autoFill}
        >
          <span aria-hidden="true">{autoFill ? "⚡" : "📝"}</span>
          {autoFill ? "Cocher en continu" : "Cocher individuellement"}
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onCheckAll}
          className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-300"
          disabled={allChecked}
        >
          Tout cocher
        </button>
        <button
          type="button"
          onClick={onClearAll}
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-rose-300 hover:text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-200"
          disabled={noneChecked}
        >
          Tout décocher
        </button>
      </div>
      <p className="text-xs text-slate-500">
        Astuce : maintiens la touche <kbd className="rounded border border-slate-300 px-1">Maj</kbd> pendant un clic pour inverser le
        mode de coche.
      </p>
    </section>
  );
}
