import { Link, createFileRoute } from "@tanstack/react-router";
import { Bell, CalendarClock, KeyRound, Laptop, LogOut, Scale, Shield, Smartphone, SlidersHorizontal, Tablet, Trash2 } from "lucide-react";
import { useState } from "react";

import { AppButton } from "@/components/AppButton";
import { Field } from "@/components/AuthShell";
import { AvailabilityGrid } from "@/components/AvailabilityGrid";
import { PageShell, Toggle } from "@/components/PageShell";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações — Agiliza" },
      { name: "description", content: "Preferências, disponibilidade, avisos, dispositivos e segurança da sua conta Agiliza." },
      { property: "og:title", content: "Configurações — Agiliza" },
      { property: "og:description", content: "Adapte o Agiliza à sua rotina." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SettingsPage,
});

const tabs = [
  { id: "prefs", label: "Preferências", icon: SlidersHorizontal },
  { id: "disp", label: "Disponibilidade", icon: CalendarClock },
  { id: "avisos", label: "Avisos", icon: Bell },
  { id: "equilibrio", label: "Equilíbrio", icon: Scale },
  { id: "dispositivos", label: "Dispositivos", icon: Laptop },
  { id: "seguranca", label: "Segurança", icon: Shield },
] as const;
type Tab = (typeof tabs)[number]["id"];

