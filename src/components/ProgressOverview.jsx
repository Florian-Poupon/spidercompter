import SpiderMascot from "./SpiderMascot";

export default function ProgressOverview({
  checkedCount,
  totalDays,
  remaining,
  percentage,
  streak,
  nextDay,
}) {
  const completion = totalDays > 0 && checkedCount === totalDays;
  const progressWidth = `${Math.min(percentage, 100)}%`;

  return (
    <section className="rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-rose-50 p-6 shadow-sm ring-1 ring-indigo-100">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
            {completion ? "Année complétée !" : "Suivi des dodos"}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">
            {completion
              ? "Bravo, toutes les journées sont cochées !"
              : "Clique sur chaque jour pour valider ton avancée. Active le mode " +
                "cocher en continu pour remplir automatiquement les jours précédents."}
          </p>
        </div>
        <SpiderMascot className="h-20 w-20" title="Mascotte célébrant les progrès" />
      </header>
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-600">
          <span>Progression</span>
          <span>{percentage}%</span>
        </div>
        <div className="h-3 rounded-full bg-slate-200">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-rose-400 via-indigo-400 to-emerald-400 transition-all"
            style={{ width: progressWidth }}
          ></div>
        </div>
      </div>
      <dl className="mt-6 grid gap-4 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-white/70 p-3 text-center shadow-sm">
          <dt className="text-xs uppercase tracking-wide text-slate-400">Jours cochés</dt>
          <dd className="text-lg font-bold text-emerald-600">{checkedCount}</dd>
        </div>
        <div className="rounded-2xl bg-white/70 p-3 text-center shadow-sm">
          <dt className="text-xs uppercase tracking-wide text-slate-400">Jours restants</dt>
          <dd className="text-lg font-bold text-rose-500">{remaining}</dd>
        </div>
        <div className="rounded-2xl bg-white/70 p-3 text-center shadow-sm">
          <dt className="text-xs uppercase tracking-wide text-slate-400">Série de jours validés</dt>
          <dd className="text-lg font-bold text-indigo-500">{streak}</dd>
        </div>
        <div className="rounded-2xl bg-white/70 p-3 text-center shadow-sm">
          <dt className="text-xs uppercase tracking-wide text-slate-400">Prochain jour à cocher</dt>
          <dd className="text-sm font-semibold text-slate-700">
            {nextDay ? (
              <>{nextDay.date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</>
            ) : (
              <span>Tous les jours sont faits ✨</span>
            )}
          </dd>
        </div>
      </dl>
    </section>
  );
}
