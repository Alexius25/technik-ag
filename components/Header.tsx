"use client"

import Link from "next/link"
import Image from "next/image"
import { ChevronDown, Search } from "lucide-react"

const navItems = [
  {
    label: "Infos",
    children: ["Testfeld"],
  },
]

export default function Header() {
  return (
    <header className="sticky top-0 z-20 bg-background/95">
      <div className="mx-auto flex max-w-screen items-center justify-between px-4 py-[2.4rem] md:px-8">
        <Link href="/" className="ml-[0.4rem] block shrink-0">
          <Image
            src="/logo.svg"
            alt="Solitude-Gymnasium Stuttgart-Weilimdorf"
            className=""
            width={400}
            height={200}
          />
        </Link>

        <nav
          className="relative -top-3 hidden items-center gap-6 lg:flex"
          aria-label="Hauptnavigation"
        >
          {navItems.map((item) => (
            <div key={item.label} className="group relative">
              <a
                href={
                  item.children.length
                    ? "#"
                    : "https://solitude-gymnasium.de/kontakt/"
                }
                className="group inline-flex items-center gap-1 text-xl font-medium tracking-[0.12em] uppercase transition"
              >
                <span className="group-hover:underline">{item.label}</span>
                {item.children.length > 0 && (
                  <ChevronDown className="text-xl select-none" />
                )}
              </a>

              {item.children.length > 0 && (
                <ul className="invisible absolute top-8 left-1/2 z-10 min-w-[240px] -translate-x-1/2 translate-y-2 bg-foreground p-3 text-background opacity-0 shadow-lg transition-all duration-200 ease-out group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  {item.children.map((child) => (
                    <li
                      key={child}
                      className="ml-5 py-1 text-lg font-medium tracking-[0.12em] uppercase"
                    >
                      <Link href="" className="block py-1.5">
                        {child}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <nav
            className="hidden items-center gap-4 xl:flex"
            aria-label="Info für"
          ></nav>

          <Link
            href="/suche"
            className="relative -top-3"
            aria-label="Zur Suchseite"
          >
            <Search className="h-12 w-12 scale-x-[-1]" />
          </Link>

          <button
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e8ddc0] lg:hidden"
            aria-label="Menü öffnen"
          >
            <span className="flex flex-col gap-1.5">
              <span className="block h-0.5 w-5 bg-[#23596A]" />
              <span className="block h-0.5 w-5 bg-[#23596A]" />
              <span className="block h-0.5 w-5 bg-[#23596A]" />
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}
