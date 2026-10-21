export type AuthUser = {
  id: number;
  name: string;
  email: string;
};

export type AuthField = "name" | "email" | "password";

export class AuthApiError extends Error {
  readonly field: AuthField | undefined;

  constructor(message: string, field?: AuthField) {
    super(message);
    this.name = "AuthApiError";
    this.field = field;
  }
}

const API_BASE_URL = (import.meta.env["VITE_API_URL"] ?? "").replace(/\/$/, "");

async function requestAuth(
  endpoint: "login" | "register",
  payload: Record<string, string>,
): Promise<AuthUser> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/auth/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new AuthApiError(
      "Não foi possível conectar ao servidor. Tente novamente.",
    );
  }

  const result = (await response.json().catch(() => null)) as {
    user?: AuthUser;
    message?: string;
    field?: AuthField;
  } | null;

  if (!response.ok) {
    throw new AuthApiError(
      result?.message ?? "Não foi possível concluir a solicitação.",
      result?.field,
    );
  }

  if (!result?.user) {
    throw new AuthApiError("O servidor retornou uma resposta inválida.");
  }

  return result.user;
}

export function registerUser(payload: {
  name: string;
  email: string;
  password: string;
}) {
  return requestAuth("register", payload);
}

export function loginUser(payload: { email: string; password: string }) {
  return requestAuth("login", payload);
}
