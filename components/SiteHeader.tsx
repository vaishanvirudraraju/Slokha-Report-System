"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const BRANCHES = [
  { label: "Nagole", href: "#" },
  { label: "Nanakramguda", href: "#" },
  { label: "Madhapur", href: "#" },
  { label: "Almasguda", href: "#" },
] as const;

function SocialIcon({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href="#"
      aria-label={label}
      className="flex size-8 items-center justify-center rounded-full bg-[#004d40] text-white shadow-sm transition hover:bg-[#006b5c]"
    >
      {children}
    </a>
  );
}

function NavLink({
  href,
  children,
  active,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
        active
          ? "bg-[#004d40]/10 text-[#004d40]"
          : "text-neutral-800 hover:bg-neutral-100 hover:text-[#004d40]"
      }`}
    >
      {children}
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [branchesOpen, setBranchesOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[100]">
      <div className="flex min-h-[40px] flex-col sm:flex-row">
        <div className="flex flex-1 items-center gap-3 bg-[#f9c200] px-4 py-2 sm:px-6">
          <span className="text-sm font-semibold text-[#004d40]">Follow Us:</span>
          <div className="flex items-center gap-2">
            <SocialIcon label="Facebook">
              <svg className="size-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </SocialIcon>
            <SocialIcon label="Twitter">
              <svg className="size-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </SocialIcon>
            <SocialIcon label="Instagram">
              <svg className="size-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5a4.25 4.25 0 0 0-4.25-4.25h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM17.25 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
              </svg>
            </SocialIcon>
            <SocialIcon label="LinkedIn">
              <svg className="size-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </SocialIcon>
          </div>
        </div>
        <div className="flex flex-none flex-wrap items-center justify-start gap-x-6 gap-y-2 bg-[#004d40] px-4 py-2 text-sm text-white sm:justify-end sm:px-6">
          <a
            href="mailto:info@slokatheschools.com"
            className="inline-flex items-center gap-2 font-medium hover:text-[#f9c200]"
          >
            <span className="rounded-full bg-[#f9c200]/20 p-1.5 text-[#f9c200]" aria-hidden>
              <svg className="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            <span className="hidden sm:inline">info@slokatheschools.com</span>
            <span className="sm:hidden">Email</span>
          </a>
          <a
            href="tel:+919502593723"
            className="inline-flex items-center gap-2 font-medium hover:text-[#f9c200]"
          >
            <span className="rounded-full bg-[#f9c200]/20 p-1.5 text-[#f9c200]" aria-hidden>
              <svg className="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </span>
            91-9502593723
          </a>
          <span className="inline-flex items-center gap-2 font-semibold text-[#f9c200]">
            <svg className="size-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <span className="whitespace-nowrap">Admissions Open 2026-27</span>
          </span>
        </div>
      </div>

      <div className="border-b border-neutral-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-3 rounded-xl py-1 pr-2 transition hover:opacity-90"
          >
            <span className="relative size-[52px] shrink-0 overflow-hidden rounded-full border-2 border-[#9d1b1f] shadow-md ring-2 ring-[#f9c200]/40 ring-offset-2 transition group-hover:ring-[#f9c200]/70 sm:size-[60px]">
              <Image
                src="/brand/sloka-logo.png"
                alt="Sloka — The Global School"
                width={120}
                height={120}
                className="size-full object-cover"
                priority
              />
            </span>
            <span className="hidden min-w-0 flex-col leading-tight sm:flex">
              <span className="font-['Georgia',ui-serif,serif] text-lg font-bold tracking-tight text-[#9d1b1f]">
                Sloka
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-800">
                The Global School
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            <NavLink href="/" active={pathname === "/"}>
              Home
            </NavLink>
            <div className="relative">
              <button
                type="button"
                onClick={() => setBranchesOpen((o) => !o)}
                onBlur={() => {
                  window.setTimeout(() => setBranchesOpen(false), 120);
                }}
                className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-100 hover:text-[#004d40]"
                aria-expanded={branchesOpen}
                aria-haspopup="true"
              >
                Branches
                <svg className="size-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 9-7 7-7-7" />
                </svg>
              </button>
              {branchesOpen ? (
                <div
                  role="menu"
                  className="absolute left-0 top-full z-50 mt-1 min-w-[200px] rounded-xl border border-neutral-200 bg-white py-2 shadow-lg"
                >
                  {BRANCHES.map((b) => (
                    <a
                      key={b.label}
                      href={b.href}
                      role="menuitem"
                      className="block px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-[#f9c200]/15 hover:text-[#004d40]"
                    >
                      {b.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
            <NavLink href="/#contact" active={false}>
              Contact us
            </NavLink>
            <Link
              href="/results"
              className={`ml-1 rounded-full px-5 py-2.5 text-sm font-bold tracking-wide transition ${
                pathname === "/results"
                  ? "bg-[#004d40] text-white shadow-md"
                  : "bg-[#f9c200] text-[#004d40] shadow-sm hover:bg-[#e6b000]"
              }`}
            >
              Result
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="tel:+919502593723"
              className="hidden items-center gap-2 lg:flex"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-[#004d40] text-white shadow-sm">
                <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </span>
              <span className="flex flex-col text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                  Phone
                </span>
                <span className="text-sm font-bold text-[#004d40]">91-9502593723</span>
              </span>
            </a>
            <Link
              href="/results"
              className="hidden rounded-full bg-[#f9c200] px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-[#004d40] shadow-sm transition hover:bg-[#e6b000] sm:inline-flex lg:hidden"
            >
              Result
            </Link>

            <button
              type="button"
              className="inline-flex rounded-lg p-2 text-neutral-800 hover:bg-neutral-100 md:hidden"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              onClick={() => setMobileOpen((o) => !o)}
            >
              <span className="sr-only">Menu</span>
              {mobileOpen ? (
                <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {mobileOpen ? (
          <div
            id="mobile-menu"
            className="border-t border-neutral-100 bg-white px-4 py-4 md:hidden"
          >
            <div className="flex flex-col gap-1">
              <NavLink href="/">Home</NavLink>
              <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-neutral-400">
                Branches
              </span>
              {BRANCHES.map((b) => (
                <a
                  key={b.label}
                  href={b.href}
                  className="rounded-lg px-6 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  {b.label}
                </a>
              ))}
              <NavLink href="/#contact">Contact us</NavLink>
              <Link
                href="/results"
                className="mt-2 rounded-full bg-[#f9c200] py-3 text-center text-sm font-bold text-[#004d40]"
                onClick={() => setMobileOpen(false)}
              >
                Result
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
