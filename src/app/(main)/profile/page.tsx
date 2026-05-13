"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { User, Shield, HelpCircle, FileText, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const menuItems = [
    { icon: FileText, label: "Riwayat Transaksi", href: "/history", desc: "Lihat semua pembelian" },
    { icon: Shield, label: "Keamanan", href: "#", desc: "Pengaturan keamanan akun" },
    { icon: HelpCircle, label: "Bantuan", href: "#", desc: "FAQ dan panduan" },
  ];

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <User className="w-6 h-6 text-brutal-yellow dark:text-brutal-purple" />
        <h1 className="font-black text-2xl text-black dark:text-white">Profil</h1>
      </div>

      {/* User Card */}
      <Card className="p-6 text-center">
        <div className="w-20 h-20 bg-brutal-yellow dark:bg-brutal-purple rounded-brutal border-2 border-black mx-auto flex items-center justify-center">
          <User className="w-10 h-10 text-black dark:text-white" />
        </div>
        <h2 className="font-black text-xl text-black dark:text-white mt-4">Guest User</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Login untuk menyimpan riwayat transaksi
        </p>
      </Card>

      {/* Menu */}
      <div className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.label} href={item.href}>
              <Card className="p-4 flex items-center gap-3 hover:translate-x-[2px] hover:translate-y-[2px]">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-brutal border-2 border-black dark:border-brutal-border-dark flex items-center justify-center">
                  <Icon className="w-5 h-5 text-black dark:text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-black dark:text-white">{item.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Card>
            </Link>
          );
        })}
      </div>
  );
}
