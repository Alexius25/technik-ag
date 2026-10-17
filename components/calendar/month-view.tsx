import { formatDate, dateKey } from "@/lib/date-utils";
import { CalendarEvent, weekdays } from "./types";
import { eventCard } from "./event-card";
import { categoryDots } from "./style";

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
    return (
        <div className="overflow-hidden rounded-xl border">
            <div className="grid grid-cols-7 border-b bg-accent/30">
                {weekdays.map((day) => (
                    <div
                        key={day}
                        className="py-3 text-center text-xs font-medium text-muted-foreground sm:text-sm"
                    >
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7">
                {monthDays.map((date) => {
                    const isCurrentMonth =
                        date.getMonth() === currentDate.getMonth();
                    const isToday = dateKey(date) === dateKey(new Date());
                    const dayEvents = eventsForDate(date);

                    return (
                        <div
                            key={dateKey(date)}
                            className={`min-h-24 border-r border-b p-1.5 sm:min-h-32 sm:p-2 ${
                                !isCurrentMonth ? "bg-accent/20" : ""
                            }`}
                        >
                            <button
                                type="button"
                                onClick={() => openNewEvent(dateKey(date))}
                                aria-label={`Termin am ${formatDate(date)}`}
                                className={`mb-1 flex size-7 items-center justify-center rounded-full text-xs transition hover:bg-accent sm:size-8 sm:text-sm ${
                                    isToday
                                        ? "bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
                                        : isCurrentMonth
                                          ? "text-foreground"
                                          : "text-muted-foreground"
                                }`}
                            >
                                {date.getDate()}
                            </button>

                            <div className="space-y-1">
                                {dayEvents.slice(0, 2).map((event) => (
                                    <div
                                        key={event.id}
                                        className="hidden sm:block"
                                    >
                                        {eventCard(
                                            event,
                                            true,
                                            setSelectedEvent
                                        )}
                                    </div>
                                ))}
                                {dayEvents.slice(0, 3).map((event) => (
                                    <button
                                        key={`mobile-${event.id}`}
                                        type="button"
                                        onClick={() => setSelectedEvent(event)}
                                        aria-label={event.title}
                                        className={`mx-auto block size-2 rounded-full sm:hidden ${
                                            categoryDots[event.category]
                                        }`}
                                    />
                                ))}
                                {dayEvents.length > 2 && (
                                    <p className="hidden px-1 text-xs text-muted-foreground sm:block">
                                        +{dayEvents.length - 2} weitere
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}


