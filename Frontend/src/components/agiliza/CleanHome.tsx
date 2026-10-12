import { ArrowRight, CalendarDays, Check, CheckCircle2, Clock3, Columns2, LayoutList, ListTodo, Pause, Play, Sun, Target } from "lucide-react";
import { useState } from "react";

import { AppButton } from "@/components/AppButton";
import { cn } from "@/lib/utils";

type HomeTask = { id: number; title: string; area: string; time: string; priority: string; complexity: string; done?: boolean; overdue?: boolean };
type HomeSchedule = { time: string; title: string; meta: string; type: string };
type Layout = "essencial" | "foco" | "agenda";

const layouts = [
  { id: "essencial", label: "Essencial", icon: Columns2 },
  { id: "foco", label: "Foco", icon: Target },
  { id: "agenda", label: "Agenda", icon: LayoutList },
] as const;

export function CleanHome({ tasks, schedule, toggleTask, energy, openTasks, openAgenda, openNew }: {
  tasks: HomeTask[]; schedule: HomeSchedule[]; toggleTask: (id: number) => void; energy: string;
  openTasks: () => void; openAgenda: () => void; openNew: () => void;
}) {
  const [layout, setLayout] = useState<Layout>("essencial");
  const [activeTask, setActiveTask] = useState<number | null>(null);
  const pending = tasks.filter((task) => !task.done);
  const next = pending[0];
  const completed = tasks.length - pending.length;

  const taskList = <section className="min-w-0 bg-muted/70 px-4 py-5 sm:px-6 sm:py-6">
    <div className="mb-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
      <div className="min-w-0"><p className="eyebrow">Um passo de cada vez</p><h2 className="mt-1 font-display text-xl font-semibold">Suas tarefas</h2></div>
      <AppButton variant="ghost" size="sm" onClick={openTasks}>Ver todas <ArrowRight className="size-3.5" /></AppButton>
    </div>
    <div className="divide-y divide-border">
      {(layout === "foco" ? pending.slice(1, 4) : tasks).map((task) => <div key={task.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 py-4">
        <AppButton variant="ghost" size="icon" className={cn("size-7 min-h-7 rounded-full border p-0", task.done ? "border-success bg-success-soft text-success" : "border-input text-muted-foreground hover:border-primary")} aria-label={`${task.done ? "Reabrir" : "Concluir"} ${task.title}`} onClick={() => toggleTask(task.id)}>{task.done && <Check className="size-3.5" />}</AppButton>
        <div className="min-w-0"><p className={cn("text-sm font-medium leading-5", task.done && "text-muted-foreground line-through")}>{task.title}</p><p className="mt-1 text-xs text-muted-foreground">{task.area}{task.overdue && !task.done && <span className="ml-2 text-danger">Atrasada</span>}</p></div>
        <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{task.time}</span>
      </div>)}
      {layout === "foco" && pending.length <= 1 && <p className="py-5 text-sm text-muted-foreground">Nada mais na fila por enquanto.</p>}
    </div>
  </section>;

  const agenda = <section className="min-w-0">
    <div className="mb-5 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2"><div className="min-w-0"><p className="eyebrow">No seu ritmo</p><h2 className="mt-1 font-display text-xl font-semibold">Agenda do dia</h2></div><AppButton variant="ghost" size="icon" aria-label="Abrir agenda completa" onClick={openAgenda}><ArrowRight className="size-4" /></AppButton></div>
    <div>{schedule.map((item, index) => <div key={item.time} className="grid grid-cols-[48px_16px_minmax(0,1fr)] gap-3">
      <span className="pt-0.5 text-xs font-medium tabular-nums text-muted-foreground">{item.time}</span>
      <div className="flex flex-col items-center"><span className={cn("mt-1 size-2 shrink-0 rounded-full", item.type === "health" ? "bg-success" : item.type === "study" ? "bg-highlight" : "bg-primary")} />{index < schedule.length - 1 && <span className="mt-2 w-px flex-1 bg-border" />}</div>
      <div className="min-w-0 pb-7"><p className="text-sm font-medium leading-5">{item.title}</p><p className="mt-1 text-xs text-muted-foreground">{item.meta}</p></div>
    </div>)}</div>
    <AppButton variant="secondary" size="sm" className="mt-1" onClick={openAgenda}><CalendarDays className="size-3.5" />Ver agenda completa</AppButton>
  </section>;

  return <div className="w-full">
    <div className="mb-8 flex flex-col items-center gap-5">
      <p className="self-start text-sm text-muted-foreground">Seu dia, com espaço para o que importa.</p>
      <div role="group" aria-label="Visual da Home" className="grid shrink-0 grid-cols-3 gap-1 rounded-lg bg-muted/60 p-1">
        {layouts.map(({ id, label, icon: Icon }) => <AppButton key={id} variant={layout === id ? "secondary" : "ghost"} size="sm" aria-pressed={layout === id} onClick={() => setLayout(id)} className={cn("gap-1.5 px-3", layout !== id && "border border-transparent")}><Icon className="size-3.5" />{label}</AppButton>)}
      </div>
    </div>

    <div className="mb-8 grid grid-cols-3 gap-2 sm:gap-4">
      {[{ icon: CheckCircle2, value: `${completed}/${tasks.length}`, label: "Concluídas", color: "border-success/30 bg-success-soft", iconColor: "bg-success/10 text-success" }, { icon: ListTodo, value: pending.length, label: "Pendentes", color: "border-primary/30 bg-primary-soft", iconColor: "bg-primary/10 text-primary" }, { icon: Sun, value: energy, label: "Sua energia", color: "border-warning/30 bg-warning-soft", iconColor: "bg-warning/10 text-warning-foreground" }].map(({ icon: Icon, value, label, color, iconColor }) => <div key={label} className={cn("min-w-0 rounded-lg border border-t-2 px-3 py-4 sm:px-5 sm:py-5", color)}><div className="flex flex-col-reverse items-start gap-2 sm:flex-row sm:items-center sm:justify-between"><span className="font-display text-2xl font-bold tabular-nums sm:text-3xl">{value}</span><div className={cn("grid size-8 shrink-0 place-items-center rounded-lg sm:size-10", iconColor)}><Icon className="size-4 sm:size-5" /></div></div><p className="mt-2 text-xs font-semibold text-foreground sm:text-sm">{label}</p></div>)}
    </div>

    {layout !== "agenda" && <section className={cn("mb-10 border-l-2 border-primary bg-primary-soft/80 px-5 py-6 sm:px-7", layout === "foco" && "py-10 sm:py-12")}>
      <div className="grid grid-cols-1 items-center gap-5 sm:grid-cols-[minmax(0,1fr)_auto]">
        <div className="min-w-0"><p className="eyebrow text-primary">{next ? "Seu próximo passo" : "Tudo em dia"}</p><h2 className={cn("mt-2 font-display font-semibold leading-tight", layout === "foco" ? "text-3xl" : "text-2xl")}>{next?.title ?? "Um respiro merecido."}</h2>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">{next ? <><span>{next.area}</span><span className="flex items-center gap-1.5"><Clock3 className="size-3.5" />{next.time}</span><span>{next.priority} prioridade</span></> : <span>Todas as suas tarefas foram concluídas.</span>}</div>
        </div>
        {next ? <div className="flex shrink-0 flex-wrap gap-2"><AppButton onClick={() => setActiveTask(activeTask === next.id ? null : next.id)}>{activeTask === next.id ? <Pause className="size-4" /> : <Play className="size-4" />}{activeTask === next.id ? "Pausar foco" : "Entrar em foco"}</AppButton>{activeTask === next.id && <AppButton variant="secondary" onClick={() => { toggleTask(next.id); setActiveTask(null); }}><Check className="size-4" />Concluir</AppButton>}</div> : <AppButton variant="secondary" onClick={openNew}>Nova tarefa <ArrowRight className="size-4" /></AppButton>}
      </div>
      {activeTask === next?.id && <p role="status" className="mt-4 flex items-center gap-2 text-xs font-medium text-primary"><span className="size-1.5 rounded-full bg-primary" />Em foco agora</p>}
    </section>}

    <div className={cn("grid gap-9 lg:gap-12", layout === "foco" ? "w-full" : layout === "agenda" ? "lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]" : "lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]")}>
      {layout === "agenda" ? <>{agenda}<div className="min-w-0 lg:border-l lg:border-border lg:pl-10">{taskList}</div></> : <>{taskList}{layout !== "foco" && <div className="min-w-0 lg:border-l lg:border-border lg:pl-10">{agenda}</div>}</>}
    </div>
  </div>;
}