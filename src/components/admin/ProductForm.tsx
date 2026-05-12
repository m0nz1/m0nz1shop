"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Product, Game } from "@/types";

interface ProductFormProps {
  games: Game[];
  product?: Product | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function ProductForm({ games, product, onSubmit, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    game_id: product?.game_id || games[0]?.id || "",
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    original_price: product?.original_price || 0,
    nominal: product?.nominal || "",
    bonus: product?.bonus || "",
    is_promo: product?.is_promo || false,
    sort_order: product?.sort_order || 0,
    is_active: product?.is_active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-bold mb-1.5 text-black dark:text-white">Game</label>
        <select
          value={formData.game_id}
          onChange={(e) => setFormData({ ...formData, game_id: e.target.value })}
          className="w-full px-3 py-2.5 bg-white dark:bg-brutal-dark-card border-2 border-black dark:border-brutal-border-dark rounded-brutal text-black dark:text-white"
        >
          {games.map((g) => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
      </div>

      <Input
        label="Nama Produk"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="contoh: 86 Diamond"
        required
      />

      <div>
        <label className="block text-sm font-bold mb-1.5 text-black dark:text-white">Deskripsi</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2.5 bg-white dark:bg-brutal-dark-card border-2 border-black dark:border-brutal-border-dark rounded-brutal text-black dark:text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brutal-yellow dark:focus:ring-brutal-purple focus:ring-offset-2 dark:focus:ring-offset-brutal-dark-bg transition-all min-h-[60px] resize-y"
          placeholder="Deskripsi produk..."
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Harga (IDR)"
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
          required
        />
        <Input
          label="Harga Asli (opsional)"
          type="number"
          value={formData.original_price}
          onChange={(e) => setFormData({ ...formData, original_price: Number(e.target.value) })}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Nominal"
          value={formData.nominal}
          onChange={(e) => setFormData({ ...formData, nominal: e.target.value })}
          placeholder="contoh: 86"
          required
        />
        <Input
          label="Bonus (opsional)"
          value={formData.bonus}
          onChange={(e) => setFormData({ ...formData, bonus: e.target.value })}
          placeholder="contoh: 8 Bonus"
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_promo"
            checked={formData.is_promo}
            onChange={(e) => setFormData({ ...formData, is_promo: e.target.checked })}
            className="w-4 h-4 border-2 border-black rounded"
          />
          <label htmlFor="is_promo" className="text-sm font-bold text-black dark:text-white">Promo</label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            className="w-4 h-4 border-2 border-black rounded"
          />
          <label htmlFor="is_active" className="text-sm font-bold text-black dark:text-white">Aktif</label>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" className="flex-1">{product ? "Update Produk" : "Tambah Produk"}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Batal</Button>
      </div>
    </form>
  );
}
