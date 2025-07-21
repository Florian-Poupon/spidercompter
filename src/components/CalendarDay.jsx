import React from "react";

export default function CalendarDay({ day, badge = null, onClick, big = false }) {
  const isChecked = day.isChecked;

  // Taille des cases (option big pour semainier)
  const sizeClass = big ? "w-full aspect-square text-lg sm:text-2xl min-w-[44px] min-h-[44px]" : "w-16 h-16 min-w-[3.2rem] min-h-[3.2rem] text-base sm:text-lg";

  // Détermine fond, texte et bordure
  let bg, textColor, borderColor;
  if (isChecked) {
    bg = "bg-gray-300"; // Fond gris clair Tailwind (ou adapte à ta palette)
    textColor = "text-gray-500";
    borderColor = "border-gray-300";
  } else if (day.isWeekend) {
    bg = "bg-[var(--color-spidey-yellow-pastel)]";
    textColor = "text-[var(--color-black-soft)]";
    borderColor = "border-[var(--color-spidey-yellow-medium)]";
  } else {
    bg = "bg-white";
    textColor = "text-[var(--color-spidey-blue-dark)]";
    borderColor = day.dayOfWeek % 2 === 0 ? "border-[var(--color-spidey-red-soft)]" : "border-[var(--color-spidey-blue-soft)]";
  }

  return (
    <button
      type="button"
      className={`
        flex flex-col items-center justify-center rounded-2xl shadow-lg border-2 ${borderColor}
        ${bg} relative transition-all duration-200 select-none p-3 gap-2
        font-[var(--font-dynapuff)] focus:outline-none focus:ring-2 focus:ring-[var(--color-spidey-blue-soft)]
        ${sizeClass}
        ${isChecked ? "opacity-60 pointer-events-none" : "hover:scale-105 active:scale-95"}
      `}
      aria-label={`Jour ${day.label}, ${day.dateLabel}${day.isWeekend ? ", week-end" : ""}${isChecked ? ", coché" : ", non coché"}`}
      disabled={isChecked}
      onClick={isChecked ? undefined : onClick}
      tabIndex={0}
    >
      <span className={`font-extrabold flex items-center gap-1 ${textColor} ${isChecked ? "line-through" : ""} truncate w-full`}>
        {day.label}
        {day.isWeekend && !isChecked && (
          <span className="text-lg ml-1" role="img" aria-label="week-end">
            ☀️
          </span>
        )}
      </span>
      <span className="text-xs sm:text-sm text-[var(--color-black-soft)] opacity-90 truncate w-full">{day.dateLabel}</span>
      {badge && !isChecked && (
        <span className="absolute top-1 right-1 bg-[var(--color-spidey-blue-soft)] text-white text-xs px-2 py-1 rounded-full shadow font-bold flex items-center gap-1 animate-pop">
          <span role="img" aria-label="étoile">
            ⭐
          </span>{" "}
          Bravo !
        </span>
      )}
    </button>
  );
}
