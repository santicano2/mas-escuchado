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

// List of search terms to get diverse artists
const searchTerms = [
  "pop",
  "rock",
  "hip hop",
  "jazz",
  "electronic",
  "indie",
  "latin",
  "r&b",
  "dance",
  "alternative",
];

export async function getTopLatinArtists(): Promise<SpotifyArtist[]> {
  await getAccessToken();

  try {
    const artists: SpotifyArtist[] = [];
    const artistIds = new Set<string>();

    // Shuffle search terms
    const shuffledTerms = [...searchTerms]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5); // Use only 5 random terms

    // Search artists for each term
    for (const term of shuffledTerms) {
      try {
        const searchResults = await spotifyApi.searchArtists(term, {
          limit: 10,
          market: "ES",
        });

        for (const artist of searchResults.body.artists.items) {
          if (
            artist.followers.total > 100000 && // Only popular artists
            artist.images.length > 0 && // Must have an image
            !artistIds.has(artist.id)
          ) {
            artistIds.add(artist.id);
            artists.push({
              id: artist.id,
              name: artist.name,
              // Estimate monthly listeners based on follower count
              monthlyListeners: Math.floor(
                artist.followers.total * (Math.random() * 3 + 2)
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
    for (let i = artists.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [artists[i], artists[j]] = [artists[j], artists[i]];
    }

    return artists;
  } catch (error) {
    console.error("Error fetching artists:", error);
    throw error;
  }
}
