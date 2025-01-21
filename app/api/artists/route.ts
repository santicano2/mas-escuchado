import { NextResponse } from "next/server";

import { getTopArtists } from "@/lib/spotify";

export async function GET() {
  try {
    const artists = await getTopArtists();
    return NextResponse.json(artists);
  } catch (error) {
    console.error("Error in artists API route:", error);
    return NextResponse.json(
      { error: "Failed to fetch artists" },
      { status: 500 }
    );
  }
}
