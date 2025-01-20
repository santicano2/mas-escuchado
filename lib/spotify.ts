import SpotifyWebApi from "spotify-web-api-node";

export interface SpotifyArtist {
  name: string;
  monthlyListeners: number;
  imageUrl: string;
  id: string;
}

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
    return getAccessToken;
  } catch (error) {
    console.error("Error obteniendo el token de Spotify:", error);
    throw error;
  }
}

async function getRandomPlaylistFromCategory(
  categoryId: string
): Promise<string> {
  const playlists = await spotifyApi.getPlaylistsForCategory(categoryId, {
    limit: 50,
  });
  const randomIndex = Math.floor(
    Math.random() * playlists.body.playlists.items.length
  );

  return playlists.body.playlists.items[randomIndex].id;
}

export async function getTopArtists(): Promise<SpotifyArtist[]> {
  await getAccessToken();

  try {
    // Get several categories
    const categories = await spotifyApi.getCategories({
      limit: 50,
      country: "US",
    });

    const categoryIds = categories.body.categories.items.map(
      (cat: any) => cat.id
    );
    const selectedCategories = [];

    // Randomly select 3 categories
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * categoryIds.length);
      selectedCategories.push(categoryIds[randomIndex]);
      categoryIds.splice(randomIndex, 1);
    }

    const artistIds = new Set<string>();
    const artists: SpotifyArtist[] = [];

    // Get playlists from each selected category
    for (const categoryId of selectedCategories) {
      const playlistId = await getRandomPlaylistFromCategory(categoryId);
      const playlist = await spotifyApi.getPlaylist(playlistId);

      for (const item of playlist.body.tracks.items) {
        const artist = item.track?.artists[0];
        if (artist && !artistIds.has(artist.id)) {
          artistIds.add(artist.id);

          const artistInfo = await spotifyApi.getArtist(artist.id);
          // Only include artists with more than 100,000 followers to ensure they're well-known
          if (
            artistInfo.body.followers.total > 100000 &&
            artistInfo.body.images[0]
          ) {
            artists.push({
              id: artist.id,
              name: artist.name,
              // Estimate monthly listeners based on follower count
              monthlyListeners: Math.floor(
                artistInfo.body.followers.total * (Math.random() * 3 + 2)
              ),
              imageUrl: artistInfo.body.images[0].url,
            });
          }
        }

        if (artists.length >= 20) break;
      }

      if (artists.length >= 20) break;
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
