"use client";

import { cn } from "@/utils";
import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-brutal-light-card dark:bg-brutal-dark-card border-2 border-black dark:border-brutal-border-dark rounded-brutal shadow-brutal dark:shadow-brutal-dark transition-all duration-200",
          hover && "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brutal-active dark:hover:shadow-brutal-dark cursor-pointer",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export { Card };
