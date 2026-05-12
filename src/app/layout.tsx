import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GameTop - Top Up Game Murah & Cepat",
  description: "Top up diamond, UC, dan currency game favoritmu dengan harga termurah dan proses cepat. Mobile Legends, Free Fire, PUBG, Genshin Impact, dan banyak lagi.",
  keywords: "top up game, diamond ml, free fire, pubg mobile, genshin impact, top up murah",
  openGraph: {
    title: "GameTop - Top Up Game Murah & Cepat",
    description: "Top up game favoritmu dengan harga termurah",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.className} bg-brutal-light-bg dark:bg-brutal-dark-bg text-black dark:text-white min-h-screen`}>
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-6">
          {children}
        </main>
        <BottomNav />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#FFD700",
              color: "#000",
              border: "2px solid #000",
              borderRadius: "6px",
              fontWeight: "bold",
              boxShadow: "4px 4px 0px 0px #000",
            },
          }}
        />
      </body>
    </html>
  );
}
