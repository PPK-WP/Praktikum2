export interface User {
  id: string;
  name: string;
  email: string;
  role: "student";
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthSession {
  user: User | null;
  isAuthenticated: boolean;
}
