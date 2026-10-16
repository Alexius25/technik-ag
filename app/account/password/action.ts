
"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

type PasswordChangeError =
  | "missing"
  | "mismatch"
  | "weak"
  | "password"
  | "server";

function passwordError(error: PasswordChangeError): never {
  redirect(`/account/password?error=${error}`);
}

export async function changeInitialPassword(formData: FormData) {
  const currentPassword = formData.get("currentPassword");
  const newPassword = formData.get("newPassword");
  const confirmPassword = formData.get("confirmPassword");

  // Formulardaten validieren
  if (
    typeof currentPassword !== "string" ||
    typeof newPassword !== "string" ||
    typeof confirmPassword !== "string" ||
    !currentPassword ||
    !newPassword ||
    !confirmPassword
  ) {
    passwordError("missing");
  }

  if (newPassword !== confirmPassword) {
    passwordError("mismatch");
  }

  if (newPassword.length < 12) {
    passwordError("weak");
  }

  // Session und Berechtigung prüfen
  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session) {
    redirect("/account");
  }

  if (!session.user.mustChangePassword) {
    redirect("/");
  }

  // Passwort über Better Auth ändern
  try {
    await auth.api.changePassword({
      headers: requestHeaders,
      body: {
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      },
    });
  } catch {
    passwordError("password");
  }

  // Flag erst nach erfolgreicher Passwortänderung zurücksetzen
  try {
    db.prepare(`
      UPDATE user
      SET mustChangePassword = 0
      WHERE id = ?
    `).run(session.user.id);
  } catch {
    // Passwort wurde bereits geändert.
    // Fehler protokollieren und Wiederherstellung ermöglichen.
    console.error(
      "Failed to clear mustChangePassword for user",
      session.user.id,
    );

    passwordError("server");
  }

  redirect("/");
}
