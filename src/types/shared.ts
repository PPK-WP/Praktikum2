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
