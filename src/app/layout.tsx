import type { Metadata } from "next";

import { UserProvider } from "@/features/auth/UserProvider";
import { getCurrentUser } from "@/lib/auth/session";
import "./globals.css";

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "Expense Tracker foundation for mahasiswa personal finance management.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <html lang="id">
      <body>
        <UserProvider user={user}>{children}</UserProvider>
      </body>
    </html>
  );
}
