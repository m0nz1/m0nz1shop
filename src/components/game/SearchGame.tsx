"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Game } from "@/types";
import { GameCard } from "./GameCard";

interface SearchGameProps {
  games: Game[];
}

export function SearchGame({ games }: SearchGameProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filtered = query.length > 0
    ? games.filter((g) =>
        g.name.toLowerCase().includes(query.toLowerCase()) ||
        g.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <Input
          placeholder="Cari game..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(e.target.value.length > 0);
          }}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          className="pl-10 pr-10"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>

      {isOpen && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-brutal-light-card dark:bg-brutal-dark-card border-2 border-black dark:border-brutal-border-dark rounded-brutal shadow-brutal-lg dark:shadow-brutal-dark z-50 max-h-[400px] overflow-y-auto p-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filtered.slice(0, 6).map((game) => (
              <div key={game.id} onClick={() => setIsOpen(false)}>
                <GameCard game={game} />
              </div>
            ))}
          </div>
        </div>
      )}

      {isOpen && query.length > 0 && filtered.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-brutal-light-card dark:bg-brutal-dark-card border-2 border-black dark:border-brutal-border-dark rounded-brutal shadow-brutal-lg p-4 text-center z-50">
          <p className="text-sm font-bold text-gray-500">Game tidak ditemukan</p>
        </div>
      )}
    </div>
  );
}
