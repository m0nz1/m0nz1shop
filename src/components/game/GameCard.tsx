"use client";

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Game } from "@/types";

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  return (
    <Link href={`/${game.slug}`}>
      <Card className="overflow-hidden group">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={game.image_url || "/images/placeholder.jpg"}
            alt={game.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          {game.category === "new" && (
            <div className="absolute top-2 left-2">
              <Badge variant="promo">NEW</Badge>
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-bold text-sm md:text-base text-black dark:text-white line-clamp-1">
            {game.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
            {game.description || "Top up cepat & aman"}
          </p>
        </div>
      </Card>
    </Link>
  );
}
