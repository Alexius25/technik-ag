
"use client";

import { useMemo, useState } from "react";
import {
    CalendarDays,
    Clock3,
    MapPin,
    Pencil,
    X,
} from "lucide-react";

import {
    dateKey,
    shiftDate,
    startOfWeek,
    formatDate,
} from "@/lib/date-utils";

import { EventCategory, CalendarEvent } from "./types";
import { categoryDots, categoryStyles } from "./style";
import CalendarToolbar from "./toolbar";
import CalendarMonthView from "./month-view";
import CalendarWeekView from "./week-view";
import CalendarListView from "./list-view";

function createInitialEvents(): CalendarEvent[] {
    const today = new Date();

    const date = (offset: number) => {
        const result = new Date(today);
        result.setDate(today.getDate() + offset);

        const year = result.getFullYear();
        const month = String(result.getMonth() + 1).padStart(2, "0");
        const day = String(result.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    return [
        {
            id: 1,
            title: "Team-Meeting",
            description: "Wöchentliche Teamabstimmung.",
            startDate: date(0),
            endDate: date(0),
            start: "09:00",
            end: "10:00",
            location: "Besprechungsraum A",
            category: "Meeting",
        },
        {
            id: 2,
            title: "Projektplanung",
            description: "Planung der nächsten Projektphase.",
            startDate: date(1),
            endDate: date(1),
            start: "11:00",
            end: "12:30",
            location: "Online",
            category: "Projekt",
        },
        {
            id: 3,
            title: "Abgabe Konzept",
            description: "Abgabe des finalen Konzepts.",
            startDate: date(2),
            endDate: date(2),
            start: "15:00",
            end: "16:00",
            location: "Arbeitsbereich",
            category: "Deadline",
        },
        {
            id: 4,
            title: "Feedbackrunde",
            description: "Besprechung der bisherigen Ergebnisse.",
            startDate: date(4),
            endDate: date(4),
            start: "10:00",
            end: "11:00",
            location: "Besprechungsraum B",
            category: "Meeting",
        },
        {
            id: 5,
            title: "Projekt-Review",
            description: "Projektfortschritt und nächste Schritte.",
            startDate: date(7),
            endDate: date(7),
            start: "09:30",
            end: "10:30",
            location: "Online",
            category: "Projekt",
        },
        {
            id: 6,
            title: "Projektwoche",
            description: "Planung und Umsetzung des Projekts.",
            startDate: date(10),
            endDate: date(16),
            start: "09:00",
            end: "17:00",
            location: "Büro",
            category: "Projekt",
        },
    ];
}

export function EventCalendar() {
    const [events, setEvents] = useState<CalendarEvent[]>(() =>
        createInitialEvents()
    );

    const [currentDate, setCurrentDate] = useState(() => new Date());
    const [view, setView] = useState<"month" | "week" | "list">("month");

    const [selectedEvent, setSelectedEvent] =
        useState<CalendarEvent | null>(null);

    const [editingEvent, setEditingEvent] =
        useState<CalendarEvent | null>(null);

    const [showForm, setShowForm] = useState(false);
    const [selectedDate, setSelectedDate] = useState(dateKey(new Date()));

    const monthLabel = formatDate(currentDate, {
        month: "long",
        year: "numeric",
    });

    const monthDays = useMemo(() => {
        const first = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            1
        );

        const mondayOffset = (first.getDay() + 6) % 7;
        const gridStart = shiftDate(first, -mondayOffset);

        return Array.from(
            { length: 42 },
            (_, i) => shiftDate(gridStart, i)
        );
    }, [currentDate]);

    const weekDays = useMemo(() => {
        const start = startOfWeek(currentDate);

        return Array.from(
            { length: 7 },
            (_, i) => shiftDate(start, i)
        );
    }, [currentDate]);

    const sortedEvents = useMemo(
        () =>
            [...events].sort(
                (a, b) =>
                    a.startDate.localeCompare(b.startDate) ||
                    a.start.localeCompare(b.start)
            ),
        [events]
    );

    // A multi-day event belongs to every date between its start and end.
    const eventsForDate = (date: Date) => {
        const key = dateKey(date);

        return sortedEvents.filter(
            (event) =>
                event.startDate <= key &&
                event.endDate >= key
        );
    };

    const navigate = (direction: number) => {
        setCurrentDate((date) => {
            const next = new Date(date);

            if (view === "week" || view === "list") {
                next.setDate(next.getDate() + direction * 7);
            } else {
                next.setMonth(next.getMonth() + direction);
            }

            return next;
        });
    };

    const openNewEvent = (date = dateKey(currentDate)) => {
        setSelectedDate(date);
        setEditingEvent(null);
        setSelectedEvent(null);
        setShowForm(true);
    };

    const saveEvent = (formData: FormData) => {
        const startDate = String(
            formData.get("startDate") ?? selectedDate
        );

        const endDate = String(
            formData.get("endDate") ?? startDate
        );

        if (endDate < startDate) {
            return;
        }

        const event: CalendarEvent = {
            id: editingEvent?.id ?? Date.now(),
            title: String(formData.get("title") ?? "").trim(),
            description: String(
                formData.get("description") ?? ""
            ).trim(),
            startDate,
            endDate,
            start: String(formData.get("start") ?? "09:00"),
            end: String(formData.get("end") ?? "10:00"),
            location: String(formData.get("location") ?? "").trim(),
            category: String(
                formData.get("category") ?? "Meeting"
            ) as EventCategory,
        };

        if (!event.title) return;

        setEvents((previous) =>
            editingEvent
                ? previous.map((item) =>
                      item.id === event.id ? event : item
                  )
                : [...previous, event]
        );

        setShowForm(false);
        setSelectedEvent(null);
        setEditingEvent(null);
    };

    const openEdit = (event: CalendarEvent) => {
        setEditingEvent(event);
        setSelectedEvent(null);
        setSelectedDate(event.startDate);
        setShowForm(true);
    };

    const formatEventDate = (date: string) =>
        formatDate(new Date(`${date}T12:00:00`), {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        });

    const formatEventRange = (event: CalendarEvent) => {
        if (event.startDate === event.endDate) {
            return formatEventDate(event.startDate);
        }

        return `${formatEventDate(event.startDate)} – ${formatEventDate(
            event.endDate
        )}`;
    };

    return (
        <div className="space-y-5">
            <CalendarToolbar
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
                view={view}
                setView={setView}
                navigate={navigate}
                openNewEvent={openNewEvent}
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-xl font-semibold capitalize">
                    {monthLabel}
                </h3>

                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    {(
                        [
                            "Meeting",
                            "Projekt",
                            "Deadline",
                            "Sonstiges",
                        ] as EventCategory[]
                    ).map((category) => (
                        <span
                            key={category}
                            className="flex items-center gap-1.5"
                        >
                            <span
                                className={`size-2 rounded-full ${categoryDots[category]}`}
                            />
                            {category}
                        </span>
                    ))}
                </div>
            </div>

            {view === "month" && (
                <CalendarMonthView
                    monthDays={monthDays}
                    currentDate={currentDate}
                    eventsForDate={eventsForDate}
                    setSelectedEvent={setSelectedEvent}
                    openNewEvent={openNewEvent}
                />
            )}

            {view === "week" && (
                <CalendarWeekView
                    weekDays={weekDays}
                    eventsForDate={eventsForDate}
                    setSelectedEvent={setSelectedEvent}
                    openNewEvent={openNewEvent}
                />
            )}

            {view === "list" && (
                <CalendarListView
                    sortedEvents={sortedEvents}
                    setSelectedEvent={setSelectedEvent}
                    currentDate={currentDate}
                />
            )}

            {/* Event details */}
            {selectedEvent && (
                <div
                    className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            setSelectedEvent(null);
                        }
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="event-title"
                        className="w-full max-w-lg space-y-5 rounded-t-2xl border bg-background p-5 shadow-xl sm:rounded-2xl sm:p-6"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-2">
                                <span
                                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                                        categoryStyles[selectedEvent.category]
                                    }`}
                                >
                                    {selectedEvent.category}
                                </span>

                                <h3
                                    id="event-title"
                                    className="text-xl font-semibold"
                                >
                                    {selectedEvent.title}
                                </h3>
                            </div>

                            <button
                                type="button"
                                aria-label="Schließen"
                                onClick={() => setSelectedEvent(null)}
                                className="rounded-lg p-2 hover:bg-accent"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-3">
                                <CalendarDays className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                                <span>{formatEventRange(selectedEvent)}</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <Clock3 className="size-4 shrink-0 text-muted-foreground" />
                                {selectedEvent.start} – {selectedEvent.end} Uhr
                            </div>

                            <div className="flex items-center gap-3">
                                <MapPin className="size-4 shrink-0 text-muted-foreground" />
                                {selectedEvent.location || "Kein Ort angegeben"}
                            </div>
                        </div>

                        {selectedEvent.description && (
                            <div className="rounded-lg bg-accent/40 p-3 text-sm leading-relaxed">
                                {selectedEvent.description}
                            </div>
                        )}

                        <div className="flex justify-end gap-2 border-t pt-4">
                            <button
                                type="button"
                                onClick={() => setSelectedEvent(null)}
                                className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent"
                            >
                                Schließen
                            </button>

                            <button
                                type="button"
                                onClick={() => openEdit(selectedEvent)}
                                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                            >
                                <Pencil className="size-4" />
                                Bearbeiten
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create / edit form */}
            {showForm && (
                <div
                    className="fixed inset-0 z-[60] flex items-end justify-center overflow-y-auto bg-black/40 p-0 sm:items-center sm:p-4"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowForm(false);
                        }
                    }}
                >
                    <form
                        key={editingEvent?.id ?? "new"}
                        action={saveEvent}
                        className="my-auto w-full max-w-lg space-y-4 rounded-t-2xl border bg-background p-5 shadow-xl sm:rounded-2xl sm:p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-semibold">
                                    {editingEvent
                                        ? "Termin bearbeiten"
                                        : "Neuer Termin"}
                                </h3>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Änderungen gelten nur in dieser Sitzung.
                                </p>
                            </div>

                            <button
                                type="button"
                                aria-label="Schließen"
                                onClick={() => setShowForm(false)}
                                className="rounded-lg p-2 hover:bg-accent"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        <div className="space-y-1.5">
                            <label
                                htmlFor="event-title-input"
                                className="text-sm font-medium"
                            >
                                Titel
                            </label>

                            <input
                                id="event-title-input"
                                name="title"
                                required
                                defaultValue={editingEvent?.title ?? ""}
                                placeholder="z. B. Team-Meeting"
                                className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label
                                htmlFor="event-description"
                                className="text-sm font-medium"
                            >
                                Beschreibung
                            </label>

                            <textarea
                                id="event-description"
                                name="description"
                                rows={3}
                                defaultValue={editingEvent?.description ?? ""}
                                placeholder="Worum geht es bei diesem Termin?"
                                className="w-full resize-y rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <label
                                    htmlFor="event-start-date"
                                    className="text-sm font-medium"
                                >
                                    Startdatum
                                </label>

                                <input
                                    id="event-start-date"
                                    name="startDate"
                                    type="date"
                                    required
                                    defaultValue={
                                        editingEvent?.startDate ?? selectedDate
                                    }
                                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label
                                    htmlFor="event-end-date"
                                    className="text-sm font-medium"
                                >
                                    Enddatum
                                </label>

                                <input
                                    id="event-end-date"
                                    name="endDate"
                                    type="date"
                                    required
                                    min={editingEvent?.startDate ?? selectedDate}
                                    defaultValue={
                                        editingEvent?.endDate ??
                                        selectedDate
                                    }
                                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label
                                    htmlFor="event-category"
                                    className="text-sm font-medium"
                                >
                                    Kategorie
                                </label>

                                <select
                                    id="event-category"
                                    name="category"
                                    defaultValue={
                                        editingEvent?.category ?? "Meeting"
                                    }
                                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                                >
                                    <option value="Meeting">Meeting</option>
                                    <option value="Projekt">Projekt</option>
                                    <option value="Deadline">Deadline</option>
                                    <option value="Sonstiges">Sonstiges</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label
                                    htmlFor="event-start"
                                    className="text-sm font-medium"
                                >
                                    Beginn
                                </label>

                                <input
                                    id="event-start"
                                    name="start"
                                    type="time"
                                    required
                                    defaultValue={editingEvent?.start ?? "09:00"}
                                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label
                                    htmlFor="event-end"
                                    className="text-sm font-medium"
                                >
                                    Ende
                                </label>

                                <input
                                    id="event-end"
                                    name="end"
                                    type="time"
                                    required
                                    defaultValue={editingEvent?.end ?? "10:00"}
                                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label
                                htmlFor="event-location"
                                className="text-sm font-medium"
                            >
                                Ort
                            </label>

                            <input
                                id="event-location"
                                name="location"
                                defaultValue={editingEvent?.location ?? ""}
                                placeholder="z. B. Besprechungsraum oder Online"
                                className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>

                        <div className="flex justify-end gap-2 border-t pt-4">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent"
                            >
                                Abbrechen
                            </button>

                            <button
                                type="submit"
                                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                            >
                                {editingEvent
                                    ? "Änderungen übernehmen"
                                    : "Termin erstellen"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
