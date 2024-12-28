const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

import { TMDbCastMember, TMDbMovie, TMDbSeason, TMDbVideo } from "@/types";

const BASE_URL = 'https://api.themoviedb.org/3';

export async function searchTMDb(query: string, type: 'movie' | 'tv') {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB_API_KEY is not set in environment variables');
  }

  const url = `${BASE_URL}/search/${type}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching from TMDb:', error);
    throw error;
  }
}

export async function getDetails(id: number, type: 'movie' | 'tv'): Promise<TMDbMovie> {
  const response = await fetch(
    `https://api.themoviedb.org/3/${type}/${id}?api_key=${TMDB_API_KEY}&append_to_response=videos,credits`,
    { next: { revalidate: 3600 } }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch details')
  }

  const data = await response.json()

  // Process videos to get only official trailers from YouTube
  const processedVideos = data.videos?.results
    .filter((video: TMDbVideo) => 
      video.site === "YouTube" && 
      video.type === "Trailer" && 
      video.official
    )
    .sort((a: TMDbVideo, b: TMDbVideo) => 
      new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
    )
    .slice(0, 2) || []

  // Sort cast by order and take top 6
  const processedCast = data.credits?.cast
    .sort((a: TMDbCastMember, b: TMDbCastMember) => a.order - b.order)
    .slice(0, 6) || []

  return {
    ...data,
    videos: {
      results: processedVideos
    },
    credits: {
      cast: processedCast
    }
  }
}