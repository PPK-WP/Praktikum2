"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { ThemePreference } from "@/types/shared";

export function ThemeToggle({ initialTheme }: { initialTheme: ThemePreference }) {
  const router = useRouter();
  const [theme, setTheme] = useState(initialTheme);
  const nextTheme: ThemePreference = theme === "dark" ? "light" : "dark";

  async function handleToggle() {
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;

    const response = await fetch("/api/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme: nextTheme }),
    }).catch(() => null);

    if (response?.ok) {
      router.refresh();
    } else {
      setTheme(theme);
      document.documentElement.dataset.theme = theme;
    }
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={handleToggle}
      aria-label={`Ganti ke tema ${nextTheme === "dark" ? "gelap" : "terang"}`}
    >
      {theme === "dark" ? "☀ Terang" : "☾ Gelap"}
    </button>
  );
}
