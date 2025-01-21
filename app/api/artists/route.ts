import { NextResponse } from "next/server";

import { getTopLatinArtists } from "@/lib/spotify";

export async function GET() {
  try {
    const artists = await getTopLatinArtists();
    return NextResponse.json(artists);
  } catch (error) {
    console.error("Error in artists API route:", error);
    return NextResponse.json(
      { error: "Failed to fetch artists" },
      { status: 500 }
    );
  }
}
