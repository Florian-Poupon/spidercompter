import React from "react";

export default function CalendarDay({ day, badge = null, onClick, big = false }) {
  let bg, textColor, borderColor;
  if (day.isWeekend) {
    bg = "bg-[var(--color-spidey-yellow-pastel)]";
    textColor = "text-[var(--color-black-soft)]";
    borderColor = "border-[var(--color-spidey-yellow-medium)]";
  } else {
    bg = "bg-white";
    textColor = "text-[var(--color-spidey-blue-dark)]";
    borderColor = day.dayOfWeek % 2 === 0 ? "border-[var(--color-spidey-red-soft)]" : "border-[var(--color-spidey-blue-soft)]";
  }
  const isChecked = day.isChecked;

  // Taille XXL si "big" passé en prop
  const sizeClass = big ? "w-24 h-24 min-w-[6rem] min-h-[6rem] text-2xl sm:text-3xl" : "w-16 h-16 min-w-[3.2rem] min-h-[3.2rem] text-base sm:text-lg";

  return (
    <button
      type="button"
      className={`
        flex flex-col items-center justify-center aspect-square rounded-2xl shadow-lg border-2 ${borderColor}
        ${bg} relative transition-all duration-200 select-none p-3 gap-2
        font-[var(--font-dynapuff)] focus:outline-none focus:ring-2 focus:ring-[var(--color-spidey-blue-soft)]
        ${sizeClass}
        ${isChecked ? "opacity-60 scale-95 ring-2 ring-[var(--color-spidey-blue-soft)]" : "hover:scale-105 active:scale-95"}
      `}
      aria-label={`Jour ${day.label}, ${day.dateLabel}${day.isWeekend ? ", week-end" : ""}${isChecked ? ", coché" : ", non coché"}`}
      disabled={isChecked}
      onClick={isChecked ? undefined : onClick}
      tabIndex={0}
    >
      <span className={`font-extrabold drop-shadow-sm flex items-center gap-1 ${textColor} ${isChecked ? "line-through" : ""} truncate w-full`}>
        {day.label}
        {day.isWeekend && (
          <span className="text-lg ml-1" role="img" aria-label="week-end">
            ☀️
          </span>
        )}
      </span>
      <span className="text-xs sm:text-sm text-[var(--color-black-soft)] opacity-90 truncate w-full">{day.dateLabel}</span>
      {badge && (
        <span className="absolute top-1 right-1 bg-[var(--color-spidey-blue-soft)] text-white text-xs px-2 py-1 rounded-full shadow font-bold flex items-center gap-1 animate-pop">
          <span role="img" aria-label="étoile">
            ⭐
          </span>{" "}
          Bravo !
        </span>
      )}
      {isChecked && (
        <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="bg-[var(--color-spidey-blue-soft)] bg-opacity-30 rounded-2xl p-2 flex items-center justify-center">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="12" fill="currentColor" opacity="0.18" />
              <path d="M7 13l3 3 7-7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </span>
      )}
    </button>
  );
}
