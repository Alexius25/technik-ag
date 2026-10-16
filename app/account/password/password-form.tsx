
"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PasswordForm() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 8) {
      setError("Das neue Passwort muss mindestens 8 Zeichen haben.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Die neuen Passwörter stimmen nicht überein.");
      return;
    }

    if (currentPassword === newPassword) {
      setError("Bitte wähle ein anderes Passwort.");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });

      if (result.error) {
        setError(
          result.error.message ?? "Das Passwort konnte nicht geändert werden.",
        );
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess("Dein Passwort wurde erfolgreich geändert.");

      router.refresh();
    } catch {
      setError("Ein unerwarteter Fehler ist aufgetreten.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="w-full max-w-6xl space-y-6">
      {/* Seitenkopf */}
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent">
            <KeyRound className="size-5" aria-hidden="true" />
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Passwort ändern
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              Schütze deinen Account mit einem sicheren Passwort.
            </p>
          </div>
        </div>
      </header>

      {/* Formular */}
      <div className="overflow-hidden rounded-xl border border-border/60 bg-background">
        <div className="flex items-start gap-3 border-b border-border/60 bg-accent/30 px-4 py-4 sm:px-6">
          <ShieldCheck
            className="mt-0.5 size-5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />

          <div className="space-y-1">
            <h3 className="font-semibold">Kontosicherheit</h3>
            <p className="text-sm text-muted-foreground">
              Nach der Änderung werden deine anderen aktiven Sitzungen
              abgemeldet.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-4 sm:p-6">
          <div className="space-y-4">
            <PasswordField
              id="currentPassword"
              label="Aktuelles Passwort"
              autoComplete="current-password"
              value={currentPassword}
              onChange={setCurrentPassword}
              visible={showPasswords}
              disabled={loading}
            />

            <div className="border-t border-border/50 pt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <PasswordField
                  id="newPassword"
                  label="Neues Passwort"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={setNewPassword}
                  visible={showPasswords}
                  disabled={loading}
                  minLength={8}
                />

                <PasswordField
                  id="confirmPassword"
                  label="Neues Passwort bestätigen"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  visible={showPasswords}
                  disabled={loading}
                  minLength={8}
                />
              </div>

              <p className="mt-3 text-xs text-muted-foreground">
                Dein neues Passwort muss mindestens 8 Zeichen lang sein.
              </p>
            </div>
          </div>

          {/* Passwortsichtbarkeit */}
          <button
            type="button"
            onClick={() => setShowPasswords((visible) => !visible)}
            aria-pressed={showPasswords}
            className="inline-flex items-center gap-2 rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {showPasswords ? (
              <EyeOff className="size-4" aria-hidden="true" />
            ) : (
              <Eye className="size-4" aria-hidden="true" />
            )}
            {showPasswords
              ? "Passwörter verbergen"
              : "Passwörter anzeigen"}
          </button>

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

          {/* Aktionen */}
          <div className="flex flex-col-reverse gap-3 border-t border-border/50 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              Verwende ein Passwort, das du nicht für andere Dienste nutzt.
            </p>

            <Button
              type="submit"
              disabled={
                loading ||
                !currentPassword ||
                !newPassword ||
                !confirmPassword
              }
              className="w-full gap-2 sm:w-auto"
            >
              {loading ? (
                <>
                  <LoaderCircle
                    className="size-4 animate-spin"
                    aria-hidden="true"
                  />
                  Passwort wird geändert …
                </>
              ) : (
                <>
                  <KeyRound className="size-4" aria-hidden="true" />
                  Passwort ändern
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}

function PasswordField({
  id,
  label,
  autoComplete,
  value,
  onChange,
  visible,
  disabled,
  minLength,
}: {
  id: string;
  label: string;
  autoComplete: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  disabled: boolean;
  minLength?: number;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        disabled={disabled}
        minLength={minLength}
      />
    </div>
  );
}
