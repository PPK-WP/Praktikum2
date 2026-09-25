import type { Metadata } from "next";

import { UserProvider } from "@/features/auth/UserProvider";
import { ThemeToggle } from "@/features/preferences/ThemeToggle";
import { getCurrentUser } from "@/lib/auth/session";
import { getPreference } from "@/services/preferences";
import "./globals.css";

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "Expense Tracker foundation for mahasiswa personal finance management.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [user, preference] = await Promise.all([getCurrentUser(), getPreference()]);

  return (
    <html lang="id" data-theme={preference.theme}>
      <body>
        <UserProvider user={user}>{children}</UserProvider>
        <ThemeToggle initialTheme={preference.theme} />
      </body>
    </html>
  );
}
