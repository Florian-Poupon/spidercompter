import MonthGrid from "./MonthGrid";

export default function AnnualCalendar({ months, weekDays, checkedSet, autoFill, onDayAction, lastInteracted }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {months.map((month) => (
        <MonthGrid
          key={month.index}
          month={month}
          weekDays={weekDays}
          checkedSet={checkedSet}
          autoFill={autoFill}
          onDayAction={onDayAction}
          lastInteracted={lastInteracted}
        />
      ))}
    </div>
  );
}
