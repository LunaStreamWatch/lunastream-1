export interface PlayerConfig {
  id: string
  name: string
  generateUrl: (params: {
    tmdbId?: string
    anilistId?: string
    seasonNumber?: number
    episodeNumber?: number
    mediaType: "movie" | "tv" | "anime"
    isDub?: boolean
  }) => string
}

export const playerConfigs: PlayerConfig[] = [
  {
    id: "vidplus",
    name: "VidPlus",
    generateUrl: ({ tmdbId, anilistId, seasonNumber, episodeNumber, mediaType, isDub = false }) => {
      const baseUrl = "https://player.vidplus.to/embed";
      const playerParams = new URLSearchParams({
        primarycolor: "fbc9ff",
        secondarycolor: "f8b4ff", 
        iconcolor: "fbc9ff",
        autoplay: "true",
        poster: "true",
        title: "true",
        watchparty: "false",
        chromecast: "false",
      }
      )
      if (mediaType === "movie" && tmdbId) {
        return `${baseUrl}/movie/${tmdbId}?${playerParams.toString()}`;
      } else if (mediaType === "tv" && tmdbId && seasonNumber && episodeNumber) {
        return `${baseUrl}/tv/${tmdbId}/${seasonNumber}/${episodeNumber}?${playerParams.toString()}`;
      } else if (mediaType === "anime" && anilistId && episodeNumber) {
        const animeParams = new URLSearchParams({
          ...Object.fromEntries(playerParams),
          dub: isDub.toString()
        });
        return `${baseUrl}/anime/${anilistId}/${episodeNumber}?${animeParams.toString()}`;
      }
      
      throw new Error(`Invalid parameters for ${mediaType}`);
    },
  },
  {
    id: "vidnest",
    name: "Vidnest",
    generateUrl: ({ tmdbId, seasonNumber, episodeNumber, mediaType }) => {
      if (mediaType === "movie") {
        return `https://vidnest.fun/movie/${tmdbId}`;
      } else {
        return `https://vidnest.fun/tv/${tmdbId}/${seasonNumber}/${episodeNumber}`;
      }
    },
  }
];

export const getPlayerUrl = (
  playerId: string,
  params: {
    tmdbId?: string
    anilistId?: string
    seasonNumber?: number
    episodeNumber?: number
    mediaType: "movie" | "tv" | "anime"
    isDub?: boolean
  }
): string => {
  const config = playerConfigs.find((p) => p.id === playerId)
  if (!config) {
    throw new Error(`Player ${playerId} not found`)
  }

  return config.generateUrl(params)
}