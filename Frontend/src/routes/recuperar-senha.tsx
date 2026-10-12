import { Link, createFileRoute } from "@tanstack/react-router";
import { MailCheck, Send } from "lucide-react";
import { useState } from "react";

import { AppButton } from "@/components/AppButton";
import { AuthShell, Field } from "@/components/AuthShell";

export const Route = createFileRoute("/recuperar-senha")({
  head: () => ({
    meta: [
      { title: "Recuperar senha — Agiliza" },
      { name: "description", content: "Receba um link para redefinir a senha da sua conta Agiliza." },
      { property: "og:title", content: "Recuperar senha — Agiliza" },
      { property: "og:description", content: "Redefina sua senha do Agiliza." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RecoverPage,
});

function RecoverPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <AuthShell eyebrow="Acontece" title="Recuperar senha" subtitle="Enviaremos um link para você criar uma nova senha." footer={<Link to="/login" className="font-semibold text-primary hover:underline">Voltar para o login</Link>}>
      {sent ? (
        <div className="rounded-xl border border-success/30 bg-success-soft p-6 text-center">
          <MailCheck className="mx-auto size-10 text-success" />
          <p className="mt-3 font-display text-lg font-bold">Confira seu e-mail</p>
          <p className="mt-1 text-sm text-muted-foreground">Se existir uma conta para {email}, o link chega em instantes.</p>
        </div>
      ) : (
        <form className="space-y-4" noValidate onSubmit={(e) => { e.preventDefault(); if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Informe um e-mail válido"); setSent(true); }}>
          <Field label="E-mail da conta" type="email" placeholder="voce@email.com" value={email} onChange={(e) => setEmail(e.target.value)} error={error} />
          <AppButton type="submit" className="h-11 w-full"><Send className="size-4" /> Enviar link</AppButton>
        </form>
      )}
    </AuthShell>
  );
}
