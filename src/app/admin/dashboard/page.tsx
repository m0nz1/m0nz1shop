"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { StatCard } from "@/components/admin/StatCard";
import { TransactionTable } from "@/components/admin/TransactionTable";
import { ProductForm } from "@/components/admin/ProductForm";
import { GameForm } from "@/components/admin/GameForm";
import { PaymentMethodForm } from "@/components/admin/PaymentMethodForm";
import { GameProductList } from "@/components/admin/GameProductList";
import { Transaction, Game, Product, PaymentMethod } from "@/types";
import { formatPrice } from "@/utils";
import { useDarkMode } from "@/hooks/useDarkMode";
import toast from "react-hot-toast";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  LogOut,
  Plus,
  Search,
  Moon,
  Sun,
  Gamepad2,
  CreditCard,
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { isDark, toggle } = useDarkMode();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [showProductForm, setShowProductForm] = useState(false);
  const [showGameForm, setShowGameForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [editingPayment, setEditingPayment] = useState<PaymentMethod | null>(null);

  // Tab state
  const [activeTab, setActiveTab] = useState<"transactions" | "products" | "payments">("products");

  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0,
  });

  useEffect(() => {
    checkAdmin();
    fetchData();
  }, []);

  const checkAdmin = async () => {
    const res = await fetch("/api/admin/check");
    const data = await res.json();
    if (!data.isAdmin) {
      router.push("/admin/login");
    }
  };

  const fetchData = async () => {
    const supabase = createClient();

    const [
      { data: txData },
      { data: gamesData },
      { data: productsData },
      { data: pmData },
    ] = await Promise.all([
      supabase.from("transactions").select("*, game:games(*), product:products(*)").order("created_at", { ascending: false }),
      supabase.from("games").select("*").order("sort_order"),
      supabase.from("products").select("*, game:games(*)").order("sort_order"),
      supabase.from("payment_methods").select("*").order("sort_order"),
    ]);

    const txs = txData || [];
    setTransactions(txs);
    setGames(gamesData || []);
    setProducts(productsData || []);
    setPaymentMethods(pmData || []);

    const revenue = txs.filter((t) => t.status === "success").reduce((sum, t) => sum + t.total, 0);
    const uniqueUsers = new Set(txs.map((t) => t.user_id).filter(Boolean));

    setStats({
      totalTransactions: txs.length,
      totalRevenue: revenue,
      totalUsers: uniqueUsers.size,
      totalProducts: (productsData || []).length,
    });

    setLoading(false);
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    toast.success("Logout berhasil");
    router.push("/admin/login");
  };

  // ========== TRANSACTION STATUS UPDATE ==========
  const handleStatusChange = async (id: string, status: string) => {
    const res = await fetch("/api/admin/transactions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });

    const data = await res.json();
    if (!data.success) {
      toast.error(data.error || "Gagal update status");
    } else {
      toast.success("Status diupdate!");
      fetchData();
    }
  };

  // ========== PRODUCT CRUD (via API) ==========
  const handleProductSubmit = async (formData: any) => {
    const url = editingProduct ? "/api/admin/products" : "/api/admin/products";
    const method = editingProduct ? "PATCH" : "POST";
    const body = editingProduct ? { id: editingProduct.id, ...formData } : formData;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!data.success) {
      toast.error(data.error || "Gagal simpan produk");
    } else {
      toast.success(editingProduct ? "Produk diupdate!" : "Produk ditambahkan!");
    }

    setShowProductForm(false);
    setEditingProduct(null);
    fetchData();
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Yakin hapus produk ini?")) return;

    const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    const data = await res.json();

    if (!data.success) {
      toast.error(data.error || "Gagal hapus produk");
    } else {
      toast.success("Produk dihapus!");
      fetchData();
    }
  };

  // ========== GAME CRUD (via API) ==========
  const handleGameSubmit = async (formData: any) => {
    const method = editingGame ? "PATCH" : "POST";
    const body = editingGame ? { id: editingGame.id, ...formData } : formData;

    const res = await fetch("/api/admin/games", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!data.success) {
      toast.error(data.error || "Gagal simpan game");
    } else {
      toast.success(editingGame ? "Game diupdate!" : "Game ditambahkan!");
    }

    setShowGameForm(false);
    setEditingGame(null);
    fetchData();
  };

  const handleDeleteGame = async (id: string) => {
    if (!confirm("Yakin hapus game ini? Semua produk terkait akan ikut terhapus!")) return;

    const res = await fetch(`/api/admin/games?id=${id}`, { method: "DELETE" });
    const data = await res.json();

    if (!data.success) {
      toast.error(data.error || "Gagal hapus game");
    } else {
      toast.success("Game dihapus!");
      fetchData();
    }
  };

  // ========== REORDER (via API) ==========
  const handleReorderGame = async (gameId: string, direction: "up" | "down") => {
    const sortedGames = [...games].sort((a, b) => a.sort_order - b.sort_order);
    const currentIndex = sortedGames.findIndex((g) => g.id === gameId);
    const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (swapIndex < 0 || swapIndex >= sortedGames.length) return;

    const currentGame = sortedGames[currentIndex];
    const swapGame = sortedGames[swapIndex];

    const items = [
      { id: currentGame.id, sort_order: swapGame.sort_order },
      { id: swapGame.id, sort_order: currentGame.sort_order },
    ];

    const res = await fetch("/api/admin/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table: "games", items }),
    });

    const data = await res.json();
    if (!data.success) {
      toast.error(data.error || "Gagal reorder");
    } else {
      toast.success("Urutan diupdate!");
      fetchData();
    }
  };

  const handleReorderProduct = async (productId: string, direction: "up" | "down") => {
    const currentProduct = products.find((p) => p.id === productId);
    if (!currentProduct) return;

    const gameProducts = products
      .filter((p) => p.game_id === currentProduct.game_id)
      .sort((a, b) => a.sort_order - b.sort_order);

    const currentIndex = gameProducts.findIndex((p) => p.id === productId);
    const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (swapIndex < 0 || swapIndex >= gameProducts.length) return;

    const swapProduct = gameProducts[swapIndex];

    const items = [
      { id: currentProduct.id, sort_order: swapProduct.sort_order },
      { id: swapProduct.id, sort_order: currentProduct.sort_order },
    ];

    const res = await fetch("/api/admin/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table: "products", items }),
    });

    const data = await res.json();
    if (!data.success) {
      toast.error(data.error || "Gagal reorder");
    } else {
      toast.success("Urutan produk diupdate!");
      fetchData();
    }
  };

  // ========== PAYMENT METHOD CRUD (via API) ==========
  const handlePaymentSubmit = async (formData: any) => {
    const method = editingPayment ? "PATCH" : "POST";
    const body = editingPayment ? { id: editingPayment.id, ...formData } : formData;

    const res = await fetch("/api/admin/payment-methods", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!data.success) {
      toast.error(data.error || "Gagal simpan metode pembayaran");
    } else {
      toast.success(editingPayment ? "Metode pembayaran diupdate!" : "Metode pembayaran ditambahkan!");
    }

    setShowPaymentForm(false);
    setEditingPayment(null);
    fetchData();
  };

  const handleDeletePayment = async (id: string) => {
    if (!confirm("Yakin hapus metode pembayaran ini?")) return;

    const res = await fetch(`/api/admin/payment-methods?id=${id}`, { method: "DELETE" });
    const data = await res.json();

    if (!data.success) {
      toast.error(data.error || "Gagal hapus metode pembayaran");
    } else {
      toast.success("Metode pembayaran dihapus!");
      fetchData();
    }
  };

  const filteredTransactions = searchQuery
    ? transactions.filter(
        (t) =>
          t.invoice_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.user_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.game?.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : transactions;

  if (loading) {
    return (
      <div className="min-h-screen bg-brutal-light-bg dark:bg-brutal-dark-bg p-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-8 w-1/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-brutal animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brutal-light-bg dark:bg-brutal-dark-bg">
      {/* Header */}
      <header className="bg-brutal-light-card dark:bg-brutal-dark-card border-b-2 border-black dark:border-brutal-border-dark p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brutal-yellow dark:bg-brutal-purple rounded-brutal border-2 border-black flex items-center justify-center">
              <span className="font-black text-sm">A</span>
            </div>
            <span className="font-black text-xl text-black dark:text-white">Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="p-2 rounded-brutal border-2 border-black dark:border-brutal-border-dark bg-white dark:bg-brutal-dark-card shadow-brutal dark:shadow-brutal-dark"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Button variant="danger" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total Transaksi" value={stats.totalTransactions} icon={ShoppingCart} color="yellow" />
          <StatCard title="Pendapatan" value={formatPrice(stats.totalRevenue)} icon={DollarSign} color="green" />
          <StatCard title="Total User" value={stats.totalUsers} icon={Users} color="purple" />
          <StatCard title="Total Produk" value={stats.totalProducts} icon={Package} color="yellow" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b-2 border-black dark:border-brutal-border-dark pb-2">
          {[
            { key: "products" as const, label: "Game & Produk", icon: Gamepad2 },
            { key: "transactions" as const, label: "Transaksi", icon: ShoppingCart },
            { key: "payments" as const, label: "Pembayaran", icon: CreditCard },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 font-bold text-sm rounded-brutal border-2 transition-all ${
                  isActive
                    ? "bg-brutal-yellow dark:bg-brutal-purple text-black dark:text-white border-black dark:border-brutal-border-dark shadow-brutal dark:shadow-brutal-dark"
                    : "bg-white dark:bg-brutal-dark-card text-gray-600 dark:text-gray-400 border-black dark:border-brutal-border-dark hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ===== PRODUCTS TAB ===== */}
        {activeTab === "products" && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => { setEditingProduct(null); setShowProductForm(true); }}>
                <Plus className="w-4 h-4 mr-1" /> Tambah Produk
              </Button>
              <Button size="sm" variant="secondary" onClick={() => { setEditingGame(null); setShowGameForm(true); }}>
                <Plus className="w-4 h-4 mr-1" /> Tambah Game
              </Button>
            </div>

            {showProductForm && (
              <div className="p-4 border-2 border-black dark:border-brutal-border-dark rounded-brutal bg-gray-50 dark:bg-gray-900">
                <h3 className="font-bold text-black dark:text-white mb-3">{editingProduct ? "Edit Produk" : "Tambah Produk"}</h3>
                <ProductForm games={games} product={editingProduct} onSubmit={handleProductSubmit} onCancel={() => { setShowProductForm(false); setEditingProduct(null); }} />
              </div>
            )}

            {showGameForm && (
              <div className="p-4 border-2 border-black dark:border-brutal-border-dark rounded-brutal bg-gray-50 dark:bg-gray-900">
                <h3 className="font-bold text-black dark:text-white mb-3">{editingGame ? "Edit Game" : "Tambah Game"}</h3>
                <GameForm game={editingGame} onSubmit={handleGameSubmit} onCancel={() => { setShowGameForm(false); setEditingGame(null); }} />
              </div>
            )}

            <GameProductList
              games={games}
              products={products}
              onEditProduct={(p) => { setEditingProduct(p); setShowProductForm(true); }}
              onDeleteProduct={handleDeleteProduct}
              onEditGame={(g) => { setEditingGame(g); setShowGameForm(true); }}
              onDeleteGame={handleDeleteGame}
              onReorderGame={handleReorderGame}
              onReorderProduct={handleReorderProduct}
            />
          </div>
        )}

        {/* ===== TRANSACTIONS TAB ===== */}
        {activeTab === "transactions" && (
          <div className="bg-brutal-light-card dark:bg-brutal-dark-card border-2 border-black dark:border-brutal-border-dark rounded-brutal shadow-brutal dark:shadow-brutal-dark p-4">
            <div className="flex items-center gap-2 mb-4">
              <Search className="w-4 h-4 text-gray-500" />
              <Input placeholder="Cari transaksi..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1" />
            </div>
            <TransactionTable transactions={filteredTransactions} onStatusChange={handleStatusChange} onRefresh={fetchData} />
          </div>
        )}

        {/* ===== PAYMENTS TAB ===== */}
        {activeTab === "payments" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-lg text-black dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5" /> Metode Pembayaran
              </h2>
              <Button size="sm" onClick={() => { setEditingPayment(null); setShowPaymentForm(true); }}>
                <Plus className="w-4 h-4 mr-1" /> Tambah
              </Button>
            </div>

            {showPaymentForm && (
              <div className="p-4 border-2 border-black dark:border-brutal-border-dark rounded-brutal bg-gray-50 dark:bg-gray-900">
                <h3 className="font-bold text-black dark:text-white mb-3">{editingPayment ? "Edit Metode Pembayaran" : "Tambah Metode Pembayaran"}</h3>
                <PaymentMethodForm method={editingPayment} onSubmit={handlePaymentSubmit} onCancel={() => { setShowPaymentForm(false); setEditingPayment(null); }} />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {paymentMethods.map((pm) => (
                <div key={pm.id} className="bg-white dark:bg-brutal-dark-card border-2 border-black dark:border-brutal-border-dark rounded-brutal shadow-brutal dark:shadow-brutal-dark p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-brutal border border-black/20 flex items-center justify-center overflow-hidden">
                      {pm.logo_url ? (
                        <img src={pm.logo_url} alt={pm.name} className="w-10 h-10 object-contain" />
                      ) : (
                        <span className="text-xs font-bold">{pm.code.toUpperCase().slice(0, 3)}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-black dark:text-white">{pm.name}</span>
                        {!pm.is_active && <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded">NONAKTIF</span>}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{pm.type} | Fee: {formatPrice(pm.fee)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => { setEditingPayment(pm); setShowPaymentForm(true); }}>Edit</Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeletePayment(pm.id)}>Hapus</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
