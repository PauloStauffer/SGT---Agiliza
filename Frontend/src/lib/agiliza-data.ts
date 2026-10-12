export type Status = "Não iniciada" | "Em andamento" | "Pausada" | "Concluída";
export type Level = "Baixa" | "Média" | "Alta";
export type Priority = "Muito alta" | "Alta" | "Média" | "Baixa";
export type Energy = Level;
export type Subtask = { id: number; title: string; done: boolean };
export type Task = {
  id: number;
  title: string;
  description?: string;
  area: string;
  duration: number;
  priority: Priority;
  criticality: Level;
  complexity: Level;
  due: string; // "hoje" | "amanhã" | "em 3 dias" ...
  dueDays: number; // dias até o prazo (negativo = vencida)
  dueTime?: string;
  status: Status;
  important?: boolean;
  postponed: number;
  spent: number;
  subtasks: Subtask[];
  goal?: string | undefined;
  completedAt?: string;
  ageDays: number;
};

export type InboxItem = { id: number; title: string };
export type Area = { name: string; color: string };
export type Goal = { id: number; title: string; area: string; target: string };

export const priorities: Priority[] = ["Muito alta", "Alta", "Média", "Baixa"];
export const levels: Level[] = ["Baixa", "Média", "Alta"];
export const durations = [15, 30, 45, 60, 90, 120, 180];

export const initialAreas: Area[] = [
  { name: "Trabalho", color: "bg-primary" },
  { name: "Estudos", color: "bg-highlight" },
  { name: "Família", color: "bg-warning" },
  { name: "Saúde", color: "bg-success" },
  { name: "Pessoal", color: "bg-info" },
  { name: "Relacionamento", color: "bg-danger" },
];

const base = { postponed: 0, spent: 0, subtasks: [], ageDays: 1, status: "Não iniciada" as Status };
export const initialTasks: Task[] = [
  { ...base, id: 1, title: "Finalizar relatório do projeto", description: "Consolidar resultados da sprint e enviar ao gestor.", area: "Trabalho", duration: 90, priority: "Muito alta", criticality: "Alta", complexity: "Alta", due: "hoje", dueDays: 0, dueTime: "17:00", important: true, goal: "Entregar projeto da sprint" },
  { ...base, id: 2, title: "Revisar capítulo 4 de Estatística", area: "Estudos", duration: 50, priority: "Alta", criticality: "Média", complexity: "Média", due: "amanhã", dueDays: 1, important: true, goal: "Passar em Estatística" },
  { ...base, id: 3, title: "Responder e-mail do orientador", area: "Estudos", duration: 15, priority: "Alta", criticality: "Alta", complexity: "Baixa", due: "ontem", dueDays: -1, postponed: 3, ageDays: 9 },
  { ...base, id: 4, title: "Treino de corrida", area: "Saúde", duration: 40, priority: "Média", criticality: "Baixa", complexity: "Média", due: "hoje", dueDays: 0, dueTime: "18:00" },
  { ...base, id: 5, title: "Renovar documento", area: "Pessoal", duration: 30, priority: "Baixa", criticality: "Média", complexity: "Baixa", due: "em 12 dias", dueDays: 12, important: true, ageDays: 24, postponed: 4 },
  { ...base, id: 6, title: "Fazer TCC", area: "Estudos", duration: 180, priority: "Muito alta", criticality: "Alta", complexity: "Alta", due: "em 20 dias", dueDays: 20, important: true, goal: "Passar em Estatística", subtasks: [
    { id: 61, title: "Definir tema", done: true }, { id: 62, title: "Pesquisar referências", done: true }, { id: 63, title: "Criar estrutura", done: false }, { id: 64, title: "Escrever introdução", done: false },
  ] },
  { ...base, id: 7, title: "Levar mãe ao médico", area: "Família", duration: 120, priority: "Alta", criticality: "Alta", complexity: "Baixa", due: "em 2 dias", dueDays: 2, dueTime: "09:30" },
  { ...base, id: 8, title: "Marcar jantar", area: "Relacionamento", duration: 15, priority: "Média", criticality: "Baixa", complexity: "Baixa", due: "em 4 dias", dueDays: 4 },
];

export const initialGoals: Goal[] = [
  { id: 1, title: "Entregar projeto da sprint", area: "Trabalho", target: "30 de outubro" },
  { id: 2, title: "Passar em Estatística", area: "Estudos", target: "15 de dezembro" },
];

export const isDone = (t: Task) => t.status === "Concluída";

export const fmtMin = (m: number) => {
  if (m < 60) return `${m}min`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r ? `${h}h ${r}min` : `${h}h`;
};

const pVal: Record<Priority, number> = { "Muito alta": 4, Alta: 3, Média: 2, Baixa: 1 };
const lVal: Record<Level, number> = { Baixa: 1, Média: 2, Alta: 3 };

export function factors(t: Task, energy: Energy, freeMin = 240) {
  const f: { label: string; points: number }[] = [];
  const deadline = t.dueDays < 0 ? 40 : t.dueDays === 0 ? 30 : t.dueDays <= 2 ? 18 : t.dueDays <= 7 ? 8 : 2;
  f.push({ label: t.dueDays < 0 ? "Prazo vencido" : t.dueDays === 0 ? "Vence hoje" : `Prazo ${t.due}`, points: deadline });
  f.push({ label: `Prioridade ${t.priority.toLowerCase()}`, points: pVal[t.priority] * 6 });
  f.push({ label: `Criticidade ${t.criticality.toLowerCase()}`, points: lVal[t.criticality] * 6 });
  const fit = energy === "Baixa" ? (t.complexity === "Alta" ? -15 : t.complexity === "Baixa" ? 8 : 0) : energy === "Alta" && t.complexity === "Alta" ? 6 : 0;
  f.push({ label: `Complexidade ${t.complexity.toLowerCase()} x energia ${energy.toLowerCase()}`, points: fit });
  f.push({ label: t.duration <= freeMin ? `Cabe no tempo livre (${fmtMin(t.duration)})` : "Maior que o tempo livre", points: t.duration <= freeMin ? 4 : -10 });
  return f;
}

export const score = (t: Task, energy: Energy) => {
  let s = factors(t, energy).reduce((a, b) => a + b.points, 0);
  // energia baixa: só mostra alta complexidade se for crítica e urgente
  if (energy === "Baixa" && t.complexity === "Alta" && !(t.criticality === "Alta" && t.dueDays <= 0)) s -= 30;
  return s;
};

export type Quadrant = "Urgente" | "Importante, não urgente" | "Aproximando da urgência" | "Outras";
export function quadrant(t: Task): Quadrant {
  const urgent = t.dueDays <= 0 || (t.dueDays <= 1 && t.criticality === "Alta");
  if (urgent) return "Urgente";
  if (t.dueDays <= 3) return "Aproximando da urgência";
  if (t.important || t.criticality === "Alta" || pVal[t.priority] >= 3) return "Importante, não urgente";
  return "Outras";
}

export function deadlineState(t: Task) {
  if (isDone(t)) return null;
  if (t.dueDays < 0) return { label: "Atrasada", cls: "bg-danger-soft text-danger" };
  if (t.dueDays <= 1) return { label: "Vence logo", cls: "bg-warning-soft text-warning-foreground" };
  return null;
}

export function suggestSteps(title: string) {
  return ["Entender o que precisa ser entregue", `Separar materiais para "${title}"`, "Fazer a primeira versão", "Revisar e ajustar", "Entregar"];
}
