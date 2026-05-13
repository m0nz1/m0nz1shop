"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Transaction } from "@/types";
import { formatPrice, formatDate, getStatusLabel } from "@/utils";
import { TransactionSkeleton } from "@/components/skeletons";
import { Search, Copy, ArrowRight, History, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const searchTransactions = async () => {
    if (!searchQuery.trim()) {
      toast.error("Masukkan Invoice ID atau User ID");
      return;
    }

    setLoading(true);
    setSearched(true);
    setTransactions([]);

    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("transactions")
        .select("*, game:games(*), product:products(*)")
        .or(`invoice_id.ilike.%${searchQuery.trim()}%,user_id.ilike.%${searchQuery.trim()}%`)
        .order("created_at", { ascending: false });

      setTransactions(data || []);
    } catch {
      toast.error("Gagal mencari transaksi");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const copyInvoice = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Invoice ID disalin!");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <History className="w-6 h-6 text-brutal-yellow dark:text-brutal-purple" />
        <h1 className="font-black text-2xl text-black dark:text-white">Riwayat Pembelian</h1>
      </div>

      {/* Search */}
      <div className="bg-brutal-light-card dark:bg-brutal-dark-card border-2 border-black dark:border-brutal-border-dark rounded-brutal shadow-brutal dark:shadow-brutal-dark p-4">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          Cek riwayat pembelianmu dengan Invoice ID atau User ID
        </p>
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="Contoh: INV-20260101-123456"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchTransactions()}
            />
          </div>
          <Button onClick={searchTransactions} isLoading={loading}>
            <Search className="w-4 h-4 mr-1" />
            Cari
          </Button>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <TransactionSkeleton key={i} />
          ))}
        </div>
      ) : searched && transactions.length === 0 ? (
        <div className="text-center py-12 bg-brutal-light-card dark:bg-brutal-dark-card border-2 border-black dark:border-brutal-border-dark rounded-brutal shadow-brutal dark:shadow-brutal-dark">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="font-bold text-black dark:text-white">Transaksi tidak ditemukan</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Pastikan Invoice ID atau User ID benar
          </p>
        </div>
      ) : searched ? (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <Card key={tx.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <button
                    onClick={() => copyInvoice(tx.invoice_id)}
                    className="flex items-center gap-1 font-mono text-sm font-bold text-black dark:text-white hover:text-brutal-yellow transition-colors"
                  >
                    {tx.invoice_id}
                    <Copy className="w-3 h-3" />
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {formatDate(tx.created_at)}
                  </p>
                </div>
                <Badge
                  variant={tx.status === "success" ? "success" : tx.status === "pending" ? "warning" : "danger"}
                >
                  {getStatusLabel(tx.status)}
                </Badge>
              </div>

              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Game</span>
                  <span className="font-bold text-black dark:text-white">{tx.game?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Username</span>
                  <span className="font-bold text-black dark:text-white">{tx.username || tx.user_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Item</span>
                  <span className="font-bold text-black dark:text-white">{tx.product?.nominal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Metode</span>
                  <span className="font-bold text-black dark:text-white uppercase">{tx.payment_method}</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
                <span className="font-black text-lg text-black dark:text-white">
                  {formatPrice(tx.total)}
                </span>
                <Link href={`/payment?invoice=${tx.invoice_id}`}>
                  <Button variant="outline" size="sm">
                    Detail
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}
