import { describeEventPeriod } from "../../utils/dates";

export default function EventSpotlight({ event }) {
  if (!event) {
    return null;
  }

  return (
    <section className="flex flex-col gap-2 rounded-3xl border border-indigo-200 bg-indigo-50/80 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3 text-indigo-700">
        <span aria-hidden="true" className="text-3xl">
          {event.icon}
        </span>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide">Prochain temps fort</p>
          <p className="text-base font-bold">{event.label}</p>
          <p className="text-xs text-indigo-600">{describeEventPeriod(event)}</p>
        </div>
      </div>
      <p className="text-xs text-indigo-600">
        Pense à cocher la journée correspondante pour ne rien manquer !
      </p>
    </section>
  );
}
