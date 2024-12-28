import Image from 'next/image'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getDetails } from '@/lib/tmdb'
import { Suggestion } from '@prisma/client'
import SeasonList from '@/components/season-list'
import { Badge } from '@/components/ui/badge'
import { TMDbMovie } from '@/types'


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
  params: Promise<{ id: string; }>; 
}

export default async function SuggestionPage({ params }: PageProps) {
  const {id} = await params
  const data = await getSuggestionAndDetails(id)
  
  if (!data) notFound()
  
  const { suggestion, tmdbDetails } = data
  
  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {/* Poster */}
        <div className="flex-shrink-0">
          {suggestion.posterPath && (
            <div className="relative w-[180px] aspect-[2/3] rounded-lg overflow-hidden shadow-lg mx-auto">
              <Image
                src={`https://image.tmdb.org/t/p/w500${suggestion.posterPath}`}
                alt={suggestion.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 180px, 180px"
              />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-grow space-y-4">
          <div>
            <h1 className="text-3xl font-bold mb-3">{suggestion.title}</h1>
            
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400 mb-4">
              {suggestion.type === 'movie' ? (
                <Badge variant="secondary">Movie</Badge>
              ) : (
                <Badge variant="secondary">TV Show</Badge>
              )}
              
              {tmdbDetails.release_date && (
                <div className="flex items-center gap-2">
                  <span>•</span>
                  <span>{new Date(tmdbDetails.release_date).getFullYear()}</span>
                </div>
              )}
              
              {tmdbDetails.runtime && (
                <div className="flex items-center gap-2">
                  <span>•</span>
                  <span>{formatRuntime(tmdbDetails.runtime)}</span>
                </div>
              )}

              {tmdbDetails.vote_average && (
                <div className="flex items-center gap-2">
                  <span>•</span>
                  <span>★ {tmdbDetails.vote_average.toFixed(1)}</span>
                </div>
              )}
            </div>

            {/* Overview */}
            <p className="text-gray-400 text-sm leading-relaxed mb-4">{suggestion.overview}</p>

            {/* Genres */}
            {tmdbDetails.genres && tmdbDetails.genres.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-sm font-semibold">Genres</h2>
                <div className="flex flex-wrap gap-1.5">
                  {tmdbDetails.genres.map((genre) => (
                    <Badge variant="outline" key={genre.id} className="text-xs">
                      {genre.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-8">
        {/* Videos Section */}
        {tmdbDetails.videos?.results && tmdbDetails.videos.results.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tmdbDetails.videos.results
                .filter((video) => video.site === 'YouTube')
                .slice(0, 2)
                .map((video) => (
                  <div key={video.id} className="aspect-video rounded-lg overflow-hidden shadow-md">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.key}`}
                      title={video.name}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* Cast Section */}
        {tmdbDetails.credits?.cast && tmdbDetails.credits.cast.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Cast</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {tmdbDetails.credits.cast.slice(0, 6).map((person) => (
                <div key={person.id} className="group">
                  <div className="relative aspect-[2/3] rounded-md overflow-hidden mb-1.5">
                    {person.profile_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                        alt={person.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 16vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No Image</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-medium text-xs truncate">{person.name}</h3>
                  <p className="text-gray-500 text-xs truncate">{person.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Seasons Section */}
        {tmdbDetails.seasons && tmdbDetails.seasons.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Seasons</h2>
              <Badge variant="secondary" className="text-xs">
                {tmdbDetails.seasons.length} {tmdbDetails.seasons.length === 1 ? 'Season' : 'Seasons'}
              </Badge>
            </div>
            <SeasonList seasons={tmdbDetails.seasons} />
          </section>
        )}
      </div>
    </div>
  );
}