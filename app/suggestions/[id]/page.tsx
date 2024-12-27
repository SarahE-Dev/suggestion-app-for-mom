import Image from 'next/image'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getDetails } from '@/lib/tmdb'
import { Suggestion } from '@prisma/client'


// Define TMDB response types
interface TMDbMovie {
  release_date?: string
  runtime?: number
  genres?: Array<{
    id: number
    name: string
  }>
  credits?: {
    cast: Array<{
      id: number
      name: string
      character: string
      profile_path: string | null
    }>
  }
  videos?: {
    results: Array<{
      id: string
      key: string
      name: string
      site: string
    }>
  }
}

// Define the return type for getSuggestionAndDetails
interface SuggestionWithDetails {
  suggestion: Suggestion
  tmdbDetails: TMDbMovie
}

async function getSuggestionAndDetails(id: string): Promise<SuggestionWithDetails | null> {
  const suggestion = await prisma.suggestion.findUnique({
    where: { id: parseInt(id) }
  })

  if (!suggestion) return null

  const tmdbDetails = await getDetails(suggestion.tmdbId, suggestion.type as 'movie' | 'tv')
  return { suggestion, tmdbDetails }
}

// Page component props type
interface PageProps {
  params: {
    id: string
  }
}

export default async function SuggestionPage({ params }: PageProps) {
  const {id} = await params
  const data = await getSuggestionAndDetails(id)
  
  if (!data) notFound()
  
  const { suggestion, tmdbDetails } = data

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Poster */}
        <div className="md:col-span-1">
          {suggestion.posterPath && (
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
              <Image
                src={`https://image.tmdb.org/t/p/original${suggestion.posterPath}`}
                alt={suggestion.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="md:col-span-2">
          <h1 className="text-4xl font-bold mb-2">{suggestion.title}</h1>
          <div className="flex items-center gap-2 text-gray-600 mb-4">
            <span>{suggestion.type === 'movie' ? 'Movie' : 'TV Show'}</span>
            {tmdbDetails.release_date && (
              <>
                <span>•</span>
                <span>{new Date(tmdbDetails.release_date).getFullYear()}</span>
              </>
            )}
            {tmdbDetails.runtime && (
              <>
                <span>•</span>
                <span>{tmdbDetails.runtime} min</span>
              </>
            )}
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold mb-2">Overview</h2>
            <p className="text-gray-700 mb-6">{suggestion.overview}</p>

            {tmdbDetails.genres && (
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Genres</h2>
                <div className="flex flex-wrap gap-2">
                  {tmdbDetails.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {tmdbDetails.credits?.cast && (
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Cast</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {tmdbDetails.credits.cast.slice(0, 6).map((person) => (
                    <div key={person.id} className="text-center">
                      {person.profile_path ? (
                        <div className="relative aspect-[2/3] mb-2">
                          <Image
                            src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                            alt={person.name}
                            fill
                            className="object-cover rounded"
                            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                          />
                        </div>
                      ) : (
                        <div className="aspect-[2/3] bg-gray-200 rounded mb-2" />
                      )}
                      <p className="font-medium text-sm">{person.name}</p>
                      <p className="text-gray-600 text-sm">{person.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tmdbDetails.videos?.results && (
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Videos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tmdbDetails.videos.results
                    .filter((video) => video.site === 'YouTube')
                    .slice(0, 2)
                    .map((video) => (
                      <div key={video.id} className="aspect-video">
                        <iframe
                          src={`https://www.youtube.com/embed/${video.key}`}
                          title={video.name}
                          className="w-full h-full rounded"
                          allowFullScreen

                        />
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}