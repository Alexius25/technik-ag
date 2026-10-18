"use client"

import { useEffect, useState } from "react"
import { EventCalendar } from "@/components/calendar/event-calendar"
import { EventInput } from '@fullcalendar/react/public-api';
import deLocale from '@fullcalendar/react/locales/de';

interface MyCustomMetadata {
  room?: string;
}

const herbstferienBW2026: EventInput = {
  id: 'ferien-bw-herbst-2026',
  title: 'Herbstferien',
  start: '2026-10-24',  // Startet mit dem ersten Ferien-Samstag
  end: '2026-11-02',    // Exklusives Ende (Erster Schultag ist Montag, der 02.11.)
  allDay: true,
  display: 'block',     // Wird als solider Balken gerendert
  backgroundColor: '#ff9f89', // Ein herbstlicher Farbton
  borderColor: '#ff9f89',
  editable: false,      // Ferien sollten im Kalender nicht verschiebbar sein
  extendedProps: {
    type: 'school-holiday',
    region: 'BW'
  }
};

const events: EventInput[] = [
    {
        id: "1",
        title: "Schubertiade \n Generalprobe",
        start: "2026-10-20T14:00:00",
        end: "2026-10-20T15:30:00",
        backgroundColor: "#ff9f89",
        extendedProps: {
            room: "Aula"
        } as MyCustomMetadata
    },
    {
        id: "2",
        title: "Schubertiade",
        start: "2026-10-21T18:00:00",
        end: "2026-10-21T20:00:00",
        backgroundColor: "#ff9f89",
        extendedProps: {
            room: "Aula"
        } as MyCustomMetadata
    },
    herbstferienBW2026
]

export default function DashboardPage() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)")

    const update = () => setIsMobile(mediaQuery.matches)

    update()
    mediaQuery.addEventListener("change", update)

    return () => mediaQuery.removeEventListener("change", update)
  }, [])

  return (
    <EventCalendar
      className="my-10 mx-auto w-full max-w-[1800px]"
      editable
      selectable
      nowIndicator
      navLinks
      timeZone="UTC"
      events={events}
      addButton={{
        text: "Event hinzufügen",
        click() {
          alert("add event...")
        },
      }}
      height={isMobile ? 800 : 800}
      eventTimeFormat={{hour12: false, hour: "2-digit"}}
      slotHeaderFormat={{hour12: false, hour: "2-digit"}}
      locale={deLocale}
    />
  )
}