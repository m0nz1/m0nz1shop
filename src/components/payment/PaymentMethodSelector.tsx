"use client";

import { cn } from "@/utils";
import { PaymentMethod } from "@/types";
import { Check } from "lucide-react";

interface PaymentMethodSelectorProps {
  methods: PaymentMethod[];
  selected: PaymentMethod | null;
  onSelect: (method: PaymentMethod) => void;
}

export function PaymentMethodSelector({ methods, selected, onSelect }: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-bold text-black dark:text-white">Metode Pembayaran</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {methods.map((method) => {
          const isSelected = selected?.id === method.id;
          return (
            <button
              key={method.id}
              onClick={() => onSelect(method)}
              className={cn(
                "relative flex items-center gap-3 p-3 border-2 rounded-brutal transition-all text-left",
                isSelected
                  ? "border-brutal-yellow dark:border-brutal-purple bg-brutal-yellow/10 dark:bg-brutal-purple/10 shadow-brutal dark:shadow-brutal-dark"
                  : "border-black dark:border-brutal-border-dark bg-white dark:bg-brutal-dark-card hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-brutal-sm"
              )}
            >
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-brutal border border-black/20 flex items-center justify-center text-xs font-bold">
                {method.code.toUpperCase().slice(0, 3)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-black dark:text-white truncate">
                  {method.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {method.fee > 0 ? `Fee: ${method.fee}` : "No fee"}
                </p>
              </div>
              {isSelected && (
                <div className="w-6 h-6 bg-brutal-yellow dark:bg-brutal-purple rounded-full border-2 border-black flex items-center justify-center">
                  <Check className="w-3 h-3 text-black" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
