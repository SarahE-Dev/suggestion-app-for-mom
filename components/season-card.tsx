// components/season-card.tsx
import React from 'react';
import Image from 'next/image';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SeasonCardProps {
  season: {
    air_date: string;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string;
    season_number: number;
    vote_average: number;
  };
}

const SeasonCard: React.FC<SeasonCardProps> = ({ season }) => {
  return (
    <Card className="h-full">
      <CardHeader className="space-y-4">
        <div className="space-y-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <h3 className="font-semibold truncate text-lg">
                  {season.name}
                </h3>
              </TooltipTrigger>
              <TooltipContent>
                <p>{season.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              {season.episode_count} Episodes
            </Badge>
            {season.vote_average > 0 && (
              <Badge variant="outline">
                ★ {season.vote_average.toFixed(1)}
              </Badge>
            )}
          </div>
        </div>

        {season.poster_path && (
          <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
            <Image
              src={`https://image.tmdb.org/t/p/w300${season.poster_path}`}
              alt={season.name}
              fill
              className="object-cover transition-transform hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <p className="text-sm text-gray-500 line-clamp-4 text-wrap text-left">
                {season.overview || "No overview available."}
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-wrap">{season.overview}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
    </Card>
  );
};

export default SeasonCard;