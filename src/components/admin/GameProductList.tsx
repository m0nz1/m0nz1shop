"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Game, Product } from "@/types";
import { formatPrice } from "@/utils";
import { ChevronUp, ChevronDown, Edit, Trash2, Package } from "lucide-react";
import Image from "next/image";

interface GameProductListProps {
  games: Game[];
  products: Product[];
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onEditGame: (game: Game) => void;
  onDeleteGame: (id: string) => void;
  onReorderGame: (gameId: string, direction: "up" | "down") => void;
  onReorderProduct: (productId: string, direction: "up" | "down") => void;
}

export function GameProductList({
  games,
  products,
  onEditProduct,
  onDeleteProduct,
  onEditGame,
  onDeleteGame,
  onReorderGame,
  onReorderProduct,
}: GameProductListProps) {
  const [expandedGames, setExpandedGames] = useState<Set<string>>(new Set(games.map((g) => g.id)));

  const toggleExpand = (gameId: string) => {
    setExpandedGames((prev) => {
      const next = new Set(prev);
      if (next.has(gameId)) {
        next.delete(gameId);
      } else {
        next.add(gameId);
      }
      return next;
    });
  };

  const sortedGames = [...games].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="space-y-4">
      {sortedGames.map((game, gameIndex) => {
        const gameProducts = products
          .filter((p) => p.game_id === game.id)
          .sort((a, b) => a.sort_order - b.sort_order);
        const isExpanded = expandedGames.has(game.id);

        return (
          <Card key={game.id} className="overflow-hidden">
            {/* Game Header */}
            <div className="p-4 border-b-2 border-black dark:border-brutal-border-dark bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-brutal border-2 border-black dark:border-brutal-border-dark overflow-hidden flex-shrink-0 bg-white">
                  <Image
                    src={game.image_url || "/images/placeholder.jpg"}
                    alt={game.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-lg text-black dark:text-white truncate">{game.name}</h3>
                    <Badge variant="default" className="text-[10px]">{game.category}</Badge>
                    {!game.is_active && <Badge variant="danger" className="text-[10px]">NONAKTIF</Badge>}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{game.description || "-"}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onReorderGame(game.id, "up")}
                    disabled={gameIndex === 0}
                    className="p-1 rounded border border-black dark:border-brutal-border-dark hover:bg-brutal-yellow dark:hover:bg-brutal-purple disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onReorderGame(game.id, "down")}
                    disabled={gameIndex === sortedGames.length - 1}
                    className="p-1 rounded border border-black dark:border-brutal-border-dark hover:bg-brutal-yellow dark:hover:bg-brutal-purple disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEditGame(game)}
                    className="p-1 rounded border border-black dark:border-brutal-border-dark hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteGame(game.id)}
                    className="p-1 rounded border border-black dark:border-brutal-border-dark hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                  <button
                    onClick={() => toggleExpand(game.id)}
                    className="p-1 rounded border border-black dark:border-brutal-border-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ml-1"
                  >
                    <Package className="w-4 h-4" />
                    <span className="text-xs font-bold ml-1">{gameProducts.length}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Products List */}
            {isExpanded && (
              <div className="divide-y divide-black/10 dark:divide-white/10">
                {gameProducts.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    Belum ada produk untuk game ini
                  </div>
                ) : (
                  gameProducts.map((product, productIndex) => (
                    <div
                      key={product.id}
                      className="p-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex flex-col gap-0.5">
                        <button
                          onClick={() => onReorderProduct(product.id, "up")}
                          disabled={productIndex === 0}
                          className="p-0.5 rounded border border-black/30 dark:border-white/30 hover:bg-brutal-yellow dark:hover:bg-brutal-purple disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ChevronUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => onReorderProduct(product.id, "down")}
                          disabled={productIndex === gameProducts.length - 1}
                          className="p-0.5 rounded border border-black/30 dark:border-white/30 hover:bg-brutal-yellow dark:hover:bg-brutal-purple disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ChevronDown className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-black dark:text-white">{product.name}</span>
                          {product.is_promo && <Badge variant="promo" className="text-[10px]">PROMO</Badge>}
                          {!product.is_active && <Badge variant="danger" className="text-[10px]">NONAKTIF</Badge>}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          <span className="font-bold text-black dark:text-white">{formatPrice(product.price)}</span>
                          {product.original_price && product.original_price > product.price && (
                            <span className="line-through">{formatPrice(product.original_price)}</span>
                          )}
                          <span>|</span>
                          <span>Nominal: {product.nominal}</span>
                          {product.bonus && <span className="text-green-600 dark:text-green-400">+{product.bonus}</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEditProduct(product)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => onDeleteProduct(product.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
