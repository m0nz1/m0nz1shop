"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/admin/StatCard";
import { TransactionTable } from "@/components/admin/TransactionTable";
import { ProductForm } from "@/components/admin/ProductForm";
import { Transaction, Game, Product } from "@/types";
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
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { isDark, toggle } = useDarkMode();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
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

    const [{ data: txData }, { data: gamesData }, { data: productsData }] = await Promise.all([
      supabase.from("transactions").select("*, game:games(*), product:products(*)").order("created_at", { ascending: false }),
      supabase.from("games").select("*").order("sort_order"),
      supabase.from("products").select("*, game:games(*)").order("sort_order"),
    ]);

    const txs = txData || [];
    setTransactions(txs);
    setGames(gamesData || []);
    setProducts(productsData || []);

    // Calculate stats
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

  const handleStatusChange = async (id: string, status: string) => {
    const supabase = createClient();
    const { error } = await supabase.from("transactions").update({ status }).eq("id", id);

    if (error) {
      toast.error("Gagal update status");
    } else {
      toast.success("Status diupdate!");
      fetchData();
    }
  };

  const handleProductSubmit = async (formData: any) => {
    const supabase = createClient();

    if (editingProduct) {
      const { error } = await supabase.from("products").update(formData).eq("id", editingProduct.id);
      if (error) toast.error("Gagal update produk");
      else toast.success("Produk diupdate!");
    } else {
      const { error } = await supabase.from("products").insert(formData);
      if (error) toast.error("Gagal tambah produk");
      else toast.success("Produk ditambahkan!");
    }

    setShowProductForm(false);
    setEditingProduct(null);
    fetchData();
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Yakin hapus produk ini?")) return;

    const supabase = createClient();
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) toast.error("Gagal hapus produk");
    else {
      toast.success("Produk dihapus!");
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
          <StatCard
            title="Total Transaksi"
            value={stats.totalTransactions}
            icon={ShoppingCart}
            color="yellow"
          />
          <StatCard
            title="Pendapatan"
            value={formatPrice(stats.totalRevenue)}
            icon={DollarSign}
            color="green"
          />
          <StatCard
            title="Total User"
            value={stats.totalUsers}
            icon={Users}
            color="purple"
          />
          <StatCard
            title="Total Produk"
            value={stats.totalProducts}
            icon={Package}
            color="yellow"
          />
        </div>

        {/* Transactions */}
        <div className="bg-brutal-light-card dark:bg-brutal-dark-card border-2 border-black dark:border-brutal-border-dark rounded-brutal shadow-brutal dark:shadow-brutal-dark p-4">
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-4 h-4 text-gray-500" />
            <Input
              placeholder="Cari transaksi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
          </div>
          <TransactionTable
            transactions={filteredTransactions}
            onStatusChange={handleStatusChange}
            onRefresh={fetchData}
          />
        </div>

        {/* Products */}
        <div className="bg-brutal-light-card dark:bg-brutal-dark-card border-2 border-black dark:border-brutal-border-dark rounded-brutal shadow-brutal dark:shadow-brutal-dark p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-lg text-black dark:text-white flex items-center gap-2">
              <Package className="w-5 h-5" />
              Produk
            </h2>
            <Button size="sm" onClick={() => { setEditingProduct(null); setShowProductForm(true); }}>
              <Plus className="w-4 h-4 mr-1" />
              Tambah
            </Button>
          </div>

          {showProductForm && (
            <div className="mb-4 p-4 border-2 border-black dark:border-brutal-border-dark rounded-brutal bg-gray-50 dark:bg-gray-900">
              <ProductForm
                games={games}
                product={editingProduct}
                onSubmit={handleProductSubmit}
                onCancel={() => { setShowProductForm(false); setEditingProduct(null); }}
              />
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 dark:bg-gray-800 border-b-2 border-black dark:border-brutal-border-dark">
                <tr>
                  <th className="px-3 py-2 text-left font-bold text-black dark:text-white">Nama</th>
                  <th className="px-3 py-2 text-left font-bold text-black dark:text-white">Game</th>
                  <th className="px-3 py-2 text-left font-bold text-black dark:text-white">Harga</th>
                  <th className="px-3 py-2 text-left font-bold text-black dark:text-white">Status</th>
                  <th className="px-3 py-2 text-left font-bold text-black dark:text-white">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10 dark:divide-white/10">
                {products.map((product) => (
                  <tr key={product.id} className="bg-white dark:bg-brutal-dark-card">
                    <td className="px-3 py-2 font-bold text-black dark:text-white">{product.name}</td>
                    <td className="px-3 py-2 text-black dark:text-white">{product.game?.name}</td>
                    <td className="px-3 py-2 font-bold text-black dark:text-white">{formatPrice(product.price)}</td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${product.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {product.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => { setEditingProduct(product); setShowProductForm(true); }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          Hapus
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Games */}
        <div className="bg-brutal-light-card dark:bg-brutal-dark-card border-2 border-black dark:border-brutal-border-dark rounded-brutal shadow-brutal dark:shadow-brutal-dark p-4">
          <h2 className="font-black text-lg text-black dark:text-white flex items-center gap-2 mb-4">
            <Gamepad2 className="w-5 h-5" />
            Games
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {games.map((game) => (
              <Card key={game.id} className="p-3">
                <p className="font-bold text-sm text-black dark:text-white">{game.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{game.category}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {game.requires_server_id ? "Butuh Server ID" : "Tanpa Server ID"}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
