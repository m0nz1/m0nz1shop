"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Transaction } from "@/types";
import { formatPrice, formatDate, getStatusLabel, getStatusColor } from "@/utils";
import { useRealtimeTransaction } from "@/hooks/useRealtime";
import { QRCodeSVG } from "qrcode.react";
import { Copy, RefreshCw, Clock, CheckCircle, XCircle, AlertCircle, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get("invoice");

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchTransaction = useCallback(async () => {
    if (!invoiceId) return;

    const supabase = createClient();
    const { data } = await supabase
      .from("transactions")
      .select("*, game:games(*), product:products(*)")
      .eq("invoice_id", invoiceId)
      .single();

    if (data) {
      setTransaction(data);
    }
    setLoading(false);
  }, [invoiceId]);

  useEffect(() => {
    fetchTransaction();
  }, [fetchTransaction]);

  // Realtime updates
  useRealtimeTransaction(invoiceId || "", (updated) => {
    setTransaction((prev) => (prev ? { ...prev, ...updated } : null));
    if (updated.status === "success") {
      toast.success("Pembayaran berhasil!");
    }
  });

  // Countdown timer
  useEffect(() => {
    if (!transaction?.expired_at) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expired = new Date(transaction.expired_at!).getTime();
      const diff = expired - now;

      if (diff <= 0) {
        setCountdown("Kadaluarsa");
        clearInterval(interval);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown(`${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [transaction?.expired_at]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTransaction();
    setRefreshing(false);
  };

  const copyInvoice = () => {
    if (transaction?.invoice_id) {
      navigator.clipboard.writeText(transaction.invoice_id);
      toast.success("Invoice ID disalin!");
    }
  };

  if (loading) {
    return (
      <div className="max-w-lg mx-auto space-y-4">
        <div className="h-8 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-brutal animate-pulse" />
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-black text-black dark:text-white">Transaksi tidak ditemukan</h2>
        <Link href="/history">
          <Button className="mt-4">Cek Riwayat</Button>
        </Link>
      </div>
    );
  }

  const isPending = transaction.status === "pending" || transaction.payment_status === "unpaid";
  const isSuccess = transaction.status === "success";
  const isFailed = transaction.status === "failed" || transaction.status === "expired";

  return (
    <div className="max-w-lg mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Link href="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Kembali
          </Button>
        </Link>
        <h1 className="font-black text-xl text-black dark:text-white">Status Pembayaran</h1>
      </div>

      {/* Status Card */}
      <Card className="p-4 text-center">
        <div className="mb-4">
          {isSuccess ? (
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          ) : isFailed ? (
            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
          ) : (
            <Clock className="w-16 h-16 text-brutal-yellow dark:text-brutal-purple mx-auto animate-pulse" />
          )}
        </div>

        <Badge variant={isSuccess ? "success" : isFailed ? "danger" : "warning"} className="text-sm">
          {getStatusLabel(transaction.status)}
        </Badge>

        <h2 className="text-2xl font-black text-black dark:text-white mt-3">
          {formatPrice(transaction.total)}
        </h2>

        {isPending && (
          <div className="mt-3 p-3 bg-brutal-yellow/10 dark:bg-brutal-purple/10 border-2 border-brutal-yellow dark:border-brutal-purple rounded-brutal">
            <p className="text-xs font-bold text-gray-600 dark:text-gray-400">Bayar sebelum</p>
            <p className="text-2xl font-black text-black dark:text-white font-mono">{countdown}</p>
          </div>
        )}
      </Card>

      {/* QR Code */}
      {isPending && (
        <Card className="p-4 text-center">
          <h3 className="font-bold text-black dark:text-white mb-3">Scan QRIS</h3>
          <div className="inline-block p-3 bg-white rounded-brutal border-2 border-black">
            <QRCodeSVG
              value={`https://gametop.id/pay/${transaction.invoice_id}`}
              size={200}
              level="M"
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            Scan kode QR menggunakan aplikasi e-wallet atau mobile banking
          </p>
        </Card>
      )}

      {/* Transaction Details */}
      <Card className="p-4">
        <h3 className="font-bold text-black dark:text-white mb-3">Detail Transaksi</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Invoice ID</span>
            <button onClick={copyInvoice} className="flex items-center gap-1 font-mono font-bold text-black dark:text-white hover:text-brutal-yellow">
              {transaction.invoice_id}
              <Copy className="w-3 h-3" />
            </button>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Game</span>
            <span className="font-bold text-black dark:text-white">{transaction.game?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">User ID</span>
            <span className="font-bold text-black dark:text-white">{transaction.user_id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Item</span>
            <span className="font-bold text-black dark:text-white">{transaction.product?.nominal}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Metode</span>
            <span className="font-bold text-black dark:text-white uppercase">{transaction.payment_method}</span>
          </div>
          <div className="border-t border-black/10 dark:border-white/10 pt-2 flex justify-between">
            <span className="font-bold text-black dark:text-white">Total</span>
            <span className="font-black text-black dark:text-white">{formatPrice(transaction.total)}</span>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={handleRefresh}
          isLoading={refreshing}
        >
          <RefreshCw className="w-4 h-4 mr-1" />
          Refresh Status
        </Button>
        <Link href="/history" className="flex-1">
          <Button variant="secondary" className="w-full">
            Lihat Riwayat
          </Button>
        </Link>
      </div>
    </div>
  );
}
