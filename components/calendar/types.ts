export type EventCategory = "Meeting" | "Projekt" | "Deadline" | "Sonstiges";

export type CalendarEvent = {
  id: number;
  title: string;
  description: string;
  date: string;
  start: string;
  end: string;
  location: string;
  category: EventCategory;
};

export const weekdays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];