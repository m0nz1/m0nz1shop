"use client";

import { GameCard } from "./GameCard";
import { GameCardSkeleton } from "@/components/skeletons";
import { Game } from "@/types";

interface GameListProps {
  games: Game[];
  loading?: boolean;
  title?: React.ReactNode;
  emptyText?: string;
}

export function GameList({ games, loading, title, emptyText = "Tidak ada game" }: GameListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {title && (
          <h2 className="text-lg md:text-xl font-black text-black dark:text-white">
            {title}
          </h2>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <GameCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 font-bold">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {title && (
        <h2 className="text-lg md:text-xl font-black text-black dark:text-white">
          {title}
        </h2>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}
