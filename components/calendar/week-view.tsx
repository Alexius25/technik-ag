import { Plus } from "lucide-react";
import { dateKey, formatDate } from "@/lib/date-utils";
import { eventCard } from "./event-card";
import { CalendarEvent } from "./types";
import { getWeekSegments } from "./week-segments";
import { getUniqueEvents } from "./event-utils";
import EventBar from "./event-bar";

export default function CalendarWeekView({
    weekDays,
    eventsForDate,
    openNewEvent,
    setSelectedEvent,
}: {
    weekDays: Date[];
    eventsForDate: (date: Date) => CalendarEvent[];
    openNewEvent: (dateKey: string) => void;
    setSelectedEvent: (event: CalendarEvent) => void;
}) {
    const allEvents = getUniqueEvents(weekDays, eventsForDate);

    const segments = getWeekSegments(allEvents, weekDays, {
        excludeSingleDayEvents: true,
    });

    const laneCount = segments.length
        ? Math.max(...segments.map((segment) => segment.lane + 1))
        : 0;

    const barHeight = 28;

    return (
        <div className="overflow-x-auto rounded-xl border">
            <div className="min-w-[700px]">
                {/* Wochentage */}
                <div className="grid grid-cols-7 border-b bg-accent/30">
                    {weekDays.map((date) => {
                        const isToday = dateKey(date) === dateKey(new Date());

                        return (
                            <button
                                key={dateKey(date)}
                                type="button"
                                onClick={() => openNewEvent(dateKey(date))}
                                className="border-r px-2 py-3 text-center transition last:border-r-0 hover:bg-accent"
                            >
                                <p className="text-xs text-muted-foreground">
                                    {formatDate(date, {
                                        weekday: "short",
                                    })}
                                </p>

                                <p
                                    className={`mx-auto mt-1 flex size-8 items-center justify-center rounded-full text-sm font-medium ${
                                        isToday
                                            ? "bg-primary text-primary-foreground"
                                            : ""
                                    }`}
                                >
                                    {date.getDate()}
                                </p>
                            </button>
                        );
                    })}
                </div>

                {/* Gemeinsamer Terminbereich */}
                <div className="relative grid grid-cols-7">
                    {/* Tages-Spalten mit durchgehenden Borders */}
                    {weekDays.map((date, index) => {
                        const dayEvents = eventsForDate(date).filter(
                            (event) => event.startDate === event.endDate
                        );

                        return (
                            <div
                                key={dateKey(date)}
                                className={`min-h-72 min-w-0 border-r p-1.5 sm:p-2 ${
                                    index === 6 ? "border-r-0" : ""
                                }`}
                                style={{
                                    gridColumn: index + 1,
                                    gridRow: 1,
                                    paddingTop: `${8 + laneCount * barHeight}px`,
                                }}
                            >
                                <div className="space-y-2">
                                    {dayEvents.map((event) =>
                                        eventCard(
                                            event,
                                            false,
                                            setSelectedEvent
                                        )
                                    )}

                                    {dayEvents.length === 0 && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                openNewEvent(dateKey(date))
                                            }
                                            aria-label={`Termin am ${formatDate(date)} hinzufügen`}
                                            className="w-full rounded-md py-3 text-xs text-muted-foreground transition hover:bg-accent"
                                        >
                                            <Plus className="mx-auto size-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {/* Mehrtagesbalken im selben Bereich */}
                    {laneCount > 0 && (
                        <div
                            className="pointer-events-none absolute inset-x-0 top-0 grid grid-cols-7"
                            style={{
                                gridTemplateRows: `repeat(${laneCount}, ${barHeight}px)`,
                            }}
                        >
                            {segments.map((segment) => (
                                <EventBar
                                    key={segment.event.id}
                                    segment={segment}
                                    setSelectedEvent={setSelectedEvent}
                                    classNamePrefix="pointer-events-auto mx-1 my-0.5 block min-w-0 self-start overflow-hidden px-2 py-1 text-left text-xs font-medium leading-tight transition hover:opacity-80"
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