function Card({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return <section className="bg-muted/70 p-6"><h2 className="section-title">{title}</h2>{desc && <p className="mt-1 text-sm text-muted-foreground">{desc}</p>}<div className="mt-4">{children}</div></section>;
}
function Select({ label, options, defaultValue }: { label: string; options: string[]; defaultValue?: string }) {
  return <label className="block text-sm font-semibold">{label}<select defaultValue={defaultValue} className="mt-1.5 h-11 w-full rounded-lg border border-input bg-card px-3 font-normal">{options.map((o) => <option key={o}>{o}</option>)}</select></label>;
}

function SettingsPage() {
  const [tab, setTab] = useState<Tab>("prefs");
  const [t, setT] = useState({ energy: true, autoplan: true, quickCapture: true, delivery: true, neglected: true, inbox: true, daily: true, email: false, push: true, balance: true, sync: true });
  const set = (k: keyof typeof t) => (v: boolean) => setT({ ...t, [k]: v });
  const [saved, setSaved] = useState(false);
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <PageShell eyebrow="Ajustes" title="Configurações">
      <div className="grid gap-6 md:grid-cols-[220px_1fr]">
        <nav className="flex min-w-0 gap-1 overflow-x-auto md:flex-col">
          {tabs.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setTab(id)} className={cn("flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold", tab === id ? "bg-sidebar text-sidebar-foreground" : "text-muted-foreground hover:bg-accent")}><Icon className="size-4" />{label}</button>)}
          <Link to="/login" className="flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold text-danger hover:bg-danger-soft md:mt-4"><LogOut className="size-4" />Sair</Link>
        </nav>

        <div className="min-w-0 space-y-4">
          {tab === "prefs" && <>
            <Card title="Organização" desc="Como o Agiliza deve ordenar e sugerir suas tarefas.">
              <div className="grid gap-4 sm:grid-cols-2">
                <Select label="Critério principal" options={["Prazos primeiro", "Prioridade primeiro", "Tarefas curtas primeiro", "Blocos de foco longos"]} />
                <Select label="Duração padrão de nova tarefa" options={["15 min", "30 min", "45 min", "1 hora"]} defaultValue="30 min" />
                <Select label="Início da semana" options={["Segunda-feira", "Domingo"]} />
                <Select label="Pausa entre tarefas" options={["Sem pausa", "5 min", "10 min", "15 min"]} defaultValue="10 min" />
              </div>
              <div className="mt-4 divide-y divide-border">
                <Toggle checked={t.energy} onChange={set("energy")} label="Considerar nível de energia" desc="Com energia baixa, evitar tarefas complexas não urgentes." />
                <Toggle checked={t.autoplan} onChange={set("autoplan")} label="Planejar o dia automaticamente" desc="Distribuir tarefas nos horários livres a cada manhã." />
                <Toggle checked={t.quickCapture} onChange={set("quickCapture")} label="Captura rápida vai para a Caixa de entrada" desc="Organize os detalhes depois." />
              </div>
            </Card>
          </>}
          {tab === "disp" && <>
            <Card title="Semana típica" desc="Defina dias e horários de trabalho, estudo, livres e indisponíveis."><AvailabilityGrid /></Card>
            <Card title="Horário habitual"><div className="grid gap-4 sm:grid-cols-3"><Field label="Acordo às" type="time" defaultValue="07:00" /><Field label="Encerro o dia às" type="time" defaultValue="22:00" /><Field label="Máx. de foco por dia" type="number" defaultValue={6} min={1} max={14} /></div></Card>
          </>}
          {tab === "avisos" && <>
            <Card title="Avisos antecipados" desc="Escolha quando e com que frequência ser lembrado.">
              <div className="grid gap-4 sm:grid-cols-3">
                <Select label="Entregas de trabalhos" options={["1 dia antes", "3 dias antes", "1 semana antes"]} defaultValue="3 dias antes" />
                <Select label="Compromissos" options={["10 min antes", "30 min antes", "1 hora antes"]} defaultValue="30 min antes" />
                <Select label="Frequência" options={["Uma vez", "Diariamente até o prazo", "A cada 2 dias"]} defaultValue="Diariamente até o prazo" />
              </div>
              <div className="mt-4 divide-y divide-border">
                <Toggle checked={t.delivery} onChange={set("delivery")} label="Prazos se aproximando" desc="Tarefas que vencem em breve ou já venceram." />
                <Toggle checked={t.neglected} onChange={set("neglected")} label="Tarefas negligenciadas" desc="Avisar quando uma tarefa for adiada 3 vezes ou mais." />
                <Toggle checked={t.inbox} onChange={set("inbox")} label="Lembrar de organizar a Caixa de entrada" />
                <Toggle checked={t.daily} onChange={set("daily")} label="Resumo para encerrar o dia" desc="Às 21:30 com o que foi feito e o que fica para amanhã." />
              </div>
            </Card>
            <Card title="Canais"><div className="divide-y divide-border"><Toggle checked={t.push} onChange={set("push")} label="Notificações no aparelho" /><Toggle checked={t.email} onChange={set("email")} label="E-mail" /></div></Card>
          </>}
          {tab === "equilibrio" && <Card title="Equilíbrio entre áreas" desc="Receba um alerta quando uma área concentrar tempo demais.">
            <Toggle checked={t.balance} onChange={set("balance")} label="Alertar concentração excessiva" />
            <label className="mt-3 block text-sm font-semibold">Limite por área: <span className="text-primary">50% da semana</span><input type="range" min={30} max={80} defaultValue={50} className="mt-3 w-full accent-primary" /></label>
          </Card>}
          {tab === "dispositivos" && <Card title="Seus dispositivos" desc="Sua agenda fica atualizada em todos eles.">
            <Toggle checked={t.sync} onChange={set("sync")} label="Sincronização automática" />
            <div className="mt-3 space-y-2">{[{ i: Laptop, n: "Notebook · Chrome", s: "Este dispositivo" }, { i: Smartphone, n: "iPhone 14", s: "Sincronizado há 2 min" }, { i: Tablet, n: "Tablet Samsung", s: "Sincronizado ontem" }].map(({ i: Icon, n, s }) => <div key={n} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"><Icon className="size-5 text-primary" /><div className="flex-1"><p className="text-sm font-semibold">{n}</p><p className="text-xs text-muted-foreground">{s}</p></div>{s !== "Este dispositivo" && <AppButton variant="ghost" size="sm">Desconectar</AppButton>}</div>)}</div>
          </Card>}
          {tab === "seguranca" && <>
            <Card title="Alterar senha"><div className="grid gap-4 sm:grid-cols-3"><Field label="Senha atual" type="password" /><Field label="Nova senha" type="password" /><Field label="Confirmar" type="password" /></div><AppButton className="mt-4" onClick={save}><KeyRound className="size-4" />Atualizar senha</AppButton></Card>
            <Card title="Zona de perigo" desc="Excluir a conta remove todas as suas tarefas e histórico."><AppButton variant="secondary" className="text-danger"><Trash2 className="size-4" />Excluir conta</AppButton></Card>
          </>}
          <div className="flex items-center gap-3"><AppButton onClick={save}>Salvar configurações</AppButton>{saved && <span className="text-sm font-semibold text-success">Salvo!</span>}</div>
        </div>
      </div>
    </PageShell>
  );
}
