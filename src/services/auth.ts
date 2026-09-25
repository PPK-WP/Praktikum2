import type { AuthSession, LoginPayload, RegisterPayload, User } from "@/types/auth";

const mockUser: User = {
  id: "user-001",
  name: "Mahasiswa",
  email: "mahasiswa@expense.test",
  role: "student",
};

export async function login(payload: LoginPayload): Promise<AuthSession> {
  if (payload.email === "mahasiswa@expense.test" && payload.password === "password123") {
    return { user: mockUser, isAuthenticated: true };
  }

  return { user: null, isAuthenticated: false };
}

export async function register(payload: RegisterPayload): Promise<AuthSession> {
  return {
    user: {
      id: crypto.randomUUID(),
      name: payload.name,
      email: payload.email,
      role: "student",
    },
    isAuthenticated: true,
  };
}

export async function getSession(): Promise<AuthSession> {
  return { user: mockUser, isAuthenticated: true };
}
