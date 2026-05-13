"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ProductSelector } from "@/components/payment/ProductSelector";
import { PaymentMethodSelector } from "@/components/payment/PaymentMethodSelector";
import { OrderSummary } from "@/components/payment/OrderSummary";
import { Badge } from "@/components/ui/Badge";
import { Game, Product, PaymentMethod } from "@/types";
import { ProductSkeleton } from "@/components/skeletons";
import { Search, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function GameDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.gameSlug as string;

  const [game, setGame] = useState<Game | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [userId, setUserId] = useState("");
  const [serverId, setServerId] = useState("");
  const [username, setUsername] = useState("");
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    fetchGameData();
  }, [slug]);

  const fetchGameData = async () => {
    const supabase = createClient();

    const { data: gameData } = await supabase
      .from("games")
      .select("*")
      .eq("slug", slug)
      .single();

    if (gameData) {
      setGame(gameData);

      const { data: productsData } = await supabase
        .from("products")
        .select("*")
        .eq("game_id", gameData.id)
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      setProducts(productsData || []);
    }

    const { data: methodsData } = await supabase
      .from("payment_methods")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    setPaymentMethods(methodsData || []);
    setLoading(false);
  };

  const checkUsername = async () => {
    if (!userId.trim()) {
      toast.error("Masukkan User ID terlebih dahulu");
      return;
    }

    setCheckingUsername(true);
    setUsername("");

    try {
      const res = await fetch("/api/check-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId: userId.trim(), 
          gameSlug: slug,
          serverId: serverId.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (data.success && data.username) {
        setUsername(data.username);
        toast.success(`Username ditemukan: ${data.username}`);
      } else {
        // Tampilkan error detail dari API
        toast.error(data.error || "Username tidak ditemukan");
      }
    } catch {
      toast.error("Gagal cek username. Coba lagi.");
    } finally {
      setCheckingUsername(false);
    }
  };

  const handleCheckout = async () => {
    if (!selectedProduct || !selectedPayment || !userId.trim()) {
      toast.error("Lengkapi semua data terlebih dahulu");
      return;
    }

    if (game?.requires_server_id && !serverId.trim()) {
      toast.error("Server ID wajib diisi");
      return;
    }

    setCheckoutLoading(true);

    try {
      const res = await fetch("/api/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          game_id: game?.id,
          product_id: selectedProduct.id,
          user_id: userId.trim(),
          server_id: serverId.trim() || null,
          username: username || null,
          payment_method: selectedPayment.code,
          price: selectedProduct.price,
          fee: selectedPayment.fee,
          total: selectedProduct.price + selectedPayment.fee,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Invoice berhasil dibuat!");
        router.push(`/payment?invoice=${data.invoice_id}`);
      } else {
        toast.error(data.error || "Gagal membuat invoice");
      }
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-brutal-light-card dark:bg-brutal-dark-card border-2 border-black dark:border-brutal-border-dark rounded-brutal shadow-brutal dark:shadow-brutal-dark p-4">
          <div className="h-8 w-1/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" />
          <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-black text-black dark:text-white">Game tidak ditemukan</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Silakan kembali ke beranda</p>
        <Link href="/">
          <Button className="mt-4">Kembali</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Game Header */}
      <div className="bg-brutal-light-card dark:bg-brutal-dark-card border-2 border-black dark:border-brutal-border-dark rounded-brutal shadow-brutal dark:shadow-brutal-dark overflow-hidden">
        <div className="relative aspect-[3/1] md:aspect-[4/1]">
          <Image
            src={game.image_url || "/images/placeholder.jpg"}
            alt={game.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
            <Badge variant="promo" className="mb-2">{game.category.toUpperCase()}</Badge>
            <h1 className="text-2xl md:text-3xl font-black text-white">{game.name}</h1>
            <p className="text-sm text-gray-300 mt-1">{game.description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* User ID Input */}
          <div className="bg-brutal-light-card dark:bg-brutal-dark-card border-2 border-black dark:border-brutal-border-dark rounded-brutal shadow-brutal dark:shadow-brutal-dark p-4 space-y-4">
            <h2 className="font-black text-lg text-black dark:text-white">Data Akun</h2>

            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    label="User ID"
                    placeholder="Masukkan User ID"
                    value={userId}
                    onChange={(e) => {
                      setUserId(e.target.value);
                      setUsername("");
                    }}
                  />
                </div>
                <div className="pt-7">
                  <Button
                    onClick={checkUsername}
                    isLoading={checkingUsername}
                    size="sm"
                    className="h-[42px]"
                  >
                    <Search className="w-4 h-4 mr-1" />
                    Cek
                  </Button>
                </div>
              </div>

              {game.requires_server_id && (
                <Input
                  label="Server ID"
                  placeholder={game.server_id_hint || "Masukkan Server ID"}
                  value={serverId}
                  onChange={(e) => setServerId(e.target.value)}
                />
              )}

              {username && (
                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-brutal">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-green-600 dark:text-green-400 font-bold">Username Terverifikasi</p>
                    <p className="text-sm font-bold text-black dark:text-white">{username}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Selection */}
          <div className="bg-brutal-light-card dark:bg-brutal-dark-card border-2 border-black dark:border-brutal-border-dark rounded-brutal shadow-brutal dark:shadow-brutal-dark p-4">
            <ProductSelector
              products={products}
              selected={selectedProduct}
              onSelect={setSelectedProduct}
            />
          </div>

          {/* Payment Method */}
          <div className="bg-brutal-light-card dark:bg-brutal-dark-card border-2 border-black dark:border-brutal-border-dark rounded-brutal shadow-brutal dark:shadow-brutal-dark p-4">
            <PaymentMethodSelector
              methods={paymentMethods}
              selected={selectedPayment}
              onSelect={setSelectedPayment}
            />
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <OrderSummary
              game={game}
              product={selectedProduct}
              paymentMethod={selectedPayment}
              userId={userId}
              serverId={serverId}
              username={username}
              onCheckout={handleCheckout}
              loading={checkoutLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
