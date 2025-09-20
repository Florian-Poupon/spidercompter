import { describeEventRange } from "../data/celebrations";
import { normaliseDate } from "../utils/calendarUtils";

export default function EventTimeline({ events, referenceDate }) {
  return (
    <section className="rounded-3xl bg-white/85 p-5 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-xl font-bold text-slate-800">Temps forts de l'année</h2>
      <p className="mt-1 text-sm text-slate-600">
        Toutes les fêtes et vacances de la zone A sont listées ici. Les événements à venir sont mis en avant.
      </p>
      <ul className="mt-4 space-y-3">
        {events.map((event) => {
          const startDate = normaliseDate(event.start);
          const endDate = normaliseDate(event.end);
          const hasValidStart = !Number.isNaN(startDate.getTime());
          const hasValidEnd = !Number.isNaN(endDate.getTime());
          const isPast = hasValidEnd && endDate < referenceDate;
          const isOngoing = hasValidStart && hasValidEnd && startDate <= referenceDate && endDate >= referenceDate;
          const statusLabel = isOngoing ? "En cours" : isPast ? "Terminé" : "À venir";
          const statusColor = isOngoing
            ? "bg-emerald-100 text-emerald-800 border-emerald-300"
            : isPast
            ? "bg-slate-100 text-slate-500 border-slate-200"
            : "bg-indigo-100 text-indigo-700 border-indigo-200";

          return (
            <li
              key={`${event.id}-${event.start}`}
              className="rounded-2xl border border-slate-200 bg-white/70 p-3 shadow-sm transition hover:border-indigo-200"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <span aria-hidden="true" className="text-lg">
                      {event.icon}
                    </span>
                    <span>{event.label}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {event.description} <br />
                    <span className="font-semibold">{describeEventRange(event)}</span>
                  </p>
                </div>
                <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${statusColor}`}>{statusLabel}</span>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-[0.7rem] text-slate-500">
        Astuce : clique sur un jour festif pour célébrer sa réussite en même temps que ta progression.
      </p>
    </section>
  );
}
