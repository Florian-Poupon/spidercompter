import { useMemo } from "react";
import { describeEventPeriod } from "../../utils/dates";

export default function DayButton({ day, isChecked, autoFill, onToggle, isHighlighted }) {
  const { iso, dayNumber, weekdayLabel, events } = day;

  const statusClasses = useMemo(() => {
    if (isChecked) {
      return {
        background: "bg-slate-200",
        border: "border-slate-400",
        text: "text-slate-600 line-through decoration-slate-500",
      };
    }

    if (day.hasVacation && day.hasCelebration) {
      return {
        background: "bg-gradient-to-br from-emerald-50 via-white to-rose-50",
        border: "border-emerald-300",
        text: "text-slate-900",
      };
    }

    if (day.hasVacation) {
      return {
        background: "bg-emerald-50",
        border: "border-emerald-200",
        text: "text-emerald-900",
      };
    }

    if (day.hasCelebration) {
      return {
        background: "bg-rose-50",
        border: "border-rose-200",
        text: "text-rose-900",
      };
    }

    if (day.isWeekend) {
      return {
        background: "bg-amber-50",
        border: "border-amber-200",
        text: "text-amber-900",
      };
    }

    return {
      background: "bg-white",
      border: "border-slate-200",
      text: "text-slate-900",
    };
  }, [day.hasCelebration, day.hasVacation, day.isWeekend, isChecked]);

  const todayRing = !isChecked && day.isToday ? "ring-2 ring-offset-2 ring-indigo-300" : "";
  const highlightRing = isHighlighted ? "ring-2 ring-offset-2 ring-rose-400" : "";

  const baseClasses = [
    "relative flex min-h-[88px] flex-col gap-1 rounded-xl border p-2 text-xs sm:text-sm transition", // layout
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2", // focus styles
    statusClasses.background,
    statusClasses.border,
    statusClasses.text,
    todayRing,
    highlightRing,
    isChecked ? "shadow-none" : "shadow-sm hover:-translate-y-0.5 hover:shadow-md",
  ]
    .filter(Boolean)
    .join(" ");

  const handleClick = (event) => {
    const fill = event.shiftKey ? !autoFill : autoFill;
    onToggle(iso, { fill });
  };

  const ariaPressed = isChecked ? "true" : "false";

  const badges = events.slice(0, 2).map((event) => (
    <span
      key={`${event.id}-${iso}`}
      className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.65rem] font-semibold ${event.colorClass}`}
      title={describeEventPeriod(event)}
    >
      <span aria-hidden="true">{event.icon}</span>
      <span className="max-w-[80px] truncate">{event.label}</span>
    </span>
  ));

  const extraCount = Math.max(events.length - badges.length, 0);

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={ariaPressed}
      aria-label={`${day.label}${
        events.length ? ` – ${events.map((event) => event.label).join(", ")}` : ""
      }`}
      className={baseClasses}
    >
      <div className="flex items-center justify-between text-sm font-semibold">
        <span className="text-lg font-bold sm:text-xl">{dayNumber}</span>
        <span className="text-[0.65rem] uppercase tracking-wide text-slate-500">{weekdayLabel}</span>
      </div>
      {events.length > 0 && <div className="flex flex-wrap justify-center gap-1">{badges}</div>}
      {extraCount > 0 && <span className="text-[0.6rem] text-slate-500">+{extraCount} événement(s)</span>}
      <span className="sr-only">
        {isChecked
          ? "Jour déjà validé. Cliquez pour le décocher."
          : autoFill
          ? "Cliquez pour valider ce jour et tous les précédents. Maintenez Maj pour ne cocher que cette case."
          : "Cliquez pour valider uniquement ce jour. Maintenez Maj pour cocher aussi les jours précédents."}
      </span>
    </button>
  );
}
