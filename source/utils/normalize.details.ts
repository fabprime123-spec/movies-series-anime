import { DetailsItem } from "../types/details.type"
import { normalizeMovies, normalizeSeries } from "./normalize"

export function normalizeDetails(item: any): DetailsItem {
  const isMovie = item.title !== undefined || item.media_type === "movie"

  return {
    id: item.id,
    type: isMovie ? "movie" : "series",
    title: item.title ?? item.name ?? "",
    originalTitle: item.original_title ?? item.original_name ?? "",
    overview: item.overview ?? "",

    poster: item.poster_path ?? "",

    backdrop: item.backdrop_path ?? "",

    rating: item.vote_average ?? 0,

    releaseDate:
      item.release_date ??
      item.first_air_date ??
      "",

    runtime:
      item.runtime ??
      item.episode_run_time?.[0] ??
      0,

    status: item.status ?? "",

    genres:
      item.genres?.map((g: any) => g.name) ??
      [],

    countries:
      item.production_countries?.map((c: any) => ({
        isoCode: c.iso_3166_1?.toLowerCase() || "",
        name: c.name
      })) ?? [],

    languages:
      item.spoken_languages?.map(
        (l: any) => l.english_name
      ) ??
      [],

    productionCompanies:
      item.production_companies?.map((c: any) => ({
        id: c.id,
        name: c.name,
        logo: c.logo_path ?? null
      })) ?? [],

    seasons:
      item.number_of_seasons,

    episodes:
      item.number_of_episodes,

    seasonsList:
      item.seasons?.map((s: any) => ({
        id: s.id,
        name: s.name,
        episodeCount: s.episode_count,
        seasonNumber: s.season_number,
        poster: s.poster_path ?? null,
        overview: s.overview ?? ""
      })) ?? [],

    cast:
      item.credits?.cast?.map((actor: any) => ({
        id: actor.id,
        name: actor.name,
        character: actor.character,
        profile: actor.profile_path
      })) ?? [],

    trailers:
      item.videos?.results
        ?.filter(
          (video: any) =>
            video.site === "YouTube"
        )
        ?.map((video: any) => ({
          id: video.id,
          key: video.key,
          name: video.name,
          site: video.site,
          type: video.type
        })) ?? [],

    recommendations:
      item.recommendations?.results?.map(
        isMovie
          ? normalizeMovies
          : normalizeSeries
      ) ?? [],

    similar:
      item.similar?.results?.map(
        isMovie
          ? normalizeMovies
          : normalizeSeries
      ) ?? []

  }

}