import { CalendarDays, Check, Clock3 } from "lucide-react";
import { AppButton } from "@/components/AppButton";
import { cn } from "@/lib/utils";

type CardTask = { id: number; title: string; area: string; time: string; priority: string; complexity: string; done?: boolean; overdue?: boolean; date?: string; startTime?: string };

export function TaskCards({ tasks, toggleTask }: { tasks: CardTask[]; toggleTask: (id: number) => void }) {
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
    {tasks.map((task) => <article key={task.id} className={cn("flex min-w-0 flex-col rounded-lg border border-t-2 p-5 transition-colors", task.done ? "border-success/30 bg-success-soft/80" : task.overdue ? "border-danger/40 bg-danger-soft/80" : task.priority === "Muito alta" || task.priority === "Alta" ? "border-primary/40 bg-primary-soft/80" : "border-border bg-muted")}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-semibold text-muted-foreground">{task.area}</span>
        <span className={cn("rounded-md px-2 py-1 text-[11px] font-semibold", task.done ? "bg-success-soft text-success" : task.overdue ? "bg-danger-soft text-danger" : task.priority === "Muito alta" || task.priority === "Alta" ? "bg-primary-soft text-primary" : "bg-muted text-muted-foreground")}>{task.done ? "Concluída" : task.overdue ? "Atrasada" : task.priority}</span>
      </div>
      <h3 className={cn("min-h-12 break-words font-display text-lg font-semibold leading-6", task.done && "text-muted-foreground line-through")}>{task.title}</h3>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><Clock3 className="size-3.5" />{task.time}</span>
        {task.date && <span className="flex items-center gap-1.5"><CalendarDays className="size-3.5" />{task.date.split("-").reverse().slice(0, 2).join("/")}{task.startTime && ` · ${task.startTime}`}</span>}
      </div>
      <div className="mt-5 flex items-center justify-between gap-2 border-t border-border pt-4">
        <span className="text-xs text-muted-foreground">Complexidade {task.complexity.toLowerCase()}</span>
        <AppButton variant={task.done ? "ghost" : "secondary"} size="sm" aria-label={`${task.done ? "Reabrir" : "Concluir"} ${task.title}`} onClick={() => toggleTask(task.id)}><Check className="size-3.5" />{task.done ? "Reabrir" : "Concluir"}</AppButton>
      </div>
    </article>)}
  </div>;
}