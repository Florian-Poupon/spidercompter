import { describeEventPeriod } from "../../utils/dates";

export default function TimelineItem({ event, referenceDate }) {
  const isPast = event.endDate < referenceDate;
  const isCurrent = event.startDate <= referenceDate && event.endDate >= referenceDate;

  const status = isPast ? "Terminé" : isCurrent ? "En cours" : "À venir";
  const badgeClass = isPast
    ? "border-slate-300 bg-slate-100 text-slate-500"
    : isCurrent
    ? "border-indigo-300 bg-indigo-100 text-indigo-700"
    : event.colorClass;

  const cardClass = [
    "flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm transition",
    isPast ? "opacity-80" : "hover:-translate-y-0.5 hover:shadow-md",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <li className={cardClass}>
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className="text-2xl">
          {event.icon}
        </span>
        <div className="flex flex-col gap-1">
          <span className="text-base font-semibold text-slate-800">{event.label}</span>
          <span className={`inline-flex w-max items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${badgeClass}`}>
            {status}
          </span>
        </div>
      </div>
      <p className="text-xs font-medium text-slate-500">{describeEventPeriod(event)}</p>
      {event.description && <p className="text-sm text-slate-600">{event.description}</p>}
    </li>
  );
}
