
import { dateKey } from "@/lib/date-utils";
import { CalendarEvent } from "./types";

export type WeekSegment = {
    event: CalendarEvent;
    startColumn: number;
    endColumn: number;
    lane: number;
    continuesBefore: boolean;
    continuesAfter: boolean;
};

type GetWeekSegmentsOptions = {
    excludeSingleDayEvents?: boolean;
    fixedSevenDayWeek?: boolean;
};

export function getWeekSegments(
    events: CalendarEvent[],
    weekDays: Date[],
    {
        excludeSingleDayEvents = false,
        fixedSevenDayWeek = false,
    }: GetWeekSegmentsOptions = {}
): WeekSegment[] {
    const weekStart = dateKey(weekDays[0]);
    const weekEnd = dateKey(
        fixedSevenDayWeek ? weekDays[6] : weekDays[weekDays.length - 1]
    );

    const weekEvents = events
        .filter(
            (event) =>
                (!excludeSingleDayEvents ||
                    event.startDate < event.endDate) &&
                event.startDate <= weekEnd &&
                event.endDate >= weekStart
        )
        .sort(
            (a, b) =>
                a.startDate.localeCompare(b.startDate) ||
                b.endDate.localeCompare(a.endDate)
        );

    const occupiedLanes: number[] = [];
    const segments: WeekSegment[] = [];

    for (const event of weekEvents) {
        const firstDayIndex = weekDays.findIndex(
            (date) => dateKey(date) >= event.startDate
        );

        const startIndex =
            firstDayIndex === -1 ? 0 : firstDayIndex;

        const firstAfterEnd = weekDays.findIndex(
            (date) => dateKey(date) > event.endDate
        );

        const endIndex =
            firstAfterEnd === -1
                ? weekDays.length - 1
                : firstAfterEnd - 1;

        let lane = occupiedLanes.findIndex(
            (lastColumn) => lastColumn < startIndex
        );

        if (lane === -1) {
            lane = occupiedLanes.length;
            occupiedLanes.push(endIndex);
        } else {
            occupiedLanes[lane] = endIndex;
        }

        segments.push({
            event,
            startColumn: startIndex + 1,
            endColumn: endIndex + 1,
            lane,
            continuesBefore: event.startDate < weekStart,
            continuesAfter: event.endDate > weekEnd,
        });
    }

    return segments;
}
