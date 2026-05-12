"use client";

import { Moon, Sun, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useDarkMode } from "@/hooks/useDarkMode";
import { cn } from "@/utils";

export function Header() {
  const { isDark, toggle, mounted } = useDarkMode();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-40 bg-brutal-light-bg dark:bg-brutal-dark-bg border-b-2 border-black dark:border-brutal-border-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brutal-yellow dark:bg-brutal-purple rounded-brutal border-2 border-black flex items-center justify-center">
              <span className="font-black text-sm">G</span>
            </div>
            <span className="font-black text-xl tracking-tight text-black dark:text-white">
              GAME<span className="text-brutal-yellow dark:text-brutal-purple">TOP</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { href: "/", label: "Beranda" },
              { href: "/history", label: "Riwayat" },
              { href: "/promo", label: "Promo" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm font-bold text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-brutal transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="p-2 rounded-brutal border-2 border-black dark:border-brutal-border-dark bg-white dark:bg-brutal-dark-card shadow-brutal dark:shadow-brutal-dark hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-brutal-active active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <Link
              href="/admin/login"
              className="hidden md:inline-flex px-3 py-2 text-sm font-bold bg-brutal-yellow dark:bg-brutal-purple text-black dark:text-white border-2 border-black dark:border-brutal-border-dark rounded-brutal shadow-brutal dark:shadow-brutal-dark hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-brutal-active active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
            >
              Admin
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-brutal border-2 border-black dark:border-brutal-border-dark bg-white dark:bg-brutal-dark-card shadow-brutal dark:shadow-brutal-dark"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden border-t-2 border-black dark:border-brutal-border-dark bg-brutal-light-bg dark:bg-brutal-dark-bg overflow-hidden transition-all duration-300",
          mobileMenuOpen ? "max-h-64" : "max-h-0"
        )}
      >
        <div className="px-4 py-3 space-y-1">
          {[
            { href: "/", label: "Beranda" },
            { href: "/history", label: "Riwayat" },
            { href: "/promo", label: "Promo" },
            { href: "/profile", label: "Profil" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-bold text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-brutal"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
