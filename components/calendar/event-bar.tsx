import { categoryStyles } from "./style";
import { CalendarEvent } from "./types";
import { WeekSegment } from "./week-segments";

type EventBarProps = {
    segment: WeekSegment;
    setSelectedEvent: (event: CalendarEvent) => void;
    classNamePrefix: string;
    showLocation?: boolean;
};

export default function EventBar({
    segment,
    setSelectedEvent,
    classNamePrefix,
    showLocation = false,
}: EventBarProps) {
    const {
        event,
        startColumn,
        endColumn,
        lane,
        continuesBefore,
        continuesAfter,
    } = segment;

    return (
        <button
            type="button"
            onClick={() => setSelectedEvent(event)}
            title={`${event.title} (${event.startDate} – ${event.endDate})`}
            aria-label={`${event.title}, ${event.startDate} bis ${event.endDate}`}
            className={`${classNamePrefix} ${
                categoryStyles[event.category]
            } ${
                continuesBefore ? "rounded-l-none" : "rounded-l-md"
            } ${
                continuesAfter ? "rounded-r-none" : "rounded-r-md"
            }`}
            style={{
                gridColumn: `${startColumn} / ${endColumn + 1}`,
                gridRow: lane + 1,
            }}
        >
            <span className="block truncate">
                {event.title}
            </span>

            {showLocation && (
                <span className="block truncate text-[10px] font-normal opacity-80">
                    {event.location}
                </span>
            )}
        </button>
    );
}