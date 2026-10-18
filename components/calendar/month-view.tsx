
import { formatDate, dateKey } from "@/lib/date-utils";
import { CalendarEvent, weekdays } from "./types";
import { getWeekSegments } from "./week-segments";
import { getUniqueEvents } from "./event-utils";
import EventBar from "./event-bar";

export default function CalendarMonthView({
    currentDate,
    eventsForDate,
    openNewEvent,
    setSelectedEvent,
    monthDays,
}: {
    currentDate: Date;
    eventsForDate: (date: Date) => CalendarEvent[];
    openNewEvent: (dateKey: string) => void;
    setSelectedEvent: (event: CalendarEvent) => void;
    monthDays: Date[];
}) {
    const weeks: Date[][] = [];

    for (let i = 0; i < monthDays.length; i += 7) {
        weeks.push(monthDays.slice(i, i + 7));
    }

    const events = getUniqueEvents(monthDays, eventsForDate);

    return (
        <div className="overflow-hidden rounded-xl border">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 border-b bg-accent/30">
                {weekdays.map((day) => (
                    <div
                        key={day}
                        className="border-r py-3 text-center text-[10px] font-medium text-muted-foreground last:border-r-0 sm:text-sm"
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar weeks */}
            {weeks.map((week) => {
                const segments = getWeekSegments(events, week, {
                    fixedSevenDayWeek: true,
                });

                const laneCount = Math.max(
                    0,
                    ...segments.map((segment) => segment.lane + 1)
                );

                const eventAreaHeight = laneCount * 25;
                const rowHeight = Math.max(112, 40 + eventAreaHeight);

                return (
                    <div
                        key={dateKey(week[0])}
                        className="relative grid grid-cols-7 border-b last:border-b-0"
                        style={{
                            minHeight: `${rowHeight}px`,
                        }}
                    >
                        {/* Day cells: continuous borders */}
                        {week.map((date, dayIndex) => {
                            const isCurrentMonth =
                                date.getMonth() === currentDate.getMonth() &&
                                date.getFullYear() ===
                                    currentDate.getFullYear();

                            const isToday =
                                dateKey(date) === dateKey(new Date());

                            return (
                                <div
                                    key={dateKey(date)}
                                    className={`relative min-w-0 border-r p-1 sm:p-2 ${
                                        dayIndex === 6 ? "border-r-0" : ""
                                    } ${
                                        !isCurrentMonth
                                            ? "bg-accent/20"
                                            : ""
                                    }`}
                                    style={{
                                        gridColumn: dayIndex + 1,
                                        gridRow: 1,
                                        minHeight: `${rowHeight}px`,
                                    }}
                                >
                                    <button
                                        type="button"
                                        onClick={() =>
                                            openNewEvent(dateKey(date))
                                        }
                                        aria-label={`Termin am ${formatDate(date)}`}
                                        className={`relative z-10 flex size-7 items-center justify-center rounded-full text-xs transition hover:bg-accent sm:size-8 sm:text-sm ${
                                            isToday
                                                ? "bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
                                                : isCurrentMonth
                                                  ? "text-foreground"
                                                  : "text-muted-foreground"
                                        }`}
                                    >
                                        {date.getDate()}
                                    </button>
                                </div>
                            );
                        })}

                        {/* Event bars, positioned below the day numbers */}
                        <div
                            className="pointer-events-none absolute inset-x-0 top-10 grid grid-cols-7"
                            style={{
                                gridTemplateRows: `repeat(${Math.max(
                                    1,
                                    laneCount
                                )}, 25px)`,
                            }}
                        >
                            {segments.map((segment) => (
                                <EventBar
                                    key={`${segment.event.id}-${dateKey(week[0])}`}
                                    segment={segment}
                                    setSelectedEvent={setSelectedEvent}
                                    classNamePrefix="pointer-events-auto mx-0.5 my-0.5 block min-w-0 self-start overflow-hidden px-1 py-1 text-left text-[10px] font-medium leading-tight transition hover:opacity-80 sm:mx-1 sm:px-2 sm:text-xs"
                                />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
