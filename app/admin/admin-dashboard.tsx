'use client'

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { searchTMDb, getDetails } from "@/lib/tmdb"
import { useToast } from "@/hooks/use-toast"
import { ResultCard } from "@/components/result-card"

interface SearchResult {
  id: number
  title?: string
  name?: string
  overview: string
  poster_path: string
  release_date?: string
  first_air_date?: string
}

export function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState("movie")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [existingSuggestions, setExistingSuggestions] = useState<number[]>([])
  const { toast } = useToast()

  // Fetch existing suggestions when component mounts
  const fetchExistingSuggestions = async () => {
    try {
      const response = await fetch('/api/suggestions')
      const data = await response.json()
      setExistingSuggestions(data.map((suggestion: any) => suggestion.tmdbId))
    } catch (error) {
      console.error('Failed to fetch existing suggestions:', error)
    }
  }

    useEffect(() => {
      fetchExistingSuggestions()
    }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      const results = await searchTMDb(searchQuery, searchType as 'movie' | 'tv')
      setSearchResults(results.results || [])
      if (results.results.length === 0) {
        setError("No results found. Try a different search term.")
      }
      // Fetch existing suggestions to check for duplicates
      await fetchExistingSuggestions()
    } catch (error) {
      console.error("Search failed:", error)
      setError("Search failed. Please try again.")
    } finally {
      setIsLoading(false)
      setSearchQuery("")
    }
  }

  
  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Add to Mom's Movie and Show Picks</h1>
      <Card>
        <CardHeader>
          <CardTitle>Search Movies and TV Shows</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <Label htmlFor="searchQuery">Search Query</Label>
              <Input
                id="searchQuery"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="searchType">Type</Label>
              <Select value={searchType} onValueChange={setSearchType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="movie">Movie</SelectItem>
                  <SelectItem value="tv">TV Show</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Card className="mt-4 bg-red-100">
          <CardContent>
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {searchResults.length > 0 && (
        <div className="mt-8 mx-auto">
          <h2 className="text-2xl font-bold mb-4">Search Results</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {searchResults.map((result) => {
              return (
                <ResultCard
                key={result.id}
                id={result.id}
                title={result.title || result.name || ''}
                type={searchType as 'movie' | 'tv'}
                posterPath={result.poster_path}
                releaseDate={result.release_date || result.first_air_date || null}
                overview={result.overview}
                isInPicks={existingSuggestions.includes(result.id)}
              />
                  
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
