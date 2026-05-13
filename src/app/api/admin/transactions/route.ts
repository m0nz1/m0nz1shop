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

export async function PATCH(request: NextRequest) {
  if (!checkAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, status } = await request.json();
    const supabase = createServiceClient();
    const { data, error } = await supabase.from("transactions").update({ status }).eq("id", id).select().single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
