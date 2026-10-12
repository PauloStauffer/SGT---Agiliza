import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Plus } from "lucide-react";
import { useState } from "react";

import { AppButton } from "@/components/AppButton";
import { AvailabilityGrid } from "@/components/AvailabilityGrid";
import { BrandLockup } from "@/components/BrandLogo";
import { initialAreas } from "@/lib/agiliza-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Configure sua rotina — Agiliza" },
      { name: "description", content: "Conte ao Agiliza como é sua rotina para receber um planejamento sob medida." },
      { property: "og:title", content: "Configure sua rotina — Agiliza" },
      { property: "og:description", content: "Preferências, horários e áreas da vida em três passos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Onboarding,
});

const profiles = [
  { id: "estudante", label: "Estudante", desc: "Aulas, provas e entregas de trabalhos" },
  { id: "trabalho", label: "Trabalho", desc: "Reuniões, projetos e prazos" },
  { id: "ambos", label: "Estudo e trabalho", desc: "Equilibrar as duas rotinas" },
];
const styles = ["Prazos primeiro", "Prioridade primeiro", "Tarefas curtas primeiro", "Blocos de foco longos"];

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState("ambos");
  const [style, setStyle] = useState("Prazos primeiro");
  const [areas, setAreas] = useState(initialAreas.map((a) => a.name));
  const [selected, setSelected] = useState<string[]>(["Trabalho", "Estudos", "Família", "Pessoal"]);
  const [newArea, setNewArea] = useState("");
  const steps = ["Sua rotina", "Seus horários", "Áreas da vida"];

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center gap-3"><BrandLockup textClassName="text-foreground" /><span className="ml-auto text-sm text-muted-foreground">Passo {step + 1} de 3</span></div>
        <div className="mb-8 grid grid-cols-3 gap-2">{steps.map((s, i) => <div key={s}><div className={cn("h-1.5 rounded-full transition-colors", i <= step ? "bg-primary" : "bg-muted")} /><p className={cn("mt-2 text-xs font-semibold", i <= step ? "text-foreground" : "text-muted-foreground")}>{s}</p></div>)}</div>

        <section className="rounded-xl border border-border bg-card p-6 sm:p-8">
          {step === 0 && <>
            <h1 className="font-display text-2xl font-bold">Como é sua rotina?</h1>
            <p className="mt-1 text-sm text-muted-foreground">Usamos isso para sugerir horários e avisos.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">{profiles.map((p) => <button key={p.id} onClick={() => setProfile(p.id)} className={cn("rounded-xl border-2 p-4 text-left transition", profile === p.id ? "border-primary bg-primary-soft" : "border-border hover:border-primary/40")}><p className="font-semibold">{p.label}</p><p className="mt-1 text-xs text-muted-foreground">{p.desc}</p></button>)}</div>
            <p className="mt-8 text-sm font-semibold">Como prefere organizar suas tarefas?</p>
            <div className="mt-3 flex flex-wrap gap-2">{styles.map((s) => <button key={s} onClick={() => setStyle(s)} className={cn("rounded-full border px-4 py-2 text-sm font-semibold", style === s ? "border-sidebar bg-sidebar text-sidebar-foreground" : "border-border hover:bg-accent")}>{s}</button>)}</div>
          </>}
          {step === 1 && <>
            <h1 className="font-display text-2xl font-bold">Quando você está disponível?</h1>
            <p className="mb-6 mt-1 text-sm text-muted-foreground">Defina dias de trabalho, estudo e horários livres. Você pode mudar depois.</p>
            <AvailabilityGrid />
          </>}
          {step === 2 && <>
            <h1 className="font-display text-2xl font-bold">Quais áreas fazem parte da sua vida?</h1>
            <p className="mt-1 text-sm text-muted-foreground">Selecione as áreas padrão ou crie as suas.</p>
            <div className="mt-6 flex flex-wrap gap-2">{areas.map((a) => { const on = selected.includes(a); return <button key={a} onClick={() => setSelected(on ? selected.filter((x) => x !== a) : [...selected, a])} className={cn("flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold", on ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-accent")}>{on && <Check className="size-3.5" />}{a}</button>; })}</div>
            <form className="mt-5 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (newArea.trim()) { setAreas([...areas, newArea.trim()]); setSelected([...selected, newArea.trim()]); setNewArea(""); } }}>
              <input value={newArea} onChange={(e) => setNewArea(e.target.value)} placeholder="Nova área (ex.: Igreja, Esporte)" className="h-10 flex-1 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
              <AppButton variant="secondary" type="submit"><Plus className="size-4" />Criar</AppButton>
            </form>
          </>}
        </section>

        <div className="mt-6 flex justify-between">
          <AppButton variant="ghost" disabled={step === 0} onClick={() => setStep(step - 1)}><ArrowLeft className="size-4" />Voltar</AppButton>
          {step < 2 ? <AppButton onClick={() => setStep(step + 1)}>Continuar<ArrowRight className="size-4" /></AppButton> : <AppButton onClick={() => navigate({ to: "/" })}><Check className="size-4" />Começar a usar</AppButton>}
        </div>
      </div>
    </div>
  );
}
