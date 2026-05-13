import { NextResponse } from "next/server";
import crypto from "crypto";

// Mapping game slug ke game_code API Games
const GAME_CODE_MAP: Record<string, string> = {
  "mobile-legends": "mobile-legends",
  "free-fire": "free-fire",
  "pubg-mobile": "pubg-mobile",
  "genshin-impact": "genshin-impact",
  "valorant": "valorant",
  "cod-mobile": "call-of-duty-mobile",
  "honor-of-kings": "honor-of-kings",
  "apex-legends": "apex-legends-mobile",
};

function generateSignature(merchantId: string, secretKey: string): string {
  return crypto.createHash("md5").update(merchantId + secretKey).digest("hex");
}

export async function POST(request: Request) {
  try {
    const { userId, gameSlug, serverId } = await request.json();

    if (!userId || !gameSlug) {
      return NextResponse.json(
        { error: "User ID dan Game slug diperlukan" },
        { status: 400 }
      );
    }

    const merchantId = process.env.API_GAMES_MERCHANT_ID;
    const secretKey = process.env.API_GAMES_SECRET_KEY;

    // Kalau env tidak di-set, beri error jelas
    if (!merchantId || merchantId === "your-merchant-id" || !secretKey || secretKey === "your-secret-key") {
      return NextResponse.json(
        { 
          error: "API Games belum dikonfigurasi. Tambahkan API_GAMES_MERCHANT_ID dan API_GAMES_SECRET_KEY di environment variables.",
          setupGuide: "Daftar di https://apigames.id untuk mendapatkan Merchant ID dan Secret Key."
        },
        { status: 503 }
      );
    }

    // REAL API GAMES INTEGRATION
    const gameCode = GAME_CODE_MAP[gameSlug] || gameSlug;
    const signature = generateSignature(merchantId, secretKey);

    let apiUrl = `https://v1.apigames.id/merchant/${merchantId}/cek-username/${gameCode}?user_id=${encodeURIComponent(userId)}&signature=${signature}`;

    // Kalau game butuh server_id (seperti Mobile Legends, Genshin)
    if (serverId) {
      apiUrl += `&server_id=${encodeURIComponent(serverId)}`;
    }

    console.log("[API GAMES] Calling:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
      signal: AbortSignal.timeout(15000),
    });

    const data = await response.json();
    console.log("[API GAMES] Response:", data);

    // API Games response format:
    // { status: "success", data: { username: "PlayerName", ... } }
    // atau { status: "error", message: "..." }

    if (data.status === "error" || data.status === "failed") {
      return NextResponse.json(
        { 
          error: data.message || data.data?.message || "Username tidak ditemukan di server game",
          detail: data.data || null
        },
        { status: 400 }
      );
    }

    const username = data.data?.username || data.data?.nama || data.username;

    if (!username) {
      return NextResponse.json(
        { error: "Username tidak ditemukan di server game" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      username,
      userId,
      source: "apigames",
      raw: data.data,
    });

  } catch (error: any) {
    console.error("[API GAMES] Exception:", error);

    if (error.name === "AbortError" || error.code === "ETIMEDOUT") {
      return NextResponse.json(
        { error: "Timeout saat menghubungi API Games. Coba lagi dalam beberapa saat." },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: "Terjadi kesalahan server saat cek username" },
      { status: 500 }
    );
  }
}
