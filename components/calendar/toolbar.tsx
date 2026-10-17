import { ChevronLeft, ChevronRight, CalendarDays, Plus } from "lucide-react";


export default function CalendarToolbar({
    currentDate,
    setCurrentDate,
    view,
    setView,
    navigate,
    openNewEvent,
}: {
    currentDate: Date;
    setCurrentDate: (date: Date) => void;
    view: "month" | "week" | "list";
    setView: (view: "month" | "week" | "list") => void;
    navigate: (direction: -1 | 1) => void;
    openNewEvent: () => void;
}) {
    return (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-accent">
                    <CalendarDays className="size-5" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold">Kalender</h2>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <button
                    type="button"
                    onClick={() => setCurrentDate(new Date())}
                    className="rounded-lg border px-3 py-2 text-sm font-medium transition hover:bg-accent"
                >
                    Heute
                </button>

                <div className="flex items-center rounded-lg border">
                    <button
                        type="button"
                        aria-label="Zurück"
                        onClick={() => navigate(-1)}
                        className="rounded-l-lg p-2.5 transition hover:bg-accent"
                    >
                        <ChevronLeft className="size-4" />
                    </button>
                    <button
                        type="button"
                        aria-label="Weiter"
                        onClick={() => navigate(1)}
                        className="rounded-r-lg border-l p-2.5 transition hover:bg-accent"
                    >
                        <ChevronRight className="size-4" />
                    </button>
                </div>

                <div className="flex rounded-lg bg-accent/60 p-1">
                    {(
                        [
                            ["month", "Monat"],
                            ["week", "Woche"],
                            ["list", "Liste"],
                        ] as const
                    ).map(([key, label]) => (
                        <button
                            key={key}
                            type="button"
                            onClick={() => setView(key)}
                            className={`rounded-md px-3 py-1.5 text-sm transition ${
                                view === key
                                    ? "bg-background font-medium shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={() => openNewEvent()}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                >
                    <Plus className="size-4" />
                    <span>Termin</span>
                </button>
            </div>
        </div>
    );
}
