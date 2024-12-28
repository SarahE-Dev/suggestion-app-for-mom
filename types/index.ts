// types/index.ts
export interface Season {
    air_date: string;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string;
    season_number: number;
    vote_average: number;
  }

  export interface Video {
    id: string;
    key: string;
    name: string;
    site: string;
    type: string;
  }
  
  export interface CastMember {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
  }

  export interface TMDbVideo {
    id: string
    key: string
    name: string
    site: string
    type: string // Important for filtering trailers
    official: boolean
    published_at: string
  }
  
  export interface TMDbCastMember {
    id: number
    name: string
    character: string
    profile_path: string | null
    order: number // For sorting cast by importance
  }
  
  export interface TMDbSeason {
    air_date: string
    episode_count: number
    id: number
    name: string
    overview: string
    poster_path: string
    season_number: number
    vote_average: number
  }
  
  export interface TMDbMovie {
    id: number
    title?: string // for movies
    name?: string // for TV shows
    release_date?: string
    first_air_date?: string // for TV shows
    runtime?: number
    episode_run_time?: number[] // for TV shows
    genres?: Array<{
      id: number
      name: string
    }>
    credits?: {
      cast: TMDbCastMember[]
    }
    videos?: {
      results: TMDbVideo[]
    }
    seasons?: TMDbSeason[]
    vote_average?: number
    overview?: string
    tagline?: string
    status?: string
    production_companies?: Array<{
      id: number
      name: string
      logo_path: string | null
    }>
    poster_path?: string
  }
  