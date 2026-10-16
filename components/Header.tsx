
"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronDown,
  Search,
  UserRound,
  Menu,
  X,
  ArrowUpRight,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

type NavLink = {
  label: string;
  href: string;
  roles?: string[];
};

type NavItem = {
  label: string;
  roles?: string[];
  children: NavLink[];
};

const navItems: NavItem[] = [
  {
    label: "Infos",
    children: [{ label: "Testfeld", href: "/testfeld" }],
  },
  {
    label: "Administration",
    roles: ["admin"],
    children: [
      { label: "Adminbereich", href: "/admin" },
    ],
  },
];

function hasAccess(
  roles: string[] | undefined,
  userRole: string | undefined,
) {
  return !roles || (!!userRole && roles.includes(userRole));
}

export default function Header() {
  const { data: session, isPending } = authClient.useSession();

  const isLoggedIn = !!session?.user;
  const role = session?.user?.role as string | undefined;

  const visibleNavItems = navItems.filter((item) =>
    hasAccess(item.roles, role),
  );

  const accountHref = "/account";
  const accountLabel = isPending
    ? "Konto"
    : isLoggedIn
      ? "Mein Profil"
      : "Anmelden";

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Hintergrund-Scroll sperren und Escape behandeln
  useEffect(() => {
    if (!mobileOpen && !searchOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setMobileSubmenu(null);
        setSearchOpen(false);
        setOpenMenu(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen, searchOpen]);

  // Suchfeld beim Öffnen fokussieren
  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();
    }
  }, [searchOpen]);

  function closeMobileMenu() {
    setMobileOpen(false);
    setMobileSubmenu(null);
  }

  function openSearch() {
    closeMobileMenu();
    setOpenMenu(null);
    setSearchOpen(true);
  }

  function closeSearch() {
    setSearchOpen(false);
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between gap-3 px-4 py-4 sm:px-6 md:py-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            aria-label="Solitude-Gymnasium – Startseite"
            className="min-w-0 shrink-0 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Image
              src="/logo.svg"
              alt="Solitude-Gymnasium Stuttgart-Weilimdorf"
              width={400}
              height={200}
              priority
              sizes="(max-width: 640px) 180px, (max-width: 1024px) 240px, 300px"
              className="h-auto w-[180px] sm:w-[220px] lg:w-[280px]"
            />
          </Link>

          {/* Desktop navigation */}
          <nav
            className="hidden items-center gap-6 lg:flex"
            aria-label="Hauptnavigation"
          >
            {visibleNavItems.map((item) => {
              const isOpen = openMenu === item.label;
              const menuId = `desktop-menu-${item.label.toLowerCase()}`;

              return (
                <div key={item.label} className="relative">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={menuId}
                    onClick={() =>
                      setOpenMenu(isOpen ? null : item.label)
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Escape") {
                        setOpenMenu(null);
                      }
                    }}
                    className="inline-flex items-center gap-2 rounded-sm py-2 text-base font-medium tracking-[0.12em] uppercase transition-colors hover:text-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring xl:text-lg"
                  >
                    {item.label}
                    <ChevronDown
                      aria-hidden="true"
                      className={`size-4 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <ul
                      id={menuId}
                      className="absolute top-full left-1/2 z-50 mt-3 min-w-60 -translate-x-1/2 rounded-lg border border-border bg-background p-2 text-foreground shadow-lg"
                    >
                      {item.children
                        .filter((child) => hasAccess(child.roles, role))
                        .map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={() => setOpenMenu(null)}
                              className="block rounded-md px-4 py-3 text-sm font-medium tracking-wide uppercase transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Desktop actions */}
          <div className="hidden shrink-0 items-center gap-3 lg:flex">
            <ActionLink
              href={accountHref}
              label={accountLabel}
              icon={<UserRound aria-hidden="true" className="size-6" />}
            />

            <button
              type="button"
              onClick={openSearch}
              aria-label="Suche öffnen"
              title="Suche"
              className="inline-flex size-11 items-center justify-center rounded-full bg-accent/50 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Search aria-hidden="true" className="size-6" />
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Menü öffnen"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-accent/50 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
          >
            <Menu aria-hidden="true" className="size-6" />
          </button>
        </div>
      </header>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Menü schließen"
            onClick={closeMobileMenu}
            className="absolute inset-0 size-full cursor-default bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-200"
          />

          {/* Sidebar */}
          <aside
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
            className="absolute inset-y-0 right-0 flex w-[min(88vw,380px)] flex-col border-l border-border bg-background shadow-2xl animate-in slide-in-from-right duration-300"
          >
            {/* Sidebar header */}
            <div className="flex items-center justify-between border-b border-border/60 px-5 py-5">
              <Link
                href="/"
                onClick={closeMobileMenu}
                aria-label="Zur Startseite"
                className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Image
                  src="/logo.svg"
                  alt="Solitude-Gymnasium"
                  width={240}
                  height={120}
                  sizes="170px"
                  className="h-auto w-[170px]"
                />
              </Link>

              <button
                type="button"
                onClick={closeMobileMenu}
                aria-label="Menü schließen"
                autoFocus
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-accent/50 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>

            {/* Navigation links */}
            <nav
              aria-label="Mobile Hauptnavigation"
              className="flex-1 overflow-y-auto px-5 py-6"
            >
              <p className="mb-4 px-3 text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                Navigation
              </p>

              <ul className="space-y-2">
                {visibleNavItems.map((item) => {
                  const isOpen = mobileSubmenu === item.label;
                  const submenuId = `mobile-submenu-${item.label.toLowerCase()}`;

                  return (
                    <li key={item.label}>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={submenuId}
                        onClick={() =>
                          setMobileSubmenu(isOpen ? null : item.label)
                        }
                        className="flex w-full items-center justify-between rounded-lg px-3 py-3.5 text-left text-base font-medium tracking-[0.12em] uppercase transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {item.label}
                        <ChevronDown
                          aria-hidden="true"
                          className={`size-5 text-muted-foreground transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <ul
                          id={submenuId}
                          className="mt-1 ml-3 space-y-1 border-l border-border pl-3"
                        >
                          {item.children
                            .filter((child) => hasAccess(child.roles, role))
                            .map((child) => (
                              <li key={child.href}>
                                <Link
                                  href={child.href}
                                  onClick={closeMobileMenu}
                                  className="flex items-center justify-between rounded-md px-3 py-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                  {child.label}
                                  <ArrowUpRight
                                    aria-hidden="true"
                                    className="size-4"
                                  />
                                </Link>
                              </li>
                            ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Account + search */}
            <div className="border-t border-border/60 p-5">
              <p className="mb-3 px-1 text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                Schnellzugriff
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={openSearch}
                  className="flex min-h-14 items-center gap-3 rounded-lg bg-accent/50 px-4 py-3 text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Search aria-hidden="true" className="size-5" />
                  Suche
                </button>

                <QuickLink
                  href={accountHref}
                  label={accountLabel}
                  icon={<UserRound aria-hidden="true" className="size-5" />}
                  onClick={closeMobileMenu}
                />
              </div>

              {isLoggedIn && (
                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Angemeldet{role ? ` · Rolle: ${role}` : ""}
                </p>
              )}

              <p className="mt-5 text-center text-xs text-muted-foreground">
                Solitude-Gymnasium Stuttgart-Weilimdorf
              </p>
            </div>
          </aside>
        </div>
      )}

      {/* Search popup — UI only */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-black/50 px-4 pt-[15vh] backdrop-blur-sm animate-in fade-in duration-200"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeSearch();
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-label="Seitensuche"
            className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-background shadow-2xl animate-in slide-in-from-top-2 duration-200"
          >
            <div className="flex items-center gap-3 p-4 sm:p-5">
              <Search
                aria-hidden="true"
                className="size-6 shrink-0 text-muted-foreground"
              />

              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                  }
                }}
                placeholder="Wonach suchst du?"
                aria-label="Suchbegriff"
                className="min-w-0 flex-1 bg-transparent py-2 text-base outline-none placeholder:text-muted-foreground sm:text-lg"
              />

              <button
                type="button"
                onClick={closeSearch}
                aria-label="Suche schließen"
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>

            <div className="border-t border-border/60 px-5 py-3">
              <p className="text-xs text-muted-foreground">
                {searchQuery.trim()
                  ? "Die Suche wird später hier integriert."
                  : "Gib einen Suchbegriff ein."}
              </p>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

function ActionLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      className="inline-flex size-11 items-center justify-center rounded-full bg-accent/50 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {icon}
    </Link>
  );
}

function QuickLink({
  href,
  label,
  icon,
  onClick,
}: {
  href: string;
  label: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex min-h-14 items-center gap-3 rounded-lg bg-accent/50 px-4 py-3 text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {icon}
      <span className="truncate">{label}</span>
    </Link>
  );
}
