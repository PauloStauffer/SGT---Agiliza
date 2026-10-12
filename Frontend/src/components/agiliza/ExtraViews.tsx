import { AlarmClock, CalendarClock, CheckCircle2, Clock3, Inbox, Moon, Plus, RefreshCw, Sunrise, Target, TriangleAlert } from "lucide-react";
import { useState } from "react";

import { AppButton } from "@/components/AppButton";
import { type Area, type Goal, type Task, fmtMin, isDone } from "@/lib/agiliza-data";
import { cn } from "@/lib/utils";

export function GoalsView({ goals, setGoals, tasks, areas, open }: { goals: Goal[]; setGoals: (g: Goal[]) => void; tasks: Task[]; areas: Area[]; open: (id: number) => void }) {
  const [title, setTitle] = useState("");
  const [area, setArea] = useState(areas[0]?.name ?? "");
  return <div className="grid gap-4 xl:grid-cols-3">
    <form className="rounded-xl bg-sidebar p-5 text-sidebar-foreground" onSubmit={(e) => { e.preventDefault(); if (title.trim()) { setGoals([...goals, { id: Date.now(), title: title.trim(), area, target: "sem data" }]); setTitle(""); } }}>
      <p className="eyebrow text-sidebar-muted">Nova meta</p><h2 className="mt-1 font-display text-xl font-bold">Onde você quer chegar?</h2>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex.: Ler 6 livros no semestre" className="mt-4 h-11 w-full rounded-lg bg-sidebar-panel px-3 text-sm outline-none" />
      <select value={area} onChange={(e) => setArea(e.target.value)} className="mt-2 h-11 w-full rounded-lg bg-sidebar-panel px-3 text-sm">{areas.map((a) => <option key={a.name}>{a.name}</option>)}</select>
      <AppButton type="submit" variant="warning" className="mt-3 w-full"><Plus className="size-4" />Criar meta</AppButton>
      <p className="mt-3 text-xs text-sidebar-muted">Associe tarefas à meta pelo painel de detalhes da tarefa.</p>
    </form>
    <div className="space-y-4 xl:col-span-2">{goals.map((g) => { const linked = tasks.filter((t) => t.goal === g.title); const d = linked.filter(isDone).length; const pct = linked.length ? Math.round((d / linked.length) * 100) : 0; return <section key={g.id} className="rounded-xl border border-border bg-card p-5"><div className="flex items-start gap-3"><div className="grid size-10 place-items-center rounded-lg bg-primary-soft text-primary"><Target className="size-5" /></div><div className="flex-1"><h3 className="section-title mt-0">{g.title}</h3><p className="text-xs text-muted-foreground">{g.area} · até {g.target}</p></div><span className="font-display text-2xl font-bold">{pct}%</span></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.max(4, pct)}%` }} /></div><div className="mt-3 flex flex-wrap gap-2">{linked.length ? linked.map((t) => <button key={t.id} onClick={() => open(t.id)} className={cn("rounded-md border px-2.5 py-1 text-xs font-semibold", isDone(t) ? "border-success/30 bg-success-soft text-success line-through" : "border-border hover:bg-accent")}>{t.title}</button>) : <span className="text-xs text-muted-foreground">Nenhuma tarefa associada ainda.</span>}</div></section>; })}</div>
  </div>;
}

export function ReviewView({ tasks, setTasks, notify }: { tasks: Task[]; setTasks: (fn: (t: Task[]) => Task[]) => void; notify: (m: string) => void }) {
  const [tab, setTab] = useState<"dia" | "amanha" | "semana">("dia");
  const pending = tasks.filter((t) => !isDone(t));
  const [selected, setSelected] = useState<number[]>(() => pending.slice(0, 4).map((t) => t.id));
  const [notes, setNotes] = useState("");
  const available = 300;
  const selMin = pending.filter((t) => selected.includes(t.id)).reduce((a, t) => a + t.duration, 0);
  const reschedule = (id: number) => { setTasks((ts) => ts.map((t) => t.id === id ? { ...t, postponed: t.postponed + 1, dueDays: Math.max(1, t.dueDays + 1), due: "amanhã" } : t)); notify("Reagendada para amanhã"); };
  const tabs = [{ id: "dia", label: "Encerrar o dia", icon: Moon }, { id: "amanha", label: "Planejar amanhã", icon: Sunrise }, { id: "semana", label: "Revisão da semana", icon: RefreshCw }] as const;
  return <div className="space-y-4">
    <div className="flex gap-1 overflow-x-auto rounded-xl bg-muted p-1">{tabs.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setTab(id)} className={cn("flex flex-1 shrink-0 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold", tab === id ? "bg-card shadow-sm" : "text-muted-foreground")}><Icon className="size-4" />{label}</button>)}</div>
    {tab === "dia" && <div className="grid gap-4 lg:grid-cols-2">
      <section className="rounded-xl border border-border bg-card p-5"><p className="eyebrow">Concluídas hoje</p><h3 className="section-title">{tasks.filter(isDone).length} tarefas feitas</h3><div className="mt-3 space-y-1.5">{tasks.filter(isDone).map((t) => <p key={t.id} className="flex items-center gap-2 text-sm"><CheckCircle2 className="size-4 text-success" />{t.title}</p>)}{!tasks.some(isDone) && <p className="text-sm text-muted-foreground">Nada concluído ainda — tudo bem, amanhã é outro dia.</p>}</div></section>
      <section className="rounded-xl border border-border bg-card p-5"><p className="eyebrow">Não concluídas</p><h3 className="section-title">Decida o destino</h3><div className="mt-3 space-y-2">{pending.slice(0, 6).map((t) => <div key={t.id} className="flex items-center gap-2 rounded-lg border border-border p-2.5"><span className="flex-1 truncate text-sm font-semibold">{t.title}{(t.dueDays <= 1 || t.criticality === "Alta") && <span className="ml-2 rounded bg-warning-soft px-1.5 py-0.5 text-[10px] font-bold text-warning-foreground">Atenção amanhã</span>}</span><AppButton size="sm" variant="secondary" onClick={() => reschedule(t.id)}><CalendarClock className="size-3.5" />Amanhã</AppButton></div>)}</div><AppButton className="mt-4 w-full" onClick={() => notify("Revisão do dia finalizada. Bom descanso!")}><Moon className="size-4" />Finalizar revisão</AppButton></section>
    </div>}
    {tab === "amanha" && <div className="grid gap-4 lg:grid-cols-3">
      <section className="rounded-xl border border-border bg-card p-5 lg:col-span-2"><p className="eyebrow">Tarefas pendentes</p><h3 className="section-title">Escolha o que entra amanhã</h3><div className="mt-3 space-y-2">{pending.map((t) => { const on = selected.includes(t.id); return <button key={t.id} onClick={() => setSelected(on ? selected.filter((x) => x !== t.id) : [...selected, t.id])} className={cn("flex w-full items-center gap-3 rounded-lg border p-3 text-left", on ? "border-primary bg-primary-soft" : "border-border hover:bg-accent")}><span className={cn("size-4 rounded border-2", on ? "border-primary bg-primary" : "border-border")} /><span className="flex-1 text-sm font-semibold">{t.title}</span><span className="text-xs text-muted-foreground">{fmtMin(t.duration)}</span></button>; })}</div></section>
      <section className="space-y-4"><div className={cn("rounded-xl p-5", selMin > available ? "bg-danger-soft" : "bg-success-soft")}><p className="eyebrow">Tempo disponível amanhã</p><p className="mt-1 font-display text-3xl font-bold">{fmtMin(selMin)} <span className="text-base text-muted-foreground">/ {fmtMin(available)}</span></p><p className="mt-2 text-sm">{selMin > available ? "Sobrecarga: remova alguma tarefa." : "Planejamento realista."}</p></div><div className="rounded-xl border border-border bg-card p-5"><p className="eyebrow">Compromissos de amanhã</p>{["08:00 · Aula de Banco de Dados", "13:30 · Reunião de estágio", "19:00 · Academia"].map((c) => <p key={c} className="mt-2 text-sm font-semibold">{c}</p>)}</div><AppButton className="w-full" onClick={() => notify("Amanhã planejado!")}><Sunrise className="size-4" />Confirmar plano</AppButton></section>
    </div>}
    {tab === "semana" && <div className="grid gap-4 lg:grid-cols-3">
      {[{ l: "Planejadas", v: tasks.length, i: CalendarClock }, { l: "Concluídas", v: tasks.filter(isDone).length, i: CheckCircle2 }, { l: "Atrasadas", v: tasks.filter((t) => t.dueDays < 0 && !isDone(t)).length, i: AlarmClock }, { l: "Reagendadas", v: tasks.reduce((a, t) => a + t.postponed, 0), i: RefreshCw }, { l: "Tempo estimado", v: fmtMin(tasks.reduce((a, t) => a + t.duration, 0)), i: Clock3 }, { l: "Tempo real", v: fmtMin(tasks.reduce((a, t) => a + t.spent, 0) + 640), i: Clock3 }].map(({ l, v, i: Icon }) => <div key={l} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"><div className="grid size-10 place-items-center rounded-lg bg-highlight-soft text-highlight-foreground"><Icon className="size-5" /></div><div><p className="font-display text-2xl font-bold">{v}</p><p className="text-xs text-muted-foreground">{l}</p></div></div>)}
      <section className="rounded-xl border border-border bg-card p-5 lg:col-span-3"><p className="eyebrow">Observações</p><h3 className="section-title">Como foi sua semana?</h3><textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="O que funcionou? O que mudar na próxima?" className="mt-3 w-full rounded-lg border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring" /><AppButton className="mt-3" onClick={() => notify("Revisão semanal salva")}>Salvar revisão</AppButton></section>
    </div>}
  </div>;
}

export function NotificationsPanel({ tasks, inboxCount, close, open }: { tasks: Task[]; inboxCount: number; close: () => void; open: (id: number) => void }) {
  const items = [
    ...tasks.filter((t) => !isDone(t) && t.dueDays < 0).map((t) => ({ id: t.id, icon: AlarmClock, cls: "text-danger", title: `${t.title} está atrasada`, sub: `Venceu ${t.due}` })),
    ...tasks.filter((t) => !isDone(t) && t.dueDays >= 0 && t.dueDays <= 3 && t.area === "Estudos").map((t) => ({ id: t.id, icon: CalendarClock, cls: "text-primary", title: `Entrega: ${t.title}`, sub: `Prazo ${t.due} — reserve ${fmtMin(t.duration)}` })),
    ...tasks.filter((t) => !isDone(t) && t.postponed >= 3).map((t) => ({ id: t.id, icon: TriangleAlert, cls: "text-warning", title: `${t.title} foi adiada ${t.postponed}x`, sub: `Pendente há ${t.ageDays} dias` })),
  ];
  return <>
    <button aria-label="Fechar avisos" className="fixed inset-0 z-40" onClick={close} />
    <div className="absolute right-0 top-12 z-50 w-80 rounded-xl border border-border bg-card p-2 shadow-2xl">
      <p className="px-3 py-2 text-sm font-bold">Avisos</p>
      {inboxCount > 0 && <div className="flex gap-3 rounded-lg p-3"><Inbox className="size-4 shrink-0 text-info" /><div><p className="text-sm font-semibold">{inboxCount} itens sem organizar</p><p className="text-xs text-muted-foreground">Na caixa de entrada</p></div></div>}
      {items.map((n, i) => <button key={i} onClick={() => { open(n.id); close(); }} className="flex w-full gap-3 rounded-lg p-3 text-left hover:bg-accent"><n.icon className={cn("size-4 shrink-0", n.cls)} /><div><p className="text-sm font-semibold">{n.title}</p><p className="text-xs text-muted-foreground">{n.sub}</p></div></button>)}
    </div>
  </>;
}
