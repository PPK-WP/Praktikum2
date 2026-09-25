import type { FieldErrors, LoginPayload, RegisterPayload } from "@/types/auth";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const PASSWORD_MIN_LENGTH = 8;

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function validatePassword(password: string): string | undefined {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password minimal ${PASSWORD_MIN_LENGTH} karakter.`;
  }
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return "Password harus berisi huruf dan angka.";
  }
  return undefined;
}

export function validateRegister(payload: RegisterPayload): FieldErrors<RegisterPayload> {
  const errors: FieldErrors<RegisterPayload> = {};
  const name = payload.name.trim();

  if (name.length < 2 || name.length > 50) {
    errors.name = "Nama harus 2 sampai 50 karakter.";
  }
  if (!EMAIL_PATTERN.test(normalizeEmail(payload.email))) {
    errors.email = "Format email tidak valid.";
  }

  const passwordError = validatePassword(payload.password);
  if (passwordError) {
    errors.password = passwordError;
  }

  return errors;
}

export function validateLogin(payload: LoginPayload): FieldErrors<LoginPayload> {
  const errors: FieldErrors<LoginPayload> = {};

  if (!EMAIL_PATTERN.test(normalizeEmail(payload.email))) {
    errors.email = "Format email tidak valid.";
  }
  if (!payload.password) {
    errors.password = "Password wajib diisi.";
  }

  return errors;
}

export function hasErrors(errors: object) {
  return Object.keys(errors).length > 0;
}

/** Reads a JSON body as a string record, ignoring anything that is not a string. */
export function readStringFields<K extends string>(body: unknown, keys: readonly K[]) {
  const source = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};
  return Object.fromEntries(
    keys.map((key) => [key, typeof source[key] === "string" ? source[key] : ""]),
  ) as Record<K, string>;
}
