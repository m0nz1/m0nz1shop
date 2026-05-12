"use client";

import { useState, useEffect } from "react";

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const res = await fetch("/api/admin/check");
      const data = await res.json();
      setIsAdmin(data.isAdmin);
    } catch {
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsAdmin(false);
    window.location.href = "/admin/login";
  };

  return { isAdmin, loading, logout };
}
