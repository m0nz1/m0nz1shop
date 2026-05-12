"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase";

export function useRealtimeTransaction(
  invoiceId: string,
  onUpdate: (payload: any) => void
) {
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`transaction-${invoiceId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "transactions",
          filter: `invoice_id=eq.${invoiceId}`,
        },
        (payload) => {
          onUpdate(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [invoiceId, onUpdate]);
}
