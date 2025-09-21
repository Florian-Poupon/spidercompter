import MonthSection from "./MonthSection";

export default function YearCalendar({
  months,
  weekDays,
  checkedSet,
  autoFill,
  onDayToggle,
  highlightDay,
}) {
  return (
    <section aria-label="Calendrier annuel" className="grid gap-6 lg:grid-cols-2">
      {months.map((month) => (
        <MonthSection
          key={month.index}
          month={month}
          weekDays={weekDays}
          checkedSet={checkedSet}
          autoFill={autoFill}
          onDayToggle={onDayToggle}
          highlightDay={highlightDay}
        />
      ))}
    </section>
  );
}
