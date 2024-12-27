import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface SuggestionCardProps {
  id: number
  title: string
  type: 'movie' | 'tv'
  posterPath: string | null
  releaseDate: string | null
  overview: string
}

export function SuggestionCard({
  id,
  title,
  type,
  posterPath,
  releaseDate,
  overview
}: SuggestionCardProps) {
  return (
    <Link 
      href={`/suggestions/${id}`}
      className="transition-transform hover:scale-[1.02] duration-200"
    >
      <Card className="h-full hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{type === 'movie' ? 'Movie' : 'TV Show'}</CardDescription>
        </CardHeader>
        <CardContent>
          {posterPath && (
            <div className="relative aspect-[2/3] mb-4">
              <Image
                src={`https://image.tmdb.org/t/p/w500${posterPath}`}
                alt={title}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}
          <p className="text-sm text-gray-600 mb-2">
            Release Date: {releaseDate || 'Unknown'}
          </p>
          <p className="line-clamp-3 text-gray-600">{overview}</p>
        </CardContent>
      </Card>
    </Link>
  )
}