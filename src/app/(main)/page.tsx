import { Suspense } from "react";
import { createServerSupabase } from "@/lib/supabase-server";
import { GameList } from "@/components/game/GameList";
import { SearchGame } from "@/components/game/SearchGame";
import { BannerSkeleton, GameCardSkeleton } from "@/components/skeletons";
import { Badge } from "@/components/ui/Badge";
import { Zap, TrendingUp, Star, Gamepad2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

async function getGames() {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from("games")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  return data || [];
}

async function getPromos() {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from("promos")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  return data || [];
}

async function BannerCarousel() {
  const promos = await getPromos();

  return (
    <div className="relative overflow-hidden rounded-brutal border-2 border-black dark:border-brutal-border-dark shadow-brutal-lg dark:shadow-brutal-dark">
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-0 scrollbar-hide">
        {promos.map((promo) => (
          <div key={promo.id} className="snap-start flex-shrink-0 w-full">
            <div className="relative aspect-[21/9] md:aspect-[3/1]">
              <Image
                src={promo.image_url || "/images/banner-placeholder.jpg"}
                alt={promo.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                <Badge variant="promo" className="mb-2">
                  <Zap className="w-3 h-3 mr-1" />
                  {promo.discount_percent}% OFF
                </Badge>
                <h2 className="text-lg md:text-2xl font-black text-white">{promo.title}</h2>
                <p className="text-sm text-gray-300 mt-1">{promo.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function HomePage() {
  const games = await getGames();

  const popularGames = games.filter((g) => g.category === "popular");
  const trendingGames = games.filter((g) => g.category === "trending");
  const newGames = games.filter((g) => g.category === "new");

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section>
        <Suspense fallback={<BannerSkeleton />}>
          <BannerCarousel />
        </Suspense>
      </section>

      {/* Search */}
      <section>
        <SearchGame games={games} />
      </section>

      {/* Categories */}
      <section className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {["Semua", "Popular", "Trending", "New", "RPG", "FPS", "MOBA"].map((cat) => (
          <button
            key={cat}
            className="flex-shrink-0 px-4 py-2 bg-white dark:bg-brutal-dark-card border-2 border-black dark:border-brutal-border-dark rounded-brutal shadow-brutal dark:shadow-brutal-dark font-bold text-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-brutal-active active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
          >
            {cat}
          </button>
        ))}
      </section>

      {/* Recommended */}
      <section>
        <GameList
          games={popularGames.slice(0, 4)}
          title={
            <span className="flex items-center gap-2">
              <Star className="w-5 h-5 text-brutal-yellow" />
              Recommended
            </span>
          }
        />
      </section>

      {/* Promo Games */}
      <section>
        <GameList
          games={trendingGames}
          title={
            <span className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-red-500" />
              Trending Now
            </span>
          }
        />
      </section>

      {/* All Games */}
      <section>
        <GameList
          games={games}
          title={
            <span className="flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-brutal-purple dark:text-brutal-purple" />
              Semua Game
            </span>
          }
        />
      </section>

      {/* New Games */}
      {newGames.length > 0 && (
        <section>
          <GameList
            games={newGames}
            title={
              <span className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-green-500" />
                Game Baru
              </span>
            }
          />
        </section>
      )}

      {/* Footer */}
      <footer className="border-t-2 border-black dark:border-brutal-border-dark pt-6 pb-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-black text-lg mb-2">GameTop</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Platform top up game terpercaya dengan harga termurah dan proses cepat.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-sm mb-2">Metode Pembayaran</h3>
            <div className="flex flex-wrap gap-2">
              {["QRIS", "DANA", "OVO", "GoPay", "BCA", "BNI"].map((m) => (
                <span key={m} className="px-2 py-1 bg-white dark:bg-brutal-dark-card border border-black dark:border-brutal-border-dark rounded text-xs font-bold">
                  {m}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-sm mb-2">Kontak</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Email: support@gametop.id<br />
              WhatsApp: 0812-3456-7890
            </p>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-black/10 dark:border-white/10 text-center text-xs text-gray-500 dark:text-gray-400">
          © 2024 GameTop. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
