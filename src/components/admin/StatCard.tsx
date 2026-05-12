"use client";

import { cn } from "@/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: "yellow" | "purple" | "green" | "red";
}

export function StatCard({ title, value, icon: Icon, color = "yellow" }: StatCardProps) {
  const colors = {
    yellow: "bg-brutal-yellow text-black",
    purple: "bg-brutal-purple text-white",
    green: "bg-green-500 text-white",
    red: "bg-red-500 text-white",
  };

  return (
    <div className="bg-brutal-light-card dark:bg-brutal-dark-card border-2 border-black dark:border-brutal-border-dark rounded-brutal shadow-brutal dark:shadow-brutal-dark p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">{title}</p>
          <p className="text-2xl font-black text-black dark:text-white mt-1">{value}</p>
        </div>
        <div className={cn("p-2 rounded-brutal border-2 border-black", colors[color])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
