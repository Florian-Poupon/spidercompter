import React, { useState, useEffect } from "react";
import { generateCalendarDays, groupDaysByMonth } from "../utils/calendarUtils";
import CalendarMonth from "./CalendarMonth";
import CelebrationModal from "./CelebrationModal";
import SpiderMascot from "./SpiderMascot";

export default function CountdownCalendar() {
  // Date de départ et de fin (adapter ici)
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(2025, 8, 1); // 1er septembre 2025

  // Génère tous les jours du calendrier
  const allDays = generateCalendarDays(startDate, endDate);
  // Regroupe par mois
  const months = groupDaysByMonth(allDays);

  // Gestion de la coche et de la persistance locale
  const STORAGE_KEY = "countdownCheckedDays";
  const [checked, setChecked] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Pour l'animation de coche (index de la dernière case cochée)
  const [justCheckedIdx, setJustCheckedIdx] = useState(null);
  // Célébration finale
  const [showCelebration, setShowCelebration] = useState(false);

  // Sauvegarde dans localStorage à chaque modification
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
    } catch {}
  }, [checked]);

  // Réinitialise l'effet d'animation après 200ms
  useEffect(() => {
    if (justCheckedIdx !== null) {
      const timeout = setTimeout(() => setJustCheckedIdx(null), 200);
      return () => clearTimeout(timeout);
    }
  }, [justCheckedIdx]);

  // Affiche la célébration si tout est coché (une seule fois)
  useEffect(() => {
    if (checked.length === allDays.length && allDays.length > 0) {
      setShowCelebration(true);
    } else {
      setShowCelebration(false);
    }
  }, [checked, allDays.length]);

  // Gestion du clic sur une case
  const handleCheck = (globalIdx) => {
    if (!checked.includes(globalIdx)) {
      setChecked([...checked, globalIdx]);
      setJustCheckedIdx(globalIdx);
    }
  };

  // Réinitialise le calendrier (cases décochées + localStorage)
  const handleReset = () => {
    setChecked([]);
    localStorage.removeItem(STORAGE_KEY);
    setShowCelebration(false);
  };

  // Calcul du nombre de jours non cochés
  const uncheckedCount = allDays.length - checked.length;

  // Mapping des jours à leur index global pour la gestion de coche/animation
  let globalIdx = 0;

  return (
    <div className="relative bg-[#FFF9F3] flex flex-col items-center p-8 gap-8 font-[var(--font-dynapuff)] overflow-x-auto">
      {/* Fond crème sur tout le body */}
      <style>{`body { background: #FFF9F3 !important; }`}</style>

      {/* Header titre + mascotte, z-30 pour rester au-dessus du fond */}
      <div className="w-full max-w-2x flex items-center justify-between mt-2 mb-4 z-30  bg-white p-5 rounded-xl shadow-sm">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-spidey-red-soft drop-shadow text-left leading-tight">Combien de dodos avant la rentrée ?</h1>
        <SpiderMascot className="w-25 -4 h-auto sm:w-16 sm:h-16 ml-2" />
      </div>

      {/* Bandeau de progression visuelle */}
      <div className="fixed bottom-0  bg-white p-4 w-full max-w-2xl flex items-center justify-center  z-100">
        {/* Compteur sticky */}
        <div className="flex-1 p-4 h-4 bg-spidey-blue-soft/20 rounded-full overflow-hidden flex items-center">
          <span className={`text-xl sm:text-4xl w-auto md:text-4xl font-extrabold text-spidey-blue-soft flex-1 text-left ${justCheckedIdx !== null ? "animate-bounce" : ""}`}>
            Encore {uncheckedCount} dodos !
          </span>
          <div
            className="h-4 bg-spidey-blue-soft rounded-full transition-all duration-500"
            style={{ width: `${Math.round((checked.length / allDays.length) * 100)}%` }}
            aria-label={`Progression : ${checked.length} sur ${allDays.length} jours cochés`}
          ></div>
        </div>
        <span className="ml-3 text-spidey-blue-soft font-bold text-lg min-w-[48px] text-center">{Math.round((checked.length / allDays.length) * 100)}%</span>
      </div>

      {/* Célébration finale */}
      {showCelebration && <CelebrationModal onReset={handleReset} />}

      {/* Calendrier par mois */}
      <div className="w-full z-10">
        {months.map((month) => {
          // On passe à CalendarMonth les infos nécessaires
          const daysWithState = month.days.map((day) => {
            const idx = globalIdx;
            const isChecked = checked.includes(idx);
            const animate = justCheckedIdx === idx;
            const badge = isChecked ? (
              animate ? (
                <span role="img" aria-label="bravo">
                  ⭐ Bravo !
                </span>
              ) : (
                <span role="img" aria-label="coché">
                  ✅
                </span>
              )
            ) : null;
            globalIdx++;
            return { ...day, isChecked, animate, badge, idx };
          });
          return <CalendarMonth key={month.label} month={{ ...month, days: daysWithState }} onCheck={handleCheck} />;
        })}
      </div>
    </div>
  );
}
