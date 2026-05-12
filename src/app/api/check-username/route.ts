import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userId, gameSlug } = await request.json();

    if (!userId || !gameSlug) {
      return NextResponse.json(
        { error: "User ID dan Game slug diperlukan" },
        { status: 400 }
      );
    }

    // Simulasi API check username
    // Di production, ganti dengan API provider game sesungguhnya
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulasi hasil
    const mockUsernames: Record<string, string> = {
      "mobile-legends": `ML_Player_${userId.slice(0, 5)}`,
      "free-fire": `FF_Hero_${userId.slice(0, 5)}`,
      "pubg-mobile": `PUBG_Pro_${userId.slice(0, 5)}`,
      "genshin-impact": `Traveler_${userId.slice(0, 5)}`,
      "valorant": `Agent_${userId.slice(0, 5)}`,
    };

    const username = mockUsernames[gameSlug] || `Player_${userId.slice(0, 5)}`;

    return NextResponse.json({
      success: true,
      username,
      userId,
    });
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan" },
      { status: 500 }
    );
  }
}
