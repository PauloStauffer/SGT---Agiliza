import { Link } from "@tanstack/react-router";
import { CalendarCheck, Sparkles } from "lucide-react";
import type { InputHTMLAttributes, ReactNode } from "react";

import { BrandLockup } from "@/components/BrandLogo";
import { cn } from "@/lib/utils";

export function AuthShell({ eyebrow, title, subtitle, children, footer }: { eyebrow: string; title: string; subtitle: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[1fr_1.05fr]">
      <aside className="relative hidden overflow-hidden bg-sidebar p-12 text-sidebar-foreground lg:flex lg:flex-col">
        <Link to="/" className="block w-44">
          <BrandLockup textClassName="text-sidebar-foreground" />
        </Link>
        <div className="relative z-10 mt-auto max-w-md">
          <p className="font-display text-4xl font-bold leading-tight">Menos tempo decidindo. Mais tempo fazendo.</p>
          <p className="mt-4 text-sidebar-muted">O Agiliza organiza suas tarefas por prazo, prioridade e energia — e diz o que fazer agora.</p>
          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3 rounded-xl bg-sidebar-panel p-4"><Sparkles className="size-5 text-highlight" /><div><p className="text-sm font-semibold">Próxima tarefa recomendada</p><p className="text-xs text-sidebar-muted">Finalizar relatório · vence às 17h</p></div></div>
            <div className="ml-10 flex items-center gap-3 rounded-xl bg-sidebar-panel p-4"><CalendarCheck className="size-5 text-success" /><div><p className="text-sm font-semibold">Dia planejado</p><p className="text-xs text-sidebar-muted">5 tarefas encaixadas sem conflitos</p></div></div>
          </div>
        </div>
        <div className="absolute -right-24 -top-24 size-96 rounded-full border-[60px] border-primary/25" />
        <div className="absolute right-24 top-56 size-24 rounded-full bg-highlight/80" />
      </aside>
      <main className="flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 inline-flex"><BrandLockup textClassName="text-foreground" /></Link>
          <p className="eyebrow text-primary">{eyebrow}</p>
          <h1 className="mt-1 font-display text-3xl font-bold">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
        </div>
      </main>
    </div>
  );
}

export function Field({ label, error, className, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string | undefined }) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <input {...props} className={cn("mt-1.5 h-11 w-full rounded-lg border bg-card px-3 font-normal outline-none transition focus:ring-2 focus:ring-ring", error ? "border-danger" : "border-input", className)} />
      {error && <span className="mt-1 block text-xs font-medium text-danger">{error}</span>}
    </label>
  );
}
