"use client";

import { cn } from "@/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-bold mb-1.5 text-black dark:text-white">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full px-3 py-2.5 bg-white dark:bg-brutal-dark-card border-2 border-black dark:border-brutal-border-dark rounded-brutal text-black dark:text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brutal-yellow dark:focus:ring-brutal-purple focus:ring-offset-2 dark:focus:ring-offset-brutal-dark-bg transition-all",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-500 font-semibold">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
