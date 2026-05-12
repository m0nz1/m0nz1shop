"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Game } from "@/types";
import Image from "next/image";

interface GameFormProps {
  game?: Game | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function GameForm({ game, onSubmit, onCancel }: GameFormProps) {
  const [formData, setFormData] = useState({
    name: game?.name || "",
    slug: game?.slug || "",
    description: game?.description || "",
    image_url: game?.image_url || "",
    category: game?.category || "popular",
    requires_server_id: game?.requires_server_id || false,
    server_id_hint: game?.server_id_hint || "",
    sort_order: game?.sort_order || 0,
    is_active: game?.is_active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .trim();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nama Game"
        value={formData.name}
        onChange={(e) => {
          const name = e.target.value;
          setFormData({
            ...formData,
            name,
            slug: game ? formData.slug : generateSlug(name),
          });
        }}
        required
      />

      <Input
        label="Slug (URL)"
        value={formData.slug}
        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
        placeholder="contoh: mobile-legends"
        required
      />

      <div>
        <label className="block text-sm font-bold mb-1.5 text-black dark:text-white">Deskripsi</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2.5 bg-white dark:bg-brutal-dark-card border-2 border-black dark:border-brutal-border-dark rounded-brutal text-black dark:text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brutal-yellow dark:focus:ring-brutal-purple focus:ring-offset-2 dark:focus:ring-offset-brutal-dark-bg transition-all min-h-[80px] resize-y"
          placeholder="Deskripsi game..."
        />
      </div>

      <Input
        label="Thumbnail URL (contoh: imgbb.com)"
        value={formData.image_url}
        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
        placeholder="https://i.ibb.co/xxxxx/game.jpg"
      />

      {formData.image_url && (
        <div className="relative w-full h-32 border-2 border-black dark:border-brutal-border-dark rounded-brutal overflow-hidden">
          <Image
            src={formData.image_url}
            alt="Preview"
            fill
            className="object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
            }}
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-bold mb-1.5 text-black dark:text-white">Kategori</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full px-3 py-2.5 bg-white dark:bg-brutal-dark-card border-2 border-black dark:border-brutal-border-dark rounded-brutal text-black dark:text-white"
        >
          <option value="popular">Popular</option>
          <option value="trending">Trending</option>
          <option value="new">New</option>
          <option value="rpg">RPG</option>
          <option value="fps">FPS</option>
          <option value="moba">MOBA</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="requires_server_id"
          checked={formData.requires_server_id}
          onChange={(e) => setFormData({ ...formData, requires_server_id: e.target.checked })}
          className="w-4 h-4 border-2 border-black rounded"
        />
        <label htmlFor="requires_server_id" className="text-sm font-bold text-black dark:text-white">
          Butuh Server ID
        </label>
      </div>

      {formData.requires_server_id && (
        <Input
          label="Hint Server ID"
          value={formData.server_id_hint}
          onChange={(e) => setFormData({ ...formData, server_id_hint: e.target.value })}
          placeholder="Contoh: 1234"
        />
      )}

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="game_is_active"
          checked={formData.is_active}
          onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
          className="w-4 h-4 border-2 border-black rounded"
        />
        <label htmlFor="game_is_active" className="text-sm font-bold text-black dark:text-white">Aktif</label>
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" className="flex-1">{game ? "Update Game" : "Tambah Game"}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Batal</Button>
      </div>
    </form>
  );
}
