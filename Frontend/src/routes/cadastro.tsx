import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { UserPlus } from "lucide-react";
import { useState } from "react";

import { AppButton } from "@/components/AppButton";
import { AuthShell, Field } from "@/components/AuthShell";

export const Route = createFileRoute("/cadastro")({
  head: () => ({
    meta: [
      { title: "Criar conta — Agiliza" },
      { name: "description", content: "Crie sua conta no Agiliza e organize sua rotina de forma personalizada." },
      { property: "og:title", content: "Criar conta — Agiliza" },
      { property: "og:description", content: "Comece a planejar seu dia com o Agiliza." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", terms: false });
  const [errors, setErrors] = useState<Partial<Record<"name" | "email" | "password" | "confirm" | "terms", string>>>({});
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: k === "terms" ? e.target.checked : e.target.value });

  const strength = [form.password.length >= 8, /\d/.test(form.password), /[A-Z]/.test(form.password)].filter(Boolean).length;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const n: Partial<Record<"name" | "email" | "password" | "confirm" | "terms", string>> = {};
    if (form.name.trim().length < 2) n.name = "Informe seu nome";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) n.email = "E-mail inválido";
    if (form.password.length < 8) n.password = "Use pelo menos 8 caracteres";
    if (form.confirm !== form.password) n.confirm = "As senhas não coincidem";
    if (!form.terms) n.terms = "Aceite os termos para continuar";
    setErrors(n);
    if (!Object.keys(n).length) navigate({ to: "/onboarding" });
  };

  return (
    <AuthShell eyebrow="Novo por aqui" title="Crie sua conta" subtitle="Leva menos de um minuto. Depois ajustamos o Agiliza à sua rotina." footer={<>Já tem conta? <Link to="/login" className="font-semibold text-primary hover:underline">Entrar</Link></>}>
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label="Nome completo" placeholder="Seu nome" value={form.name} onChange={set("name")} error={errors.name} />
        <Field label="E-mail" type="email" placeholder="voce@email.com" value={form.email} onChange={set("email")} error={errors.email} />
        <div>
          <Field label="Senha" type="password" placeholder="Mínimo 8 caracteres" value={form.password} onChange={set("password")} error={errors.password} />
          <div className="mt-2 grid grid-cols-3 gap-1">{[0, 1, 2].map((i) => <span key={i} className={`h-1.5 rounded-full ${i < strength ? (strength === 3 ? "bg-success" : "bg-highlight") : "bg-muted"}`} />)}</div>
        </div>
        <Field label="Confirmar senha" type="password" value={form.confirm} onChange={set("confirm")} error={errors.confirm} />
        <label className="flex items-start gap-2 text-sm"><input type="checkbox" checked={form.terms} onChange={set("terms")} className="mt-1 accent-primary" /> <span>Aceito os termos de uso e a política de privacidade.{errors.terms && <span className="block text-xs text-danger">{errors.terms}</span>}</span></label>
        <AppButton type="submit" className="h-11 w-full"><UserPlus className="size-4" /> Criar conta</AppButton>
      </form>
    </AuthShell>
  );
}
