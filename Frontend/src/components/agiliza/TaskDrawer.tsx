import { Archive, CalendarClock, Check, CheckCircle2, Clock3, Pause, Play, Plus, Sparkles, Trash2, X } from "lucide-react";
import { useState } from "react";

import { AppButton } from "@/components/AppButton";
import { type Area, type Energy, type Task, durations, factors, fmtMin, levels, priorities, suggestSteps } from "@/lib/agiliza-data";
import { cn } from "@/lib/utils";

const statusCls: Record<string, string> = {
  "Não iniciada": "bg-muted text-muted-foreground",
  "Em andamento": "bg-primary-soft text-primary",
  Pausada: "bg-highlight-soft text-highlight-foreground",
  Concluída: "bg-success-soft text-success",
};

export function TaskDrawer({ task, areas, goals, energy, onChange, onClose, onDelete, notify }: { task: Task; areas: Area[]; goals: string[]; energy: Energy; onChange: (t: Task) => void; onClose: () => void; onDelete: (id: number, archived: boolean) => void; notify: (m: string) => void }) {
  const [sub, setSub] = useState("");
  const [suggestions, setSuggestions] = useState<string[] | null>(null);
  const up = (patch: Partial<Task>) => onChange({ ...task, ...patch });
  const done = task.subtasks.filter((s) => s.done).length;
  const now = () => new Date().toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="fixed inset-0 z-[60] flex justify-end bg-overlay" onMouseDown={onClose}>
      <aside className="h-full w-full max-w-xl overflow-y-auto bg-card shadow-2xl animate-in slide-in-from-right" onMouseDown={(e) => e.stopPropagation()}>
        <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-border bg-card px-5 py-4">
          <span className={cn("rounded-md px-2 py-1 text-[10px] font-bold uppercase", statusCls[task.status])}>{task.status}</span>
          {task.postponed >= 3 && <span className="rounded-md bg-danger-soft px-2 py-1 text-[10px] font-bold uppercase text-danger">Adiada {task.postponed}x</span>}
          <AppButton variant="ghost" size="icon" className="ml-auto" aria-label="Fechar" onClick={onClose}><X className="size-5" /></AppButton>
        </div>
        <div className="space-y-6 p-5">
          <div>
            <input value={task.title} onChange={(e) => up({ title: e.target.value })} className="w-full bg-transparent font-display text-2xl font-bold outline-none" />
            <textarea value={task.description ?? ""} onChange={(e) => up({ description: e.target.value })} placeholder="Adicionar descrição…" rows={2} className="mt-2 w-full resize-none rounded-lg bg-muted/60 p-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>

          {/* Execução */}
          <div className="rounded-xl bg-sidebar p-4 text-sidebar-foreground">
            <div className="flex items-center justify-between"><p className="text-xs font-bold uppercase text-sidebar-muted">Execução</p><p className="text-xs text-sidebar-muted">Estimado {fmtMin(task.duration)} · Real {fmtMin(task.spent)}</p></div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-sidebar-border"><div className={cn("h-full rounded-full", task.spent > task.duration ? "bg-danger" : "bg-highlight")} style={{ width: `${Math.min(100, (task.spent / task.duration) * 100)}%` }} /></div>
            <div className="mt-4 flex flex-wrap gap-2">
              {task.status !== "Em andamento" && task.status !== "Concluída" && <AppButton size="sm" onClick={() => { up({ status: "Em andamento" }); notify(`Início registrado às ${now()}`); }}><Play className="size-3.5" />{task.status === "Pausada" ? "Retomar" : "Iniciar"}</AppButton>}
              {task.status === "Em andamento" && <AppButton size="sm" variant="warning" onClick={() => up({ status: "Pausada", spent: task.spent + 25 })}><Pause className="size-3.5" />Pausar</AppButton>}
              {task.status !== "Concluída" ? <AppButton size="sm" variant="secondary" onClick={() => { up({ status: "Concluída", completedAt: now() }); notify("Tarefa concluída!"); }}><Check className="size-3.5" />Concluir</AppButton> : <span className="text-xs text-sidebar-muted">Concluída em {task.completedAt}</span>}
              <label className="ml-auto flex items-center gap-2 text-xs text-sidebar-muted">Tempo real (min)<input type="number" min={0} value={task.spent} onChange={(e) => up({ spent: Number(e.target.value) })} className="h-8 w-16 rounded-md bg-sidebar-panel px-2 text-sidebar-foreground outline-none" /></label>
            </div>
          </div>

          {/* Atributos */}
          <div className="grid grid-cols-2 gap-3">
            <Pick label="Área" value={task.area} options={areas.map((a) => a.name)} onChange={(v) => up({ area: v })} />
            <Pick label="Meta" value={task.goal ?? "Nenhuma"} options={["Nenhuma", ...goals]} onChange={(v) => up({ goal: v === "Nenhuma" ? undefined : v })} />
            <Pick label="Prioridade" value={task.priority} options={priorities} onChange={(v) => up({ priority: v as Task["priority"] })} />
            <Pick label="Criticidade" value={task.criticality} options={levels} onChange={(v) => up({ criticality: v as Task["criticality"] })} />
            <Pick label="Complexidade" value={task.complexity} options={levels} onChange={(v) => up({ complexity: v as Task["complexity"] })} />
            <Pick label="Duração estimada" value={String(task.duration)} options={durations.map(String)} format={(v) => fmtMin(Number(v))} onChange={(v) => up({ duration: Number(v) })} />
            <label className="text-xs font-bold text-muted-foreground">Prazo<input type="date" className="mt-1 h-10 w-full rounded-lg border border-input bg-background px-2 text-sm font-normal text-foreground" /></label>
            <label className="text-xs font-bold text-muted-foreground">Horário limite<input type="time" value={task.dueTime ?? ""} onChange={(e) => up({ dueTime: e.target.value })} className="mt-1 h-10 w-full rounded-lg border border-input bg-background px-2 text-sm font-normal text-foreground" /></label>
          </div>
          <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={!!task.important} onChange={(e) => up({ important: e.target.checked })} className="accent-primary" />Marcar como importante</label>

          {/* Por que é prioridade */}
          <div className="rounded-xl border border-border p-4">
            <p className="flex items-center gap-2 text-sm font-bold"><Sparkles className="size-4 text-primary" />Por que essa prioridade?</p>
            <div className="mt-3 space-y-1.5">{factors(task, energy).map((f) => <div key={f.label} className="flex items-center justify-between text-xs"><span>{f.label}</span><span className={cn("font-bold", f.points > 0 ? "text-success" : f.points < 0 ? "text-danger" : "text-muted-foreground")}>{f.points > 0 ? "+" : ""}{f.points}</span></div>)}</div>
          </div>

          {/* Subtarefas */}
          <div>
            <div className="flex items-center justify-between"><p className="text-sm font-bold">Etapas <span className="text-muted-foreground">{done}/{task.subtasks.length}</span></p>{task.complexity === "Alta" && !suggestions && <AppButton size="sm" variant="ghost" onClick={() => setSuggestions(suggestSteps(task.title))}><Sparkles className="size-3.5" />Sugerir divisão</AppButton>}</div>
            {task.subtasks.length > 0 && <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-success transition-all" style={{ width: `${(done / task.subtasks.length) * 100}%` }} /></div>}
            <div className="mt-3 space-y-1.5">{task.subtasks.map((s) => <div key={s.id} className="flex items-center gap-2 rounded-lg border border-border p-2.5"><button onClick={() => { const subtasks = task.subtasks.map((x) => x.id === s.id ? { ...x, done: !x.done } : x); const all = subtasks.every((x) => x.done); up({ subtasks, ...(all ? { status: "Concluída", completedAt: now() } : {}) }); if (all) notify("Todas as etapas concluídas — tarefa finalizada!"); }} className={cn("grid size-5 place-items-center rounded border-2", s.done ? "border-success bg-success text-success-foreground" : "border-border")}>{s.done && <Check className="size-3" />}</button><span className={cn("flex-1 text-sm", s.done && "text-muted-foreground line-through")}>{s.title}</span><span className="text-[10px] font-bold uppercase text-muted-foreground">{s.done ? "Feita" : "Pendente"}</span></div>)}</div>
            {suggestions && <div className="mt-3 rounded-xl border border-primary/30 bg-primary-soft p-3"><p className="mb-2 text-xs font-bold text-primary">Etapas sugeridas — edite antes de aceitar</p>{suggestions.map((s, i) => <input key={i} value={s} onChange={(e) => setSuggestions(suggestions.map((x, j) => j === i ? e.target.value : x))} className="mb-1.5 h-9 w-full rounded-md border border-border bg-card px-2 text-sm" />)}<div className="mt-2 flex gap-2"><AppButton size="sm" onClick={() => { up({ subtasks: [...task.subtasks, ...suggestions.filter(Boolean).map((t, i) => ({ id: Date.now() + i, title: t, done: false }))] }); setSuggestions(null); }}>Aceitar</AppButton><AppButton size="sm" variant="ghost" onClick={() => setSuggestions(null)}>Rejeitar</AppButton></div></div>}
            <form className="mt-2 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (sub.trim()) { up({ subtasks: [...task.subtasks, { id: Date.now(), title: sub.trim(), done: false }] }); setSub(""); } }}><input value={sub} onChange={(e) => setSub(e.target.value)} placeholder="Nova etapa" className="h-9 flex-1 rounded-lg border border-input bg-background px-3 text-sm outline-none" /><AppButton size="sm" variant="secondary" type="submit"><Plus className="size-3.5" /></AppButton></form>
          </div>

          {task.postponed > 0 && <div className="rounded-xl border border-border p-4 text-sm"><p className="flex items-center gap-2 font-bold"><Clock3 className="size-4" />Histórico de adiamentos</p><p className="mt-1 text-muted-foreground">Adiada {task.postponed} vez(es) · pendente há {task.ageDays} dias.</p></div>}

          <div className="flex flex-wrap gap-2 border-t border-border pt-4">
            <AppButton variant="secondary" size="sm" onClick={() => { up({ postponed: task.postponed + 1, dueDays: task.dueDays + 1, due: "amanhã" }); notify("Reagendada para amanhã"); }}><CalendarClock className="size-3.5" />Reagendar</AppButton>
            <AppButton variant="secondary" size="sm" onClick={() => { up({ status: "Concluída", completedAt: now() }); onClose(); }}><CheckCircle2 className="size-3.5" />Concluir</AppButton>
            <AppButton variant="ghost" size="sm" onClick={() => onDelete(task.id, true)}><Archive className="size-3.5" />Arquivar</AppButton>
            <AppButton variant="ghost" size="sm" className="ml-auto text-danger" onClick={() => onDelete(task.id, false)}><Trash2 className="size-3.5" />Excluir</AppButton>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Pick({ label, value, options, onChange, format }: { label: string; value: string; options: readonly string[]; onChange: (v: string) => void; format?: (v: string) => string }) {
  return <label className="text-xs font-bold text-muted-foreground">{label}<select value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 h-10 w-full rounded-lg border border-input bg-background px-2 text-sm font-semibold text-foreground">{options.map((o) => <option key={o} value={o}>{format ? format(o) : o}</option>)}</select></label>;
}
