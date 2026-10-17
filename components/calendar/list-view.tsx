import { CalendarDays } from "lucide-react";
import { formatDate, shiftDate, startOfWeek } from "@/lib/date-utils";
import { CalendarEvent } from "./types";
import { categoryStyles } from "./style";

export default function CalendarListView({
    sortedEvents,
    currentDate,
    setSelectedEvent,
}: {
    sortedEvents: CalendarEvent[];
    currentDate: Date;
    setSelectedEvent: (event: CalendarEvent) => void;
}) {
    return (
        <div className="space-y-3">
            {sortedEvents.filter((event) => {
                const start = startOfWeek(currentDate);
                const end = shiftDate(start, 7);
                const eventDate = new Date(`${event.date}T12:00:00`);
                return eventDate >= start && eventDate < end;
            }).length === 0 && (
                <div className="rounded-xl border border-dashed py-12 text-center">
                    <CalendarDays className="mx-auto size-8 text-muted-foreground" />
                    <p className="mt-3 font-medium">
                        Keine Termine diese Woche
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Füge einen Termin hinzu, um ihn hier zu sehen.
                    </p>
                </div>
            )}

            {sortedEvents
                .filter((event) => {
                    const start = startOfWeek(currentDate);
                    const end = shiftDate(start, 7);
                    const eventDate = new Date(`${event.date}T12:00:00`);
                    return eventDate >= start && eventDate < end;
                })
                .map((event) => (
                    <button
                        key={event.id}
                        type="button"
                        onClick={() => setSelectedEvent(event)}
                        className="flex w-full flex-col gap-3 rounded-xl border p-4 text-left transition hover:bg-accent/30 sm:flex-row sm:items-center"
                    >
                        <div className="min-w-24">
                            <p className="text-sm font-semibold">
                                {formatDate(
                                    new Date(`${event.date}T12:00:00`),
                                    {
                                        weekday: "short",
                                        day: "2-digit",
                                        month: "short",
                                    }
                                )}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                {event.start} – {event.end} Uhr
                            </p>
                        </div>
                        <div className="flex-1">
                            <p className="font-medium">{event.title}</p>
                            <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                                {event.description}
                            </p>
                        </div>
                        <span
                            className={`w-fit rounded-full px-2.5 py-1 text-xs font-medium ${categoryStyles[event.category]}`}
                        >
                            {event.category}
                        </span>
                    </button>
                ))}
        </div>
    );
}
