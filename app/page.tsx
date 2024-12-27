import { SuggestionCard } from '@/components/suggestion-card'
import { Suggestion } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export default async function Home() {
  const suggestions = await prisma.suggestion.findMany({
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Mom's Movie and Show Picks</h1>
      <p className="text-xl text-gray-600 mb-6">Here are some great shows and movies I think you'll love, Mom!</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suggestions.map((suggestion: Suggestion) => (
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
