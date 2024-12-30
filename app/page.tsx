import { SuggestionCard } from '@/components/suggestion-card'
import { Suggestion } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export default async function Home() {
  const suggestions = await prisma.suggestion.findMany({
    orderBy: { createdAt: "desc" }
  })

  const serializedSuggestions = suggestions.map(suggestion => ({
    ...suggestion,
    createdAt: suggestion.createdAt.toISOString(),
    updatedAt: suggestion.updatedAt.toISOString(),
  }))

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Mom's Movie and Show Picks</h1>
      <p className="text-xl text-gray-600 mb-6">
        Here are some great shows and movies I think you'll love, Mom!
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {serializedSuggestions.map((suggestion) => (
          <SuggestionCard
            key={suggestion.id}
            id={suggestion.id}
            title={suggestion.title}
            type={suggestion.type as 'movie' | 'tv'}
            posterPath={suggestion.posterPath}
            releaseDate={suggestion.releaseDate}
            overview={suggestion.overview}
          />
        ))}
      </div>
    </div>
  )
}