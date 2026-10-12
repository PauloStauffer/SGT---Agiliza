import { test } from "node:test";
import { deepStrictEqual } from "node:assert";
import { itemsFor, weekDates, type CalendarItem } from "./agenda-calendar";

test("calendar includes tasks and appointments on their scheduled day", () => {
  const items: CalendarItem[] = [
    { id: "task-1", title: "Relatório", date: "2026-10-08", time: "10:00", area: "Trabalho", kind: "task" },
    { id: "appointment-1", title: "Reunião", date: "2026-10-08", time: "09:00", area: "Trabalho", kind: "appointment" },
  ];
  deepStrictEqual(itemsFor(items, "2026-10-08", "Manhã").map((item) => item.id), ["appointment-1", "task-1"]);
  deepStrictEqual(itemsFor(items, "2026-10-09", "Manhã"), []);
});
test("week calendar covers Monday through Sunday", () => {
  deepStrictEqual(weekDates("2026-10-08"), ["2026-10-05", "2026-10-06", "2026-10-07", "2026-10-08", "2026-10-09", "2026-10-10", "2026-10-11"]);
});