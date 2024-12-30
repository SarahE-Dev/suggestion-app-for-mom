import { SuggestionCard } from '@/components/suggestion-card'
import { prisma } from '@/lib/prisma'
import { Suggestion } from '@prisma/client'

// Define a more specific type for the serialized suggestion
type SerializedSuggestion = Omit<Suggestion, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
  type: 'movie' | 'tv'
}

export default async function Home() {
  try {
    const suggestions = await prisma.suggestion.findMany({
      orderBy: { createdAt: "desc" }
    })
  
    const serializedSuggestions: SerializedSuggestion[] = suggestions.map(suggestion => ({
      ...suggestion,
      createdAt: suggestion.createdAt.toISOString(),
      updatedAt: suggestion.updatedAt.toISOString(),
      type: suggestion.type as 'movie' | 'tv'
    }))
  
    return (
      <main className="max-w-7xl mx-auto py-8 px-4">
        <header className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Mom's Movie and Show Picks</h1>
          <p className="text-xl text-gray-600">
            Here are some great shows and movies I think you'll love, Mom!
          </p>
        </header>
        
        {serializedSuggestions.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {serializedSuggestions.map((suggestion) => (
              <SuggestionCard
                key={suggestion.id}
                id={suggestion.id}
                title={suggestion.title}
                type={suggestion.type}
                posterPath={suggestion.posterPath}
                releaseDate={suggestion.releaseDate}
                overview={suggestion.overview}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No suggestions found. Add some movies or shows to get started!
          </p>
        )}
      </main>
    )
  } catch (error) {
    console.error('Error fetching suggestions:', error)
    return (
      <div className="max-w-7xl mx-auto py-8 px-4">
        <p className="text-red-500 text-center">
          Something went wrong while loading suggestions. Please try again later.
        </p>
      </div>
    )
  }
}