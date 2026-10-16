"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Eye, EyeOff, Loader2, LockKeyhole, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginForm() {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const { error } = await authClient.signIn.username({
                username,
                password,
            });

            if (error) {
                setError(error.message ?? "Login fehlgeschlagen.");
                return;
            }

            router.push("/dashboard");
            router.refresh();
        } catch {
            setError("Ein unerwarteter Fehler ist aufgetreten.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="mx-auto w-full max-w-md">
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <label htmlFor="username" className="text-sm font-medium">
                        Benutzername
                    </label>

                    <div className="relative">
                        <UserRound className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

                        <Input
                            id="username"
                            name="username"
                            type="text"
                            placeholder="Dein Benutzername"
                            autoComplete="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="h-11 rounded-lg pl-9"
                            required
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                        Passwort
                    </label>

                    <div className="relative">
                        <LockKeyhole className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Dein Passwort"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-11 rounded-lg pr-10 pl-9"
                            required
                            disabled={isLoading}
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute top-1/2 right-3 -translate-y-1/2 rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                            aria-label={
                                showPassword
                                    ? "Passwort verbergen"
                                    : "Passwort anzeigen"
                            }
                            aria-pressed={showPassword}
                            disabled={isLoading}
                        >
                            {showPassword ? (
                                <EyeOff className="size-4" />
                            ) : (
                                <Eye className="size-4" />
                            )}
                        </button>
                    </div>
                </div>

                {error && (
                    <p
                        role="alert"
                        className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                    >
                        {error}
                    </p>
                )}

                <Button
                    type="submit"
                    className="h-11 w-full rounded-lg font-semibold"
                    disabled={isLoading || !username.trim() || !password}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 size-4 animate-spin" />
                            Anmeldung läuft...
                        </>
                    ) : (
                        "Anmelden"
                    )}
                </Button>
            </form>
        </div>
    );
}
