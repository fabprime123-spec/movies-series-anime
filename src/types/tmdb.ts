export interface TMDBMedia {
  id: number;
  title?: string; // Movies use title
  name?: string; // TV Shows use name
  original_title?: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  media_type?: 'movie' | 'tv';
  genre_ids: number[];
  popularity: number;
  release_date?: string; // Movies
  first_air_date?: string; // TV
  vote_average: number;
  vote_count: number;
}

export interface TMDBResponse {
  page: number;
  results: TMDBMedia[];
  total_pages: number;
  total_results: number;
}
