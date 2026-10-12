import { Link } from "@tanstack/react-router";
import { ArrowLeft, Settings2, UserRound } from "lucide-react";
import type { ReactNode } from "react";

import { BrandLockup } from "@/components/BrandLogo";

export function PageShell({ title, eyebrow, children }: { title: string; eyebrow: string; children: ReactNode }) {
  return (
    <div className="home-clean min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="flex w-full flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold text-muted-foreground hover:bg-accent hover:text-foreground"><ArrowLeft className="size-4" />Voltar ao painel</Link>
          <span className="ml-auto flex items-center gap-1">
            <Link to="/perfil" className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-muted-foreground hover:bg-accent" activeProps={{ className: "bg-primary-soft text-primary" }}><UserRound className="size-4" />Perfil</Link>
            <Link to="/configuracoes" className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-muted-foreground hover:bg-accent" activeProps={{ className: "bg-primary-soft text-primary" }}><Settings2 className="size-4" />Configurações</Link>
          </span>
          <BrandLockup className="hidden sm:inline-flex" iconClassName="size-8" textClassName="text-lg text-foreground" />
        </div>
      </header>
      <main className="w-full px-4 py-8 sm:px-6 lg:px-8">
        <p className="eyebrow text-primary">{eyebrow}</p>
        <h1 className="mb-6 font-display text-3xl font-bold">{title}</h1>
        {children}
      </main>
    </div>
  );
}

export function Toggle({ checked, onChange, label, desc }: { checked: boolean; onChange: (v: boolean) => void; label: string; desc?: string }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 py-3">
      <span><span className="block text-sm font-semibold">{label}</span>{desc && <span className="block text-xs text-muted-foreground">{desc}</span>}</span>
      <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-primary" : "bg-muted"}`}>
        <span className={`absolute top-0.5 size-5 rounded-full bg-card shadow transition-all ${checked ? "left-[22px]" : "left-0.5"}`} />
      </button>
    </label>
  );
}
