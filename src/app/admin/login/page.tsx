"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Shield, Lock } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Login berhasil!");
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        toast.error(data.error || "Password salah");
      }
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-brutal-light-bg dark:bg-brutal-dark-bg">
      <Card className="w-full max-w-md p-6 md:p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-brutal-yellow dark:bg-brutal-purple rounded-brutal border-2 border-black mx-auto flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-black dark:text-white" />
          </div>
          <h1 className="font-black text-2xl text-black dark:text-white">Admin Portal</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Masukkan password untuk mengakses dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              type="password"
              placeholder="Password admin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
              required
            />
          </div>
          <Button type="submit" className="w-full" size="lg" isLoading={loading}>
            Login
          </Button>
        </form>
      </Card>
    </div>
  );
}
