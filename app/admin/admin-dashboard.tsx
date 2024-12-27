'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { searchTMDb, getDetails } from "@/lib/tmdb"

export function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState("movie")
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
    } catch (error) {
      console.error("Search failed:", error)
      setError("Search failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddSuggestion = async (result: any) => {
    try {
      const details = await getDetails(result.id, searchType as 'movie' | 'tv')
      const response = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tmdbId: details.id,
          title: details.title || details.name,
          type: searchType,
          overview: details.overview,
          posterPath: details.poster_path,
          releaseDate: details.release_date || details.first_air_date,
        }),
      })
      if (response.ok) {
        alert("Suggestion added successfully to Mom's picks!")
      } else {
        throw new Error("Failed to add suggestion")
      }
    } catch (error) {
      console.error("Failed to add suggestion:", error)
      alert("Failed to add suggestion. Please try again.")
    }
  }

  return (
    <div className="container mx-auto py-8">
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
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {searchResults.map((result: any) => (
                <li key={result.id} className="flex justify-between items-center">
                  <span>{result.title || result.name}</span>
                  <Button onClick={() => handleAddSuggestion(result)}>Add to Mom's Picks</Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


