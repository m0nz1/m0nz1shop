"use client";

import { cn, formatPrice } from "@/utils";
import { Product } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Zap } from "lucide-react";

interface ProductSelectorProps {
  products: Product[];
  selected: Product | null;
  onSelect: (product: Product) => void;
}

export function ProductSelector({ products, selected, onSelect }: ProductSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-bold text-black dark:text-white">Pilih Nominal</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {products.map((product) => {
          const isSelected = selected?.id === product.id;
          const hasDiscount = product.original_price && product.original_price > product.price;

          return (
            <button
              key={product.id}
              onClick={() => onSelect(product)}
              className={cn(
                "relative p-3 border-2 rounded-brutal transition-all text-left",
                isSelected
                  ? "border-brutal-yellow dark:border-brutal-purple bg-brutal-yellow/10 dark:bg-brutal-purple/10 shadow-brutal dark:shadow-brutal-dark"
                  : "border-black dark:border-brutal-border-dark bg-white dark:bg-brutal-dark-card hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-brutal-sm"
              )}
            >
              {product.is_promo && (
                <div className="absolute -top-2 -right-2">
                  <Badge variant="promo" className="text-[10px]">
                    <Zap className="w-3 h-3 mr-0.5" />
                    PROMO
                  </Badge>
                </div>
              )}

              <p className="font-bold text-sm text-black dark:text-white">
                {product.nominal}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {product.name}
              </p>

              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-black text-sm text-black dark:text-white">
                  {formatPrice(product.price)}
                </span>
                {hasDiscount && (
                  <span className="text-xs text-gray-400 line-through">
                    {formatPrice(product.original_price!)}
                  </span>
                )}
              </div>

              {product.bonus && (
                <p className="text-[10px] text-green-600 dark:text-green-400 font-bold mt-1">
                  +{product.bonus}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
