"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { LOGIN_PATH } from "@/lib/auth/constants";

export function LogoutButton({ className = "ghost-button" }: { className?: string }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleLogout() {
    setIsPending(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.replace(LOGIN_PATH);
      router.refresh();
    }
  }

  return (
    <button type="button" className={className} onClick={handleLogout} disabled={isPending}>
      {isPending ? "Keluar..." : "Logout"}
    </button>
  );
}
