import { Plus } from "lucide-react";
import { dateKey, formatDate } from "@/lib/date-utils";
import { eventCard } from "./event-card";
import { CalendarEvent } from "./types";

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
    return (
        <div className="overflow-x-auto rounded-xl border">
            <div className="grid min-w-[700px] grid-cols-7">
                {weekDays.map((date) => (
                    <div
                        key={dateKey(date)}
                        className="min-h-72 border-r last:border-r-0"
                    >
                        <button
                            type="button"
                            onClick={() => openNewEvent(dateKey(date))}
                            className="w-full border-b bg-accent/30 px-2 py-3 text-center transition hover:bg-accent"
                        >
                            <p className="text-xs text-muted-foreground">
                                {formatDate(date, { weekday: "short" })}
                            </p>
                            <p
                                className={`mx-auto mt-1 flex size-8 items-center justify-center rounded-full text-sm font-medium ${
                                    dateKey(date) === dateKey(new Date())
                                        ? "bg-primary text-primary-foreground"
                                        : ""
                                }`}
                            >
                                {date.getDate()}
                            </p>
                        </button>
                        <div className="space-y-2 p-1.5">
                            {eventsForDate(date).map((event) =>
                                eventCard(event, false, setSelectedEvent)
                            )}
                            {eventsForDate(date).length === 0 && (
                                <button
                                    type="button"
                                    onClick={() => openNewEvent(dateKey(date))}
                                    className="w-full rounded-md py-3 text-xs text-muted-foreground hover:bg-accent"
                                >
                                    <Plus className="mx-auto size-4" />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
