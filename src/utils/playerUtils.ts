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
    generateUrl: ({ tmdbId, seasonNumber, episodeNumber, mediaType }) => {
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
        return `https://player.vidify.top/embed/movie/${tmdbId}?${playerParams.toString()}`;
      } else if (mediaType === "tv" && tmdbId && seasonNumber && episodeNumber) {
        return `https://player.vidify.top/embed/tv/${tmdbId}/${seasonNumber}/${episodeNumber}?${playerParams.toString()}`;
      }
      
      throw new Error(`Invalid parameters for ${mediaType}`);
    },
  },
  {
    id: "vidplus",
    name: "VidPlus",
    generateUrl: ({ tmdbId, anilistId, seasonNumber, episodeNumber, mediaType, isDub = false }) => {
      if (mediaType === "anime" && anilistId && episodeNumber) {
        const dubParam = isDub ? "/dub" : "";
        return `https://vidplus.to/embed/anime/${anilistId}/${episodeNumber}${dubParam}`;
      } else if (mediaType === "movie" && tmdbId) {
        // Fallback to Vidify domain if needed for movies
        const params = new URLSearchParams({
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
        return `https://player.vidify.top/embed/movie/${tmdbId}?${params.toString()}`;
      } else if (mediaType === "tv" && tmdbId && seasonNumber && episodeNumber) {
        const params = new URLSearchParams({
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
        return `https://player.vidify.top/embed/tv/${tmdbId}/${seasonNumber}/${episodeNumber}?${params.toString()}`;
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