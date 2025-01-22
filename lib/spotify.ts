import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

let token: string | null = null;
let tokenExpirationTime: number | null = null;

async function getAccessToken() {
  if (token && tokenExpirationTime && Date.now() < tokenExpirationTime) {
    return token;
  }

  try {
    const data = await spotifyApi.clientCredentialsGrant();
    token = data.body.access_token;
    tokenExpirationTime = Date.now() + data.body.expires_in * 1000;
    spotifyApi.setAccessToken(token);
    return token;
  } catch (error) {
    console.error("Error getting Spotify access token:", error);
    throw error;
  }
}

export interface SpotifyArtist {
  name: string;
  monthlyListeners: number;
  imageUrl: string;
  id: string;
}

const searchTerms = [
  "top hits",
  "chart hits",
  "viral hits",
  "pop stars",
  "rap stars",
  "rock stars",
  "latin hits",
  "global hits",
  "trending",
];

function calculateMonthlyListeners(
  followers: number,
  popularity: number
): number {
  // Base calculation using followers and popularity
  // Popularity is a value between 0-100 from Spotify
  const popularityFactor = Math.pow(1.1, popularity / 10); // Exponential growth with popularity
  const baseListeners = followers * popularityFactor;

  // Add randomness but keep it within realistic bounds
  const randomVariation = 0.9 + Math.random() * 0.2; // ±10% variation
  let listeners = Math.floor(baseListeners * randomVariation);

  // Establish realistic bounds based on follower count
  if (followers > 20_000_000) {
    // Superstar artists
    listeners = Math.min(Math.max(listeners, 30_000_000), 80_000_000);
  } else if (followers > 10_000_000) {
    // Major artists
    listeners = Math.min(Math.max(listeners, 15_000_000), 40_000_000);
  } else if (followers > 5_000_000) {
    // Well-known artists
    listeners = Math.min(Math.max(listeners, 8_000_000), 20_000_000);
  } else if (followers > 1_000_000) {
    // Established artists
    listeners = Math.min(Math.max(listeners, 2_000_000), 10_000_000);
  } else {
    // Emerging artists
    listeners = Math.min(Math.max(listeners, 500_000), 3_000_000);
  }

  return listeners;
}

export async function getTopLatinArtists(): Promise<SpotifyArtist[]> {
  await getAccessToken();

  try {
    const artists: SpotifyArtist[] = [];
    const artistIds = new Set<string>();
    const shuffledTerms = [...searchTerms].sort(() => Math.random() - 0.5);

    for (const term of shuffledTerms) {
      try {
        const searchResults = await spotifyApi.searchArtists(term, {
          limit: 30,
          market: "US",
        });

        for (const artist of searchResults.body.artists.items) {
          if (
            artist.followers.total > 1_000_000 && // Minimum 1M followers
            artist.popularity > 70 && // Only highly popular artists
            artist.images.length > 0 &&
            !artistIds.has(artist.id)
          ) {
            artistIds.add(artist.id);
            artists.push({
              id: artist.id,
              name: artist.name,
              monthlyListeners: calculateMonthlyListeners(
                artist.followers.total,
                artist.popularity
              ),
              imageUrl: artist.images[0].url,
            });
          }

          if (artists.length >= 20) break;
        }

        if (artists.length >= 20) break;
      } catch (error) {
        console.error(`Error searching for term ${term}:`, error);
        continue;
      }
    }

    if (artists.length < 2) {
      throw new Error("No se pudieron obtener suficientes artistas");
    }

    // Shuffle the array of artists
    return artists.sort(() => Math.random() - 0.5);
  } catch (error) {
    console.error("Error fetching artists:", error);
    throw error;
  }
}
