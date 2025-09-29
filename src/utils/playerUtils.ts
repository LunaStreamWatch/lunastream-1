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
    id: "vidify",
    name: "Vidify",
    generateUrl: ({ tmdbId, anilistId, seasonNumber, episodeNumber, mediaType, isDub = false }) => {
      const baseUrl = "https://player.vidify.top/embed";
      const playerParams = new URLSearchParams({
        autoplay: "false",
        poster: "true",
        chromecast: "false",
        servericon: "true",
        setting: "true",
        pip: "true",
        logourl: "https://files.catbox.moe/e41yjl.png",
        font: "Roboto",
        fontcolor: "6f63ff",
        fontsize: "20",
        opacity: "0.5",
        primarycolor: "fbc9ff",
        secondarycolor: "f8b4ff",
        iconcolor: "fbc9ff",
      });

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