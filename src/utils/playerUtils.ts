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
        playerParams.set("hidenextButton", "false");
        return `https://player.vidify.top/embed/tv/${tmdbId}/${seasonNumber}/${episodeNumber}?${playerParams.toString()}`;
      }

      throw new Error(`Invalid parameters for ${mediaType}`);
    },
  },
  {
    id: "videasy",
    name: "Videasy (Ads)",
    generateUrl: ({ tmdbId, seasonNumber, episodeNumber, mediaType }) => {
      const playerParams = new URLSearchParams({
        color: "fbc9ff",
        overlay: "true",
        nextEpisode: "true",
        autoplayNextEpisode: "true",
      });

      if (mediaType === "movie" && tmdbId) {
        return `https://player.videasy.net/movie/${tmdbId}?${playerParams.toString()}`;
      } else if (mediaType === "tv" && tmdbId && seasonNumber && episodeNumber) {
        return `https://player.videasy.net/tv/${tmdbId}/${seasonNumber}/${episodeNumber}?${playerParams.toString()}`;
      }

      throw new Error(`Invalid parameters for ${mediaType}`);
    },
  },
  {
    id: "vidfast",
    name: "VidFast (Ads)",
    generateUrl: ({ tmdbId, seasonNumber, episodeNumber, mediaType }) => {
      const playerParams = new URLSearchParams({
        autoPlay: "true",
        nextButton: "true",
        autoNext: "true",
        theme: "fbc9ff",
        chromecast: "false",
      });

      if (mediaType === "movie" && tmdbId) {
        return `https://vidfast.pro/movie/${tmdbId}?${playerParams.toString()}`;
      } else if (mediaType === "tv" && tmdbId && seasonNumber && episodeNumber) {
        return `https://vidfast.pro/tv/${tmdbId}/${seasonNumber}/${episodeNumber}?${playerParams.toString()}`;
      }

      throw new Error(`Invalid parameters for ${mediaType}`);
    },
  },
  {
    id: "vidnest",
    name: "Vidnest",
    generateUrl: ({ tmdbId, anilistId, seasonNumber, episodeNumber, mediaType, isDub = false }) => {
      if (mediaType === "anime" && anilistId && episodeNumber) {
        return `https://vidnest.fun/anime/${anilistId}/${episodeNumber}/${isDub ? "dub" : "sub"}`;
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
          hidenextButton: "false",
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