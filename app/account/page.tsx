import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import LoginForm from "@/components/login";

export default async function Page() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const user = session?.user;

    return (
        <main className="min-h-screen bg-background">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                {!session ? (
                    <section className="mx-auto w-full max-w-xl rounded-xl bg-accent p-5 sm:p-8 dark:bg-accent-foreground">
                        <div className="mb-8 text-center">
                            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                Anmelden
                            </h1>
                            <p className="mt-2 text-sm leading-6 text-foreground/70">
                                Melde dich mit deinem Account an, um dein Profil
                                aufzurufen.
                            </p>
                        </div>

                        <LoginForm />
                    </section>
                ) : (
                    <section className="mx-auto w-full max-w-3xl rounded-xl bg-accent p-5 sm:p-8 dark:bg-accent-foreground">
                        <div className="mb-8 border-b border-border/50 pb-5">
                            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                Mein Profil
                            </h1>
                            <p className="mt-2 text-sm leading-6 text-foreground/70">
                                Deine persönlichen Accountinformationen.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
                            <dl className="divide-y divide-border/50">
                                <ProfileRow
                                    label="Vorname"
                                    value={user?.firstName}
                                />
                            </dl>

                            <dl className="divide-y divide-border/50">
                                <ProfileRow
                                    label="Nachname"
                                    value={user?.lastName}
                                />
                            </dl>

                            <div className="sm:col-span-2">
                                <dl className="divide-y divide-border/50">
                                    <ProfileRow
                                        label="Klasse"
                                        value={user?.className}
                                    />
                                    <ProfileRow
                                        label="E-Mail"
                                        value={user?.email}
                                    />
                                </dl>
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}

function ProfileRow({
    label,
    value,
}: {
    label: string;
    value?: string | null;
}) {
    return (
        <div className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-6">
            <dt className="text-sm font-semibold text-foreground/70">
                {label}
            </dt>
            <dd className="min-w-0 text-base font-medium break-words">
                {value || "Nicht angegeben"}
            </dd>
        </div>
    );
}
