import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogIn } from "lucide-react";
import { useState } from "react";

import { AppButton } from "@/components/AppButton";
import { AuthShell, Field } from "@/components/AuthShell";
import { AuthApiError, loginUser } from "@/lib/auth-api";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar — Agiliza" },
      {
        name: "description",
        content: "Acesse sua conta Agiliza e veja seu dia planejado.",
      },
      { property: "og:title", content: "Entrar — Agiliza" },
      {
        property: "og:description",
        content: "Acesse sua agenda de qualquer dispositivo.",
      },
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
  const [errors, setErrors] = useState<
    Partial<Record<"email" | "password", string>>
  >({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Partial<Record<"email" | "password", string>> = {};
    if (email.trim().length > 255 || !/^\S+@\S+\.\S+$/.test(email.trim()))
      next.email = "Informe um e-mail válido";
    if (!password) next.password = "Informe sua senha";
    setErrors(next);
    setFormError("");
    if (Object.keys(next).length) return;

    setIsSubmitting(true);
    try {
      await loginUser({ email: email.trim(), password });
      navigate({ to: "/" });
    } catch (error) {
      if (
        error instanceof AuthApiError &&
        (error.field === "email" || error.field === "password")
      ) {
        const { field, message } = error;
        setErrors((current) => ({ ...current, [field]: message }));
      } else {
        setFormError(
          error instanceof Error ? error.message : "Não foi possível entrar.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Bem-vindo de volta"
      title="Entre na sua conta"
      subtitle="Sua agenda sincronizada em todos os seus dispositivos."
      footer={
        <>
          Ainda não tem conta?{" "}
          <Link
            to="/cadastro"
            className="font-semibold text-primary hover:underline"
          >
            Criar conta
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        {formError && (
          <p
            role="alert"
            className="rounded-lg bg-danger/10 p-3 text-sm text-danger"
          >
            {formError}
          </p>
        )}
        <Field
          label="E-mail"
          type="email"
          maxLength={255}
          placeholder="voce@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <Field
          label="Senha"
          type="password"
          maxLength={128}
          placeholder="••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked className="accent-primary" />{" "}
            Manter conectado
          </label>
          <Link
            to="/recuperar-senha"
            className="font-semibold text-primary hover:underline"
          >
            Esqueci a senha
          </Link>
        </div>
        <AppButton
          type="submit"
          className="h-11 w-full"
          disabled={isSubmitting}
        >
          <LogIn className="size-4" /> {isSubmitting ? "Entrando..." : "Entrar"}
        </AppButton>
      </form>
    </AuthShell>
  );
}
