import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServiceClient } from "@/lib/supabase";

function checkAdmin() {
  const cookieStore = cookies();
  const adminSession = cookieStore.get("admin_session");
  if (adminSession?.value !== "true") {
    return false;
  }
  return true;
}

export async function POST(request: NextRequest) {
  if (!checkAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { table, items } = await request.json();
    const supabase = createServiceClient();

    // Update sort_order for each item
    const updates = items.map((item: { id: string; sort_order: number }) =>
      supabase.from(table).update({ sort_order: item.sort_order }).eq("id", item.id)
    );

    const results = await Promise.all(updates);
    const errors = results.filter((r) => r.error);

    if (errors.length > 0) {
      return NextResponse.json({ error: errors[0].error?.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
