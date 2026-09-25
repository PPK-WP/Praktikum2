"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { AFTER_LOGIN_PATH } from "@/lib/auth/constants";
import { hasErrors, validateRegister } from "@/lib/auth/validation";
import { submitAuth } from "@/features/auth/submit-auth";
import type { FieldErrors, RegisterPayload } from "@/types/auth";

export function RegisterForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<FieldErrors<RegisterPayload>>({});
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload: RegisterPayload = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    };

    const clientErrors = validateRegister(payload);
    setErrors(clientErrors);
    setMessage("");
    if (hasErrors(clientErrors)) {
      return;
    }

    setIsSubmitting(true);
    const result = await submitAuth("/api/auth/register", payload);
    if (result.ok) {
      router.replace(AFTER_LOGIN_PATH);
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
        Nama lengkap
        <input name="name" type="text" autoComplete="name" aria-invalid={Boolean(errors.name)} required />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </label>
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
          autoComplete="new-password"
          aria-invalid={Boolean(errors.password)}
          required
        />
        {errors.password ? (
          <span className="field-error">{errors.password}</span>
        ) : (
          <span className="field-hint">Minimal 8 karakter, berisi huruf dan angka.</span>
        )}
      </label>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Memproses..." : "Daftar"}
      </button>
    </form>
  );
}
