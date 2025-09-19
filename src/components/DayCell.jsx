import { useMemo } from "react";

function buildEventTooltip(event) {
  if (!event) {
    return "";
  }
  if (event.isRange) {
    return `${event.label} – du ${new Date(event.start).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })} au ${new Date(event.end).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}`;
  }
  const dateLabel = new Date(event.start).toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
  return `${event.label} – ${dateLabel}`;
}

export default function DayCell({ day, isChecked, autoFill, onAction, isLastInteracted }) {
  const { iso, day: dayNumber, weekdayLabel, events, label } = day;

  const { backgroundClass, borderClass, textClass } = useMemo(() => {
    if (isChecked) {
      return {
        backgroundClass: "bg-slate-300", // greyed out when checked
        borderClass: "border-slate-400",
        textClass: "text-slate-600 line-through decoration-slate-500", // show strikethrough
      };
    }

    if (day.hasVacation && day.hasCelebration) {
      return {
        backgroundClass: "bg-gradient-to-br from-emerald-50 via-white to-rose-50",
        borderClass: "border-emerald-300",
        textClass: "text-slate-900",
      };
    }

    if (day.hasVacation) {
      return {
        backgroundClass: "bg-emerald-50",
        borderClass: "border-emerald-200",
        textClass: "text-emerald-900",
      };
    }

    if (day.hasCelebration) {
      return {
        backgroundClass: "bg-rose-50",
        borderClass: "border-rose-200",
        textClass: "text-rose-900",
      };
    }

    if (day.isWeekend) {
      return {
        backgroundClass: "bg-amber-50",
        borderClass: "border-amber-200",
        textClass: "text-amber-900",
      };
    }

    return {
      backgroundClass: "bg-white",
      borderClass: "border-slate-200",
      textClass: "text-slate-900",
    };
  }, [day.hasCelebration, day.hasVacation, day.isWeekend, isChecked]);

  const todayRing = !isChecked && day.isToday ? "ring-2 ring-offset-2 ring-indigo-300" : "";
  const interactionRing = isLastInteracted ? "ring-2 ring-offset-2 ring-rose-400" : "";

  const baseClasses = [
    "relative flex flex-col gap-1 rounded-xl border p-2 text-xs sm:text-sm transition-all duration-150", // layout
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400", // focus style
    backgroundClass,
    borderClass,
    textClass,
    todayRing,
    interactionRing,
    isChecked ? "shadow-none" : "shadow-sm hover:-translate-y-0.5 hover:shadow-md",
  ]
    .filter(Boolean)
    .join(" ");

  const handleClick = (event) => {
    const fillRange = event.shiftKey ? !autoFill : autoFill;
    onAction(iso, { fillRange });
  };

  const ariaPressed = isChecked ? "true" : "false";

  const eventBadges = events.slice(0, 2).map((event) => (
    <span
      key={`${event.id}-${iso}`}
      className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.65rem] font-semibold ${event.colorClass}`}
      title={`${event.label}. ${event.description}`.trim() || buildEventTooltip(event)}
    >
      <span aria-hidden="true">{event.icon}</span>
      <span className="truncate max-w-[72px]">{event.label}</span>
    </span>
  ));

  const extraCount = events.length - eventBadges.length;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={ariaPressed}
      aria-label={`${label}${events.length ? ` – ${events.map((event) => event.label).join(", ")}` : ""}`}
      className={baseClasses}
    >
      <div className="flex items-center justify-between text-sm font-semibold">
        <span className="text-lg font-bold sm:text-xl">{dayNumber}</span>
        <span className="text-[0.65rem] uppercase tracking-wide text-slate-500">{weekdayLabel}</span>
      </div>
      {events.length > 0 && <div className="flex flex-wrap justify-center gap-1">{eventBadges}</div>}
      {extraCount > 0 && (
        <span className="text-[0.6rem] text-slate-500">+{extraCount} événement(s)</span>
      )}
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
