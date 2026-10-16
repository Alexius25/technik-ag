
"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  RefreshCw,
  UserPlus,
  Users,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";

type ManagedUser = {
  id: string;
  name: string;
  email: string;
  username?: string | null;
  role?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  className?: string | null;
  createdAt: Date | string;
};

type UserForm = {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  className: string;
};

const INITIAL_FORM: UserForm = {
  username: "",
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  className: "",
};

export default function AdminUsers() {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState<UserForm>(INITIAL_FORM);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await authClient.admin.listUsers({
        query: {
          limit: 100,
          offset: 0,
          sortBy: "createdAt",
          sortDirection: "desc",
        },
      });

      if (result.error) {
        setError(result.error.message ?? "Benutzer konnten nicht geladen werden.");
        return;
      }

      setUsers((result.data?.users ?? []) as ManagedUser[]);
    } catch {
      setError("Die Benutzer konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  function updateField(field: keyof UserForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleCreateUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setCreating(true);

    const username = form.username.trim();
    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();

    try {
      const result = await authClient.admin.createUser({
        email: form.email.trim(),
        password: form.password,
        name: `${firstName} ${lastName}`,
        role: "user",
        data: {
          username: username.toLowerCase(),
          displayUsername: username,
          firstName,
          lastName,
          className: form.className.trim(),
          mustChangePassword: true,
        },
      });

      if (result.error) {
        setError(result.error.message ?? "Der Account konnte nicht erstellt werden.");
        return;
      }

      setSuccess(`Der Account für @${username} wurde erstellt.`);
      setForm(INITIAL_FORM);
      await loadUsers();
    } catch {
      setError("Beim Erstellen des Accounts ist ein Fehler aufgetreten.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:space-y-8 sm:px-6 sm:py-8">
      {/* Seitenkopf */}
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent">
            <ShieldCheck className="size-5" aria-hidden="true" />
          </div>

          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Benutzerverwaltung
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Benutzerkonten verwalten und neue Accounts erstellen.
            </p>
          </div>
        </div>
      </header>

      {/* Benutzerübersicht */}
      <Card className="overflow-hidden rounded-xl border-border/60 bg-background shadow-none">
        <CardHeader className="gap-3 border-b border-border/60 bg-accent/30 px-4 py-5 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="size-5" aria-hidden="true" />
                Alle Benutzer
              </CardTitle>

              <CardDescription>
                {loading
                  ? "Benutzer werden geladen …"
                  : `${users.length} Benutzer insgesamt${
                      users.length === 100 ? " (maximal 100 angezeigt)" : ""
                    }`}
              </CardDescription>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void loadUsers()}
              disabled={loading}
              className="shrink-0 gap-2"
            >
              <RefreshCw
                className={`size-4 ${loading ? "animate-spin" : ""}`}
                aria-hidden="true"
              />
              <span className="hidden sm:inline">Aktualisieren</span>
              <span className="sm:hidden">Neu laden</span>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {error && (
            <div
              role="alert"
              className="mx-4 mt-4 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive sm:mx-6"
            >
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center gap-3 px-4 py-14 text-sm text-muted-foreground">
              <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
              Benutzer werden geladen …
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 px-4 py-14 text-center">
              <div className="mb-1 flex size-12 items-center justify-center rounded-xl bg-accent">
                <Users className="size-5 text-muted-foreground" aria-hidden="true" />
              </div>
              <p className="font-medium">Keine Benutzer gefunden</p>
              <p className="text-sm text-muted-foreground">
                Erstellte Benutzerkonten werden hier angezeigt.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-accent/20 text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-medium sm:px-6">
                      Benutzer
                    </th>
                    <th scope="col" className="px-5 py-3 font-medium">
                      E-Mail
                    </th>
                    <th scope="col" className="px-5 py-3 font-medium">
                      Klasse
                    </th>
                    <th scope="col" className="px-5 py-3 font-medium">
                      Rolle
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => {
                    const fullName =
                      [user.firstName, user.lastName]
                        .filter(Boolean)
                        .join(" ") || user.name;

                    return (
                      <tr
                        key={user.id}
                        className="border-t border-border/50 transition-colors hover:bg-accent/20"
                      >
                        <td className="px-5 py-4 sm:px-6">
                          <p className="font-medium">{fullName}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            @{user.username || "—"}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-muted-foreground">
                          {user.email}
                        </td>

                        <td className="px-5 py-4">
                          {user.className || "—"}
                        </td>

                        <td className="px-5 py-4">
                          <span className="inline-flex items-center rounded-md bg-accent px-2 py-1 text-xs font-medium">
                            {user.role ?? "user"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="border-t border-border/50 px-4 py-3 sm:px-6">
            <p className="text-xs text-muted-foreground">
              Es werden bis zu 100 Benutzerkonten angezeigt.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Benutzer erstellen */}
      <Card className="rounded-xl border-border/60 bg-background shadow-none">
        <CardHeader className="border-b border-border/60 bg-accent/30 px-4 py-5 sm:px-6">
          <CardTitle className="flex items-center gap-2 text-lg">
            <UserPlus className="size-5" aria-hidden="true" />
            Neuen Benutzer erstellen
          </CardTitle>
          <CardDescription>
            Der Account erhält die Rolle „user“ und muss das Startpasswort
            beim ersten Anmelden ändern.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleCreateUser} className="space-y-6">
            <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
              <FormField label="Benutzername" htmlFor="username">
                <Input
                  id="username"
                  autoComplete="off"
                  placeholder="z. B. max.mustermann"
                  required
                  minLength={3}
                  maxLength={30}
                  value={form.username}
                  onChange={(event) =>
                    updateField("username", event.target.value)
                  }
                  disabled={creating}
                />
              </FormField>

              <FormField label="E-Mail-Adresse" htmlFor="email">
                <Input
                  id="email"
                  type="email"
                  autoComplete="off"
                  placeholder="name@beispiel.de"
                  required
                  value={form.email}
                  onChange={(event) =>
                    updateField("email", event.target.value)
                  }
                  disabled={creating}
                />
              </FormField>

              <FormField label="Vorname" htmlFor="firstName">
                <Input
                  id="firstName"
                  autoComplete="given-name"
                  placeholder="Vorname"
                  required
                  value={form.firstName}
                  onChange={(event) =>
                    updateField("firstName", event.target.value)
                  }
                  disabled={creating}
                />
              </FormField>

              <FormField label="Nachname" htmlFor="lastName">
                <Input
                  id="lastName"
                  autoComplete="family-name"
                  placeholder="Nachname"
                  required
                  value={form.lastName}
                  onChange={(event) =>
                    updateField("lastName", event.target.value)
                  }
                  disabled={creating}
                />
              </FormField>

              <FormField label="Klasse" htmlFor="className">
                <Input
                  id="className"
                  placeholder="z. B. 10a"
                  required
                  value={form.className}
                  onChange={(event) =>
                    updateField("className", event.target.value)
                  }
                  disabled={creating}
                />
              </FormField>

              <FormField label="Startpasswort" htmlFor="password">
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Mindestens 8 Zeichen"
                  required
                  minLength={8}
                  value={form.password}
                  onChange={(event) =>
                    updateField("password", event.target.value)
                  }
                  disabled={creating}
                />
              </FormField>
            </div>

            {/* Statusmeldungen */}
            {error && (
              <p
                role="alert"
                className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
              >
                {error}
              </p>
            )}

            {success && (
              <p
                role="status"
                className="rounded-lg border border-border bg-accent/50 px-4 py-3 text-sm"
              >
                {success}
              </p>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-border/50 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                Alle Felder sind erforderlich.
              </p>

              <Button
                type="submit"
                disabled={creating}
                className="w-full gap-2 sm:w-auto"
              >
                {creating ? (
                  <>
                    <LoaderCircle
                      className="size-4 animate-spin"
                      aria-hidden="true"
                    />
                    Account wird erstellt …
                  </>
                ) : (
                  <>
                    <UserPlus className="size-4" aria-hidden="true" />
                    Benutzer erstellen
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

function FormField({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}
