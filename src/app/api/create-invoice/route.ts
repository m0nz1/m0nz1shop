import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      game_id,
      product_id,
      user_id,
      server_id,
      username,
      payment_method,
      price,
      fee,
      total,
    } = body;

    if (!game_id || !product_id || !user_id || !payment_method) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Set expired time (24 hours from now)
    const expiredAt = new Date();
    expiredAt.setHours(expiredAt.getHours() + 24);

    const { data, error } = await supabase
      .from("transactions")
      .insert({
        game_id,
        product_id,
        user_id,
        server_id,
        username,
        payment_method,
        price,
        fee,
        total,
        status: "pending",
        payment_status: "unpaid",
        expired_at: expiredAt.toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Insert error:", error);
      return NextResponse.json(
        { error: "Gagal membuat transaksi" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      invoice_id: data.invoice_id,
      transaction: data,
    });
  } catch (error) {
    console.error("Create invoice error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
