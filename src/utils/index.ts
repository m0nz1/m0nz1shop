import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

export function formatDate(date: string | null): string {
  if (!date) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function generateInvoiceId(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, "0");
  return `INV-${date}-${random}`;
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "success":
    case "paid":
      return "bg-green-500 text-white";
    case "pending":
      return "bg-yellow-500 text-black";
    case "failed":
    case "expired":
      return "bg-red-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case "success":
      return "Sukses";
    case "pending":
      return "Pending";
    case "failed":
      return "Gagal";
    case "unpaid":
      return "Belum Dibayar";
    case "paid":
      return "Dibayar";
    case "expired":
      return "Kadaluarsa";
    default:
      return status;
  }
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}
