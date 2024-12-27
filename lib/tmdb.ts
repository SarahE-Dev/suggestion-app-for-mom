const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

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

export async function getDetails(id: number, type: 'movie' | 'tv') {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB_API_KEY is not set in environment variables');
  }

  const url = `${BASE_URL}/${type}/${id}?api_key=${TMDB_API_KEY}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching details from TMDb:', error);
    throw error;
  }
}

