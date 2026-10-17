import { CalendarEvent } from "./types";
import { categoryDots, categoryStyles } from "./style";

export const eventCard = (event: CalendarEvent, compact = false, setSelectedEvent: (event: CalendarEvent) => void) => (
    <button
      key={event.id}
      type="button"
      onClick={() => setSelectedEvent(event)}
      className={`w-full rounded-md px-2 py-1.5 text-left transition hover:opacity-80 ${
        categoryStyles[event.category]
      }`}
    >
      <span className="flex items-center gap-1.5 text-xs font-semibold">
        <span className={`size-1.5 shrink-0 rounded-full ${categoryDots[event.category]}`} />
        {event.start}
        <span className="truncate">{event.title}</span>
      </span>
      {!compact && (
        <span className="mt-1 block truncate text-xs opacity-80">
          {event.location}
        </span>
      )}
    </button>
  );