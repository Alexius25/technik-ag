import { CalendarEvent } from "./types";
import { categoryDots, categoryStyles } from "./style";

export const eventCard = (
    event: CalendarEvent,
    compact = false,
    setSelectedEvent: (event: CalendarEvent) => void
) => (
    <button
        key={event.id}
        type="button"
        onClick={() => setSelectedEvent(event)}
        title={event.title}
        aria-label={`${event.start} – ${event.title}`}
        className={`block w-full min-w-0 overflow-hidden rounded-sm px-1 py-1 text-left transition hover:opacity-80 sm:rounded-md sm:px-2 sm:py-1.5 ${
            categoryStyles[event.category]
        }`}
    >
        <span className="flex min-w-0 items-center gap-1 sm:gap-1.5">
            <span
                className={`hidden size-1.5 shrink-0 rounded-full sm:block ${
                    categoryDots[event.category]
                }`}
            />

            <span className="hidden shrink-0 text-xs sm:inline">
                {event.start}
            </span>

            <span className="block min-w-0 truncate text-[10px] font-medium leading-tight sm:text-xs sm:font-semibold">
                {event.title}
            </span>
        </span>

        {!compact && (
            <span className="mt-1 hidden truncate text-xs opacity-80 sm:block">
                {event.location}
            </span>
        )}
    </button>
);