import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  const adminSession = cookieStore.get("admin_session");

  return NextResponse.json({
    isAdmin: adminSession?.value === "true",
  });
}
