import CalendarToolbar from "./components/controls/CalendarToolbar";
import YearCalendar from "./components/calendar/YearCalendar";
import EventSpotlight from "./components/insights/EventSpotlight";
import ProgressPanel from "./components/insights/ProgressPanel";
import EventTimeline from "./components/timeline/EventTimeline";
import { useCalendarState } from "./hooks/useCalendarState";

const SUPPORTED_YEARS = [2024, 2025];

export default function App() {
  const {
    year,
    years,
    setYear,
    autoFill,
    setAutoFill,
    calendar,
    checkedSet,
    stats,
    timeline,
    referenceDate,
    nextEvent,
    toggleDay,
    checkAll,
    clearAll,
    lastAction,
  } = useCalendarState(SUPPORTED_YEARS);

  return (
    <div className="min-h-screen bg-[#fff9f3] pb-16">
      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <ProgressPanel stats={stats} />
        <EventSpotlight event={nextEvent} />
        <CalendarToolbar
          years={years}
          selectedYear={year}
          onYearChange={setYear}
          autoFill={autoFill}
          onAutoFillChange={setAutoFill}
          onCheckAll={checkAll}
          onClearAll={clearAll}
          checkedCount={stats.checkedCount}
          totalDays={stats.totalDays}
        />
        <YearCalendar
          months={calendar.months}
          weekDays={calendar.weekDays}
          checkedSet={checkedSet}
          autoFill={autoFill}
          onDayToggle={toggleDay}
          highlightDay={lastAction}
        />
        <EventTimeline events={timeline} referenceDate={referenceDate} />
      </main>
    </div>
  );
}
