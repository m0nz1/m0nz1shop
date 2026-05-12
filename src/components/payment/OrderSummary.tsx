"use client";

import { formatPrice } from "@/utils";
import { Product, PaymentMethod, Game } from "@/types";
import { Button } from "@/components/ui/Button";
import { Receipt } from "lucide-react";

interface OrderSummaryProps {
  game: Game;
  product: Product | null;
  paymentMethod: PaymentMethod | null;
  userId: string;
  serverId?: string;
  username?: string;
  onCheckout: () => void;
  loading?: boolean;
}

export function OrderSummary({
  game,
  product,
  paymentMethod,
  userId,
  serverId,
  username,
  onCheckout,
  loading,
}: OrderSummaryProps) {
  if (!product || !paymentMethod) return null;

  const total = product.price + paymentMethod.fee;

  return (
    <div className="bg-brutal-light-card dark:bg-brutal-dark-card border-2 border-black dark:border-brutal-border-dark rounded-brutal shadow-brutal dark:shadow-brutal-dark p-4 space-y-4">
      <div className="flex items-center gap-2 border-b-2 border-black/10 dark:border-white/10 pb-3">
        <Receipt className="w-5 h-5 text-brutal-yellow dark:text-brutal-purple" />
        <h3 className="font-black text-black dark:text-white">Ringkasan Pesanan</h3>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Game</span>
          <span className="font-bold text-black dark:text-white">{game.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">User ID</span>
          <span className="font-bold text-black dark:text-white">{userId}</span>
        </div>
        {serverId && (
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Server ID</span>
            <span className="font-bold text-black dark:text-white">{serverId}</span>
          </div>
        )}
        {username && (
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Username</span>
            <span className="font-bold text-black dark:text-white">{username}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Item</span>
          <span className="font-bold text-black dark:text-white">{product.nominal}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Harga</span>
          <span className="font-bold text-black dark:text-white">{formatPrice(product.price)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Metode</span>
          <span className="font-bold text-black dark:text-white">{paymentMethod.name}</span>
        </div>
        {paymentMethod.fee > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Fee</span>
            <span className="font-bold text-black dark:text-white">{formatPrice(paymentMethod.fee)}</span>
          </div>
        )}
      </div>

      <div className="border-t-2 border-black/10 dark:border-white/10 pt-3">
        <div className="flex justify-between items-center">
          <span className="font-bold text-black dark:text-white">Total</span>
          <span className="font-black text-lg text-brutal-yellow dark:text-brutal-purple">
            {formatPrice(total)}
          </span>
        </div>
      </div>

      <Button
        onClick={onCheckout}
        isLoading={loading}
        className="w-full"
        size="lg"
      >
        Checkout
      </Button>
    </div>
  );
}
