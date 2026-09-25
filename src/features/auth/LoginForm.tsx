"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { hasErrors, validateLogin } from "@/lib/auth/validation";
import { submitAuth } from "@/features/auth/submit-auth";
import type { FieldErrors, LoginPayload } from "@/types/auth";

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const [errors, setErrors] = useState<FieldErrors<LoginPayload>>({});
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload: LoginPayload = {
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    };

    const clientErrors = validateLogin(payload);
    setErrors(clientErrors);
    setMessage("");
    if (hasErrors(clientErrors)) {
      return;
    }

    setIsSubmitting(true);
    const result = await submitAuth("/api/auth/login", payload);
    if (result.ok) {
      router.replace(redirectTo);
      router.refresh();
      return;
    }

    setErrors(result.errors);
    setMessage(result.message);
    setIsSubmitting(false);
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      {message && <p className="form-alert" role="alert">{message}</p>}
      <label>
        Email
        <input name="email" type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} required />
        {errors.email && <span className="field-error">{errors.email}</span>}
      </label>
      <label>
        Password
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={Boolean(errors.password)}
          required
        />
        {errors.password && <span className="field-error">{errors.password}</span>}
      </label>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Memproses..." : "Login"}
      </button>
    </form>
  );
}
