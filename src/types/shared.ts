export type UserRole = "student";

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string>;
}

export type ThemePreference = "light" | "dark";
export type DefaultFilterPreference = "all" | "income" | "expense";

export interface UserPreference {
  theme: ThemePreference;
  defaultFilter: DefaultFilterPreference;
}
