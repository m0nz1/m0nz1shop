import { createServerSupabase } from "@/lib/supabase-server";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Zap, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

async function getPromos() {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from("promos")
    .select("*, game:games(*)")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  return data || [];
}

export default async function PromoPage() {
  const promos = await getPromos();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Zap className="w-6 h-6 text-brutal-yellow dark:text-brutal-purple" />
        <h1 className="font-black text-2xl text-black dark:text-white">Promo & Diskon</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {promos.map((promo) => (
          <Card key={promo.id} className="overflow-hidden">
            <div className="relative aspect-[2/1]">
              <Image
                src={promo.image_url || "/images/promo-placeholder.jpg"}
                alt={promo.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute top-3 left-3">
                <Badge variant="promo" className="text-sm">
                  <Zap className="w-3 h-3 mr-1" />
                  {promo.discount_percent}% OFF
                </Badge>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg text-black dark:text-white">{promo.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{promo.description}</p>

              {promo.game && (
                <Link href={`/${promo.game.slug}`}>
                  <button className="mt-3 w-full py-2 bg-brutal-yellow dark:bg-brutal-purple text-black dark:text-white font-bold text-sm border-2 border-black dark:border-brutal-border-dark rounded-brutal shadow-brutal dark:shadow-brutal-dark hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-brutal-active active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all">
                    Top Up Sekarang
                  </button>
                </Link>
              )}

              {(promo.start_date || promo.end_date) && (
                <div className="flex items-center gap-1 mt-3 text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {promo.start_date && new Date(promo.start_date).toLocaleDateString("id-ID")}
                    {promo.start_date && promo.end_date && " - "}
                    {promo.end_date && new Date(promo.end_date).toLocaleDateString("id-ID")}
                  </span>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {promos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 font-bold">Tidak ada promo aktif saat ini</p>
        </div>
      )}
    </div>
  );
}
