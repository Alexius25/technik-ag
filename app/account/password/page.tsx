import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import PasswordForm from "./password-form";

export default async function PasswordPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/account");
  }

  return (
    <main className="flex min-h-[80vh] items-center justify-center p-6">
      <PasswordForm />
    </main>
  );
}