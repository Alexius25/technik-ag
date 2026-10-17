import type { EventCategory } from "./types";

export const categoryStyles: Record<EventCategory, string> = {
  Meeting: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  Projekt: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  Deadline: "bg-red-500/10 text-red-700 dark:text-red-300",
  Sonstiges: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
};

export const categoryDots: Record<EventCategory, string> = {
  Meeting: "bg-blue-500",
  Projekt: "bg-violet-500",
  Deadline: "bg-red-500",
  Sonstiges: "bg-emerald-500",
};