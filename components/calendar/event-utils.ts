
import { CalendarEvent } from "./types";

export function getUniqueEvents(
    dates: Date[],
    eventsForDate: (date: Date) => CalendarEvent[]
): CalendarEvent[] {
    const eventMap = new Map<number, CalendarEvent>();

    for (const date of dates) {
        for (const event of eventsForDate(date)) {
            eventMap.set(event.id, event);
        }
    }

    return Array.from(eventMap.values());
}
