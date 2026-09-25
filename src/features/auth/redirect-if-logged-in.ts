import { redirect } from "next/navigation";

import { AFTER_LOGIN_PATH } from "@/lib/auth/constants";
import { getCurrentUser } from "@/lib/auth/session";

/** Sends users who already have a valid session away from the login/register pages. */
export async function redirectIfLoggedIn() {
  if (await getCurrentUser()) {
    redirect(AFTER_LOGIN_PATH);
  }
}
