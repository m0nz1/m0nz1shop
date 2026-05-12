"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PaymentMethod } from "@/types";
import Image from "next/image";

interface PaymentMethodFormProps {
  method?: PaymentMethod | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function PaymentMethodForm({ method, onSubmit, onCancel }: PaymentMethodFormProps) {
  const [formData, setFormData] = useState({
    name: method?.name || "",
    code: method?.code || "",
    type: method?.type || "ewallet",
    logo_url: method?.logo_url || "",
    fee: method?.fee || 0,
    sort_order: method?.sort_order || 0,
    is_active: method?.is_active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nama Metode"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="contoh: DANA"
        required
      />

      <Input
        label="Kode (unique)"
        value={formData.code}
        onChange={(e) => setFormData({ ...formData, code: e.target.value.toLowerCase() })}
        placeholder="contoh: dana"
        required
      />

      <div>
        <label className="block text-sm font-bold mb-1.5 text-black dark:text-white">Tipe</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="w-full px-3 py-2.5 bg-white dark:bg-brutal-dark-card border-2 border-black dark:border-brutal-border-dark rounded-brutal text-black dark:text-white"
        >
          <option value="ewallet">E-Wallet</option>
          <option value="bank">Bank Transfer</option>
          <option value="qris">QRIS</option>
          <option value="va">Virtual Account</option>
        </select>
      </div>

      <Input
        label="Icon URL (contoh: imgbb.com)"
        value={formData.logo_url}
        onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
        placeholder="https://i.ibb.co/xxxxx/dana.png"
      />

      {formData.logo_url && (
        <div className="relative w-16 h-16 border-2 border-black dark:border-brutal-border-dark rounded-brutal overflow-hidden bg-white">
          <Image
            src={formData.logo_url}
            alt="Preview"
            fill
            className="object-contain p-1"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
            }}
          />
        </div>
      )}

      <Input
        label="Fee (IDR)"
        type="number"
        value={formData.fee}
        onChange={(e) => setFormData({ ...formData, fee: Number(e.target.value) })}
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="pm_is_active"
          checked={formData.is_active}
          onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
          className="w-4 h-4 border-2 border-black rounded"
        />
        <label htmlFor="pm_is_active" className="text-sm font-bold text-black dark:text-white">Aktif</label>
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" className="flex-1">{method ? "Update" : "Tambah"}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Batal</Button>
      </div>
    </form>
  );
}
