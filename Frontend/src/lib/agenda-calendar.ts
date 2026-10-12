import { addDays, format, startOfWeek } from "date-fns";

export const demoDate = "2026-10-08";
export type CalendarItem = { id: string; title: string; date: string; time: string; area: string; kind: "task" | "appointment"; done?: boolean | undefined };
export function weekDates(date: string) {
  const start = startOfWeek(new Date(`${date}T12:00:00`), { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, i) => format(addDays(start, i), "yyyy-MM-dd"));
}
export function periodFor(time: string) {
  if (!time) return "Sem horário";
  const hour = Number(time.split(":")[0]);
  return hour < 12 ? "Manhã" : hour < 18 ? "Tarde" : "Noite";
}
export function itemsFor(items: CalendarItem[], date: string, period: string) {
  return items.filter((item) => item.date === date && periodFor(item.time) === period).sort((a, b) => a.time.localeCompare(b.time));
}