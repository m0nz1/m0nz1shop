"use client";

import { Home, History, Tag, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/history", label: "History", icon: History },
  { href: "/promo", label: "Promo", icon: Tag },
  { href: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-brutal-light-card dark:bg-brutal-dark-card border-t-2 border-black dark:border-brutal-border-dark shadow-[0_-4px_0px_0px_#000000] dark:shadow-[0_-4px_0px_0px_#333333] md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 rounded-brutal transition-all",
                isActive
                  ? "text-brutal-yellow dark:text-brutal-purple"
                  : "text-gray-500 dark:text-gray-400"
              )}
            >
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-bold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
