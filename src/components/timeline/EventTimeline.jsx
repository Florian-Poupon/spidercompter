import TimelineItem from "./TimelineItem";

export default function EventTimeline({ events, referenceDate }) {
  if (!events || events.length === 0) {
    return null;
  }

  return (
    <section className="rounded-3xl bg-white/80 p-4 shadow-sm ring-1 ring-slate-200">
      <header className="flex flex-col gap-1">
        <h2 className="text-lg font-bold text-slate-800 sm:text-xl">Moments forts de l'année</h2>
        <p className="text-sm text-slate-500">
          Toutes les fêtes et vacances scolaires de la zone A sont listées ici pour préparer tes prochaines célébrations.
        </p>
      </header>
      <ul className="mt-4 grid gap-3 md:grid-cols-2">
        {events.map((event) => (
          <TimelineItem key={event.id} event={event} referenceDate={referenceDate} />
        ))}
      </ul>
    </section>
  );
}
