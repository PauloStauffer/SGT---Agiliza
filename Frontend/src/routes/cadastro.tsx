import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { UserPlus } from "lucide-react";
import { useState } from "react";

import { AppButton } from "@/components/AppButton";
import { AuthShell, Field } from "@/components/AuthShell";
import { AuthApiError, registerUser } from "@/lib/auth-api";

export const Route = createFileRoute("/cadastro")({
  head: () => ({
    meta: [
      { title: "Criar conta — Agiliza" },
      {
        name: "description",
        content:
          "Crie sua conta no Agiliza e organize sua rotina de forma personalizada.",
      },
      { property: "og:title", content: "Criar conta — Agiliza" },
      {
        property: "og:description",
        content: "Comece a planejar seu dia com o Agiliza.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    terms: false,
  });
  const [errors, setErrors] = useState<
    Partial<Record<"name" | "email" | "password" | "confirm" | "terms", string>>
  >({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const set =
    (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm({
        ...form,
        [k]: k === "terms" ? e.target.checked : e.target.value,
      });

  const strength = [
    form.password.length >= 8,
    /\d/.test(form.password),
    /[A-Z]/.test(form.password),
  ].filter(Boolean).length;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const n: Partial<
      Record<"name" | "email" | "password" | "confirm" | "terms", string>
    > = {};
    if (form.name.trim().length < 2 || form.name.trim().length > 255)
      n.name = "Informe um nome entre 2 e 255 caracteres";
    if (
      form.email.trim().length > 255 ||
      !/^\S+@\S+\.\S+$/.test(form.email.trim())
    )
      n.email = "Informe um e-mail válido com até 255 caracteres";
    if (form.password.length < 8) n.password = "Use pelo menos 8 caracteres";
    if (form.password.length > 128)
      n.password = "A senha deve ter no máximo 128 caracteres";
    if (form.confirm !== form.password) n.confirm = "As senhas não coincidem";
    if (!form.terms) n.terms = "Aceite os termos para continuar";
    setErrors(n);
    setFormError("");
    if (Object.keys(n).length) return;

    setIsSubmitting(true);
    try {
      await registerUser({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      navigate({ to: "/onboarding" });
    } catch (error) {
      if (error instanceof AuthApiError && error.field) {
        const { field, message } = error;
        setErrors((current) => ({ ...current, [field]: message }));
      } else {
        setFormError(
          error instanceof Error
            ? error.message
            : "Não foi possível criar sua conta.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Novo por aqui"
      title="Crie sua conta"
      subtitle="Leva menos de um minuto. Depois ajustamos o Agiliza à sua rotina."
      footer={
        <>
          Já tem conta?{" "}
          <Link
            to="/login"
            className="font-semibold text-primary hover:underline"
          >
            Entrar
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
          label="Nome completo"
          maxLength={255}
          placeholder="Seu nome"
          value={form.name}
          onChange={set("name")}
          error={errors.name}
        />
        <Field
          label="E-mail"
          type="email"
          maxLength={255}
          placeholder="voce@email.com"
          value={form.email}
          onChange={set("email")}
          error={errors.email}
        />
        <div>
          <Field
            label="Senha"
            type="password"
            maxLength={128}
            placeholder="Mínimo 8 caracteres"
            value={form.password}
            onChange={set("password")}
            error={errors.password}
          />
          <div className="mt-2 grid grid-cols-3 gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full ${i < strength ? (strength === 3 ? "bg-success" : "bg-highlight") : "bg-muted"}`}
              />
            ))}
          </div>
        </div>
        <Field
          label="Confirmar senha"
          type="password"
          maxLength={128}
          value={form.confirm}
          onChange={set("confirm")}
          error={errors.confirm}
        />
        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.terms}
            onChange={set("terms")}
            className="mt-1 accent-primary"
          />{" "}
          <span>
            Aceito os termos de uso e a política de privacidade.
            {errors.terms && (
              <span className="block text-xs text-danger">{errors.terms}</span>
            )}
          </span>
        </label>
        <AppButton
          type="submit"
          className="h-11 w-full"
          disabled={isSubmitting}
        >
          <UserPlus className="size-4" />{" "}
          {isSubmitting ? "Criando conta..." : "Criar conta"}
        </AppButton>
      </form>
    </AuthShell>
  );
}
