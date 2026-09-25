"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { User } from "@/types/auth";

const UserContext = createContext<User | null>(null);

export function UserProvider({ user, children }: { user: User | null; children: ReactNode }) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

/** The logged-in user in client components, or null for guests. */
export function useCurrentUser() {
  return useContext(UserContext);
}
