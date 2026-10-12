import { useState } from "react";
import { addDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarDays, ChevronLeft, ChevronRight, Pencil, Plus, X } from "lucide-react";
import { AppButton } from "@/components/AppButton";
import { cn } from "@/lib/utils";
import { demoDate, itemsFor, weekDates, type CalendarItem } from "@/lib/agenda-calendar";

export function WeekCalendar({ items, save }: { items: CalendarItem[]; save: (items: CalendarItem[]) => void }) {
  const [date, setDate] = useState(demoDate);
  const [draft, setDraft] = useState<CalendarItem[] | null>(null);
  const days = weekDates(date);
  const first = days[0] ?? date;
  const last = days[6] ?? date;
  const shift = (amount: number) => setDate(format(addDays(new Date(`${date}T12:00:00`), amount), "yyyy-MM-dd"));
  const update = (id: string, patch: Partial<CalendarItem>) => setDraft((current) => current?.map((item) => item.id === id ? { ...item, ...patch } : item) ?? null);
  return <section aria-label="Calendário semanal" className="mb-6 border-b border-border pb-6">
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2"><CalendarDays className="size-5 text-primary" /><h2 className="section-title">Sua semana</h2></div>
      <AppButton variant="secondary" size="sm" onClick={() => setDraft(items.map((item) => ({ ...item })))}><Pencil className="size-3.5" />Alterar agenda</AppButton>
    </div>
    <div className="mb-3 flex flex-wrap items-center gap-2">
      <AppButton variant="ghost" size="icon" className="size-8 min-h-8" aria-label="Semana anterior" onClick={() => shift(-7)}><ChevronLeft className="size-4" /></AppButton>
      <p className="text-sm font-semibold">{format(new Date(`${first}T12:00:00`), "d MMM", { locale: ptBR })} – {format(new Date(`${last}T12:00:00`), "d MMM yyyy", { locale: ptBR })}</p>
      <AppButton variant="ghost" size="icon" className="size-8 min-h-8" aria-label="Próxima semana" onClick={() => shift(7)}><ChevronRight className="size-4" /></AppButton>
      <AppButton variant="ghost" size="sm" onClick={() => setDate(demoDate)}>Hoje</AppButton>
    </div>
    <div className="overflow-x-auto">
      <div className="grid min-w-[840px] grid-cols-[72px_repeat(7,minmax(0,1fr))] border-l border-t border-border" role="table" aria-label="Tarefas e compromissos da semana">
        <div className="border-b border-r border-border bg-muted/40" />
        {days.map((day) => <div key={day} className={cn("border-b border-r border-border py-3 text-center", day === demoDate ? "bg-primary-soft/40" : "bg-muted/40")}><p className="text-xs capitalize text-muted-foreground">{format(new Date(`${day}T12:00:00`), "EEE", { locale: ptBR })}</p><p className={cn("mt-1 font-display text-lg font-semibold", day === demoDate && "text-primary")}>{day.slice(-2)}</p></div>)}
        {["Sem horário", "Manhã", "Tarde", "Noite"].map((period) => <CalendarRow key={period} period={period} days={days} items={items} />)}
      </div>
    </div>
    <div className="mt-3 flex gap-4 text-xs text-muted-foreground"><span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-primary" />Tarefas</span><span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-success" />Compromissos</span></div>
    {draft && <div className="fixed inset-0 z-[60] grid place-items-center bg-overlay p-4">
      <section role="dialog" aria-modal="true" aria-labelledby="edit-agenda-title" className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-border bg-card p-5 shadow-xl">
        <div className="mb-5 flex items-center justify-between"><h2 id="edit-agenda-title" className="section-title">Alterar agenda</h2><AppButton variant="ghost" size="icon" aria-label="Fechar edição" onClick={() => setDraft(null)}><X className="size-4" /></AppButton></div>
        <div className="divide-y divide-border">{draft.map((item) => <div key={item.id} className="grid gap-2 py-3 sm:grid-cols-[minmax(0,1fr)_150px_110px]">
          <label className="text-xs text-muted-foreground">{item.kind === "task" ? "Tarefa" : "Compromisso"}<input aria-label={`Título de ${item.title}`} value={item.title} onChange={(e) => update(item.id, { title: e.target.value })} className="mt-1 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground" /></label>
          <label className="text-xs text-muted-foreground">Data<input aria-label={`Data de ${item.title}`} type="date" value={item.date} onChange={(e) => update(item.id, { date: e.target.value })} className="mt-1 h-10 w-full rounded-lg border border-input bg-background px-2 text-sm text-foreground" /></label>
          <label className="text-xs text-muted-foreground">Horário<input aria-label={`Horário de ${item.title}`} type="time" value={item.time} onChange={(e) => update(item.id, { time: e.target.value })} className="mt-1 h-10 w-full rounded-lg border border-input bg-background px-2 text-sm text-foreground" /></label>
        </div>)}</div>
        <AppButton variant="ghost" size="sm" onClick={() => setDraft((current) => [...(current ?? []), { id: `appointment-${Date.now()}`, title: "", date, time: "09:00", area: "Pessoal", kind: "appointment" }])}><Plus className="size-4" />Novo compromisso</AppButton>
        <div className="mt-5 flex justify-end gap-2"><AppButton variant="secondary" onClick={() => setDraft(null)}>Cancelar</AppButton><AppButton disabled={draft.some((item) => !item.title.trim() || !item.date)} onClick={() => { save(draft); setDraft(null); }}>Salvar alterações</AppButton></div>
      </section>
    </div>}
  </section>;
}

function CalendarRow({ period, days, items }: { period: string; days: string[]; items: CalendarItem[] }) {
  return <><div className="border-b border-r border-border bg-muted/30 px-2 py-3 text-xs font-medium text-muted-foreground">{period}</div>{days.map((day) => <div key={day} className={cn("min-h-20 space-y-1.5 border-b border-r border-border p-1.5", day === demoDate && "bg-primary-soft/10")}>
    {itemsFor(items, day, period).map((item) => <div key={item.id} title={`${item.title} · ${item.area}`} className={cn("rounded-md border-l-2 px-2 py-1.5", item.kind === "task" ? "border-primary bg-primary-soft/50" : "border-success bg-success-soft/50", item.done && "opacity-60")}>
      <p className="text-[10px] font-medium tabular-nums text-muted-foreground">{item.time || "Sem horário"}</p><p className={cn("mt-0.5 break-words text-xs font-medium leading-4", item.done && "line-through")}>{item.title}</p>
    </div>)}
  </div>)}</>;
}