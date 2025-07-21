import React from "react";
import { WEEKDAYS } from "../utils/calendarUtils";

export default function CalendarHeader() {
  return (
    <div className="grid grid-cols-7 gap-2 mb-2">
      {WEEKDAYS.map((d) => (
        <div key={d} className="text-center text-spidey-blue-soft font-bold text-base sm:text-lg tracking-wide" aria-label={d}>
          {d}
        </div>
      ))}
    </div>
  );
}
