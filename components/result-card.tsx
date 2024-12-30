'use client'
import Image from 'next/image'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Plus, Minus, Loader2 } from "lucide-react"
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

interface ResultCardProps {
  id: number
  title: string
  type: 'movie' | 'tv'
  posterPath: string | null
  releaseDate: string | null
  overview: string
  isInPicks?: boolean
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function ResultCard({
  id,
  title,
  type,
  posterPath,
  releaseDate,
  overview,
  isInPicks = false
}: ResultCardProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isInPicksState, setIsInPicksState] = useState(isInPicks)
  const { toast } = useToast()

  const handleTogglePicks = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      setIsLoading(true)
      if (isInPicksState) {
        const response = await fetch(`/api/results/${id}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error('Failed to remove from picks')
        }

        toast({
          title: "Success",
          description: "Removed from Mom's picks!",
        })
      } else {
        const response = await fetch("/api/suggestions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tmdbId: id,
            title,
            type,
            overview,
            posterPath,
            releaseDate,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to add to picks')
        }

        toast({
          title: "Success",
          description: "Added to Mom's picks!",
        })
      }

      setIsInPicksState(!isInPicksState)
      router.refresh()
    } catch (error) {
      console.error('Error updating picks:', error)
      toast({
        title: "Error",
        description: isInPicksState 
          ? "Failed to remove from picks. Please try again."
          : "Failed to add to picks. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <TooltipProvider>
      <div className="group relative">
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <div className="block transition-transform hover:scale-[1.02] duration-200">
              <Card className="h-full hover:shadow-lg transition-shadow">
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
                  <p className="line-clamp-2 text-xs text-gray-400 mb-4">{overview}</p>
                  <Button
                    className="w-full"
                    variant={isInPicksState ? "secondary" : "default"}
                    onClick={handleTogglePicks}
                    disabled={isLoading}
                    color="purple"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isInPicksState ? 'Removing...' : 'Adding...'}
                      </>
                    ) : (
                      <>
                        {isInPicksState ? (
                          <>
                            <Minus className="mr-2 h-4 w-4" />
                            Remove from Picks
                          </>
                        ) : (
                          <>
                            <Plus className="mr-2 h-4 w-4" />
                            Add to Picks
                          </>
                        )}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
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