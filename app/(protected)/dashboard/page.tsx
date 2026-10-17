import { EventCalendar } from "@/components/calendar/event-calendar";

export default async function DashboardPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl space-y-6 bg-background px-4 py-6 sm:px-6 sm:py-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Termine, Veranstaltungen und wichtige Ereignisse im Überblick.
        </p>
      </header>

      <section className="overflow-hidden rounded-xl bg-background">
        <EventCalendar
          availableViews={["dayGridMonth", "timeGridWeek", "listWeek"]}
          events={[]}
        />
      </section>
    </main>
  );
}