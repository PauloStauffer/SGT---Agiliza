import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogIn } from "lucide-react";
import { useState } from "react";

import { AppButton } from "@/components/AppButton";
import { AuthShell, Field } from "@/components/AuthShell";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar — Agiliza" },
      { name: "description", content: "Acesse sua conta Agiliza e veja seu dia planejado." },
      { property: "og:title", content: "Entrar — Agiliza" },
      { property: "og:description", content: "Acesse sua agenda de qualquer dispositivo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Partial<Record<"name" | "email" | "password" | "confirm" | "terms", string>>>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Partial<Record<"name" | "email" | "password" | "confirm" | "terms", string>> = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Informe um e-mail válido";
    if (password.length < 6) next.password = "A senha tem pelo menos 6 caracteres";
    setErrors(next);
    if (!Object.keys(next).length) navigate({ to: "/" });
  };

  return (
    <AuthShell eyebrow="Bem-vindo de volta" title="Entre na sua conta" subtitle="Sua agenda sincronizada em todos os seus dispositivos." footer={<>Ainda não tem conta? <Link to="/cadastro" className="font-semibold text-primary hover:underline">Criar conta</Link></>}>
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label="E-mail" type="email" placeholder="voce@email.com" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
        <Field label="Senha" type="password" placeholder="••••••" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" defaultChecked className="accent-primary" /> Manter conectado</label>
          <Link to="/recuperar-senha" className="font-semibold text-primary hover:underline">Esqueci a senha</Link>
        </div>
        <AppButton type="submit" className="h-11 w-full"><LogIn className="size-4" /> Entrar</AppButton>
      </form>
    </AuthShell>
  );
}
