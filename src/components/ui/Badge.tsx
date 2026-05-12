"use client";

import { cn } from "@/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "promo" | "success" | "warning" | "danger";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const variants = {
    default: "bg-gray-200 text-black dark:bg-gray-700 dark:text-white",
    promo: "bg-brutal-yellow text-black border-2 border-black",
    success: "bg-green-500 text-white border-2 border-black",
    warning: "bg-yellow-500 text-black border-2 border-black",
    danger: "bg-red-500 text-white border-2 border-black",
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-brutal text-xs font-bold shadow-brutal-sm",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
