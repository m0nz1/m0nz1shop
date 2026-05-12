"use client";

import { formatPrice, formatDate, getStatusColor, getStatusLabel } from "@/utils";
import { Transaction } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { RefreshCw } from "lucide-react";

interface TransactionTableProps {
  transactions: Transaction[];
  onStatusChange: (id: string, status: string) => void;
  onRefresh: () => void;
}

export function TransactionTable({ transactions, onStatusChange, onRefresh }: TransactionTableProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-black text-lg text-black dark:text-white">Transaksi</h2>
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="w-4 h-4 mr-1" />
          Refresh
        </Button>
      </div>

      <div className="overflow-x-auto border-2 border-black dark:border-brutal-border-dark rounded-brutal shadow-brutal dark:shadow-brutal-dark">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800 border-b-2 border-black dark:border-brutal-border-dark">
            <tr>
              <th className="px-3 py-2 text-left font-bold text-black dark:text-white">Invoice</th>
              <th className="px-3 py-2 text-left font-bold text-black dark:text-white">Game</th>
              <th className="px-3 py-2 text-left font-bold text-black dark:text-white">User</th>
              <th className="px-3 py-2 text-left font-bold text-black dark:text-white">Total</th>
              <th className="px-3 py-2 text-left font-bold text-black dark:text-white">Status</th>
              <th className="px-3 py-2 text-left font-bold text-black dark:text-white">Waktu</th>
              <th className="px-3 py-2 text-left font-bold text-black dark:text-white">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10 dark:divide-white/10">
            {transactions.map((tx) => (
              <tr key={tx.id} className="bg-white dark:bg-brutal-dark-card hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-3 py-2 font-mono text-xs text-black dark:text-white">{tx.invoice_id}</td>
                <td className="px-3 py-2 text-black dark:text-white">{tx.game?.name || "-"}</td>
                <td className="px-3 py-2 text-black dark:text-white">{tx.user_id || "-"}</td>
                <td className="px-3 py-2 font-bold text-black dark:text-white">{formatPrice(tx.total)}</td>
                <td className="px-3 py-2">
                  <Badge variant={tx.status === "success" ? "success" : tx.status === "pending" ? "warning" : "danger"}>
                    {getStatusLabel(tx.status)}
                  </Badge>
                </td>
                <td className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400">{formatDate(tx.created_at)}</td>
                <td className="px-3 py-2">
                  <select
                    value={tx.status}
                    onChange={(e) => onStatusChange(tx.id, e.target.value)}
                    className="text-xs font-bold bg-white dark:bg-brutal-dark-card border-2 border-black dark:border-brutal-border-dark rounded-brutal px-2 py-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="success">Sukses</option>
                    <option value="failed">Gagal</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
