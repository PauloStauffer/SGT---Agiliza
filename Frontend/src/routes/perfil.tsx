import { Link, createFileRoute } from "@tanstack/react-router";
import { Camera, CheckCircle2, Clock3, Flame, Save, Settings2, Target } from "lucide-react";
import { useState } from "react";

import { AppButton } from "@/components/AppButton";
import { Field } from "@/components/AuthShell";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Meu perfil — Agiliza" },
      { name: "description", content: "Seus dados, sua rotina e seu desempenho no Agiliza." },
      { property: "og:title", content: "Meu perfil — Agiliza" },
      { property: "og:description", content: "Gerencie seus dados pessoais no Agiliza." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const [form, setForm] = useState({ name: "Paulo Stauffer", email: "paulo@uvv.br", course: "Sistemas de Informação — UVV", bio: "Estudante e desenvolvedor. Gosto de blocos de foco pela manhã." });
  const [saved, setSaved] = useState(false);
  return (
    <PageShell eyebrow="Conta" title="Meu perfil">
      <div className="grid gap-4 lg:grid-cols-3">
        <section className="min-w-0 bg-sidebar p-6 text-sidebar-foreground">
          <div className="relative mx-auto w-fit">
            <div className="grid size-24 place-items-center rounded-full bg-primary font-display text-3xl font-bold">PS</div>
            <button className="absolute bottom-0 right-0 grid size-8 place-items-center rounded-full bg-highlight text-highlight-foreground" aria-label="Trocar foto"><Camera className="size-4" /></button>
          </div>
          <p className="mt-4 text-center font-display text-xl font-bold">{form.name}</p>
          <p className="break-words text-center text-sm text-sidebar-muted">{form.email}</p>
          <div className="mt-6 grid grid-cols-3 gap-2 text-center">
            {[{ i: CheckCircle2, v: "142", l: "concluídas" }, { i: Flame, v: "9", l: "dias seguidos" }, { i: Clock3, v: "86h", l: "focado" }].map(({ i: Icon, v, l }) => <div key={l} className="rounded-lg bg-sidebar-panel p-3"><Icon className="mx-auto size-4 text-highlight" /><p className="mt-1 font-display text-lg font-bold">{v}</p><p className="text-[10px] text-sidebar-muted">{l}</p></div>)}
          </div>
          <div className="mt-6 rounded-lg bg-sidebar-panel p-4 text-sm"><p className="flex items-center gap-2 font-semibold"><Target className="size-4 text-highlight" />Estilo de organização</p><p className="mt-1 text-sidebar-muted">Prazos primeiro · Estudo e trabalho</p></div>
          <AppButton asChild variant="warning" className="mt-4 w-full"><Link to="/configuracoes"><Settings2 className="size-4" />Ajustar rotina</Link></AppButton>
        </section>
        <section className="min-w-0 bg-muted/70 p-6 lg:col-span-2">
          <h2 className="section-title">Dados pessoais</h2>
          <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); setSaved(true); setTimeout(() => setSaved(false), 2200); }}>
            <Field label="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Field label="E-mail" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <div className="sm:col-span-2"><Field label="Curso / Ocupação" value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} /></div>
            <label className="block text-sm font-semibold sm:col-span-2">Sobre você<textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} className="mt-1.5 w-full rounded-lg border border-input bg-card p-3 font-normal outline-none focus:ring-2 focus:ring-ring" /></label>
            <label className="block text-sm font-semibold">Fuso horário<select className="mt-1.5 h-11 w-full rounded-lg border border-input bg-card px-3 font-normal"><option>América/São Paulo (UTC-3)</option></select></label>
            <label className="block text-sm font-semibold">Idioma<select className="mt-1.5 h-11 w-full rounded-lg border border-input bg-card px-3 font-normal"><option>Português (Brasil)</option><option>English</option></select></label>
            <div className="flex items-center gap-3 sm:col-span-2"><AppButton type="submit"><Save className="size-4" />Salvar alterações</AppButton>{saved && <span className="text-sm font-semibold text-success">Perfil atualizado!</span>}</div>
          </form>
        </section>
      </div>
    </PageShell>
  );
}
