import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminUsers from "./admin-users";

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/account");
  }

  const roles = session.user.role?.split(",") ?? [];

  if (!roles.includes("admin")) {
    redirect("/");
  }

  return <AdminUsers />;
}