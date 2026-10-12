import { Link, createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  AlarmClock,
  Archive,
  ArrowRight,
  BarChart3,
  Bell,
  Brain,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock3,
  Flame,
  History,
  Inbox,
  LayoutDashboard,
  LayoutGrid,
  List,
  Menu,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  RefreshCw,
  Search,
  Settings2,
  Sparkles,
  Target,
  Timer,
  UserRound,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

import { AppButton } from "@/components/AppButton";
import { WeekCalendar } from "@/components/agiliza/WeekCalendar";
import { demoDate, type CalendarItem } from "@/lib/agenda-calendar";
import { BrandLockup } from "@/components/BrandLogo";
import { CleanHome } from "@/components/agiliza/CleanHome";
import { TaskCards } from "@/components/agiliza/TaskCards";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Agiliza — Gestão inteligente do tempo" },
      { name: "description", content: "Organize tarefas, compromissos e áreas da vida em um planejamento simples e inteligente." },
      { property: "og:title", content: "Agiliza — Gestão inteligente do tempo" },
      { property: "og:description", content: "Planeje seu dia, equilibre suas prioridades e avance no seu ritmo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type View = "Hoje" | "Agenda" | "Tarefas" | "Entrada" | "Áreas" | "Histórico";
type Task = { id: number; title: string; area: string; time: string; priority: string; complexity: string; done?: boolean; overdue?: boolean; date?: string; startTime?: string };

const initialTasks: Task[] = [
  { id: 1, title: "Finalizar relatório do projeto", area: "Trabalho", time: "1h 30min", priority: "Muito alta", complexity: "Alta" },
  { id: 2, title: "Revisar capítulo 4 de Estatística", area: "Estudos", time: "50min", priority: "Alta", complexity: "Média" },
  { id: 3, title: "Responder e-mail do orientador", area: "Estudos", time: "15min", priority: "Alta", complexity: "Baixa", overdue: true },
  { id: 4, title: "Treino de corrida", area: "Saúde", time: "40min", priority: "Média", complexity: "Média" },
  { id: 5, title: "Renovar documento", area: "Pessoal", time: "30min", priority: "Baixa", complexity: "Baixa" },
];

const navItems: { label: View; icon: typeof LayoutDashboard; count?: number }[] = [
  { label: "Hoje", icon: LayoutDashboard }, { label: "Agenda", icon: CalendarDays },
  { label: "Tarefas", icon: CheckCircle2, count: 5 }, { label: "Entrada", icon: Inbox, count: 3 },
  { label: "Áreas", icon: Target }, { label: "Histórico", icon: History },
];

const schedule = [
  { time: "09:00", title: "Check-in da equipe", meta: "Trabalho · 30min", type: "work" },
  { time: "10:00", title: "Foco: relatório do projeto", meta: "Trabalho · 1h30", type: "focus" },
  { time: "12:00", title: "Almoço e pausa", meta: "Pessoal · 1h", type: "health" },
  { time: "14:00", title: "Aula de Estatística", meta: "Estudos · 1h30", type: "study" },
  { time: "18:00", title: "Treino de corrida", meta: "Saúde · 40min", type: "health" },
];

function Index() {
  const [view, setView] = useState<View>("Hoje");
  const [tasks, setTasks] = useState(() => initialTasks.map((task) => ({ ...task, date: demoDate, startTime: "" })));
  const [appointments, setAppointments] = useState<CalendarItem[]>(() => schedule.map((item, index) => ({ id: `appointment-${index}`, title: item.title, date: demoDate, time: item.time, area: item.meta.split(" · ")[0] ?? "Pessoal", kind: "appointment" })));
  const calendarItems: CalendarItem[] = [...tasks.map((task) => ({ id: `task-${task.id}`, title: task.title, date: task.date, time: task.startTime, area: task.area, kind: "task" as const, done: task.done })), ...appointments];
  const todaySchedule = appointments.filter((item) => item.date === demoDate).sort((a, b) => a.time.localeCompare(b.time)).map((item) => ({ time: item.time || "—", title: item.title, meta: item.area, type: item.area === "Saúde" ? "health" : item.area === "Estudos" ? "study" : "work" }));
  const saveAgenda = (items: CalendarItem[]) => {
    setTasks((current) => current.map((task) => { const item = items.find((entry) => entry.id === `task-${task.id}`); return item ? { ...task, title: item.title, date: item.date, startTime: item.time } : task; }));
    setAppointments(items.filter((item) => item.kind === "appointment"));
    notify("Agenda atualizada");
  };
  const [energy, setEnergy] = useState<"Baixa" | "Média" | "Alta">("Alta");
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [toast, setToast] = useState("");

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const toggleTask = (id: number) => setTasks((current) => current.map((task) => task.id === id ? { ...task, done: !task.done } : task));

  return (
    <div className="home-clean min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen w-full">
        <Sidebar view={view} setView={setView} energy={energy} setEnergy={setEnergy} mobileNav={mobileNav} closeMobile={() => setMobileNav(false)} collapsed={sidebarCollapsed} toggleCollapsed={() => setSidebarCollapsed((current) => !current)} />

        <main className="min-w-0 flex-1 px-4 pb-24 pt-4 sm:px-6 lg:px-8 lg:pb-8">
          <header className="mb-5 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 pb-3 pt-3 sm:flex sm:gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:pt-7">
            <AppButton variant="secondary" size="icon" className="lg:hidden" aria-label="Abrir menu" onClick={() => setMobileNav(true)}><Menu className="size-5" /></AppButton>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase text-muted-foreground">Quinta-feira, 8 de outubro</p>
              <h1 className="truncate font-display text-2xl font-bold sm:text-3xl">{view === "Hoje" ? "Bom dia, Paulo!" : view}</h1>
            </div>
            <AppButton className="shrink-0" onClick={() => setNewTaskOpen(true)}><Plus className="size-4" /><span className="hidden sm:inline">Nova tarefa</span></AppButton>
          </header>

          {view === "Hoje" && <CleanHome tasks={tasks} schedule={todaySchedule} toggleTask={toggleTask} energy={energy} openTasks={() => setView("Tarefas")} openAgenda={() => setView("Agenda")} openNew={() => setNewTaskOpen(true)} />}
          {view === "Agenda" && <><WeekCalendar items={calendarItems} save={saveAgenda} /><AgendaView notify={notify} entries={todaySchedule} /></>}
          {view === "Tarefas" && <TasksView tasks={tasks} toggleTask={toggleTask} openNew={() => setNewTaskOpen(true)} />}
          {view === "Entrada" && <InboxView notify={notify} />}
          {view === "Áreas" && <AreasView />}
          {view === "Histórico" && <HistoryView />}
        </main>
      </div>

      <nav className="fixed inset-x-3 bottom-3 z-30 flex justify-around rounded-xl border border-border bg-card p-1.5 shadow-xl lg:hidden">
        {navItems.slice(0, 5).map(({ label, icon: Icon }) => <button key={label} onClick={() => setView(label)} className={cn("flex min-w-12 flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-[10px] font-semibold", view === label ? "bg-primary-soft text-primary" : "text-muted-foreground")}><Icon className="size-4" />{label}</button>)}
      </nav>

      {newTaskOpen && <NewTaskModal close={() => setNewTaskOpen(false)} add={(title, area, date, startTime) => { setTasks((current) => [...current, { id: Date.now(), title, area, date, startTime, time: "30min", priority: "Média", complexity: "Média" }]); setNewTaskOpen(false); notify("Tarefa adicionada à sua agenda"); }} />}
      {toast && <div className="fixed bottom-24 right-5 z-50 flex items-center gap-2 rounded-lg bg-sidebar px-4 py-3 text-sm font-semibold text-sidebar-foreground shadow-xl lg:bottom-6"><Check className="size-4 text-highlight" />{toast}</div>}
    </div>
  );
}

function Sidebar({ view, setView, energy, setEnergy, mobileNav, closeMobile, collapsed: manuallyCollapsed, toggleCollapsed }: { view: View; setView: (v: View) => void; energy: string; setEnergy: (e: "Baixa" | "Média" | "Alta") => void; mobileNav: boolean; closeMobile: () => void; collapsed: boolean; toggleCollapsed: () => void }) {
  const [hovered, setHovered] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const collapsed = manuallyCollapsed && !hovered && !keyboardFocus;
  const labelClass = collapsed ? "lg:hidden" : "";
  return <>
    {mobileNav && <button aria-label="Fechar menu" className="fixed inset-0 z-40 bg-overlay lg:hidden" onClick={closeMobile} />}
    <aside id="main-sidebar" aria-label="Menu principal" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={(event) => { if (event.target.matches(":focus-visible")) setKeyboardFocus(true); }} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setKeyboardFocus(false); }} className={cn("fixed inset-y-0 left-0 z-50 flex w-72 shrink-0 flex-col bg-sidebar px-5 py-6 text-sidebar-foreground transition-[width,transform,padding] duration-200 motion-reduce:transition-none lg:sticky lg:top-0 lg:h-screen lg:border-r lg:border-border lg:translate-x-0", collapsed ? "lg:w-20 lg:px-3" : "lg:w-60", mobileNav ? "translate-x-0" : "-translate-x-full")}>
      <div className={cn("mb-10 flex items-center justify-between gap-2", collapsed && "lg:flex-col lg:gap-4")}>
        <div className="min-w-0"><BrandLockup textClassName={cn("text-sidebar-foreground", labelClass)} /></div>
        <AppButton variant="ghost" size="icon" className="hidden shrink-0 text-sidebar-muted lg:inline-flex" aria-label={manuallyCollapsed ? "Fixar barra lateral expandida" : "Ativar expansão automática"} title={manuallyCollapsed ? "Fixar barra lateral expandida" : "Ativar expansão automática"} aria-expanded={!collapsed} aria-controls="main-sidebar" onClick={toggleCollapsed}>{manuallyCollapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}</AppButton>
        <AppButton variant="ghost" size="icon" className="text-sidebar-muted lg:hidden" onClick={closeMobile}><X className="size-5" /></AppButton>
      </div>
      <nav className="space-y-1">
        {navItems.map(({ label, icon: Icon, count }) => <AppButton variant="ghost" key={label} aria-label={label} title={collapsed ? label : undefined} onClick={() => { setView(label); closeMobile(); }} className={cn("w-full justify-start gap-3 px-3 py-2.5", collapsed && "lg:justify-center", view === label ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-muted hover:bg-sidebar-accent/60 hover:text-sidebar-foreground")}><Icon className="size-4 shrink-0" /><span className={labelClass}>{label}</span>{count && <span className={cn("ml-auto rounded bg-sidebar-border px-1.5 py-0.5 text-[10px]", labelClass)}>{count}</span>}</AppButton>)}
      </nav>
      <div className="mt-auto space-y-4">
        <div className="border-t border-sidebar-border py-4">
          <div className={cn("mb-3 flex items-center justify-between", collapsed && "lg:justify-center")}><span className={cn("text-xs font-bold uppercase text-sidebar-muted", labelClass)}>Energia agora</span><Activity className="size-4 text-highlight" /></div>
          <div className={cn("grid grid-cols-3 gap-1.5", collapsed && "lg:grid-cols-1")}>{(["Baixa", "Média", "Alta"] as const).map((level) => <AppButton variant="ghost" size="sm" key={level} title={`Energia ${level.toLowerCase()}`} aria-label={`Energia ${level.toLowerCase()}`} aria-pressed={energy === level} onClick={() => setEnergy(level)} className={cn("px-1", energy === level ? "bg-highlight text-highlight-foreground" : "bg-sidebar-border text-sidebar-muted hover:text-sidebar-foreground")}>{level}</AppButton>)}</div>
          <p className={cn("mt-3 text-xs text-sidebar-muted", labelClass)}>{energy === "Alta" ? "Bom momento para tarefas complexas." : energy === "Média" ? "Prefira tarefas de ritmo constante." : "Escolha algo curto e simples."}</p>
        </div>
        <AppButton asChild variant="ghost" className={cn("w-full justify-start", collapsed && "lg:justify-center lg:px-0")}><Link to="/configuracoes" aria-label="Configurações" title={collapsed ? "Configurações" : undefined}><Settings2 className="size-4 shrink-0" /><span className={labelClass}>Configurações</span></Link></AppButton>
        <div className={cn("flex items-center gap-3 border-t border-sidebar-border pt-4", collapsed && "lg:justify-center")}><div title="Paulo Stauffer" className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold">PS</div><div className={cn("min-w-0", labelClass)}><p className="truncate text-sm font-semibold">Paulo Stauffer</p><p className="text-xs text-sidebar-muted">Minha rotina</p></div></div>
      </div>
    </aside>
  </>;
}

function TaskRow({ task, toggle }: { task: Task; toggle: () => void }) { return <div className={cn("group flex items-center gap-3 rounded-lg border border-border p-3 transition-all hover:border-primary/40 hover:bg-accent", task.done ? "bg-success-soft/70" : task.overdue ? "bg-danger-soft/70" : task.priority === "Muito alta" || task.priority === "Alta" ? "bg-primary-soft/70" : "bg-muted")}><button aria-label={task.done ? "Reabrir tarefa" : "Concluir tarefa"} onClick={toggle} className={cn("grid size-6 shrink-0 place-items-center rounded-md border-2 transition-colors", task.done ? "border-success bg-success text-success-foreground" : "border-border group-hover:border-primary")}>{task.done && <Check className="size-4" />}</button><div className="min-w-0 flex-1"><p className={cn("truncate text-sm font-semibold", task.done && "line-through")}>{task.title}</p><p className="mt-0.5 text-xs text-muted-foreground">{task.area} · {task.time} · {task.complexity}</p></div><span className={cn("hidden rounded-md px-2 py-1 text-[10px] font-bold uppercase sm:block", task.overdue ? "bg-danger-soft text-danger" : task.priority === "Muito alta" ? "bg-primary-soft text-primary" : "bg-highlight-soft text-highlight-foreground")}>{task.overdue ? "Atrasada" : task.priority}</span><AppButton variant="ghost" size="icon" aria-label="Mais opções"><MoreHorizontal className="size-4" /></AppButton></div>; }

function AgendaView({ notify, entries }: { notify: (m: string) => void; entries: typeof schedule }) {
  return <div className="space-y-3">
    <h2 className="section-title">Compromissos de hoje</h2>
    <section aria-label="Compromissos do dia" className="space-y-1.5">
      {entries.map((item, index) => <div key={item.time} className="grid grid-cols-[42px_minmax(0,1fr)] items-center gap-2 sm:gap-3">
        <p className="text-xs font-medium tabular-nums text-muted-foreground">{item.time}</p>
        <AppButton variant="ghost" onClick={() => notify(`${item.title} selecionado`)} className={cn("min-h-14 w-full justify-start gap-3 rounded-lg border-l-2 px-3 py-2 text-left hover:bg-accent", index === 3 ? "border-danger/60 bg-danger-soft/80" : item.type === "health" ? "border-success/60 bg-success-soft/80" : item.type === "study" ? "border-highlight/60 bg-highlight-soft/80" : "border-primary/60 bg-primary-soft/80")}>
          <span className="min-w-0 flex-1"><span className="block text-sm font-medium leading-5 text-foreground">{item.title}</span><span className="block text-xs font-normal text-muted-foreground">{item.meta}</span></span>
          {index === 3 && <span className="flex shrink-0 items-center gap-1 text-[10px] font-semibold text-danger" title="Conflito de horário"><AlarmClock className="size-3.5" /><span className="hidden sm:inline">Conflito</span></span>}
        </AppButton>
      </div>)}
    </section>
  </div>;
}

function TasksView({ tasks, toggleTask, openNew }: { tasks: Task[]; toggleTask: (id: number) => void; openNew: () => void }) {
  const [query, setQuery] = useState("");
  const [layout, setLayout] = useState<"cards" | "list">("cards");
  const filtered = useMemo(() => tasks.filter((task) => task.title.toLowerCase().includes(query.toLowerCase())), [tasks, query]);
  return <div className="space-y-6">
    <section className="flex flex-wrap items-center gap-3 border-b border-border pb-5">
      <label className="flex min-w-0 basis-60 flex-1 items-center gap-2 rounded-lg border border-input bg-card px-3"><Search className="size-4 shrink-0 text-muted-foreground" /><input aria-label="Buscar tarefas" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar tarefas" className="h-10 w-full min-w-0 bg-transparent text-sm outline-none" /></label>
      <select aria-label="Área" className="h-10 rounded-lg border border-input bg-background px-3 text-sm"><option>Todas as áreas</option><option>Trabalho</option><option>Estudos</option></select>
      <select aria-label="Ordenação" className="h-10 rounded-lg border border-input bg-background px-3 text-sm"><option>Por prioridade</option><option>Por prazo</option></select>
      <AppButton onClick={openNew}><Plus className="size-4" />Adicionar</AppButton>
    </section>
    <section>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div><p className="eyebrow">{filtered.length} atividades</p><h2 className="section-title">Todas as tarefas</h2></div>
        <div role="group" aria-label="Visualização das tarefas" className="flex gap-1 rounded-lg bg-muted p-1">
          <AppButton variant={layout === "cards" ? "secondary" : "ghost"} size="sm" aria-pressed={layout === "cards"} onClick={() => setLayout("cards")}><LayoutGrid className="size-4" />Cartões</AppButton>
          <AppButton variant={layout === "list" ? "secondary" : "ghost"} size="sm" aria-pressed={layout === "list"} onClick={() => setLayout("list")}><List className="size-4" />Lista</AppButton>
        </div>
      </div>
      {filtered.length === 0 ? <p role="status" className="py-10 text-center text-sm text-muted-foreground">Nenhuma tarefa encontrada.</p> : layout === "cards" ? <TaskCards tasks={filtered} toggleTask={toggleTask} /> : <div className="space-y-2">{filtered.map((task) => <TaskRow key={task.id} task={task} toggle={() => toggleTask(task.id)} />)}</div>}
    </section>
  </div>;
}

function InboxView({ notify }: { notify: (m: string) => void }) { const items = ["Comprar presente para sábado", "Pesquisar referências do TCC", "Marcar consulta no dentista"]; return <section className="bg-muted/60 p-5"><div className="mb-5 flex items-center justify-between"><div><p className="eyebrow">Organize depois</p><h2 className="section-title">Caixa de entrada</h2></div><span className="rounded-lg bg-primary-soft px-3 py-1.5 text-xs font-bold text-primary">3 itens</span></div><div className="space-y-2">{items.map((item) => <div key={item} className="flex items-center gap-3 rounded-lg border border-border bg-card p-4"><Archive className="size-4 text-muted-foreground" /><p className="flex-1 text-sm font-semibold">{item}</p><AppButton variant="secondary" size="sm" onClick={() => notify("Item organizado em Pessoal")}>Organizar</AppButton></div>)}</div></section>; }

function AreasView() { return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[{n:"Trabalho",i:"8 tarefas",v:72,c:"bg-primary",icon:Brain},{n:"Estudos",i:"6 tarefas",v:54,c:"bg-highlight",icon:Target},{n:"Saúde",i:"3 tarefas",v:35,c:"bg-success",icon:Activity},{n:"Pessoal",i:"4 tarefas",v:28,c:"bg-info",icon:UserRound}].map(({n,i,v,c,icon:Icon}) => <section key={n} className={cn("rounded-lg border border-border p-5", c === "bg-primary" ? "bg-primary-soft" : c === "bg-highlight" ? "bg-highlight-soft" : c === "bg-success" ? "bg-success-soft" : "bg-info-soft")}><div className={cn("mb-5 grid size-11 place-items-center rounded-lg text-primary-foreground", c)}><Icon className="size-5" /></div><h2 className="font-display text-xl font-bold">{n}</h2><p className="mt-1 text-sm text-muted-foreground">{i}</p><div className="mt-5 h-2 overflow-hidden rounded-full bg-muted"><div className={cn("h-full rounded-full", c)} style={{width:`${v}%`}} /></div><p className="mt-2 text-xs font-semibold text-muted-foreground">{v}% da meta semanal</p></section>)}</div>; }

function HistoryView() { return <div className="grid gap-4 xl:grid-cols-3"><section className="bg-muted/70 p-5 xl:col-span-2"><p className="eyebrow">Últimos 7 dias</p><h2 className="section-title">Tempo planejado x realizado</h2><div className="mt-8 flex h-56 items-end gap-3 sm:gap-6">{[[70,60],[45,50],[80,73],[60,68],[90,82],[35,30],[48,42]].map(([planned,done],i)=><div key={i} className="flex flex-1 flex-col items-center gap-2"><div className="flex h-44 items-end gap-1"><div className="w-3 rounded-t bg-muted" style={{height:`${planned}%`}}/><div className="w-3 rounded-t bg-primary" style={{height:`${done}%`}}/></div><span className="text-[10px] font-bold text-muted-foreground">{["Q","Q","S","S","D","S","T"][i]}</span></div>)}</div></section><section className="bg-sidebar p-5 text-sidebar-foreground"><p className="eyebrow text-sidebar-muted">Resumo</p><h2 className="mt-1 font-display text-2xl font-bold">Semana produtiva</h2><div className="mt-6 space-y-5"><Metric icon={CheckCircle2} value="18" label="tarefas concluídas" /><Metric icon={Clock3} value="12h 40" label="tempo realizado" /><Metric icon={RefreshCw} value="3" label="reagendamentos" /></div></section></div>; }

function NewTaskModal({ close, add }: { close: () => void; add: (title: string, area: string, date: string, startTime: string) => void }) { const [title, setTitle] = useState(""); const [date, setDate] = useState(demoDate); const [startTime, setStartTime] = useState(""); const [area, setArea] = useState("Trabalho"); return <div className="fixed inset-0 z-[60] grid place-items-center bg-overlay p-4" onMouseDown={close}><div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl animate-scale-in" onMouseDown={(e) => e.stopPropagation()}><div className="mb-5 flex items-center justify-between"><div><p className="eyebrow">Criação rápida</p><h2 className="section-title">Nova tarefa</h2></div><AppButton variant="ghost" size="icon" onClick={close}><X className="size-5" /></AppButton></div><div className="space-y-4"><label className="block text-sm font-semibold">Título<input autoFocus value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="O que precisa ser feito?" className="mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-3 font-normal outline-none focus:ring-2 focus:ring-ring" /></label><div className="grid grid-cols-2 gap-3"><label className="text-sm font-semibold">Área<select value={area} onChange={(e)=>setArea(e.target.value)} className="mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-3 font-normal"><option>Trabalho</option><option>Estudos</option><option>Saúde</option><option>Pessoal</option></select></label><label className="text-sm font-semibold">Prazo<input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-3 font-normal" /></label></div><label className="block text-sm font-semibold">Horário<input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-3 font-normal" /></label><div className="grid grid-cols-3 gap-2">{["Prioridade","Complexidade","Duração"].map((label)=><button key={label} className="rounded-lg border border-border p-3 text-left text-xs font-semibold hover:border-primary hover:bg-primary-soft"><span className="block text-muted-foreground">{label}</span><span className="mt-1 block">Média</span></button>)}</div><AppButton className="w-full" disabled={!title.trim() || !date} onClick={()=>add(title,area,date,startTime)}><Plus className="size-4" />Adicionar à agenda</AppButton></div></div></div>; }

function Tag({ children }: { children: React.ReactNode }) { return <span className="rounded-md bg-primary-foreground/14 px-2.5 py-1.5 text-xs font-semibold">{children}</span>; }
function ScheduleRow({ item }: { item: typeof schedule[number] }) { return <div className="flex items-center gap-3 rounded-lg p-2.5 hover:bg-accent"><span className="w-11 text-xs font-bold text-muted-foreground">{item.time}</span><span className={cn("h-9 w-1 rounded-full", item.type === "health" ? "bg-success" : item.type === "study" ? "bg-highlight" : "bg-primary")} /><div className="min-w-0"><p className="truncate text-sm font-semibold">{item.title}</p><p className="text-xs text-muted-foreground">{item.meta}</p></div></div>; }
function AreaStat({ label, value, color }: { label: string; value: string; color: string }) { return <div><div className="mb-3 flex items-center justify-between"><span className="text-sm font-semibold">{label}</span><span className="text-xs font-bold text-muted-foreground">{value}</span></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className={cn("h-full rounded-full", color)} style={{width:value}} /></div></div>; }
function Metric({ icon: Icon, value, label }: { icon: typeof CheckCircle2; value: string; label: string }) { return <div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-lg bg-sidebar-accent text-highlight"><Icon className="size-5" /></div><div><p className="font-display text-xl font-bold">{value}</p><p className="text-xs text-sidebar-muted">{label}</p></div></div>; }