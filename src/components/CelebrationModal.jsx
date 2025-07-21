import React from "react";

export default function CelebrationModal({ onReset }) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-spidey-blue-soft via-spidey-red-soft to-spidey-yellow-pastel bg-opacity-95 animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex flex-col items-center justify-center gap-6 p-8 rounded-3xl shadow-2xl bg-white/90 border-4 border-spidey-blue-soft animate-pop">
        <span className="text-7xl md:text-8xl animate-bounce" role="img" aria-label="fête">
          🎉🥳🦸‍♂️
        </span>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-spidey-red-soft text-center drop-shadow-lg">
          C’est la rentrée !<br />
          Bravo !
        </h2>
        <button
          onClick={onReset}
          className="mt-4 px-8 py-4 rounded-2xl bg-spidey-blue-soft text-white text-2xl sm:text-3xl font-bold shadow-lg hover:bg-spidey-red-soft focus:outline-none focus:ring-4 focus:ring-spidey-yellow-pastel transition-all duration-200"
          aria-label="Réinitialiser le calendrier"
          autoFocus
        >
          🔄 Recommencer
        </button>
      </div>
    </div>
  );
}
