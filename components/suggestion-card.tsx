'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Eye, Check, Loader2 } from "lucide-react"
import { useRouter } from 'next/navigation'

interface SuggestionCardProps {
  id: number
  title: string
  type: 'movie' | 'tv'
  posterPath: string | null
  releaseDate: string | null
  overview: string
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function SuggestionCard({
  id,
  title,
  type,
  posterPath,
  releaseDate,
  overview
}: SuggestionCardProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleMarkAsWatched = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent Link navigation
    e.stopPropagation() // Prevent event bubbling

    try {
      setIsLoading(true)
      const response = await fetch(`/api/suggestions/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to mark as watched')
      }

      // Refresh the page data
      router.refresh()
    } catch (error) {
      console.error('Error marking as watched:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <TooltipProvider>
      <div className="group relative">
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Link 
              href={`/suggestions/${id}`}
              className="block transition-transform hover:scale-[1.02] duration-200"
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <div className="absolute top-2 right-2 z-10">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background/90 hover:text-primary"
                        onClick={handleMarkAsWatched}
                        disabled={isLoading}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          isHovered ? <Check className="h-4 w-4" /> : <Eye className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {isLoading ? 'Marking as watched...' : 'Mark as watched'}
                        </span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent 
                      side="top" 
                      className="bg-background/90 backdrop-blur-sm"
                    >
                      Mark as watched
                    </TooltipContent>
                  </Tooltip>
                </div>
                <CardHeader className="p-4">
                  <div>
                    <CardTitle className="text-lg truncate">{title}</CardTitle>
                    <CardDescription className="text-xs">
                      {type === 'movie' ? 'Movie' : 'TV Show'}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  {posterPath && (
                    <div className="relative aspect-[2/3] mb-2">
                      <Image
                        src={`https://image.tmdb.org/t/p/w300${posterPath}`}
                        alt={title}
                        fill
                        className="object-cover rounded-lg"
                        sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, (max-width: 1024px) 20vw, 15vw"
                      />
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mb-1">
                    {releaseDate ? formatDate(releaseDate) : 'Release date unknown'}
                  </p>
                  <p className="line-clamp-2 text-xs text-gray-400">{overview}</p>
                </CardContent>
              </Card>
            </Link>
          </TooltipTrigger>
          <TooltipContent 
            side='right'
            className="max-w-[300px] p-4"
            sideOffset={-20}
          >
            <div className="space-y-2">
              <p className="font-semibold">{title}</p>
              <p className="text-sm">{overview}</p>
              {releaseDate && (
                <p className="text-sm text-gray-400">
                  Released: {formatDate(releaseDate)}
                </p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}